"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Container, Badge, Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AppTabBar, type AppTab } from "@/components/AppTabBar";
import { KakaoChat, type ChatMessage } from "@/components/KakaoChat";
import { SiteFooter } from "@/components/SiteFooter";
import { CAREGIVERS, HOSPITALS, won, type Caregiver } from "@/lib/data";

type Screen =
  | "home"
  | "apply"
  | "matching"
  | "detail"
  | "negotiate"
  | "contract"
  | "payment"
  | "success"
  | "progress"
  | "my";

type TabKey = "home" | "apply" | "progress" | "my";

const TABS: AppTab[] = [
  { key: "home", label: "홈", icon: "home" },
  { key: "apply", label: "신청", icon: "plus" },
  { key: "progress", label: "진행", icon: "clipboard" },
  { key: "my", label: "마이", icon: "user" },
];

// 신청 → 정산까지 스텝 트래커용 정의 (데스크탑 좌측 레일)
const STEP_TRACKER: { key: Screen; no: number; title: string; icon: IconName }[] =
  [
    { key: "apply", no: 1, title: "간병 신청", icon: "edit" },
    { key: "matching", no: 2, title: "간병인 매칭", icon: "search" },
    { key: "detail", no: 3, title: "간병인 선택", icon: "userCheck" },
    { key: "negotiate", no: 4, title: "간병비 협의", icon: "kakao" },
    { key: "contract", no: 5, title: "전자계약", icon: "fileText" },
    { key: "payment", no: 6, title: "안전결제", icon: "creditCard" },
    { key: "progress", no: 7, title: "간병 진행", icon: "clipboard" },
  ];

const STEP_INDEX: Record<Screen, number> = {
  home: 0,
  apply: 1,
  matching: 2,
  detail: 3,
  negotiate: 4,
  contract: 5,
  payment: 6,
  success: 6,
  progress: 7,
  my: 0,
};

// 신청 폼 고정값 (데모 일관성용)
const CARE_PERIOD = "6/25 ~ 7/9";
const CARE_DAYS = 14;

// ── 인앱 공용 소품 ───────────────────────────────────────────────

function AppBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로"
          className="flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
        >
          <Icon name="chevronLeft" className="h-6 w-6" />
        </button>
      ) : (
        <span className="w-2" />
      )}
      <h2 className="flex-1 truncate text-base font-bold text-foreground">
        {title}
      </h2>
      {right}
    </header>
  );
}

function Avatar({ cg, size = 44 }: { cg: Caregiver; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        background: cg.color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
      aria-hidden="true"
    >
      {cg.name.slice(0, 1)}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      <Icon name="star" className="h-3.5 w-3.5" filled />
      <span className="tnum text-xs font-bold text-foreground">{rating}</span>
    </span>
  );
}

