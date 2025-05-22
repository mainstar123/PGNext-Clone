import { Col, Container, Row } from "react-bootstrap"
import { useEffect, useState } from "react"

import {
  defaultShowcaseClips,
  API_URLS,
  HighlightClipCategory,
} from "../../src/constants"

import {
  BLivePlayerShowcasesResponse,
  BLivePlayerShowcaseClipInfo,
} from "../../src/types/BLivePlayerHighlightClip"
import { ClipDetails, ClipSource } from "../../src/types/ClipDetails"
import { apiService } from "../../src/services"

import {
  HighlightsVideoPlayer,
  PlayListContainer,
} from "@/components/PlayerHighlights"

import { useAuth } from "@/context/auth"
import Script from "next/script"
import { TabPlayerCategories } from "@/constants/constants"
import { useRouter } from "next/router"

export default function Player() {
  const [bLiveHighlightClips, setBLiveHighlightClips] = useState<ClipDetails[]>(
    []
  )
  const router = useRouter()
  const {
    isReady,
    query: { playerId },
  } = router

  const playerIdAsNumber = Number(playerId)
  const [drundClips, setDrundClips] = useState<ClipDetails[]>([])
  const [supabaseClips, setSupabaseClips] = useState<ClipDetails[]>([])
  const [clipsInitialized, setClipsInitialized] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState(
    HighlightClipCategory.Showcase
  )

  const [playingVideoInfo, setPlayingVideoInfo] = useState<ClipDetails>(
    {} as ClipDetails
  )
  const { user, isAuthenticated, loading } = useAuth()

  const [bLiveDataLoadComplete, setBLiveDataLoadComplete] = useState(false)
  const [showDKPlusSubscriptionModel, setShowDKPlusSubscriptionModel] =
    useState(false)

  const getShowcaseClipsDetails = (
    data: BLivePlayerShowcaseClipInfo[]
  ): ClipDetails[] => {
    const clips = data
      .filter((x) => x.is_active == "1")
      .map<ClipDetails>((clip: BLivePlayerShowcaseClipInfo) => {
        const clipDetails: ClipDetails = clip as any
        clipDetails.title = clip.label
        if (clip.poster_thumbnail_url.startsWith("http"))
          clipDetails.thumbnail = clip.poster_thumbnail_url
        else clipDetails.thumbnail = `https:${clip.poster_thumbnail_url}`
        clipDetails.url = `https://${clip.active_playlist_url}`
        clipDetails.publishedOn = new Date(clip.published_timestamp)
        clipDetails.start_time = 0
        clipDetails.source = ClipSource.BLive
        clipDetails.category = HighlightClipCategory.Showcase

        return clipDetails
      })

    return clips
  }

  useEffect(() => {
    if (!isReady) {
      return
    }
  }, [isReady])

  useEffect(() => {
    const loadBLivePlayerShowcases = async () => {
      const url = `${API_URLS.GetPlayerShowcasesFromBLive}${playerIdAsNumber}`
      await apiService.bLive
        .getAsync<BLivePlayerShowcasesResponse>(url)
        .then(({ data }: BLivePlayerShowcasesResponse) => {
          let clips = getShowcaseClipsDetails(data)
          const additionalShowcaseClips = getShowcaseClipsDetails(
            defaultShowcaseClips.data as BLivePlayerShowcaseClipInfo[]
          )
          clips = [...clips, ...additionalShowcaseClips]
          setBLiveHighlightClips(clips)
          setBLiveDataLoadComplete(true)
          if (clips.length > 0) {
            setPlayingVideoInfo(clips[0])
          }
        })
    }
    if (isReady && playerIdAsNumber) {
      loadBLivePlayerShowcases()
    }
  }, [isReady, playerIdAsNumber])

  useEffect(() => {
    async function fetchAndSetDrundData(
      playerId: number,
      category: string,
      page: number
    ) {
      if (category === undefined) return
      const data = await apiService.drund.fetchDrundData(
        playerId,
        category,
        page
      )
      if (data !== null) {
        setDrundClips((prevClips) => [...prevClips, ...data])
      }
    }

    async function fetchAndSetSupabaseData(playerId: number) {
      const data = await apiService.supabase.fetchSupabaseData(playerId)
      if (data !== null) {
        setSupabaseClips(data)
      }
    }
    if (
      playerIdAsNumber &&
      !clipsInitialized &&
      !loading &&
      bLiveDataLoadComplete &&
      isReady
    ) {
      fetchAndSetDrundData(playerIdAsNumber, "h", 1)
      fetchAndSetDrundData(playerIdAsNumber, "a", 1)
      fetchAndSetDrundData(playerIdAsNumber, "l", 1)
      fetchAndSetDrundData(playerIdAsNumber, "b", 1)
      fetchAndSetDrundData(playerIdAsNumber, "p", 1)
      fetchAndSetSupabaseData(playerIdAsNumber)
      setClipsInitialized(false)
    }
  }, [
    isReady,
    playerIdAsNumber,
    clipsInitialized,
    loading,
    bLiveDataLoadComplete,
  ])

  const onVideoPlayComplete = () => {
    //check if the user has access to dk plus, set the next video
    if (isAuthenticated && user !== null && user.hasAccessToDkPlus) {
      //get the set of clips based on the selected tab
      const clips =
        selectedFilter === HighlightClipCategory.Showcase
          ? bLiveHighlightClips
          : [
              ...supabaseClips,
              ...drundClips.filter((clip) => clip.category === "h"),
            ]
      findandSetNextVideo(clips)
    }
    //the only tab the user has access to is the showcase tab which is the bLiveHighlightClips
    else {
      //only clips that are available to the user are the bLiveHighlightClips
      findandSetNextVideo(bLiveHighlightClips)
    }
  }

  function findandSetNextVideo(clips: ClipDetails[]) {
    const index = clips.findIndex((v) => v.id === playingVideoInfo.id)
    if (index < clips.length - 1) {
      setPlayingVideoInfo(clips[index + 1])
    }
  }

  const updateSelectedFilter = (selectedTabName: string) => {
    setSelectedFilter(selectedTabName)
  }

  const playListVideoClickHandler = (clip: ClipDetails) => {
    if (
      clip.source === 0 ||
      (isAuthenticated && user !== null && user.hasAccessToDkPlus)
    ) {
      setPlayingVideoInfo(clip)
    } else {
      setShowDKPlusSubscriptionModel(!showDKPlusSubscriptionModel)
    }
  }

  useEffect(() => {
    if (
      loading === false &&
      isAuthenticated &&
      user !== null &&
      user.hasAccessToDkPlus
    ) {
      setShowDKPlusSubscriptionModel(false)
    }
  }, [isAuthenticated, loading, user])

  useEffect(() => {
    const callModalFunction = () => {
      if (
        typeof window !== "undefined" &&
        typeof window.openModal === "function" &&
        process.env.NEXT_PUBLIC_PARENT_IFRAME !== undefined
      )
        window.openModal(process.env.NEXT_PUBLIC_PARENT_IFRAME)
    }
    if (showDKPlusSubscriptionModel) {
      callModalFunction()
      setShowDKPlusSubscriptionModel(false)
    }
  }, [showDKPlusSubscriptionModel])

  return (
    <Container fluid="true">
      <Script id="parentmodal" src="/js/parentmodal.js"></Script>
      <div className="player-highlights-container">
        <Row>
          <Col lg={7} className="pe-1">
            <HighlightsVideoPlayer
              sentFrom=""
              clipDetailsToPlay={playingVideoInfo}
              onVideoPlayComplete={onVideoPlayComplete}
            />
          </Col>
          <Col lg={5} className="px-1">
            <div className="px-2">
              <PlayListContainer
                playingVideoId={playingVideoInfo?.id}
                bLiveClips={bLiveHighlightClips}
                bLiveDataLoadComplete={bLiveDataLoadComplete}
                drundClips={drundClips}
                supabaseClips={supabaseClips}
                onTabChange={updateSelectedFilter}
                playListVideoClickHandler={playListVideoClickHandler}
                playerId={playerIdAsNumber}
                tabs={TabPlayerCategories}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  )
}
