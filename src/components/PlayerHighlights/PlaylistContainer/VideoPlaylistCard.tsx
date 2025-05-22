import { useContext, useEffect, useRef, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { API_URLS, fallbackImagePath } from "../../../constants"
import { ClipDetails } from "../../../types/ClipDetails"

import { utilService } from "../../../services/utility-service"
import GlobalContext from "../../../context/GlobalContext"
import ImageWithFallback from "../../shared/ImageWithFallback"
import DKPlusSubscriptionAlert from "./DKPlusSubscriptionAlert"
import useOnScreen from "../../../hooks/useOnScreen"
import Script from "next/script"

type PlayerHighlightVideoPlaylistCardPropTypes = {
  clipInfo: ClipDetails
  isPlaying: boolean
  allowClickHandler: boolean
  playListVideoClickHandler: (clip: ClipDetails) => void
}

const VideoPlaylistCard: React.FC<
  PlayerHighlightVideoPlaylistCardPropTypes
> = ({ clipInfo, isPlaying, allowClickHandler, playListVideoClickHandler }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        ref={cardRef}
        className={
          "video-thumbnail-card" + ` ${isPlaying && "playing-video-card"}`
        }
        key={clipInfo.id}
      >
        <>
          <Col xs={12} className="px-1">
            <Row
              className="video-thumbnail-and-title"
              {...(allowClickHandler
                ? {
                    onClick: () => playListVideoClickHandler(clipInfo),
                  }
                : {})}
              title="Click to play the video"
            >
              <Col xs={4} md={3} className="thumbnail-wrapper">
                <ImageWithFallback
                  src={clipInfo.thumbnail}
                  className="thumbnail-img prevent-select"
                  width={150}
                  height={100}
                  alt="Play video"
                  fallbackSrc={fallbackImagePath}
                />
              </Col>
              <Col xs={8} md={9} className="px-1">
                <div className="text-start padright">
                  <span>{clipInfo.title}</span>
                  <div className="text-end greyed-text">
                    <small>
                      {clipInfo.highlightCreated
                        ? utilService.getFormattedDateTime(
                            clipInfo.highlightCreated
                          )
                        : utilService.getFormattedDate(clipInfo.publishedOn)}
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </>
      </div>
    </>
  )
}

export default VideoPlaylistCard
