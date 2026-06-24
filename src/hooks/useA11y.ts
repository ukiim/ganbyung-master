"use client";

import { useCallback, useEffect, useState } from "react";

// 전역 접근성 환경설정 — 큰글씨(root font-size 확대, rem 기반 전체 스케일) + 고대비.
// localStorage 영구화 + 같은 페이지 내 여러 토글(헤더/인앱) 동기화(커스텀 이벤트).
const LS_LARGE = "gm-large-text";
const LS_HC = "gm-high-contrast";
const EVT = "gm-a11y-change";

function read(key: string): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function write(key: string, val: boolean) {
  try {
    window.localStorage.setItem(key, val ? "1" : "0");
  } catch {
    /* no-op */
  }
}

export function useA11y() {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // 초기 로드 + 다른 인스턴스/탭 변경 동기화
  useEffect(() => {
    const sync = () => {
      setLargeText(read(LS_LARGE));
      setHighContrast(read(LS_HC));
    };
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // 클래스 적용
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
  }, [largeText]);
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const toggleLargeText = useCallback(() => {
    const next = !read(LS_LARGE);
    write(LS_LARGE, next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const toggleHighContrast = useCallback(() => {
    const next = !read(LS_HC);
    write(LS_HC, next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { largeText, highContrast, toggleLargeText, toggleHighContrast };
}
