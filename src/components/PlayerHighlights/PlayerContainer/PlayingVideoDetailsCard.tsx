import { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { BiTimeFive } from "react-icons/bi"
import {
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiOutlineLike,
} from "react-icons/ai"
import { FaEllipsisH } from "react-icons/fa"

import { utilService } from "../../../services/utility-service"
import { ClipDetails } from "../../../types/ClipDetails"
import { apiService } from "../../../services"
import { API_URLS } from "../../../constants"
import { IconContext } from "react-icons"
import DKPlusSubscriptionAlert from "../PlaylistContainer/DKPlusSubscriptionAlert"
import { useAuth } from "@/context/auth"

type PlayerHighlightVideoPlaylistCardPropTypes = {
  clipInfo: ClipDetails
  // eslint-disable-next-line @typescript-eslint/ban-types
  onShowMoreClick: Function
}

const PlayingVideoDetailsCard: React.FC<
  PlayerHighlightVideoPlaylistCardPropTypes
> = ({ clipInfo, onShowMoreClick: showMoreClickHandler }) => {
  const [isFeedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const [clipLikesCount, setClipLikesCount] = useState(0)
  const [isUserLiked, setIsUserLiked] = useState(false)
  const [isUserFavourited, setIsUserFavourited] = useState(false)
  const [askDKPlusSubscriptionModel, setAskDKPlusSubscriptionModel] =
    useState(false)

  const checkIfUserLikedTheClip = (clipId: number, accountId: number) => {
    return apiService.common
      .getByParams<boolean>(API_URLS.CheckIfUserLikedPlayerHighlightsClip, {
        accountId: accountId,
        sourceVideoId: clipId,
      })
      .then((isLiked: boolean) => {
        setIsUserLiked(isLiked)
      })
  }

  const getLikesCountForTheClip = (clipId: number) => {
    return apiService.common
      .getByParams<number>(API_URLS.GetPlayerHighlightsClipLikes, {
        sourceVideoId: clipId,
      })
      .then((likesCount: number) => {
        setClipLikesCount(likesCount)
      })
  }

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
    const accountId = user?.accountId ?? 0
    setFeedbackSubmitted(false)

    if (accountId != 0 && clipInfo.id) {
      getLikesCountForTheClip(clipInfo.id)
      if (isAuthenticated) {
        checkIfUserLikedTheClip(clipInfo.id, accountId)
        checkIfUserFavouritedTheClip(clipInfo.id, accountId)
      }
    }
  }, [clipInfo.id, isAuthenticated, user?.accountId])

  const handleUserLikeClick = () => {
    if (!isAuthenticated) return

    // TODO: Remove after implementing unlike functionality
    //if (isUserLiked) return

    apiService.common
      .postWithParamsAndBody(
        API_URLS.CreateDKPlusPlayerHighlightsClipLike,
        {
          SourceVideoId: clipInfo.id,
          Title: clipInfo.title,
          Description: clipInfo.description,
          StartTime: clipInfo.start_time,
          Duration: clipInfo.duration,
          SourceUrl: clipInfo.url,
          Thumbnail: clipInfo.thumbnail,
          VideoSourceType: clipInfo.source,
        },
        {
          accountId: user?.accountId ?? 0,
        }
      )
      .then((response: any) => {
        setIsUserLiked(!isUserLiked)
        getLikesCountForTheClip(clipInfo.id)
      })
  }

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
          SourceVideoId: clipInfo.id,
          Title: clipInfo.title,
          Description: clipInfo.description,
          StartTime: clipInfo.start_time,
          Duration: clipInfo.duration,
          SourceUrl: clipInfo.url,
          Thumbnail: clipInfo.thumbnail,
          VideoSourceType: clipInfo.source,
        },
        {
          accountId: user?.accountId ?? 0,
        }
      )
      .then((response: any) => {
        setIsUserFavourited(!isUserFavourited)
      })
  }

  const toggleDKPlusSubscriptionModel = () => {
    setAskDKPlusSubscriptionModel(!askDKPlusSubscriptionModel)
  }

  return (
    <>
      {clipInfo && clipInfo.id > 0 ? (
        <div className="video-thumbnail-card" key={clipInfo.id}>
          <Row>
            <Col xs={11}>
              <Row
                className="video-thumbnail-and-title"
                title="Click to play the video"
              >
                <Col xs={12}>
                  <div className="text-start flex-middle-left">
                    <span>{clipInfo.title}</span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={1}>
              <div className="text-end flex-middle-center cursor-pointer">
                <div onClick={() => showMoreClickHandler()}>
                  <FaEllipsisH />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="py-1">
            <Col md={3} xs={3} className="flex-middle-center">
              <div className="greyed-text flex-middle-center">
                <span
                  className={
                    clipInfo.id == 192043 ||
                    clipInfo.id == 192044 ||
                    clipInfo.id == 286409
                      ? "disableBtnOverlay"
                      : "default-bolder-font-size cursor-pointer"
                  }
                  onClick={() => handleUserLikeClick()}
                >
                  <IconContext.Provider
                    value={{
                      size: "1.5em",
                      color: "#2763a5",
                    }}
                  >
                    {isUserLiked ? <AiFillLike /> : <AiOutlineLike />}
                  </IconContext.Provider>
                </span>

                <span className="px-2">
                  {clipInfo.id == 192043 ||
                  clipInfo.id == 192044 ||
                  clipInfo.id == 286409
                    ? ""
                    : clipLikesCount}
                </span>
              </div>
            </Col>
            <Col md={4} xs={4} className="flex-middle-center">
              <div className="greyed-text">
                <span>
                  <BiTimeFive />
                </span>
                <span className="px-2">
                  {utilService.getFormattedTimeDuration(clipInfo.duration || 0)}
                </span>
              </div>
            </Col>
            <Col md={2} xs={1} className="flex-middle-center">
              <div className="greyed-text flex-middle-center">
                <span
                  className={
                    clipInfo.id == 192043 ||
                    clipInfo.id == 192044 ||
                    clipInfo.id == 286409
                      ? "disableBtnOverlay"
                      : `default-bolder-font-size cursor-pointer icon-wrapper-favorite`
                  }
                  onClick={() => {
                    clipInfo.id == 192043 ||
                    clipInfo.id == 192044 ||
                    clipInfo.id == 286409
                      ? ""
                      : handleUserFavoriteClick()
                  }}
                >
                  <IconContext.Provider
                    value={{
                      size: "1.5em",
                    }}
                  >
                    {isUserFavourited &&
                    !(
                      clipInfo.id == 192043 ||
                      clipInfo.id == 192044 ||
                      clipInfo.id == 286409
                    ) ? (
                      <AiFillHeart className="icon-color-favorite" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </IconContext.Provider>
                </span>
              </div>
            </Col>
            <Col md={3} xs={4} className="flex-middle-right">
              <div className="text-end greyed-text">
                <small>
                  {clipInfo.highlightCreated
                    ? utilService.getFormattedDateTime(
                        clipInfo.highlightCreated
                      )
                    : utilService.getFormattedDate(clipInfo.publishedOn)}
                </small>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default PlayingVideoDetailsCard
