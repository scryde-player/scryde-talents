// components/FrameChecker.tsx
'use client';

import { useEffect, useState } from 'react';
import CryingOrc from '../CryingOrc/CryingOrc';

export default function FrameChecker({ children }: { children: React.ReactNode }) {
  const [isFrame, setIsFrame] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkFrame = () => {
      const inIframe = window.self !== window.top;
      const urlParams = new URLSearchParams(window.location.search);
      const hasFrameParam = urlParams.get('frame') === '1';
      setIsFrame(inIframe || hasFrameParam);
    };

    checkFrame();
  }, []);

  if (!isMounted) {
    return <>{children}</>; // На сервере показываем обычный контент
  }

  return isFrame ? <CryingOrc /> : <>{children}</>;
}