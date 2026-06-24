import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";

export type ChatMessage = {
  from: "me" | "them" | "system";
  text?: ReactNode;
  time?: string;
  card?: ReactNode;
};

// 카카오 알림톡 스타일 간병비 협의 대화 UI.
export function KakaoChat({
  messages,
  partnerName,
}: {
  messages: ChatMessage[];
  partnerName: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-[#b2c7d9] px-4 py-5">
      <div className="mx-auto flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-[11px] font-medium text-white/90">
        <Icon name="kakao" className="h-3.5 w-3.5" filled />
        카카오 알림톡 · 간병비 협의
      </div>

      {messages.map((m, i) => {
        if (m.from === "system") {
          return (
            <div key={i} className="mx-auto my-1 rounded-full bg-black/10 px-3 py-1 text-center text-[11px] text-white/90">
              {m.text}
            </div>
          );
        }
        const mine = m.from === "me";
        return (
          <div
            key={i}
            className={`flex items-end gap-1.5 ${mine ? "flex-row-reverse" : "flex-row"}`}
          >
            {!mine && (
              <div className="mb-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-xs font-bold text-[#3b1e1e]">
                {partnerName.slice(0, 1)}
              </div>
            )}
            <div className={`flex max-w-[78%] flex-col ${mine ? "items-end" : "items-start"}`}>
              {!mine && (
                <span className="mb-0.5 ml-1 text-[11px] font-medium text-[#3b3b3b]/80">
                  {partnerName}
                </span>
              )}
              <div className="flex items-end gap-1">
                {mine && m.time && (
                  <span className="mb-0.5 text-[10px] text-[#3b3b3b]/60">{m.time}</span>
                )}
                <div>
                  {m.text && (
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed shadow-sm ${
                        mine
                          ? "rounded-tr-md bg-[#fee500] text-[#191600]"
                          : "rounded-tl-md bg-white text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                  {m.card && (
                    <div className="mt-1 overflow-hidden rounded-2xl bg-white shadow-sm">
                      {m.card}
                    </div>
                  )}
                </div>
                {!mine && m.time && (
                  <span className="mb-0.5 text-[10px] text-[#3b3b3b]/60">{m.time}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
