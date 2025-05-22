import React, { useState } from "react";
import { ClipDetails } from "../../../types/ClipDetails";

import VideoPlaylistCard from "./VideoPlaylistCard";

type PlayerHighlightsVideoPlaylistPropTypes = {
  playerHighlightClips: ClipDetails[];
  playListVideoClickHandler: (clip: ClipDetails) => void;
  playingVideoId?: number,
};

const VideoPlaylist: React.FC<PlayerHighlightsVideoPlaylistPropTypes> = ({
  playerHighlightClips,
  playListVideoClickHandler,
  playingVideoId,
}) => {

  const updatePlayingVideoDetails = (clipInfo: ClipDetails) => {
    playListVideoClickHandler(clipInfo);
  };

  return (
    <>
      {playerHighlightClips?.map((x, index) => (
        <VideoPlaylistCard
          key={index}
          clipInfo={x}
          isPlaying={x.id == playingVideoId}
          allowClickHandler
          playListVideoClickHandler={updatePlayingVideoDetails}
        />
      ))}
    </>
  );
};

export default VideoPlaylist;
