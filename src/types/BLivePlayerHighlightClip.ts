export interface BLivePlayerShowcasesResponse {
  success: number;
  data: BLivePlayerShowcaseClipInfo[];
  errors: any[];
  count: number;
  params: InputParams;
}

export interface InputParams {
  campaign: string;
  topics: string[];
  domain: string;
  url: string;
}

export interface BLivePlayerShowcaseClipInfo {
  id: string;
  label: string;
  description: string;
  close_caption_path?: any;
  active_media_type: string;
  active_playlist_url: string;
  active_mobile_playlist_url: string;
  poster_image_url: string;
  poster_thumbnail_url: string;
  duration: string;
  published_timestamp: string;
  slug: string;
  link: string;
  is_active: string;
}

export interface DefaultBLiveShowcaseClipInfo
  extends BLivePlayerShowcaseClipInfo {
  campaign_id: string;
  tv_entity_type_id: string;
  root_tv_entity_id: string;
  parent_tv_entity_id: string;
  is_topic: string;
  teaser_video_asset_id?: any;
  video_asset_id: string;
  broadcast_id?: any;
  slug_aliases?: string;
  external_content_id?: any;
  external_content_type?: any;
  vertical_image_url?: any;
  vertical_thumbnail_url?: any;
  background_image_url?: any;
  start_availability_date?: any;
  end_availability_date?: any;
  actual_start_time?: string;
  actual_end_time?: string;
  media_create_date?: any;
  tv_ad_profile_id?: any;
  display_order: string;
  cache_time: string;
  is_link?: string;
  link_location?: any;
  scheduled_build_timestamp?: any;
  schedule_build_queued?: any;
  last_build_timestamp: string;
  create_user_id: string;
  update_user_id: string;
  rights_status: string;
  rights_run_timestamp?: any;
  rights_update_timestamp?: any;
  rights_notes?: any;
  rights_change_notes?: any;
  create_timestamp: string;
  update_timestamp: string;
  entity_identifier: string;
  parent_label: string;
  parent_link: string;
  root_label: string;
  root_slug: string;
  root_link: string;
  root_type_name: string;
  root_type_name_plural: string;
  type_name: string;
  is_video_wrapper: string;
  actual_time_formatted: string;
  actual_time_simple: string;
  actual_date_simple: string;
  published_date: string;
  start_availability_unix: number;
  end_availability_unix: number;
  actual_start_unix: number;
  actual_end_unix: number;
  video_playlist_url: string;
  video_mobile_playlist_url: string;
  video_provisioned: string;
  video_duration_simple_format: string;
  video_duration_time_format: string;
}
