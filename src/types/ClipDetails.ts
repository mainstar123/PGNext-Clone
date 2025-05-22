export interface ClipDetails {
  id: number
  title: string
  description: string
  start_time: number
  duration: number
  thumbnail: string
  publishedOn: Date
  highlightCreated: Date
  gameKey: string
  scoringapp_play_id: number
  streamID: number
  markerID: number
  tagged_player_keys: number[] | null
  url: string
  likes: number
  source: ClipSource
  category: string
  /** @deprecated Use category instead */
  subcategory: string
  count: number
  page: number
  offset: number
}

export enum ClipSource {
  BLive,
  Drund,
  Supabase,
}

export enum ClipCategory {
  Highlights,
  AtBats,
  LastPitch,
}
