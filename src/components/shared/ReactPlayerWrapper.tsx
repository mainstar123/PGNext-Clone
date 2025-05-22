import React, { FC, useEffect, useState } from "react";
import ReactPlayer from "react-player";
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface ReactPlayerWrapperProps {
  setReactPlayerRef?: (player: ReactPlayer) => void;
  playClip?: boolean;
  url: string;
  startTime?: number;
  playDuration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEndedHandler?: () => void;
  onProgressChange?: (playerDuration: number) => void;
  handleDuration?: ((duration: number) => void) | undefined;
  PlayerOverlayComponent?: FC<any>;
  playerOverlayComponentProps?: any;
  stopPlayingAfterDuration?: boolean;
}

const ReactPlayerWrapper: FC<ReactPlayerWrapperProps> = ({
  setReactPlayerRef,
  playClip,
  url,
  startTime,
  playDuration,
  handleDuration,
  onPlay,
  onPause,
  onProgressChange,
  onEndedHandler,
  PlayerOverlayComponent,
  playerOverlayComponentProps,
  stopPlayingAfterDuration = true,
}) => {
  const [hasWindow, setHasWindow] = useState(false);
  let playerControlRef: any;

  const playerRef = (player: any) => {
    playerControlRef = player;
    if (setReactPlayerRef) setReactPlayerRef(player);
  };

  // Video controls states
  const [playing, setPlaying] = useState(playClip);
  const [videoDuration, setVideoDuration] = useState(playDuration);
  let stopVideoAt: number;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    if (playerControlRef && url && startTime !== 0) {
      playerControlRef.seekTo(startTime);
      setPlaying(true);
      if (!stopVideoAt) setVideoStopTime();

      // TODO: stop teh player after specific seconds
      // const videoLength = clip.start_time + clip.duration;
      // if(currentTime()== videoLength) // TODO: stop/pause the video
    }
  }, [playerControlRef, url, startTime]);

  useEffect(() => {
    setPlaying(playClip);
  }, [playClip]);

  const setVideoStopTime = () => {
    if (playDuration) {
      if (startTime) stopVideoAt = startTime + playDuration;
      else stopVideoAt = playDuration;
    }
  };

  const handleVideoProgress = (progressProps: any) => {
    if (!stopVideoAt) setVideoStopTime();

    if (
      stopVideoAt > 0 &&
      progressProps.playedSeconds > stopVideoAt &&
      stopPlayingAfterDuration
    ) {
      setPlaying(false);
    }

    if (onProgressChange) onProgressChange(progressProps.playedSeconds);
  };

  const playHandler = () => {
    setPlaying(true);
    if (onPlay) onPlay();
  };

  const pauseHandler = () => {
    setPlaying(false);
    if (onPause) onPause();
  };

  return (
    <div className="player-wrapper" id="player">
      {hasWindow && (
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          className="react-player"
          controls={true}
          playsinline={true}
          muted={true}
          playing={playing}
          onPlay={() => playHandler()}
          onPause={() => pauseHandler()}
          onProgress={handleVideoProgress}
          onDuration={handleDuration}
          onEnded={() => onEndedHandler && onEndedHandler()}
        />
      )}
      {PlayerOverlayComponent && (
        <PlayerOverlayComponent {...playerOverlayComponentProps} />
      )}
    </div>
  );
};

export default ReactPlayerWrapper;
