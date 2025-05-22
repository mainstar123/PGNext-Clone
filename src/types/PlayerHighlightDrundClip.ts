export interface DrundClipInfoResponse {
  count: number
  results: DrundClipResponse[]
  page: number
}
//TODO: remove any
export interface DrundClipResponse {
  id: number
  stream_id: number
  title: string
  description: string
  start_time: number
  duration: number
  thumbnail: string
  created: Date
  highlight_created: Date
  tagged_player_keys: TaggedPlayers[]
  url: string
  highlight_type: string
  drund_event_id: number
  game_key: string
  scoringapp_play_id: any
  play_type: any
  likes: number
}

export interface TaggedPlayers {
  Key: number
  Position: string
}
