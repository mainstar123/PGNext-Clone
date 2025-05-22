export const DKPLUS_API_BASE_URL = "https://api.perfectgame.org"
export const PG_TPA_API_BASE_URL = "https://tpa.perfectgame.org"
export const B_LIVE_API_BASE_URL = "https://dcm.perfectgame.tv"

export const API_URLS = {
  GetAccessToken: "grantarea",
  GetUsersDetails: "api/Account/GetUsersDetails",
  GetClipsOfPlayerHighlights:
    "api/DiamondKastPlusVideoPlayer/GetClipsOfPlayerHighlightsv2",
  GetPlayerShowcasesFromBLive: "dcm/campaign/9000/topics/playerid-", //playerId should be appended to the end of this url
  GetTeamDetailsByGameId:
    "api/DiamondKastPlusVideoPlayer/GetTeamDetailsByGameId", //?gameId=661083
  GetPitchersTeamDetailsByGameId:
    "api/DiamondKastPlusVideoPlayer/GetPichersTeamDetailsByGameId", //?gameId=661083
  SendReportAProblemEmail: "api/Iterable/SendReportVideoProblemEmails",
  CheckIsFavorite: "api/MyFavorite/CheckIsFavorite", // ?accountID={PGAccountID}&favoriteObjectID={PGPlayerID}&favoriteTypeID=1
  UpsertMyFavorite: "api/MyFavorite/InsertUpdateMyFavorite", // ?accountID={PGAccountID}&favoriteObjectID={PGPlayerID}&favoriteTypeID=1
  GetHighlightClipPlayDetails:
    "api/DiamondKastPlusVideoPlayer/HighlightPlayDetails", // ?scoringPlayID=41923018
  // CreateDKPlusPlayerHighlightClipDetails:
  //   "api/DiamondKastPlusVideoPlayer/CreateDKPlusPlayerHighlightClipDetails",
  CheckIfUserLikedPlayerHighlightsClip:
    "api/DiamondKastPlusVideoPlayer/CheckIfUserLikedPlayerHighlightsClip", //?sourceVideoId=411885&accountId=600343",
  CreateDKPlusPlayerHighlightsClipLike:
    "api/DiamondKastPlusVideoPlayer/CreateDKPlusPlayerHighlightsClipLike", // ?sourceVideoId=411885&accountId=600343
  GetPlayerHighlightsClipLikes:
    "api/DiamondKastPlusVideoPlayer/GetPlayerHighlightsClipLikes", // ?sourceVideoId=411885",
  CheckIfUserFavouritedPlayerHighlightsClip:
    "api/DiamondKastPlusVideoPlayer/CheckIfUserFavoritedPlayerHighlightsClip", // ?sourceVideoId=411885&accountId=600343",
  CreateDKPlusPlayerHighlightsClipFavorite:
    "api/DiamondKastPlusVideoPlayer/CreateDKPlusPlayerHighlightsClipFavorite", //?AccountId=600343",

  FetchHighlightsByPlayerIdandType:
    "api/DiamondKastPlusVideoPlayer/GetClipsOfPlayerHighlightsv2ByHighlightType",
  ListGameClipsByGameId: "diamondkastplus/gameclips",
}
//TODO: if hosting is moved from rackspace to azure this image url should be updated
export const fallbackImagePath =
  "https://7d7ce4d2fd579ab1db8f-ff847b6fa91c3461c76d26fad16823fb.ssl.cf1.rackcdn.com/19146.jpg"

// Local API
// export const UserAuthInfo = {
//     accessToken: "t7rFB38nS_yiY3pB7c13QKGlNdA6iagzL40VSd3L-8w1Spp-v7lj8SCIlBsI2hUknxzPpUdOcgLyLExQa2tRu2GB5VCyriUyBCAw68bJKmiEGqwqyxfT4GH1rnbRGfcnjbDSUQgKo28t-uS454tetlAQGJXC0SaaCzYGjyix6-maTWVIb4D4j686cZoiB46sI7gMdh6_KFd51SbRjUbkf6QA4A5lGU9m9DFQR_MOL7QNSdK0iYESFIfSIHhDN3UIsPY6GEkxWvp1tzyrpfhTTqDzA086ZFtLnt-OWKaCJ65jKDw0UUhgl9yajlYU6YNiSIRTTLqg5hbG2I9x2AKxbrxLJY5Fo3g_FzsB19GRma7wJFcE4fOpT08SqA6Oxf9d"
// }

