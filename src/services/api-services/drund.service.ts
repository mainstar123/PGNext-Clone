import axios, { AxiosError, AxiosResponse } from "axios"
import {
  API_URLS,
  ClipCategoryIdentifier,
  DKPLUS_API_BASE_URL,
  getDrundApiClipsByType,
  HighlightClipCategory,
} from "@/constants/constants"
import { ClipDetails, ClipSource } from "@/types/ClipDetails"
import {
  DrundClipInfoResponse,
  DrundClipResponse,
  TaggedPlayers,
} from "@/types/PlayerHighlightDrundClip"
import { apiService } from "./common-api-service"

//move interfaces this to types
interface ExtractTaggedPlayers {
  playIds: number[]
  subcategory: string
}
//move interfaces this to constants
export const POSITION_PITCHING = "p"
export const POSITION_BATTING = "b"

export async function fetchDrundData(
  playerId: number,
  category: string,
  page: number
): Promise<ClipDetails[] | null> {
  try {
    const response: AxiosResponse<DrundClipInfoResponse> =
      await apiService.common.post<DrundClipInfoResponse>(
        API_URLS.FetchHighlightsByPlayerIdandType,
        {
          playerId: playerId,
          highlightType: category,
          page: page,
        }
      )
    const drundClips: DrundClipInfoResponse = response.data
    const totalCount: number = drundClips.count
    const currentPage: number = drundClips.page

    const target: ClipDetails[] = drundClips.results.map(
      (c: DrundClipResponse) => {
        const clipDetails: ClipDetails = {
          title: cleanClipTitle(c.title),
          markerID: c.id,
          id: c.id,
          description: c.description,
          start_time: c.start_time,
          duration: c.duration,
          thumbnail: c.thumbnail,
          publishedOn: new Date(c.highlight_created),
          highlightCreated: new Date(c.highlight_created),
          gameKey: c.game_key,
          scoringapp_play_id: c.scoringapp_play_id,
          streamID: c.stream_id,
          tagged_player_keys: (() => {
            const bats = extractTaggedPlayers(
              c,
              playerId,
              POSITION_BATTING
            )?.playIds
            const piches = extractTaggedPlayers(
              c,
              playerId,
              POSITION_PITCHING
            )?.playIds
            return (piches ?? []).concat(bats ?? [])
          })(),
          url: c.url,
          likes: c.likes,
          source: ClipSource.Drund,
          category: category,
          subcategory: HighlightClipCategory.Undefined,
          count: totalCount,
          page: currentPage,
          offset: 15,
        }
        return clipDetails
      }
    )
    return target
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      console.error(
        "Request failed with status code",
        axiosError.response.status
      )
    } else if (axiosError.request) {
      // No response received from the server
      console.error("No response received")
    } else {
      // Other errors
      console.error("Error occurred", axiosError.message)
    }
    return null
  }
}

export async function fetchDrundGameData(
  gameId: number,
  category: string,
  page: number
): Promise<ClipDetails[] | null> {
  const apiUrl = `${DKPLUS_API_BASE_URL}/${API_URLS.ListGameClipsByGameId}`
  try {
    const response: AxiosResponse<DrundClipInfoResponse> =
      await axios.get<DrundClipInfoResponse>(apiUrl, {
        params: { gameKey: gameId, page: page, category: category },
        headers: { "Ocp-Apim-Subscription-Key": process.env.PG_API_KEY },
      })
    return mapDrundJsonToClipDetails(response.data, category, page)
  } catch (error) {
    console.error(error)
    return null
  }
}

export function cleanClipTitle(title: string): string {
  let cleanTitle = title
  if (cleanTitle == null) return ""

  cleanTitle.trim()
  cleanTitle = cleanTitle.replace(ClipCategoryIdentifier.FullAtBat, "")
  cleanTitle = cleanTitle.replace(ClipCategoryIdentifier.Highlight, "")
  cleanTitle = cleanTitle.replace(ClipCategoryIdentifier.LastPitch, "")
  cleanTitle = cleanTitle.replace("9999", "")
  return cleanTitle
}

export function extractTaggedPlayers(
  clip: DrundClipResponse,
  playerId: number,
  position: string
): ExtractTaggedPlayers {
  const playIds: number[] = []

  if (clip.tagged_player_keys === null)
    return { playIds: [], subcategory: position }

  const search: TaggedPlayers | undefined = clip.tagged_player_keys.find(
    function (item: TaggedPlayers) {
      if (item.Position === position && item.Key === playerId) return true
      return false
    }
  )

  if (
    search != null &&
    search?.Key == playerId &&
    search?.Position == position &&
    !playIds.includes(clip.scoringapp_play_id)
  ) {
    playIds.push(clip.scoringapp_play_id)
  }

  return { playIds: playIds, subcategory: position }
}

export function extractTaggedPlayersNoPlayerId(
  clip: DrundClipResponse,
  position: string
): ExtractTaggedPlayers {
  const playIds: number[] = []

  if (clip.tagged_player_keys === null)
    return { playIds: [], subcategory: position }

  const search: TaggedPlayers | undefined = clip.tagged_player_keys.find(
    function (item: TaggedPlayers) {
      if (item.Position === position) return true
      return false
    }
  )
  if (
    search != null &&
    search?.Position == position &&
    !playIds.includes(clip.scoringapp_play_id)
  ) {
    playIds.push(clip.scoringapp_play_id)
  }

  return { playIds: playIds, subcategory: position }
}

export function mapDrundJsonToClipDetails(
  drundJsonPayload: DrundClipInfoResponse,
  category: string,
  page: number
): ClipDetails[] {
  const totalCount: number = drundJsonPayload.count
  const target: ClipDetails[] = drundJsonPayload.results.map(
    (c: DrundClipResponse) => {
      const clipDetails: ClipDetails = {
        title: cleanClipTitle(c.title),
        markerID: c.id,
        id: c.id,
        description: c.description,
        start_time: c.start_time,
        duration: c.duration,
        thumbnail: c.thumbnail,
        publishedOn: c.created,
        highlightCreated: c.highlight_created,
        gameKey: c.game_key,
        scoringapp_play_id: 0,
        streamID: c.stream_id ? c.stream_id : 0,
        tagged_player_keys: (() => {
          const bats = extractTaggedPlayersNoPlayerId(
            c,
            POSITION_BATTING
          )?.playIds
          const pitches = extractTaggedPlayersNoPlayerId(
            c,
            POSITION_PITCHING
          )?.playIds
          return (pitches ?? []).concat(bats ?? [])
        })(),
        url: c.url,
        likes: 0,
        source: ClipSource.Drund,
        category: category,
        subcategory: HighlightClipCategory.Undefined,
        count: totalCount,
        page: page,
        offset: 10,
      }
      return clipDetails
    }
  )
  return target
}
