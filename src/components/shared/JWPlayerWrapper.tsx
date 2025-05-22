import React, { FC, useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { ClipDetails } from "../../types/ClipDetails"

type JWPlayerInstance = any // Replace with actual JWPlayer type if available

interface JWPlayerWrapperProps {
  playClip?: boolean
  url: string
  startTime?: number
  playDuration?: number
  onPlay?: () => void
  onPause?: () => void
  onEndedHandler?: () => void
  onProgressChange?: (playerDuration: number) => void
  handleDuration?: ((duration: number) => void) | undefined
  PlayerOverlayComponent?: React.ComponentType<any>
  playerOverlayComponentProps?: any
  stopPlayingAfterDuration?: boolean
  playSource?: number
  clipDetail?: ClipDetails
  isShowMoreDialog?: boolean
}

interface AnalyticsEvents {
  screen_view: () => void
  tab_view: (tab: string) => void
  player_presented: () => void
  player_play: (position: number | undefined) => void
  player_pause: (position: number | undefined) => void
  player_complete: (position: number | undefined) => void
  player_error: (code: number | undefined, message: string | undefined) => void
  player_playlist_selection: (position: number | undefined) => void
  play_time: (time: number | undefined) => void
}

interface PlayerMeta {
  name: string
  media_id: string
  media_type: string
  stream_type: string
  stream_format: string
  current_position: number
  duration: number
  analyticsCustomProperties: null | Record<string, any>
}

const JWPlayerWrapper: FC<JWPlayerWrapperProps> = ({
  playClip,
  url,
  startTime,
  playDuration,
  handleDuration,
  onPlay,
  onPause,
  onProgressChange,
  onEndedHandler,
  PlayerOverlayComponent,
  playerOverlayComponentProps,
  stopPlayingAfterDuration = true,
  playSource,
  clipDetail,
  isShowMoreDialog,
}) => {
  const playerRef = useRef<JWPlayerInstance | null>(null)
  const [hasWindow, setHasWindow] = useState(false)
  const [playing, setPlaying] = useState(playClip)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const analyticsVersion = "1.0.0"
  const zapp_platform = "profile.pgtv"
  const PLAY_TIME_EVENT_TRIGGER = [2, 5]
  const PLAY_TIME_EVENT_PERIOD = 20

  const [uuid4, setUUID4] = useState("")
  const playerMetaRef = useRef<PlayerMeta>({
    name: "",
    media_id: "",
    media_type: "",
    stream_type: "vod",
    stream_format: "video",
    current_position: 0,
    duration: 0,
    analyticsCustomProperties: null,
  })

  const isIOS = useRef(false)
  const playEventTimeRef = useRef<number[]>([])
  const stopVideoAtRef = useRef<number | undefined>(undefined)
  const initializedRef = useRef(false)

  useEffect(() => {
    isIOS.current =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (!initializedRef.current) {
      if (!window.localStorage.getItem("uuid4")) {
        window.localStorage.setItem("uuid4", uuidv4())
      }
      setUUID4(window.localStorage.getItem("uuid4") || "")
      if (typeof window !== "undefined") {
        setHasWindow(true)
        loadScript()
      }
      initializedRef.current = true
    }
    return () => {
      safeClearTracks()
    }
  }, [])

  const safeClearTracks = () => {
    if (
      playerRef.current &&
      typeof playerRef.current.getTextTracks === "function"
    ) {
      try {
        const tracks = playerRef.current.getTextTracks()
        if (Array.isArray(tracks)) {
          tracks.forEach((track) => {
            if (track && Array.isArray(track.cues)) {
              const cuesArray = Array.from(track.cues)
              cuesArray.forEach((cue) => {
                try {
                  track.removeCue(cue)
                } catch (error) {
                  // console.warn("Error removing cue:", error)
                }
              })
            }
          })
        }
      } catch (error) {
        console.warn("Error clearing tracks:", error)
      }
    }
  }

  const willPauseVideo = () => {
    playerRef.current?.pause()
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      playerRef.current?.pause()
    }
  }

  useEffect(() => {
    if (playerRef.current) {
      isShowMoreDialog ? playerRef.current.pause() : playerRef.current.play()
    }
  }, [isShowMoreDialog])

  useEffect(() => {
    window.addEventListener("blur", willPauseVideo)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      window.removeEventListener("blur", willPauseVideo)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (scriptLoaded && url) {
      try {
        if (setupPlayer(url, true)) {
          if (startTime && startTime !== 0) {
            // console.log("Player setup!!! startTime", startTime, playDuration)
            playerRef.current?.seek(startTime)
            setVideoStopTime()
          }
          playerRef.current?.play()
        }
      } catch (error) {
        console.error("Error in player setup effect:", error)
      }
    }
  }, [scriptLoaded, url, startTime])

  useEffect(() => {
    setPlaying(playClip)
  }, [playClip])

  useEffect(() => {
    if (clipDetail?.category) {
      if ((window as any).gtag) {
        analyticsEvents.tab_view(clipDetail.category)
      } else {
        setTimeout(() => analyticsEvents.tab_view(clipDetail.category), 100)
      }
    }
  }, [clipDetail?.category])

  useEffect(() => {
    if (clipDetail) {
      playerMetaRef.current = {
        ...playerMetaRef.current,
        name: clipDetail.title || "",
        media_id: clipDetail.id?.toString() || "",
        media_type:
          clipDetail.category === "showcases"
            ? "player-video-dcm"
            : "player-video-dk",
        duration: clipDetail.duration || 0,
      }
    }
  }, [clipDetail])

  const sendGA = (event: string, event_name: string, event_parameters: any) => {
    const gtag = (window as any).gtag
    if (gtag) {
      gtag(event, event_name, {
        uuid: uuid4,
        zapp_platform,
        version: analyticsVersion,
        ...event_parameters,
      })
    } else {
      // console.log(
      //   "GA not ready. Retrying in 100ms.",
      //   event,
      //   event_name,
      //   event_parameters
      // )
      setTimeout(() => sendGA(event, event_name, event_parameters), 100)
    }
  }

  const analyticsEvents: AnalyticsEvents = {
    screen_view: () =>
      sendGA("event", "screen_view", {
        screen_entry_title: document.title || "page",
      }),
    tab_view: (tab: string) =>
      sendGA("event", "tab_view", { screen_entry_title: tab }),
    player_presented: () =>
      sendGA("event", "player_presented", { ...playerMetaRef.current }),
    player_play: (position: number | undefined) =>
      sendGA("event", "player_play", {
        ...playerMetaRef.current,
        current_position: position,
      }),
    player_pause: (position: number | undefined) =>
      sendGA("event", "player_pause", {
        ...playerMetaRef.current,
        current_position: position,
      }),
    player_complete: (position: number | undefined) =>
      sendGA("event", "player_complete", {
        ...playerMetaRef.current,
        current_position: position,
      }),
    player_error: (code: number | undefined, message: string | undefined) =>
      sendGA("event", "player_error", {
        ...playerMetaRef.current,
        reason: message,
        error_code: code,
      }),
    player_playlist_selection: (position: number | undefined) =>
      sendGA("event", "player_playlist_selection", {
        ...playerMetaRef.current,
        current_position: position,
      }),
    play_time: (time: number | undefined) =>
      sendGA("event", "play_time", {
        ...playerMetaRef.current,
        current_position: time,
      }),
  }

  const loadScript = () => {
    if (scriptLoaded) return
    const playerJSsrc = "https://cdn.jwplayer.com/libraries/DgmgmZ3O.js"
    const gtagScriptSrc =
      "https://www.googletagmanager.com/gtag/js?id=G-N7NJDCDGY3"
    const gtagConfigScript = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N7NJDCDGY3');
      window.gtag = gtag;
      if (window.location.hostname == 'localhost') {
        window['ga-disable-G-N7NJDCDGY3'] = true;
      }
    `
    const loadScriptAsync = (src: string, onload?: () => void) => {
      const script = document.createElement("script")
      script.src = src
      script.type = "text/javascript"
      if (onload) script.onload = onload
      document.body.appendChild(script)
    }

    loadScriptAsync(playerJSsrc, () => setScriptLoaded(true))
    loadScriptAsync(gtagScriptSrc, () => {
      const script = document.createElement("script")
      script.innerHTML = gtagConfigScript
      document.body.appendChild(script)
    })
  }

  const setupPlayer = (
    file: string | null,
    force: boolean | undefined
  ): boolean => {
    if (playerRef.current) {
      if (playerRef.current.getPlaylistItem()?.file === file && !force)
        return false
      try {
        safeClearTracks()
        playerRef.current.remove()
      } catch (error) {
        console.warn("Error removing player:", error)
      }
      playerRef.current = null
    }

    playEventTimeRef.current = []

    const baseConfig = {
      file,
      autostart: "viewable",
      playsinline: true,
      logo: {
        file: "https://dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com/638169755922083598-PGWhite.png",
        position: "bottom-right",
      },
    }

    const config =
      playSource !== 0
        ? { ...baseConfig, advertising: { schedule: [] } }
        : baseConfig

    if (typeof (window as any).jwplayer === "function") {
      try {
        playerRef.current = (window as any)
          .jwplayer("bliveJwplayer")
          .setup(config)

        playerRef.current.on("ready", () => {
          if (isIOS.current) safeClearTracks()
        })

        playerRef.current.on("firstFrame", analyticsEvents.player_presented)
        playerRef.current.on("play", () => {
          if (onPlay) onPlay()
          analyticsEvents.player_play(playerRef.current?.getPosition())
        })
        playerRef.current.on("pause", () => {
          if (onPause) onPause()
          analyticsEvents.player_pause(playerRef.current?.getPosition())
        })
        playerRef.current.on("complete", () => {
          if (onEndedHandler) onEndedHandler()
          analyticsEvents.player_complete(playerRef.current?.getPosition())
        })
        playerRef.current.on("playlistItem", () => {
          analyticsEvents.player_playlist_selection(
            playerRef.current?.getPosition()
          )
        })
        playerRef.current.on(
          "error",
          (error: { code?: number; message?: string }) => {
            // console.error("JWPlayer error:", error)
            analyticsEvents.player_error(error.code, error.message)
          }
        )
        playerRef.current.on(
          "time",
          (event: { position: number; viewable: number }) => {
            if (event.viewable === 0) playerRef.current?.pause()
            if (stopVideoAtRef.current === undefined) setVideoStopTime()
            if (
              stopVideoAtRef.current !== undefined &&
              stopVideoAtRef.current > 0 &&
              event.position > stopVideoAtRef.current &&
              stopPlayingAfterDuration
            ) {
              playerRef.current?.stop()
              if (onEndedHandler) onEndedHandler()
            }
            if (onProgressChange) onProgressChange(event.position)
            const intPosition = Math.round(event.position)
            if (
              PLAY_TIME_EVENT_TRIGGER.includes(intPosition) ||
              (intPosition >= PLAY_TIME_EVENT_PERIOD &&
                intPosition % PLAY_TIME_EVENT_PERIOD === 0)
            ) {
              if (!playEventTimeRef.current.includes(intPosition)) {
                analyticsEvents.play_time(intPosition)
                playEventTimeRef.current.push(intPosition)
              }
            }
          }
        )
        return true
      } catch (error) {
        // console.error("Error setting up JWPlayer:", error)
        return false
      }
    }
    return false
  }

  const setVideoStopTime = () => {
    stopVideoAtRef.current = playDuration
      ? startTime
        ? startTime + playDuration
        : playDuration
      : undefined
  }

  return (
    <div className="jw-player-wrapper" id="player">
      {hasWindow && <div id="bliveJwplayer"></div>}
      {PlayerOverlayComponent &&
        !(
          clipDetail?.id === 192043 ||
          clipDetail?.id === 192044 ||
          clipDetail?.id === 286409
        ) && <PlayerOverlayComponent {...playerOverlayComponentProps} />}
    </div>
  )
}

export default JWPlayerWrapper
