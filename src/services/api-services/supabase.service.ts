import axios from "axios"
import { ClipDetails, ClipSource } from "@/types/ClipDetails"

let uniqueId = 0

function generateUniqueId(): number {
  return uniqueId++
}

export async function fetchSupabaseData(
  playerId: number
): Promise<ClipDetails[] | null> {
  try {
    const response = await axios.get<any[]>(
      `/api/supabase?playerID=${playerId}`
    )
    const supabaseClips: ClipDetails[] = response.data.map((clip) => ({
      id: generateUniqueId(),
      title: clip.title,
      description: clip.description,
      thumbnail: clip.thumbnailUrl,
      url: clip.url,
      publishedOn: new Date(clip.created),
      highlightCreated: new Date(clip.created),
      source: ClipSource.Supabase,
      category: "highlights",
      scoringapp_play_id: 0,
      gameKey: "",
      start_time: 0,
      duration: 0,
      streamID: 0,
      markerID: 0,
      tagged_player_keys: [playerId, playerId],
      likes: 0,
      subcategory: "",
      count: 0,
      page: 0,
      offset: 0,
    }))
    return supabaseClips
  } catch (error) {
    console.error(error)
    return null
  }
}
