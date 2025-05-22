import React, { useState } from "react"
import { ClipDetails } from "../../../types/ClipDetails"

import VideoPlaylistCard from "./VideoPlaylistCard"
import InfiniteScroll from "react-infinite-scroll-component"
import { apiService } from "@/services"

type PlayerHighlightsVideoPlaylistPropTypes = {
  playListVideoClickHandler: (clip: ClipDetails) => void
  drundInitializeClips: ClipDetails[]
  playingVideoId?: number
  playerId: number
  gameId?: number | null
  category: string
  startPage: number
}

const DrundVideoPlaylist: React.FC<PlayerHighlightsVideoPlaylistPropTypes> = ({
  playListVideoClickHandler,
  drundInitializeClips,
  playingVideoId,
  playerId,
  gameId,
  category,
  startPage,
}) => {
  const updatePlayingVideoDetails = (clipInfo: ClipDetails) => {
    playListVideoClickHandler(clipInfo)
  }

  const [drundClips, setDrundClips] = useState(drundInitializeClips)
  const [page, setPage] = useState(startPage + 1)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreData = async () => {
    try {
      if (gameId !== null && gameId) {
        //games
        const response = await fetch(
          `/api/drundgames?gameId=${gameId}&category=${category}&page=${page}`
        )
        if (response !== null && response.ok) {
          const clips = await response.json()
          setDrundClips((drundClips) => [...drundClips, ...clips])
          setPage((page) => page + 1)
        } else {
          setHasMore(false)
        }
      } else {
        const response = await apiService.drund.fetchDrundData(
          playerId,
          category,
          page
        )
        if (response !== null && response.length > 0) {
          setDrundClips((drundClips) => [...drundClips, ...response])
          setPage((page) => page + 1)
        } else {
          setHasMore(false)
        }
      }
    } catch (err) {
      setHasMore(false)
    }
  }

  return (
    <>
      <InfiniteScroll
        dataLength={drundClips.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h5>loading...</h5>}
        endMessage={"end"}
        height={400}
        className="InfiniteBoxHeight"
      >
        {drundClips.map((x, index) => (
          <div key={index}>
            <VideoPlaylistCard
              key={index}
              clipInfo={x}
              isPlaying={x.id == playingVideoId}
              allowClickHandler
              playListVideoClickHandler={updatePlayingVideoDetails}
            />
          </div>
        ))}
      </InfiniteScroll>
    </>
  )
}

export default DrundVideoPlaylist
