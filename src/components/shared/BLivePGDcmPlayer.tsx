import React, { FC, useRef, useEffect, useState } from "react"
import { ClipDetails } from "../../types/ClipDetails"
import dynamic from 'next/dynamic'

interface BLivePGDcmPlayerProps {
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

// Keep track of script loading at module level
const scriptPromise = new Promise<void>((resolve) => {
  if (typeof window !== 'undefined') {
    // Check if script is already loaded
    if (document.querySelector('script[src*="/js/blive/bLivePGDcmPlayer.js"]')) {
      resolve();
      return;
    }

    // Load script if not present
    const script = document.createElement('script');
    script.src = 'https://install.perfectgame.tv/public/js/blive/bLivePGDcmPlayer.js';
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  }
});

const BLivePGDcmPlayer: FC<BLivePGDcmPlayerProps> = ({
  url,
  startTime,
  playDuration,
  playClip,
  onEndedHandler,
  PlayerOverlayComponent,
  playerOverlayComponentProps,
  clipDetail,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const prevClipRef = useRef(clipDetail);  // Create ref outside useEffect

  useEffect(() => {
    setIsClient(true);
    return () => {
      // Clean up old player instance
      const event = new CustomEvent('blive-cleanup');
      document.dispatchEvent(event);
    };
  }, []);

  useEffect(() => {
    if (clipDetail && prevClipRef.current !== clipDetail) {
      console.debug('User selected new clip:', clipDetail);
      document.dispatchEvent(new CustomEvent('blive-video-change', {
        detail: { clipData: clipDetail }
      }));
    }
    prevClipRef.current = clipDetail;
  }, [clipDetail]);

  useEffect(() => {
    const handleVideoEnded = () => {
        if (onEndedHandler) {
            onEndedHandler();
        }
    };

    document.addEventListener('blive-video-ended', handleVideoEnded);
    return () => {
        document.removeEventListener('blive-video-ended', handleVideoEnded);
    };
  }, [onEndedHandler]);

  useEffect(() => {
    document.dispatchEvent(new CustomEvent('blive-play-state-change', {
      detail: { shouldPlay: playClip }
    }));
  }, [playClip]);

  if (!isClient) {
    return <div className="blive-player-wrapper"></div>  // Server-side placeholder
  }

  return (
    <div className="blive-player-wrapper jw-player-wrapper" id="player" ref={containerRef}>
      <div className="blive-dcm-embed aspect-video" blive-id="pg-player" 
           data-clip={JSON.stringify(clipDetail)}>
      </div>
      {PlayerOverlayComponent && <PlayerOverlayComponent {...playerOverlayComponentProps} />}
    </div>
  )
}

// Prevent server-side rendering
export default dynamic(() => Promise.resolve(BLivePGDcmPlayer), {
  ssr: false
}) 