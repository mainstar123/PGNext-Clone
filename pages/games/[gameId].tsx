import ComponentLoader from "@/components/Loader/ComponentLoader"
import { HighlightsVideoPlayer } from "@/components/PlayerHighlights"
import GameListContainer from "@/components/PlayerHighlights/PlaylistContainer/GameListContainer"

import { TabGameCategories } from "@/constants/constants"

import { useAuth } from "@/context/auth"
import { fetchDrundGameData } from "@/services/api-services/drund.service"
import { ClipDetails } from "@/types/ClipDetails"
import { GetServerSideProps } from "next"

import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"

interface GamePageProps {
  data?: ClipDetails[]
  error: string
}

export const getServerSideProps: GetServerSideProps<{
  data: ClipDetails[] | null
  error: string
}> = async (context) => {
  try {
    const gameId = parseInt(context.params?.gameId as string) || 0

    const replay: ClipDetails[] | null = await fetchDrundGameData(
      gameId,
      "r",
      1
    )
    const highlight: ClipDetails[] | null = await fetchDrundGameData(
      gameId,
      "h",
      1
    )
    const atBat: ClipDetails[] | null = await fetchDrundGameData(gameId, "a", 1)
    const single: ClipDetails[] | null = await fetchDrundGameData(
      gameId,
      "hsdt",
      1
    )
    const hr: ClipDetails[] | null = await fetchDrundGameData(gameId, "hr", 1)
    const so: ClipDetails[] | null = await fetchDrundGameData(gameId, "so", 1)

    return {
      props: {
        data: [
          ...(replay ?? []),
          ...(highlight ?? []),
          ...(atBat ?? []),
          ...(single ?? []),
          ...(hr ?? []),
          ...(so ?? []),
        ],
        error: "",
      },
    }
  } catch (error) {
    console.error(error)

    return {
      props: {
        data: null,
        error: "API Error",
      },
    }
  }
}

export default function GamePage({ data, error }: GamePageProps) {
  const router = useRouter()
  const {
    isReady,
    query: { gameId },
  } = router

  const { user, isAuthenticated } = useAuth()
  const [fullGameVideoClipsToPlay, setFullGameVideoClipsToPlay] = useState<
    ClipDetails[]
  >(data ?? [])

  const [firstVideoToPlay, setFirstVideoToPlay] = useState<ClipDetails>(
    fullGameVideoClipsToPlay[0]
  )

  const [playingVideoInfo, setPlayingVideoInfo] = useState<ClipDetails>(
    {} as ClipDetails
  )
  const [isComponentLoading, setIsComponentLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isReady) {
      return
    } else {
      setIsComponentLoading(false)
      if (isAuthenticated && user !== null && user.hasAccessToDkPlus) {
        setPlayingVideoInfo(firstVideoToPlay)
      }
    }
  }, [firstVideoToPlay, isAuthenticated, isReady, user])

  const onVideoPlayComplete = () => {
    //check if the user has access to dk plus, set the next video
    if (isAuthenticated && user !== null && user.hasAccessToDkPlus) {
      //get the set of clips based on the selected tab
      findAndSetNextVideo(fullGameVideoClipsToPlay)
    }
  }

  const playListVideoClickHandler = (clip: ClipDetails) => {
    if (isAuthenticated && user !== null && user.hasAccessToDkPlus) {
      setPlayingVideoInfo(clip)
    } else {
      //setShowDKPlusSubscriptionModel(!showDKPlusSubscriptionModel)
    }
  }

  function findAndSetNextVideo(clips: ClipDetails[]) {
    if (!playingVideoInfo.id) {
      setPlayingVideoInfo(clips[0])
    } else {
      const index = clips.findIndex((v) => v.id === playingVideoInfo.id)
      if (index < clips.length - 1) {
        setPlayingVideoInfo(clips[index + 1])
      }
    }
  }

  //TODO: remove if not needed
  const updateSelectedFilter = (selectedTabName: string) => {
    //
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <div>
        <div>
          <Row>
            {isComponentLoading ? (
              <ComponentLoader />
            ) : (
              <>
                <Col lg={7} className="pe-1">
                  <HighlightsVideoPlayer
                    sentFrom=""
                    clipDetailsToPlay={playingVideoInfo}
                    onVideoPlayComplete={onVideoPlayComplete}
                  />
                </Col>
                <Col lg={5} className="px-1">
                  <div className="px-2">
                    <GameListContainer
                      playingVideoId={playingVideoInfo?.id}
                      drundClips={fullGameVideoClipsToPlay}
                      onTabChange={updateSelectedFilter}
                      playListVideoClickHandler={playListVideoClickHandler}
                      gameId={Number(gameId)}
                      tabs={TabGameCategories}
                    />
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    </>
  )
}
