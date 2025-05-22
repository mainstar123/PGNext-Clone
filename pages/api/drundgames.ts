import { API_URLS, DKPLUS_API_BASE_URL } from "@/constants/constants"
import { mapDrundJsonToClipDetails } from "@/services/api-services/drund.service"
import { ClipDetails } from "@/types/ClipDetails"
import { DrundClipInfoResponse } from "@/types/PlayerHighlightDrundClip"
import axios, { AxiosResponse } from "axios"

export default async function handler(
  request: { query: { gameId: number; category: string; page: number } },
  response: {
    status: (arg0: number) => {
      (): unknown
      json: { (arg0: unknown): void; new (): ClipDetails[] }
    }
  }
) {
  const { gameId, category, page } = request.query
  const apiUrl = `${DKPLUS_API_BASE_URL}/${API_URLS.ListGameClipsByGameId}`
  try {
    const res: AxiosResponse<DrundClipInfoResponse> =
      await axios.get<DrundClipInfoResponse>(apiUrl, {
        params: { gameKey: gameId, page: page, category: category },
        headers: { "Ocp-Apim-Subscription-Key": process.env.PG_API_KEY },
      })
    const payload = mapDrundJsonToClipDetails(res.data, category, page)
    response.status(200).json(payload)
  } catch (error) {
    response.status(500).json({ error })
  }
}
