// pages/api/fetchSupabaseData.ts

import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playerID } = req.query

  if (!playerID || typeof playerID !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid playerID parameter" })
  }

  try {
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("player_id", playerID)
      .eq("publish_media", true)
      .order("created_at", { ascending: false })

    if (postsError) {
      console.error("Error fetching posts from Server:", postsError)
      return res
        .status(500)
        .json({ message: "Failed to fetch posts from Server" })
    }

    const supabaseVideos = posts
      ? posts
          .filter((post) => isVideoFile(post.file_url ?? ""))
          .map((post) => ({
            id: post.id,
            title: post.title || "",
            description: post.description || "",
            thumbnailUrl: post.thumbnail_url || "",
            url: post.file_url || "",
            created: post.created_at,
            highlight_type: "",
            publish_media: post.publish_media,
          }))
      : []

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    return res.status(200).json(supabaseVideos)
  } catch (error) {
    console.error("Error making request:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

function isVideoFile(url: string): boolean {
  const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"]
  const extension = url.slice(url.lastIndexOf(".")).toLowerCase()
  return videoExtensions.includes(extension)
}