function TagBadge({ tag }: { tag?: Caregiver["tag"] }) {
  if (!tag) return null;
  const tone = tag === "추천" ? "primary" : tag === "지명" ? "accent" : "muted";
  return <Badge tone={tone}>{tag}</Badge>;
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────

export default function PatientAppPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedId, setSelectedId] = useState<string>(CAREGIVERS[0].id);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [hospital, setHospital] = useState<string | null>(null);
  const [matchFilter, setMatchFilter] = useState<"추천순" | "평점순" | "지명">(
    "추천순",
  );
  const [payMethod, setPayMethod] = useState<"bank" | "card">("bank");
  const [agreed, setAgreed] = useState(false);

  const selected =
    CAREGIVERS.find((c) => c.id === selectedId) ?? CAREGIVERS[0];

  const total = selected.dailyRate * CARE_DAYS;
  const fee = Math.round(total * 0.1);

  const activeTab: TabKey =
    screen === "home"
      ? "home"
      : screen === "my"
        ? "my"
        : screen === "progress" || screen === "success"
          ? "progress"
          : "apply";

  function go(next: Screen) {
    setScreen(next);
  }

  function onTab(key: TabKey) {
    if (key === "apply") go("apply");
    else go(key as Screen);
  }

  // ── 화면별 렌더 ────────────────────────────────────────────────

  const matchingList = [...CAREGIVERS].sort((a, b) => {
    if (matchFilter === "평점순") return b.rating - a.rating;
    if (matchFilter === "지명")
      return Number(b.tag === "지명") - Number(a.tag === "지명");
    return Number(b.tag === "추천") - Number(a.tag === "추천");
  });

  function renderScreen() {
    switch (screen) {
      // ── 홈 ──────────────────────────────────────────────────
      case "home":
        return (
          <div>
            <AppBar
              title="간병마스터"
              right={
                <button
                  type="button"
                  aria-label="알림"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
                >
                  <Icon name="bell" className="h-5 w-5" />
                </button>
              }
            />
            <div className="space-y-4 px-4 pb-6 pt-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  안녕하세요, 보호자님
                </p>
                <p className="text-xl font-bold text-foreground">
                  김보호 님 👋
                </p>
              </div>

              {/* 진행중 간병 카드 */}
              <button
                type="button"
                onClick={() => go("progress")}
                className="block w-full rounded-[var(--radius-lg)] bg-primary p-4 text-left text-primary-foreground shadow-sm transition-transform active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                    <Icon name="heartPulse" className="h-3.5 w-3.5" filled />
                    간병 진행중
                  </span>
                  <span className="tnum rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                    D+3
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/85">환자 김O O 님</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-lg font-bold">담당 간병인 김미숙</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    간병일지 보기
                    <Icon name="chevronRight" className="h-4 w-4" />
                  </span>
                </div>
              </button>

              {/* 큰 CTA */}
              <button
                type="button"
                onClick={() => go("apply")}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed border-primary/40 bg-primary/5 text-base font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <Icon name="plus" className="h-5 w-5" />새 간병 신청하기
              </button>

              {/* 빠른 메뉴 */}
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { icon: "hospital", label: "병원검색" },
                    { icon: "fileText", label: "서류발급" },
                    { icon: "list", label: "간병이력" },
                    { icon: "message", label: "고객의소리" },
                  ] as { icon: IconName; label: string }[]
                ).map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    className="flex min-h-11 flex-col items-center gap-1.5 rounded-[var(--radius-md)] bg-muted p-2.5 text-center transition-colors hover:bg-border/60"
                  >
                    <Icon name={m.icon} className="h-6 w-6 text-primary" />
                    <span className="text-[11px] font-medium text-foreground">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* 공지 배너 */}
              <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-accent/10 p-3.5">
                <Icon
                  name="sparkles"
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  filled
                />
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-bold">[공지]</span> 이제 카카오 알림톡으로
                  간병비를 투명하게 협의하세요. 신원검증·배상책임보험 가입
                  간병인만 매칭됩니다.
                </p>
              </div>
            </div>
          </div>
        );

      // ── 간병 신청 ───────────────────────────────────────────
      case "apply":
        return (
          <div>
            <AppBar title="간병 신청" onBack={() => go("home")} />
            <div className="space-y-5 px-4 pb-28 pt-3">
              {/* 환자와의 관계 */}
              <Field label="환자와의 관계">
                <ChipRow options={["부", "모", "배우자", "본인"]} defaultIndex={1} />
              </Field>

              {/* 환자 정보 */}
              <Field label="환자 정보">
                <div className="grid grid-cols-2 gap-2">
                  <FakeInput value="김O O" placeholder="환자 성함" />
                  <FakeInput value="72세" placeholder="연령" />
                </div>
                <div className="mt-2">
                  <ChipRow options={["남", "여"]} defaultIndex={0} />
                </div>
              </Field>

              {/* 병원 검색 */}
              <Field label="입원 병원">
                <button
                  type="button"
                  onClick={() => setHospitalOpen((v) => !v)}
                  className="flex min-h-12 w-full items-center justify-between rounded-[var(--radius-md)] border border-input bg-background px-3.5 text-left text-sm hover:bg-muted"
                >
                  <span
                    className={
                      hospital ? "font-medium text-foreground" : "text-muted-foreground"
                    }
                  >
                    {hospital ?? "병원명을 검색하세요"}
                  </span>
                  <Icon name="search" className="h-5 w-5 text-muted-foreground" />
                </button>
                {hospitalOpen && (
                  <ul className="mt-2 space-y-1.5">
                    {HOSPITALS.map((h) => (
                      <li key={h.name}>
                        <button
                          type="button"
                          onClick={() => {
                            setHospital(h.name);
                            setHospitalOpen(false);
                          }}
                          className="flex w-full items-start justify-between gap-2 rounded-[var(--radius-md)] border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {h.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {h.dept} · {h.region}
                            </span>
                          </span>
                          <Badge tone="primary" className="shrink-0">
                            <Icon name="verified" className="h-3 w-3" filled />
                            심평원 연계
                          </Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>

              {/* 간병 기간 */}
              <Field label="간병 기간">
                <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-input bg-background px-3.5 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon name="calendar" className="h-5 w-5 text-primary" />
                    {CARE_PERIOD}
                  </span>
                  <Badge tone="muted" className="tnum">
                    {CARE_DAYS}일
                  </Badge>
                </div>
              </Field>

              {/* 간병 유형 */}
              <Field label="간병 유형">
                <ChipRow
                  options={["수술 후 회복", "거동 불편", "치매", "와상"]}
                  defaultIndex={0}
                  wrap
                />
              </Field>
            </div>

            <BottomBar>
              <Button
                size="lg"
                className="w-full"
                onClick={() => go("matching")}
              >
                간병인 찾기
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </BottomBar>
          </div>
        );

      // ── 매칭 ────────────────────────────────────────────────
      case "matching":
        return (
          <div>
            <AppBar title="추천 간병인" onBack={() => go("apply")} />
            {/* 필터 칩 */}
            <div className="sticky top-14 z-10 flex gap-2 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur">
              {(["추천순", "평점순", "지명"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setMatchFilter(f)}
                  className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                    matchFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-border/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <ul className="space-y-3 px-4 pb-6 pt-3">
              {matchingList.map((cg) => (
                <li key={cg.id}>
                  <div className="rounded-[var(--radius-lg)] border border-border bg-card p-3.5">
                    <div className="flex items-start gap-3">
                      <Avatar cg={cg} size={48} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-foreground">
                            {cg.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {cg.age}세 · {cg.gender}
                          </span>
                          <TagBadge tag={cg.tag} />
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                          <Stars rating={cg.rating} />
                          <span className="tnum">리뷰 {cg.reviews}</span>
                          <span>·</span>
                          <span className="tnum">경력 {cg.careerYears}년</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Icon name="mapPin" className="h-3 w-3" />
                            {cg.region}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {cg.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
                      <div className="flex flex-col">
                        {cg.insured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                            <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                            배상책임보험 가입
                          </span>
                        )}
                        <span className="tnum text-sm font-bold text-foreground">
                          {won(cg.dailyRate)}
                          <span className="text-xs font-normal text-muted-foreground">
                            {" "}
                            / 일
                          </span>
                        </span>
                      </div>
                      <Button
                        size="md"
                        onClick={() => {
                          setSelectedId(cg.id);
                          go("detail");
                        }}
                      >
                        선택
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );

      // ── 상세 프로필 ─────────────────────────────────────────
      case "detail":
        return (
          <div>
            <AppBar title="간병인 프로필" onBack={() => go("matching")} />
            <div className="px-4 pb-28 pt-3">
              {/* 헤더 */}
              <div className="flex items-center gap-3.5">
                <Avatar cg={selected} size={64} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-foreground">
                      {selected.name}
                    </h3>
                    <TagBadge tag={selected.tag} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selected.age}세 · {selected.gender} · {selected.region}
                  </p>
                  {selected.insured && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                      신원검증 · 배상책임보험 가입
                    </span>
                  )}
                </div>
              </div>

              {/* 통계 */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-[var(--radius-lg)] border border-border bg-card py-3 text-center">
                <Stat label="평점" value={selected.rating.toFixed(1)} />
                <Stat label="리뷰" value={`${selected.reviews}`} />
                <Stat label="경력" value={`${selected.careerYears}년`} />
              </div>

              {/* 자격증 */}
              <SubHead>보유 자격</SubHead>
              <ul className="space-y-1.5">
                {selected.certs.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Icon
                      name="checkCircle"
                      className="h-4.5 w-4.5 shrink-0 text-primary"
                    />
                    {c}
                  </li>
                ))}
              </ul>

              {/* 전문분야 */}
              <SubHead>전문 분야</SubHead>
              <div className="flex flex-wrap gap-1.5">
                {selected.specialties.map((s) => (
                  <Badge key={s} tone="primary">
                    {s}
                  </Badge>
                ))}
              </div>

              {/* 소개 */}
              <SubHead>간병인 소개</SubHead>
              <p className="rounded-[var(--radius-md)] bg-muted p-3.5 text-sm leading-relaxed text-foreground">
                {selected.intro}
              </p>

              {/* 리뷰 */}
              <SubHead>보호자 리뷰</SubHead>
              <ul className="space-y-2.5">
                {REVIEWS.map((r) => (
                  <li
                    key={r.author}
                    className="rounded-[var(--radius-md)] border border-border bg-card p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {r.author}
                      </span>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {r.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <BottomBar>
              <Button
                size="lg"
                className="w-full"
                onClick={() => go("negotiate")}
              >
                <Icon name="kakao" className="h-5 w-5" filled />이 간병인으로
                간병비 협의
              </Button>
            </BottomBar>
          </div>
        );

      // ── 간병비 협의 (카카오) ────────────────────────────────
      case "negotiate":
        return (
          <div>
            <AppBar
              title={`${selected.name} 간병인`}
              onBack={() => go("detail")}
            />
            <KakaoChat
              partnerName={selected.name}
              messages={
                [
                  { from: "system", text: "간병비 협의가 시작되었습니다" },
                  {
                    from: "them",
                    text: `안녕하세요 보호자님, ${selected.name}입니다. 환자분 상태 확인했습니다. 제 일당은 ${won(
                      selected.dailyRate,
                    )}입니다.`,
                    time: "오후 2:14",
                  },
                  {
                    from: "me",
                    text: `네 안녕하세요. ${CARE_PERIOD}, 총 ${CARE_DAYS}일 부탁드립니다.`,
                    time: "오후 2:16",
                  },
                  {
                    from: "them",
                    time: "오후 2:18",
                    text: "확인했습니다. 간병비 견적 보내드립니다.",
                    card: (
                      <div className="w-60 p-4">
                        <p className="text-xs font-semibold text-primary">
                          간병비 견적서
                        </p>
                        <div className="mt-2.5 space-y-1.5 text-[13px]">
                          <Row k="일당" v={won(selected.dailyRate)} />
                          <Row k="간병 기간" v={`${CARE_DAYS}일`} />
                          <div className="my-1.5 border-t border-border" />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">
                              총 간병비
                            </span>
                            <span className="tnum text-base font-bold text-primary">
                              {won(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    from: "me",
                    text: "네, 진행할게요. 잘 부탁드립니다.",
                    time: "오후 2:20",
                  },
                ] satisfies ChatMessage[]
              }
            />
            <BottomBar>
              <Button
                size="lg"
                className="w-full"
                onClick={() => go("contract")}
              >
                협의 완료 · 계약 진행
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </BottomBar>
          </div>
        );

      // ── 전자 중개계약서 ─────────────────────────────────────
      case "contract":
        return (
          <div>
            <AppBar title="전자 중개계약서" onBack={() => go("negotiate")} />
            <div className="px-4 pb-32 pt-3">
              {/* 문서 카드 */}
              <article className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-semibold text-primary">
                    제니엘메디컬 간병 중개
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">
                    표준 간병 중개계약서
                  </h3>
                  <p className="tnum mt-0.5 text-xs text-muted-foreground">
                    계약번호 ZM-2026-0625-1031
                  </p>
                </div>

                <div className="my-4 border-t border-dashed border-border" />

                <DocSection title="계약 당사자">
                  <Row k="보호자 (갑)" v="김보호" />
                  <Row k="간병인 (을)" v={`${selected.name} (${selected.region})`} />
                  <Row k="중개사업자" v="제니엘메디컬(주)" />
                </DocSection>

                <DocSection title="간병 조건">
                  <Row k="간병 기간" v={`${CARE_PERIOD} (${CARE_DAYS}일)`} />
                  <Row k="일당" v={won(selected.dailyRate)} />
                  <Row k="총 간병비" v={won(total)} strong />
                  <Row k="중개수수료 (10%)" v={won(fee)} />
                </DocSection>

                <DocSection title="특약사항">
                  <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
                    <li>
                      간병인은 신원검증 및 배상책임보험에 가입되어 있으며, 사고
                      발생 시 보험으로 배상합니다.
                    </li>
                    <li>
                      간병비는 안전결제로 예치되며, 간병 종료 후 자동 정산됩니다.
                    </li>
                    <li>
                      간병 중단 시 일할 계산하여 잔여 간병비를 환급합니다.
                    </li>
                  </ul>
                </DocSection>
              </article>

              {/* 동의 체크 */}
              <button
                type="button"
                onClick={() => setAgreed((v) => !v)}
                className="mt-4 flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border bg-muted p-3.5 text-left"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    agreed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                  aria-hidden="true"
                >
                  {agreed && <Icon name="check" className="h-4 w-4" />}
                </span>
                <span className="text-sm font-medium text-foreground">
                  위 계약 내용을 확인하였으며 전자서명에 동의합니다.
                </span>
              </button>
            </div>

            <BottomBar>
              <Button
                size="lg"
                className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => agreed && go("payment")}
              >
                <Icon name="lock" className="h-5 w-5" />
                동의하고 결제
              </Button>
              {!agreed && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  계약 동의 후 결제할 수 있습니다.
                </p>
              )}
            </BottomBar>
          </div>
        );

      // ── 결제 ────────────────────────────────────────────────
      case "payment":
        return (
          <div>
            <AppBar title="결제" onBack={() => go("contract")} />
            <div className="space-y-5 px-4 pb-32 pt-3">
              <Field label="결제수단">
                <div className="space-y-2">
                  {(
                    [
                      {
                        key: "bank" as const,
                        icon: "bank" as IconName,
                        label: "은행 즉시이체",
                        sub: "대외연계 · 즉시 출금",
                      },
                      {
                        key: "card" as const,
                        icon: "creditCard" as IconName,
                        label: "신용카드",
                        sub: "대외연계 · 카드 결제승인",
                      },
                    ]
                  ).map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPayMethod(m.key)}
                      className={`flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-md)] border-2 px-3.5 text-left transition-colors ${
                        payMethod === m.key
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <Icon
                        name={m.icon}
                        className={`h-6 w-6 shrink-0 ${
                          payMethod === m.key ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {m.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {m.sub}
                        </span>
                      </span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          payMethod === m.key
                            ? "border-primary"
                            : "border-border"
                        }`}
                        aria-hidden="true"
                      >
                        {payMethod === m.key && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* 결제 요약 */}
              <Field label="결제 요약">
                <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
                  <Row
                    k={`간병비 (${won(selected.dailyRate)} × ${CARE_DAYS}일)`}
                    v={won(total)}
                  />
                  <div className="mt-1.5">
                    <Row k="중개수수료 (10%)" v={won(fee)} />
                  </div>
                  <div className="my-3 border-t border-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      총 결제금액
                    </span>
                    <span className="tnum text-xl font-bold text-primary">
                      {won(total + fee)}
                    </span>
                  </div>
                </div>
              </Field>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="shieldCheck" className="h-4 w-4" />
                안전결제로 예치 후 간병 종료 시 정산됩니다.
              </p>
            </div>

            <BottomBar>
              <Button
                size="lg"
                className="w-full"
                onClick={() => go("success")}
              >
                {won(total + fee)} 결제하기
              </Button>
            </BottomBar>
          </div>
        );

      // ── 결제 완료 ───────────────────────────────────────────
      case "success":
        return (
          <div className="flex min-h-full flex-col">
            <AppBar title="결제 완료" />
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
              <div className="animate-fade-up flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Icon
                  name="checkCircle"
                  className="h-12 w-12 text-primary"
                  filled
                />
              </div>
              <h3 className="animate-fade-up mt-5 text-xl font-bold text-foreground">
                결제가 완료되었습니다
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                간병인 매칭이 확정되었습니다.
              </p>

              <div className="animate-fade-up mt-6 w-full rounded-[var(--radius-lg)] border border-border bg-card p-4 text-left">
                <div className="flex items-center gap-3">
                  <Avatar cg={selected} size={44} />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {selected.name} 간병인
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.region}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                  <Row k="간병 기간" v={`${CARE_PERIOD} (${CARE_DAYS}일)`} />
                  <Row k="결제금액" v={won(total + fee)} strong />
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => go("progress")}
              >
                진행상태 보기
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      // ── 진행 ────────────────────────────────────────────────
      case "progress":
        return (
          <div>
            <AppBar title="간병 진행" />
            <div className="space-y-5 px-4 pb-6 pt-3">
              {/* 타임라인 */}
              <Field label="진행 상태">
                <ol className="relative space-y-0">
                  {PROGRESS_STEPS.map((s, i) => {
                    const done = i <= 2;
                    const current = i === 2;
                    const last = i === PROGRESS_STEPS.length - 1;
                    return (
                      <li key={s.label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              current
                                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                : done
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {done ? (
                              <Icon name="check" className="h-4 w-4" />
                            ) : (
                              <span className="tnum text-xs font-bold">
                                {i + 1}
                              </span>
                            )}
                          </span>
                          {!last && (
                            <span
                              className={`my-0.5 w-0.5 flex-1 ${
                                i < 2 ? "bg-primary" : "bg-border"
                              }`}
                            />
                          )}
                        </div>
                        <div className={last ? "pb-0" : "pb-5"}>
                          <p
                            className={`text-sm font-semibold ${
                              current ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {s.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.desc}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </Field>

              {/* 오늘의 간병일지 */}
              <Field label="오늘의 간병일지">
                <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Avatar cg={selected} size={28} />
                      {selected.name} 작성
                    </span>
                    <span className="tnum text-xs text-muted-foreground">
                      6/27 18:30
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {DIARY.map((d) => (
                      <li key={d.k} className="flex gap-2">
                        <Icon
                          name={d.icon}
                          className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary"
                        />
                        <span>
                          <span className="font-semibold text-foreground">
                            {d.k}
                          </span>{" "}
                          <span className="text-muted-foreground">{d.v}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Field>

              {/* 정산 예정 */}
              <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-primary/5 p-3.5">
                <Icon
                  name="coins"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    간병비 정산 예정
                  </p>
                  <p className="text-muted-foreground">
                    간병 종료일(7/9) 다음 영업일에{" "}
                    <span className="tnum font-semibold text-foreground">
                      {won(total)}
                    </span>
                    이 {selected.name} 간병인에게 자동 정산됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // ── 마이 ────────────────────────────────────────────────
      case "my":
        return (
          <div>
            <AppBar title="마이페이지" />
            <div className="space-y-5 px-4 pb-6 pt-3">
              {/* 프로필 */}
              <div className="flex items-center gap-3.5 rounded-[var(--radius-lg)] border border-border bg-card p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="user" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">김보호 님</p>
                  <p className="text-sm text-muted-foreground">
                    010-1234-5678 · 본인인증 완료
                  </p>
                </div>
              </div>

              {/* 메뉴 */}
              <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
                {MY_MENU.map((m, i) => (
                  <li key={m.label}>
                    <button
                      type="button"
                      className={`flex min-h-13 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                        i > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <Icon name={m.icon} className="h-5 w-5 text-primary" />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {m.label}
                      </span>
                      <Icon
                        name="chevronRight"
                        className="h-4 w-4 text-muted-foreground"
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                <Icon name="logout" className="h-5 w-5" />
                로그아웃
              </button>
            </div>
          </div>
        );
    }
  }

  const currentStep = STEP_INDEX[screen];

  return (
    <>
      <Container className="py-8 sm:py-10">
        {/* 인트로 */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="primary">환자·보호자용 App</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            보호자가 간병인을 만나는
            <br className="hidden sm:block" /> 가장 쉬운 길
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            신청부터 매칭, 간병비 협의, 전자계약, 안전결제, 실시간 진행 확인까지.
            복잡했던 간병 중개를 하나의 앱에서 투명하고 간편하게.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            📱 화면의 버튼을 눌러 신청 → 매칭 → 결제 흐름을 직접 체험해 보세요
          </p>
        </div>

        {/* 본문: 스텝 트래커 + 폰 */}
        <div className="mx-auto mt-10 grid max-w-5xl justify-center gap-10 lg:grid-cols-[260px_minmax(0,380px)] lg:items-start">
          {/* 스텝 트래커 (데스크탑) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <p className="text-sm font-bold text-foreground">간병 진행 단계</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                현재 단계가 강조됩니다
              </p>
              <ol className="mt-4 space-y-0">
                {STEP_TRACKER.map((step, i) => {
                  const isActive = step.no === currentStep;
                  const isDone = step.no < currentStep;
                  const last = i === STEP_TRACKER.length - 1;
                  return (
                    <li key={step.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : isDone
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isDone ? (
                            <Icon name="check" className="h-4 w-4" />
                          ) : (
                            <Icon name={step.icon} className="h-4 w-4" />
                          )}
                        </span>
                        {!last && (
                          <span
                            className={`my-1 w-0.5 flex-1 ${
                              isDone ? "bg-primary/40" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className={last ? "pb-0 pt-1" : "pb-4 pt-1"}>
                        <p
                          className={`text-sm font-semibold ${
                            isActive
                              ? "text-primary"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* 폰 */}
          <div className="w-full max-w-[380px] justify-self-center">
            <PhoneFrame
              tabBar={
                <AppTabBar<TabKey>
                  tabs={TABS}
                  active={activeTab}
                  onChange={onTab}
                />
              }
            >
              {renderScreen()}
            </PhoneFrame>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </>
  );
}

// ── 보조 컴포넌트 / 데이터 ───────────────────────────────────────

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

function ChipRow({
  options,
  defaultIndex = 0,
  wrap = false,
}: {
  options: string[];
  defaultIndex?: number;
  wrap?: boolean;
}) {
  const [sel, setSel] = useState(defaultIndex);
  return (
    <div className={`flex gap-2 ${wrap ? "flex-wrap" : ""}`}>
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => setSel(i)}
          className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
            sel === i
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-border/60"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function FakeInput({
  value,
  placeholder,
}: {
  value: string;
  placeholder: string;
}) {
  return (
    <div className="flex min-h-12 items-center rounded-[var(--radius-md)] border border-input bg-background px-3.5">
      <span className="text-sm font-medium text-foreground">{value}</span>
      <span className="sr-only">{placeholder}</span>
    </div>
  );
}

function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tnum text-base font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SubHead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 mt-5 text-sm font-bold text-foreground">{children}</p>
  );
}

function Row({
  k,
  v,
  strong = false,
}: {
  k: string;
  v: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[13px]">
      <span className="text-muted-foreground">{k}</span>
      <span
        className={`tnum ${
          strong ? "font-bold text-primary" : "font-semibold text-foreground"
        }`}
      >
        {v}
      </span>
    </div>
  );
}

function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-3.5">
      <p className="mb-1.5 text-xs font-bold text-foreground">{title}</p>
      <div className="space-y-1.5 rounded-[var(--radius-sm)] bg-muted p-3">
        {children}
      </div>
    </section>
  );
}

const REVIEWS: { author: string; rating: number; text: string }[] = [
  {
    author: "이*경 보호자",
    rating: 5,
    text: "아버지 고관절 수술 후 2주간 간병해주셨는데, 매일 상태를 꼼꼼히 알려주셔서 안심됐어요. 거동 보조도 능숙하셨습니다.",
  },
  {
    author: "박*수 보호자",
    rating: 5,
    text: "처음 간병 신청이라 걱정했는데 친절하게 설명해주시고 어머니도 편하게 잘 따르셨어요. 다음에도 꼭 다시 부탁드리고 싶습니다.",
  },
  {
    author: "정*민 보호자",
    rating: 4,
    text: "투약 시간 관리와 식사 챙기는 것이 정확하셨습니다. 병원 간호사분들과도 소통이 원활해서 좋았어요.",
  },
];

const PROGRESS_STEPS: { label: string; desc: string }[] = [
  { label: "계약 완료", desc: "전자 중개계약서 서명 완료 · 6/24" },
  { label: "결제 완료", desc: "안전결제 예치 완료 · 6/24" },
  { label: "간병 진행중", desc: "D+3 · 매일 간병일지 작성 중" },
  { label: "정산 예정", desc: "간병 종료 후 자동 정산·환급" },
];

const DIARY: { k: string; v: string; icon: IconName }[] = [
  { k: "식사", v: "아침·점심·저녁 정상 섭취, 죽 위주", icon: "checkCircle" },
  { k: "투약", v: "진통제·소염제 처방대로 3회 복용", icon: "checkCircle" },
  { k: "배변", v: "정상, 화장실 이동 보조함", icon: "checkCircle" },
  {
    k: "특이사항",
    v: "오전 재활 보행 연습 10분 진행, 통증 호소 없음",
    icon: "alert",
  },
];

const MY_MENU: { label: string; icon: IconName }[] = [
  { label: "간병 이력", icon: "list" },
  { label: "정산·환급 내역", icon: "wallet" },
  { label: "서류 발급", icon: "fileText" },
  { label: "1:1 문의 (Q&A)", icon: "message" },
  { label: "자주 묻는 질문 (FAQ)", icon: "alert" },
  { label: "고객만족도 평가", icon: "thumbsUp" },
];
