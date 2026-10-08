import { memo, useEffect, useRef } from 'react';
import backgroundVideo from '../../assets/video.mp4';

function AuthVideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyPlayback = () => {
      if (motion.matches) {
        video.pause();
        return;
      }
      video.playbackRate = 0.7;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {});
      }
    };

    applyPlayback();
    video.addEventListener('loadedmetadata', applyPlayback);
    motion.addEventListener('change', applyPlayback);

    return () => {
      video.removeEventListener('loadedmetadata', applyPlayback);
      motion.removeEventListener('change', applyPlayback);
    };
  }, []);

  return (
    <div className="auth-video-bg" aria-hidden="true">
      <video
        ref={videoRef}
        className="auth-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="auth-video-overlay" />
    </div>
  );
}

export default memo(AuthVideoBackground);
