import { FunctionComponent, useState } from "react"
import Tabs from "react-responsive-tabs"

import "react-responsive-tabs/styles.css"

import { ClipDetails } from "../../../types/ClipDetails"
import DrundVideoPlaylist from "./DrundVideoPlaylist"
import { ITabDetails, TabGameCategories } from "@/constants/constants"

interface GameListFiltersProps {
  drundClips: ClipDetails[]
  onTabChange: (selectedTabName: string) => void
  playListVideoClickHandler: (clip: ClipDetails) => void
  playingVideoId?: number
  gameId: number
  tabs: ITabDetails[]
}

const GameListContainer: FunctionComponent<GameListFiltersProps> = ({
  drundClips,
  onTabChange: handleTabChange,
  playListVideoClickHandler,
  playingVideoId,
  gameId,
  tabs,
}) => {
  const [activeTabKey] = useState("recap")

  const onTabChange = (tabKey: string) => {
    const firstVideoToPlay = drundClips.find(
      (x) =>
        x.category ===
        TabGameCategories.find((tab) => tab.key === tabKey)?.category
    )
    if (firstVideoToPlay) {
      playListVideoClickHandler(firstVideoToPlay)
    }
    handleTabChange(tabKey)
  }

  const getTabs = () => {
    tabs.forEach((element) => {
      const numberClips = drundClips.find(
        (x) => x.category === element.category
      )
      if (numberClips) {
        element.totalClips = numberClips.count
      }
    })

    const tabItems = tabs
      .filter(
        (tab) =>
          drundClips.filter((x) => x.category === tab.category).length > 0
      )
      .map((tab) => {
        return {
          title: `${tab.name} (${tab.totalClips})`,
          getContent: () => (
            <>
              {drundClips.filter((x) => x.category === tab.category).length >
              0 ? (
                <DrundVideoPlaylist
                  playingVideoId={playingVideoId}
                  playListVideoClickHandler={playListVideoClickHandler}
                  drundInitializeClips={drundClips.filter(
                    (x) => x.category === tab.category
                  )}
                  category={tab.category}
                  playerId={0}
                  startPage={1}
                  gameId={gameId}
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
    return tabItems
  }
  const tabsData = getTabs()

  return (
    <div className="playlist-container">
      {
        <div className="tabs-wrapper">
          {tabsData.length === 0 ? (
            <div>No videos found for this game. Please check back later.</div>
          ) : (
            <Tabs
              className="nav-tabs"
              transform={false}
              selectedTabKey={activeTabKey}
              onChange={onTabChange}
              items={tabsData}
            ></Tabs>
          )}
        </div>
      }
    </div>
  )
}

export default GameListContainer