// TPA API
export const UserAuthInfo = {
  // accessToken: "Xt_IOVPe3r--RsTN4AucIsY47n04uE-TdLA0FG9LCecqGQ8bafAXxdr0GJgwkSrcV1NTdDrQXfng_fgmHcQJMNurhDjee-VYBSHNtXJ2TLJxyVws-7apg7GLbfxViihgHQC8_JJJYKbAx8jZPP6CUyqNo_1HkghDxcHDJGWp2B51PmfRWhrFNXsu5a5_qBRnZDEmgu2Jx6-S_Y9VfUXRJ2oMZ7CV8r0has4sItsns4WMbMyzreO8_z1pnihFIu8gwt_7NOjo-qXzgiN1F3uKDAAf8ggkalEJcFQmL2AIA5H0AJA-fvX0U0EOsv3cH1Ag1wjDK-I3AM8JHsvu-EypTHHnZZDEEnkh_caj_eHfCVe2QpZZU7SHPMDArDYY3qgf"
}
//TODO: move to azure key vault
export const TPATokenInput = {
  user: "iframehighlights@perfectgame.org",
  secret: "StraightFastball44#",
}

export const localStorageKeys = {
  userAuthInfo: "pg_user_auth_info",
}

export const TabPlayerCategories = [
  {
    key: "showcases",
    name: "Showcases",
    category: "s",
    totalClips: 0,
  },
  {
    key: "highlights",
    name: "Highlights",
    category: "h",
    totalClips: 0,
  },
  {
    key: "fullAtBats",
    name: "AB-BF",
    category: "a",
    totalClips: 0,
  },
  {
    key: "lastPitches",
    name: "Last Pitch",
    category: "l",
    totalClips: 0,
  },
  {
    key: "batting",
    name: "Hits",
    category: "b",
    totalClips: 0,
  },
  {
    key: "pitching",
    name: "Ks",
    category: "p",
    totalClips: 0,
  },
]

export const TabGameCategories = [
  {
    key: "recap",
    category: "r",
    name: "Game",
    totalClips: 0,
  },
  {
    key: "highlights",
    category: "h",
    name: "Highlights",
    totalClips: 0,
  },
  {
    key: "homeRuns",
    category: "hr",
    name: "HRs",
    totalClips: 0,
  },
  {
    key: "fullAtBats",
    category: "a",
    name: "AB-BF",
    totalClips: 0,
  },
  {
    key: "hits",
    category: "hsdt",
    name: "Hits",
    totalClips: 0,
  },
  {
    key: "ks",
    category: "so",
    name: "Ks",
    totalClips: 0,
  },
]

export interface ITabDetails {
  key: string
  category: string
  name: string
  totalClips: number
}

export const GameHighlightsPlaylistTabDetails = [
  {
    key: "highlights",
    name: "Game Highlights",
    totalClips: 0,
  },
]

export const ClipCategoryIdentifier = {
  Highlight: "[Highlight]",
  FullAtBat: "[Full At-Bat]",
  LastPitch: "[Last Pitch]",
}
//TODO: consolidate with PlayerHighlightsPlaylistTabDetails or switch to use one and not both
//remove
export const HighlightClipCategory = {
  Showcase: "showcases",
  Highlight: "highlights",
  FullAtBat: "fullAtBats",
  LastPitch: "lastPitches",
  Favorite: "favorites",
  Batting: "batting",
  Pitching: "pitching",
  Undefined: "undefined",
}

export const getDrundApiClipsByType = (tabKey: string) => {
  switch (tabKey) {
    case HighlightClipCategory.Showcase:
      return "s"
    case HighlightClipCategory.Highlight:
      return "h"
    case HighlightClipCategory.FullAtBat:
      return "a"
    case HighlightClipCategory.LastPitch:
      return "l"
    case HighlightClipCategory.Batting:
      return "b"
    case HighlightClipCategory.Pitching:
      return "p"
    case HighlightClipCategory.Favorite:
      return "f"
  }
}
