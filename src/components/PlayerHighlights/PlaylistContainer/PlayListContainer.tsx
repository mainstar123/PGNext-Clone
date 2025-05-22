import { FunctionComponent, useState } from "react"
import Tabs from "react-responsive-tabs"

import "react-responsive-tabs/styles.css"

import { ClipDetails } from "../../../types/ClipDetails"
import VideoPlaylist from "./VideoPlaylist"
import DrundVideoPlaylist from "./DrundVideoPlaylist"
import { ITabDetails } from "@/constants/constants"

interface PlayListFiltersProps {
  bLiveClips: ClipDetails[]
  drundClips: ClipDetails[]
  supabaseClips: ClipDetails[]
  bLiveDataLoadComplete: boolean
  onTabChange: (selectedTabName: string) => void
  playListVideoClickHandler: (clip: ClipDetails) => void
  playingVideoId?: number
  playerId: number
  tabs: ITabDetails[]
}

const PlayListContainer: FunctionComponent<PlayListFiltersProps> = ({
  bLiveClips,
  drundClips,
  onTabChange: handleTabChange,
  playListVideoClickHandler,
  playingVideoId,
  supabaseClips,
  playerId,
  tabs,
}) => {
  const [activeTabKey] = useState("showcases")

  const onTabChange = (tabKey: string) => {
    const firstVideoToPlay = drundClips.find((x) => x.category === tabKey)
    if (firstVideoToPlay) {
      playListVideoClickHandler(firstVideoToPlay)
    }
    handleTabChange(tabKey)
  }

  const getTabs = () => {
    tabs.forEach((element) => {
      switch (element.key) {
        case "showcases":
          element.totalClips = bLiveClips.length
          break
        case "highlights":
          const drundHighlights = drundClips.find(
            (x) => x.category === element.category
          )
          element.totalClips =
            supabaseClips.length + (drundHighlights?.count ?? 0)
          break
        default:
          const numberClips = drundClips.find(
            (x) => x.category === element.category
          )
          if (numberClips) {
            element.totalClips = numberClips.count
          }
          break
      }
    })
    return tabs.map((tab) => {
      return {
        title: `${tab.name} (${tab.totalClips})`,
        getContent: () => (
          <>
            {bLiveClips.length > 0 && tab.key === "showcases" ? (
              <div className="playlist">
                <VideoPlaylist
                  playingVideoId={playingVideoId}
                  playerHighlightClips={bLiveClips}
                  playListVideoClickHandler={playListVideoClickHandler}
                />
              </div>
            ) : drundClips.filter((x) => x.category === tab.category).length >
                0 ||
              (tab.key === "highlights" && supabaseClips.length > 0) ? (
              <DrundVideoPlaylist
                playingVideoId={playingVideoId}
                playListVideoClickHandler={playListVideoClickHandler}
                drundInitializeClips={
                  tab.key === "highlights"
                    ? [
                        ...supabaseClips,
                        ...drundClips.filter(
                          (x) => x.category === tab.category
                        ),
                      ]
                    : drundClips.filter((x) => x.category === tab.category)
                }
                category={tab.category}
                playerId={playerId}
                startPage={1}
                gameId={0}
              />
            ) : (
              <div className="flex-middle-center default-font-size min-tab-content-height">
                {`Sorry! No videos to display in ${tab.name}`}
              </div>
            )}
          </>
        ),
        /* Optional parameters */
        key: tab.key,
        tabClassName: "RRT-tab",
        panelClassName: "RRT-panel",
      }
    })
  }

  return (
    <div className="playlist-container">
      {
        <div className="tabs-wrapper">
          <Tabs
            className="nav-tabs"
            transform={false}
            selectedTabKey={activeTabKey}
            onChange={onTabChange}
            items={getTabs()}
          ></Tabs>
        </div>
      }
    </div>
  )
}

export default PlayListContainer
