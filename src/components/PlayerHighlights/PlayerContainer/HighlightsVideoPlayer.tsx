import React, { useEffect, useState } from "react"

import { ClipDetails } from "../../../types/ClipDetails"

import PlayerOverlay from "./PlayerOverlay"
import ClipMatchDetails from "../ClipMatchDetails"
import PlayingVideoDetailsCard from "./PlayingVideoDetailsCard"
import ReactPlayerWrapper from "../../shared/ReactPlayerWrapper"
import { useRouter } from "next/router"
import ReactPlayer from "react-player"
import BLivePGDcmPlayer from "../../shared/BLivePGDcmPlayer"

type PlayerHighlightsVideoPlaylistPropTypes = {
  clipDetailsToPlay: ClipDetails
  onVideoPlayComplete: () => void
  sentFrom: string
}

const HighlightsVideoPlayer: React.FC<
  PlayerHighlightsVideoPlaylistPropTypes
> = ({ clipDetailsToPlay, onVideoPlayComplete, sentFrom }) => {
  let playerControlRef: any
  const setReactPlayerRef = (player: ReactPlayer) => (playerControlRef = player)

  const router = useRouter()
  // Video controls states
  const [playing, setPlaying] = useState(false)
  const [showClipMatchDetails, setShowClipMatchDetails] = useState(false)
  const [showReportAProblemWizard, setShowReportAProblemWizard] =
    useState(false)

  const [sentFromPHVP, setSentFrom] = useState(sentFrom)

  // const [played, setPlayed] = useState(0);
  // const [stopped, handleStop] = useState(false);
  // const [seeking, setSeeking] = useState(false);

  // const handleSeekMouseDown = (e: any) => {
  //   setSeeking(true);
  // };
  // const handleSeekChange = (e: any) => {
  //   const seekChangedTo = parseFloat(e.target.value);
  //   setPlayed(seekChangedTo);
  // };
  // const handleSeekMouseUp = (e: any) => {
  //   setSeeking(false);
  //   playerControlRef.seekTo(parseFloat(e.target.value));
  // };

  useEffect(() => {
    //   if (playerControlRef) {
    //     // const videoClipPath = `${clip.url}#t=${clip.start_time},${clip.start_time + clip.duration}`;
    //     playerControlRef.seekTo(clipDetailsToPlay.start_time);
    setPlaying(true)
  }, [playerControlRef, clipDetailsToPlay])

  const handleOnEnded = () => {
    if (onVideoPlayComplete) {
      console.log("Video Ended")
      onVideoPlayComplete()
    }
    // if (clipDetailsToPlay.source == 0) {
    //
    //   // setPlaying(true);
    // } else if (clipDetailsToPlay.source == 1) {
    //   // Highlight Tab
    // }
  }

  const toggleClipMatchDetails = () => {
    setShowClipMatchDetails(!showClipMatchDetails)
    setShowReportAProblemWizard(false)
    setPlaying(false)
  }

  // const openClipMatchDetails = () => {
  //   setShowClipMatchDetails(true);
  // };

  const openReportAProblemWizard = () => {
    // Pausing the main video on opening the model
    setPlaying(false)
    setShowClipMatchDetails(true)
    setShowReportAProblemWizard(true)
    setSentFrom("ReportAProblem")
  }

  const reportProblemWizardCloseHandler = () => {
    setShowClipMatchDetails(false)
    setShowReportAProblemWizard(false)
    setPlaying(true)
  }

  return (
    <div className="player-container">
      {clipDetailsToPlay !== undefined && clipDetailsToPlay !== null && (
        <div>
          <BLivePGDcmPlayer
            url={clipDetailsToPlay.url}
            playClip={playing}
            clipDetail={clipDetailsToPlay}
            playSource={clipDetailsToPlay.source}
            startTime={clipDetailsToPlay.start_time}
            playDuration={clipDetailsToPlay.duration}
            onEndedHandler={handleOnEnded}
            PlayerOverlayComponent={PlayerOverlay}
            playerOverlayComponentProps={{
              handleReportAProblemWizard: openReportAProblemWizard,
            }}
            isShowMoreDialog={showClipMatchDetails}
          />
          <div className="px-2">
            <PlayingVideoDetailsCard
              clipInfo={clipDetailsToPlay}
              onShowMoreClick={() => toggleClipMatchDetails()}
            />
          </div>
        </div>
      )}
      {showClipMatchDetails && (
        <ClipMatchDetails
          sentfromCMD={sentFromPHVP}
          clipDetailsToPlay={clipDetailsToPlay}
          showReportAProblemWizard={showReportAProblemWizard}
          onReportProblemWizardCloseHandler={() =>
            reportProblemWizardCloseHandler()
          }
        />
      )}
    </div>
  )
}

export default HighlightsVideoPlayer
