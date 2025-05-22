import Link from "next/link"
import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { MdReportProblem } from "react-icons/md"
import { useRouter } from "next/router"

import GlobalContext from "../../context/GlobalContext"
import { ClipDetails } from "../../types/ClipDetails"

import ReactPlayerWrapper from "../shared/ReactPlayerWrapper"
import ReportAProblemInClipWizard from "./ReportAProblem/ReportAProblemInClipWizard"
import styles from "../../../styles/PlayerHighlights.module.scss"

import { apiService, utilService } from "../../services"
import { API_URLS } from "../../constants"
import { AxiosResponse } from "axios"
import { ClipPlayDetails } from "../../types/ClipPlayDetails"
import FollowButtonText from "../shared/FollowButtonText"
import DKPlusSubscriptionAlert from "./PlaylistContainer/DKPlusSubscriptionAlert"
import { useAuth } from "@/context/auth"

interface ClipMatchDetailsProps {
  clipDetailsToPlay: ClipDetails
  showReportAProblemWizard: boolean
  onReportProblemWizardCloseHandler: () => void
  sentfromCMD: string
}

const ClipMatchDetails: FunctionComponent<ClipMatchDetailsProps> = ({
  clipDetailsToPlay,
  showReportAProblemWizard,
  onReportProblemWizardCloseHandler,
  sentfromCMD,
}) => {
  const { user, isAuthenticated } = useAuth()
  const gContext = useContext(GlobalContext)
  const [modelTitle, setModelTitle] = useState("Highlight Details")
  const [playerControlRef, setPlayerControlRef] = useState<any | undefined>()
  const [clipPlaying, setClipPlaying] = useState(true)
  const [sentfrom, setSentFrom] = useState(sentfromCMD)
  // TODO: check
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [stopPlayingAfterDuration, setStopPlayingAfterDuration] = useState(true)

  const [followingBatter, setFollowingBatter] = useState(false)
  const [followingPitcher, setFollowingPitcher] = useState(false)
  const [followingOtherPlayer, setFollowingOtherPlayer] = useState(false)

  const [videoDuration, setVideoDuration] = useState(
    clipDetailsToPlay?.duration
  )
  const [openReportAProblemWizard, setReportAProblemWizardStatus] = useState(
    showReportAProblemWizard
  )
  const [clipPlayDetails, setClipPlayDetails] = useState<ClipPlayDetails>(
    {} as any
  )
  const [askDKPlusSubscriptionModel, setAskDKPlusSubscriptionModel] =
    useState(false)
  const [isUserFavourited, setIsUserFavourited] = useState<boolean>(false)

  const backToVideoDetails = () => {
    setReportAProblemWizardStatus(false)
  }

  const handleClose = () => {
    onReportProblemWizardCloseHandler()
  }

  const handleTabChange = (tabTitle: string) => setModelTitle(tabTitle)

  const checkIfTheUserIsFollowing = (favoriteObjectID: number) => {
    return apiService.common.getByParams<boolean>(API_URLS.CheckIsFavorite, {
      accountID: user?.accountId ?? 0,
      favoriteObjectID: favoriteObjectID,
      favoriteTypeID: 1,
    })
  }

  const getClipMatchDetails = (scoringPlayID: number) => {
    return apiService.common.getByParams<ClipPlayDetails>(
      API_URLS.GetHighlightClipPlayDetails,
      {
        scoringPlayID: scoringPlayID,
      }
    )
  }
  const router = useRouter()
  const { hst } = router.query
  const domain = hst

  useEffect(() => {
    if (clipDetailsToPlay && playerControlRef) {
      // seek to start time on load
      playerControlRef.seekTo(clipDetailsToPlay.start_time, "seconds")

      if (clipDetailsToPlay.scoringapp_play_id) {
        getClipMatchDetails(clipDetailsToPlay.scoringapp_play_id).then(
          (playDetails: ClipPlayDetails) => {
            // console.log(playDetails);
            setClipPlayDetails(playDetails as any)

            if (isAuthenticated) {
              // Check if the loggedIn user is following the Batter and set state accordingly
              checkIfTheUserIsFollowing(playDetails.BatterID).then(
                (isFollowing: boolean) => {
                  setFollowingBatter(isFollowing)
                }
              )

              // Check if the loggedIn user is following the Pitcher and set state accordingly
              checkIfTheUserIsFollowing(playDetails.PitcherID).then(
                (isFollowing: boolean) => {
                  setFollowingPitcher(isFollowing)
                }
              )
            }
          }
        )
      }
    }
  }, [clipDetailsToPlay, playerControlRef])

  const checkIfUserFavouritedTheClip = (clipId: number, accountId: number) => {
    return apiService.common
      .getByParams<boolean>(
        API_URLS.CheckIfUserFavouritedPlayerHighlightsClip,
        {
          accountId: accountId,
          sourceVideoId: clipId,
        }
      )
      .then((isFavourited: boolean) => {
        setIsUserFavourited(isFavourited)
      })
  }

  useEffect(() => {
    checkIfUserFavouritedTheClip(clipDetailsToPlay.id, user?.accountId ?? 0)
  }, [clipDetailsToPlay.id, isAuthenticated, user?.accountId])

  const handleUserFavoriteClick = () => {
    if (!user?.hasAccessToDkPlus) {
      toggleDKPlusSubscriptionModel()
      return
    }

    if (!isAuthenticated) return

    apiService.common
      .postWithParamsAndBody(
        API_URLS.CreateDKPlusPlayerHighlightsClipFavorite,
        {
          SourceVideoId: clipDetailsToPlay.id,
          Title: clipDetailsToPlay.title,
          Description: clipDetailsToPlay.description,
          StartTime: clipDetailsToPlay.start_time,
          Duration: clipDetailsToPlay.duration,
          SourceUrl: clipDetailsToPlay.url,
          Thumbnail: clipDetailsToPlay.thumbnail,
          VideoSourceType: clipDetailsToPlay.source,
        },
        {
          accountId: user?.accountId ?? 0,
        }
      )
      .then((response: any) => {
        setIsUserFavourited(!isUserFavourited)
      })
  }

  const seekToHandler = (seekToSeconds: number) => {
    playerControlRef.seekTo(seekToSeconds, "seconds")
    setClipPlaying(true)
  }

  const playHandler = () => {
    setClipPlaying(true)
  }

  const pauseHandler = () => {
    setClipPlaying(false)
  }

  const continuePlayingClipAfterDuration = () => {
    setStopPlayingAfterDuration(false)
  }
  const stopPlayingClipAfterDuration = () => {
    setStopPlayingAfterDuration(true)
  }

  const handleDuration = (duration: number) => {
    setVideoDuration(duration)
    playerControlRef.seekTo(clipDetailsToPlay.start_time, "seconds")
  }

  const handleProgress = (progressSeconds: number) => {
    setPlayedSeconds(progressSeconds)
  }

  const updateUserFollowingStatus = (
    favoriteObjectID: number,
    playerType: "batter" | "pitcher" | "other"
  ) => {
    if (!user?.hasAccessToDkPlus) {
      toggleDKPlusSubscriptionModel()
      return
    }
    apiService.common
      .postWithParams(API_URLS.UpsertMyFavorite, {
        accountID: user?.accountId ?? 0,
        favoriteObjectID: favoriteObjectID,
        favoriteTypeID: 1,
      })
      .then((response: AxiosResponse) => {
        if (playerType == "batter") {
          setFollowingBatter(!followingBatter)
        } else if (playerType == "pitcher") {
          setFollowingPitcher(!followingPitcher)
        } else if (playerType == "other") {
          setFollowingOtherPlayer(!followingOtherPlayer)
        }
      })
  }

  const toggleDKPlusSubscriptionModel = () => {
    setAskDKPlusSubscriptionModel(!askDKPlusSubscriptionModel)
  }

  const turnOnReportAProblemWizard = () => {
    if (!user?.hasAccessToDkPlus) {
      toggleDKPlusSubscriptionModel()
    } else {
      setSentFrom("HighlightDetails")
      setReportAProblemWizardStatus(true)
    }
  }

  return (
    <div data-bs-theme="dark">
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        size="xl"
        show={true}
        // centered
        backdrop="static"
        onHide={handleClose}
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title id="contained-modal-title-vcenter">
            {modelTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container fluid>
            <Row>
              <Col lg={6} sm={12} className="p-0">
                {clipDetailsToPlay && (
                  <div>
                    <ReactPlayerWrapper
                      key={clipDetailsToPlay.id}
                      url={clipDetailsToPlay.url}
                      playClip={clipPlaying}
                      setReactPlayerRef={(player) =>
                        setPlayerControlRef(player)
                      }
                      startTime={clipDetailsToPlay.start_time}
                      playDuration={clipDetailsToPlay.duration}
                      handleDuration={handleDuration}
                      onProgressChange={handleProgress}
                      onPlay={playHandler}
                      onPause={pauseHandler}
                      stopPlayingAfterDuration={stopPlayingAfterDuration}
                    />
                    <h6 className="p-1">{clipDetailsToPlay.title}</h6>
                  </div>
                )}
              </Col>
              <Col lg={6} sm={12}>
                {!openReportAProblemWizard ? (
                  <div>
                    <Container fluid>
                      {/* For customer support, adding "ErrorCode: 1001" as small text when a request for 
                      highlight details fails because Drund didn't provide a play id. */}
                      {clipDetailsToPlay.source == 1 &&
                      utilService.isNullOrEmpty(clipPlayDetails?.EventName) ? (
                        <div
                          className="flex-middle-center"
                          style={{ height: "13vh" }}
                        >
                          {/* Could not find the Play details for the clip!
                          (ErrorCode: 1001) */}
                        </div>
                      ) : clipDetailsToPlay.source == 0 ? (
                        <div>
                          <Row className="py-3">
                            <Col xs={12} className="CenterText">
                              {/* <Col xs={{ span: 8, offset: 4 }}></Col> */}
                              {isAuthenticated && (
                                <Button
                                  variant="light"
                                  size="sm"
                                  className={`default-font-size ${styles["report-problem-btn"]}`}
                                  onClick={() =>
                                    updateUserFollowingStatus(
                                      user?.accountId ?? 0,
                                      "other"
                                    )
                                  }
                                >
                                  <FollowButtonText
                                    isFollowing={followingOtherPlayer}
                                    playerName=""
                                  />
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <div>
                          {clipPlayDetails?.EventName && (
                            <Row className="py-1">
                              <Col xs={12}>
                                <div>
                                  <h6>{clipPlayDetails?.EventName}</h6>
                                </div>
                              </Col>
                            </Row>
                          )}

                          {clipPlayDetails?.HomeTeamName && (
                            <Row className="py-1">
                              <Col xs={12}>
                                <div>
                                  <table className="TeamAndScore">
                                    <tr>
                                      <td>
                                        <strong>
                                          {"  "}
                                          {clipPlayDetails?.HomeTeamRuns}
                                        </strong>
                                      </td>
                                      <td>
                                        <Link
                                          href={`${domain}/Events/Tournaments/Teams/Default.aspx?team=${clipPlayDetails?.ScoringHomeTeamID}`}
                                          target="_blank"
                                        >{`${clipPlayDetails?.HomeTeamName}`}</Link>
                                        {/* <Link
                                    href={`${domain}/Events/Tournaments/Teams/Default.aspx?team=${clipPlayDetails?.ScoringHomeTeamID}`}
                                  >{`${clipPlayDetails?.HomeTeamName}`}</Link> */}
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </Col>
                            </Row>
                          )}

                          {clipPlayDetails?.VisitingTeamName && (
                            <Row className="py-1">
                              <Col xs={12}>
                                <div>
                                  <table className="TeamAndScore">
                                    <tr>
                                      <td>
                                        <strong>
                                          {"  "}
                                          {clipPlayDetails?.VisitingTeamRuns}
                                        </strong>
                                      </td>
                                      <td>
                                        <Link
                                          href={`${domain}/Events/Tournaments/Teams/Default.aspx?team=${clipPlayDetails?.ScoringVisitingTeamID}`}
                                          target="_blank"
                                        >{`${clipPlayDetails?.VisitingTeamName}`}</Link>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </Col>
                            </Row>
                          )}

                          <Row className="py-1">
                            <Col xs={6}>
                              {clipPlayDetails?.BatterName && (
                                <div>
                                  Batter:{" "}
                                  <Link
                                    style={{
                                      color: "white",
                                      textDecoration: "none",
                                    }}
                                    href={`${domain}/Players/Playerprofile.aspx?ID=${clipPlayDetails?.BatterID}`}
                                    target="_blank"
                                  >
                                    {`${clipPlayDetails?.BatterName}`}
                                  </Link>
                                  {/* <Link href={`${domain}/Players/Playerprofile.aspx?ID=${clipPlayDetails?.BatterID}`}>
                                    {`${utilService.filterDummyJerseyNumbers(
                                      `${clipPlayDetails?.BatterJerseyNum}`
                                    )} ${clipPlayDetails?.BatterName}`}
                                  </Link> */}
                                </div>
                              )}
                            </Col>
                            <Col xs={6}>
                              {isAuthenticated && (
                                <Button
                                  variant="light"
                                  size="sm"
                                  className={`default-font-size ${styles["report-problem-btn"]}`}
                                  onClick={() =>
                                    updateUserFollowingStatus(
                                      clipPlayDetails?.BatterID,
                                      "batter"
                                    )
                                  }
                                >
                                  <FollowButtonText
                                    isFollowing={followingBatter}
                                    playerName={clipPlayDetails?.BatterName}
                                  />
                                </Button>
                              )}
                            </Col>
                          </Row>
                          <Row className="py-1">
                            <Col xs={6}>
                              {clipPlayDetails?.PitcherName && (
                                <div>
                                  Pitcher:{" "}
                                  <Link
                                    style={{
                                      color: "white",
                                      textDecoration: "none",
                                    }}
                                    href={`${domain}/Players/Playerprofile.aspx?ID=${clipPlayDetails?.PitcherID}`}
                                    target="_blank"
                                  >
                                    {`${clipPlayDetails?.PitcherName}`}
                                  </Link>
                                </div>
                              )}
                            </Col>
                            <Col xs={6}>
                              {isAuthenticated && (
                                <Button
                                  variant="light"
                                  size="sm"
                                  className={`default-font-size ${styles["report-problem-btn"]}`}
                                  onClick={() =>
                                    updateUserFollowingStatus(
                                      clipPlayDetails?.PitcherID,
                                      "pitcher"
                                    )
                                  }
                                >
                                  <FollowButtonText
                                    isFollowing={followingPitcher}
                                    playerName={clipPlayDetails?.PitcherName}
                                  />
                                </Button>
                              )}
                            </Col>
                          </Row>
                          <Row className="py-1">
                            <Col xs={6}>
                              {clipPlayDetails?.Inning && (
                                <>
                                  Inning:{" "}
                                  <strong>{clipPlayDetails?.Inning}</strong>
                                </>
                              )}
                            </Col>
                          </Row>
                          <Row className="py-1">
                            <Col xs={6}>
                              <div>
                                {clipPlayDetails?.HomeTeamRuns && (
                                  <strong>
                                    {`${clipPlayDetails?.Outs} Out`}
                                    {/* ${clipPlayDetails?.Balls}-${clipPlayDetails?.Strikes}  */}
                                  </strong>
                                )}
                                <br />
                                {clipPlayDetails?.PitchSpeed && (
                                  <strong>
                                    {clipPlayDetails?.PitchSpeed} mph fastball
                                  </strong>
                                )}
                                <br />
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}

                      <Row>
                        <Col xs={12} className="flex-middle-center">
                          <Button
                            variant="light"
                            size="sm"
                            className="default-font-size report-problem-btn"
                            onClick={() => turnOnReportAProblemWizard()}
                            disabled={
                              clipDetailsToPlay.id == 192043 ||
                              clipDetailsToPlay.id == 192044 ||
                              clipDetailsToPlay.id == 286409
                            }
                          >
                            <span className="px-1">
                              {/* <MdOutlineReportProblem /> */}
                              <MdReportProblem />
                            </span>
                            Report A Problem
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                ) : (
                  <ReportAProblemInClipWizard
                    clipDetails={clipDetailsToPlay}
                    videoDuration={videoDuration}
                    playedSeconds={playedSeconds}
                    handleTabChange={handleTabChange}
                    isClipPlaying={clipPlaying}
                    sentfrom={sentfrom}
                    clipPauseHandler={pauseHandler}
                    clipPlayHandler={playHandler}
                    onReportProblemWizardCloseHandler={
                      onReportProblemWizardCloseHandler
                    }
                    backToVideoDetails={backToVideoDetails}
                    handleSeekTo={seekToHandler}
                    stopPlayingClipAfterDuration={stopPlayingClipAfterDuration}
                    continuePlayingClipAfterDuration={
                      continuePlayingClipAfterDuration
                    }
                  ></ReportAProblemInClipWizard>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ClipMatchDetails
