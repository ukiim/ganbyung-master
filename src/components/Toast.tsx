"use client";

import { useCallback, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";

type ToastState = { message: string; icon: IconName; tone: "default" | "kakao" } | null;

// 앱(폰 프레임) 내부 토스트. useToast()로 트리거를 얻고, node를 PhoneFrame의 overlay로 렌더한다.
export function useToast() {
  const [state, setState] = useState<ToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, icon: IconName = "checkCircle", tone: "default" | "kakao" = "default") => {
      setState({ message, icon, tone });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState(null), 2200);
    },
    []
  );

  const node = state ? (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex justify-center px-6">
      <div
        key={state.message}
        className="animate-toast-in flex items-center gap-2 rounded-full bg-foreground/92 px-4 py-2.5 text-sm font-medium text-background shadow-lg backdrop-blur"
      >
        <Icon
          name={state.icon}
          filled={state.tone === "kakao"}
          className={`h-4.5 w-4.5 ${state.tone === "kakao" ? "text-[#fee500]" : "text-primary"}`}
        />
        {state.message}
      </div>
    </div>
  ) : null;

  return { show, node };
}
