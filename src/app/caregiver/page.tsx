"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Container, Eyebrow } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AppTabBar, type AppTab } from "@/components/AppTabBar";
import { KakaoChat, type ChatMessage } from "@/components/KakaoChat";
import { SiteFooter } from "@/components/SiteFooter";
import { CAREGIVERS, JOBS, won, type Job } from "@/lib/data";

const ME = CAREGIVERS[0]; // 김미숙

type Screen =
  | "home"
  | "jobs"
  | "jobDetail"
  | "negotiate"
  | "contract"
  | "matched"
  | "log"
  | "settle"
  | "my";

type TabKey = "home" | "jobs" | "log" | "settle" | "my";

const TABS: AppTab[] = [
  { key: "home", label: "홈", icon: "home" },
  { key: "jobs", label: "일자리", icon: "search" },
  { key: "log", label: "간병일지", icon: "clipboard" },
  { key: "settle", label: "정산", icon: "coins" },
  { key: "my", label: "마이", icon: "user" },
];

// 데스크탑 좌측 세로 스텝 트래커가 추적하는 진행 흐름.
const STEP_TRACK: { key: Screen; label: string; icon: IconName; desc: string }[] =
  [
    { key: "jobs", label: "일자리 찾기", icon: "search", desc: "지명·공개모집·추천 탐색" },
    { key: "jobDetail", label: "신청·제안", icon: "briefcase", desc: "상세 확인 후 지원/제안" },
    { key: "negotiate", label: "간병비 협의", icon: "kakao", desc: "보호자와 알림톡 협의" },
    { key: "contract", label: "전자계약", icon: "fileText", desc: "중개계약서 서명" },
    { key: "log", label: "간병일지", icon: "clipboard", desc: "매칭 후 일지 작성" },
    { key: "settle", label: "정산", icon: "coins", desc: "간병료 자동 정산" },
  ];

// 진행 트래커상의 현재 위치 인덱스 (탭 전용 화면은 매핑).
const TRACK_INDEX: Record<Screen, number> = {
  home: 0,
  jobs: 0,
  jobDetail: 1,
  negotiate: 2,
  contract: 3,
  matched: 4,
  log: 4,
  settle: 5,
  my: 5,
};

function won0(n: number) {
  return n.toLocaleString("ko-KR");
}

// ── 작은 공용 프리미티브 (앱 화면 내부 전용) ─────────────────────────────
function ScreenWrap({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 px-4 py-5">{children}</div>;
}

function ScreenTitle({
  title,
  onBack,
  trailing,
}: {
  title: string;
  onBack?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
        >
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>
      )}
      <h2 className="flex-1 text-lg font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {trailing}
    </div>
  );
}

function JobTypeBadge({ type, urgent }: { type: Job["type"]; urgent?: boolean }) {
  const tone =
    type === "지명" ? "accent" : type === "추천" ? "primary" : "muted";
  return (
    <div className="flex items-center gap-1.5">
      <Badge tone={tone}>
        {type === "지명" && <Icon name="userCheck" className="h-3 w-3" />}
        {type === "추천" && <Icon name="sparkles" className="h-3 w-3" filled />}
        {type}
      </Badge>
      {urgent && (
        <Badge tone="warning">
          <Icon name="alert" className="h-3 w-3" />
          긴급
        </Badge>
      )}
    </div>
  );
}

function PatientAvatar({
  color,
  label,
  className = "h-10 w-10",
}: {
  color: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

// ── 정산 목업 데이터 (이 화면 전용) ──────────────────────────────────────
type Settlement = {
  id: string;
  patient: string;
  hospital: string;
  period: string;
  days: number;
  dailyRate: number;
  status: "정산완료" | "정산예정";
};

const SETTLEMENTS: Settlement[] = [
  {
    id: "st-2204",
    patient: "여 / 79세",
    hospital: "서울아산병원",
    period: "5/12 ~ 5/26",
    days: 14,
    dailyRate: 130000,
    status: "정산완료",
  },
  {
    id: "st-2218",
    patient: "남 / 83세",
    hospital: "삼성서울병원",
    period: "5/30 ~ 6/6",
    days: 7,
    dailyRate: 130000,
    status: "정산완료",
  },
  {
    id: "st-2231",
    patient: "여 / 71세",
    hospital: "강동경희대학교병원",
    period: "6/10 ~ 6/24",
    days: 14,
    dailyRate: 130000,
    status: "정산예정",
  },
];

const FEE_RATE = 0.1; // 중개 수수료 10%

// 작성 완료된 간병일지 히스토리.
const LOG_HISTORY: {
  date: string;
  status: string;
  meal: string;
  note: string;
}[] = [
  {
    date: "6/23 (월)",
    status: "양호",
    meal: "아침·점심·저녁 완식",
    note: "오전 보행 재활 30분 진행. 통증 호소 없음.",
  },
  {
    date: "6/22 (일)",
    status: "양호",
    meal: "아침 1/2, 점심·저녁 완식",
    note: "수술 부위 소독 후 드레싱 교체. 보호자 통화 완료.",
  },
  {
    date: "6/21 (토)",
    status: "주의",
    meal: "전 끼니 1/3 섭취",
    note: "미열(37.6도) 확인되어 담당 간호사에게 보고함.",
  },
];

export default function CaregiverAppPage() {
  const [tab, setTab] = useState<TabKey>("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedJobId, setSelectedJobId] = useState<string>(JOBS[0].id);
  const [contractAgreed, setContractAgreed] = useState(false);
  const [logStatus, setLogStatus] = useState("양호");
  const [logSubmitted, setLogSubmitted] = useState(false);

  const selectedJob = useMemo(
    () => JOBS.find((j) => j.id === selectedJobId) ?? JOBS[0],
    [selectedJobId],
  );

  // 탭 전환: 탭 키에 해당하는 대표 화면으로 이동.
  const goTab = (key: TabKey) => {
    setTab(key);
    setScreen(key === "jobs" ? "jobs" : key);
  };

  // 흐름 내비게이션: 탭 표시는 가장 가까운 탭으로 유지.
  const go = (next: Screen) => {
    setScreen(next);
    if (next === "home") setTab("home");
    else if (next === "jobs" || next === "jobDetail" || next === "negotiate")
      setTab("jobs");
    else if (next === "contract" || next === "matched" || next === "log")
      setTab("log");
    else if (next === "settle") setTab("settle");
    else if (next === "my") setTab("my");
  };

  const openJob = (id: string) => {
    setSelectedJobId(id);
    go("jobDetail");
  };

  // 예상 간병료 / 수수료 계산.
  const jobTotal = selectedJob.dailyRate * selectedJob.days;
  const monthlyEstimate = SETTLEMENTS.filter(
    (s) => s.status === "정산예정",
  ).reduce((sum, s) => sum + s.dailyRate * s.days, 0);
  const monthlyDone = SETTLEMENTS.filter(
    (s) => s.status === "정산완료",
  ).reduce((sum, s) => sum + Math.round(s.dailyRate * s.days * (1 - FEE_RATE)), 0);

  const negotiateMessages: ChatMessage[] = [
    { from: "system", text: `${selectedJob.hospital} · 간병비 협의 시작` },
    {
      from: "them",
      text: `안녕하세요, 김미숙 선생님. ${selectedJob.condition} 환자 간병 가능하실까요?`,
      time: "오후 2:10",
    },
    {
      from: "me",
      text: `네, 가능합니다. ${selectedJob.condition} 케어 경력이 많습니다. 일당 ${won(
        selectedJob.dailyRate,
      )}로 제안드립니다.`,
      time: "오후 2:13",
    },
    {
      from: "them",
      text: `좋습니다. 기간은 ${selectedJob.period} (${selectedJob.days}일) 그대로 진행하면 될까요?`,
      time: "오후 2:15",
    },
    {
      from: "me",
      text: "네, 그 기간으로 확정하겠습니다. 최종 견적 보내드립니다.",
      time: "오후 2:16",
    },
    {
      from: "me",
      card: (
        <div className="w-60 p-3.5">
          <p className="text-[11px] font-semibold text-primary">
            최종 간병비 견적
          </p>
          <p className="mt-1 text-base font-bold text-foreground">
            {selectedJob.hospital}
          </p>
          <dl className="mt-2.5 space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">일당</dt>
              <dd className="tnum font-semibold text-foreground">
                {won(selectedJob.dailyRate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">기간</dt>
              <dd className="tnum font-semibold text-foreground">
                {selectedJob.days}일
              </dd>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-1.5">
              <dt className="font-semibold text-foreground">예상 간병료</dt>
              <dd className="tnum text-sm font-bold text-primary">
                {won(jobTotal)}
              </dd>
            </div>
          </dl>
        </div>
      ),
    },
    {
      from: "them",
      text: "네 좋습니다. 잘 부탁드립니다, 선생님!",
      time: "오후 2:18",
    },
  ];

  // ── 화면 렌더러 ─────────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <ScreenWrap>
            <div>
              <p className="text-sm text-muted-foreground">반갑습니다</p>
              <p className="text-xl font-bold tracking-tight text-foreground">
                안녕하세요, {ME.name} 님
              </p>
            </div>

            {/* 신규 지명 제안 알림 */}
            <button
              type="button"
              onClick={() => openJob(JOBS[0].id)}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-accent/30 bg-accent/10 p-3 text-left transition-colors hover:bg-accent/15"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Icon name="bell" className="h-4.5 w-4.5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  신규 지명 제안 1건
                </span>
                <span className="block text-xs text-muted-foreground">
                  {JOBS[0].hospital} · 보호자가 직접 지명했어요
                </span>
              </span>
              <Icon
                name="chevronRight"
                className="h-5 w-5 shrink-0 text-muted-foreground"
              />
            </button>

            {/* 진행중 간병 카드 */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  진행중 간병
                </span>
                <Badge tone="success">진행중 · D+5</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <PatientAvatar color={ME.color} label="환" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    여 / 71세 · 무릎 인공관절 재활
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    강동경희대학교병원 · 6/10 ~ 6/24
                  </p>
                </div>
              </div>
              <Button
                variant="outlined"
                size="md"
                className="mt-3 w-full"
                onClick={() => go("log")}
              >
                <Icon name="clipboard" className="h-4 w-4" />
                오늘 일지 쓰기
              </Button>
            </Card>

            {/* 정산 요약 카드 */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  이번 달 예상 간병료
                </span>
                <Icon name="coins" className="h-4 w-4 text-primary" />
              </div>
              <p className="tnum mt-1.5 text-2xl font-bold text-foreground">
                {won(monthlyEstimate)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                정산예정 1건 · 수수료 차감 전
              </p>
              <Button
                variant="ghost"
                size="md"
                className="mt-2 w-full"
                onClick={() => go("settle")}
              >
                정산 내역 보기
                <Icon name="chevronRight" className="h-4 w-4" />
              </Button>
            </Card>

            {/* 오늘의 추천 일자리 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  오늘의 추천 일자리
                </h3>
                <button
                  type="button"
                  onClick={() => goTab("jobs")}
                  className="text-xs font-semibold text-primary"
                >
                  전체보기
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {JOBS.slice(0, 2).map((job) => (
                  <Card key={job.id} className="p-3.5">
                    <JobTypeBadge type={job.type} urgent={job.urgent} />
                    <p className="mt-2 text-sm font-bold text-foreground">
                      {job.condition}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.hospital} · {job.region}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="tnum text-sm font-bold text-primary">
                        {won(job.dailyRate)}
                        <span className="text-xs font-normal text-muted-foreground">
                          /일
                        </span>
                      </span>
                      <Button size="md" onClick={() => openJob(job.id)}>
                        지원하기
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScreenWrap>
        );

      case "jobs":
        return (
          <ScreenWrap>
            <ScreenTitle title="일자리 찾기" />
            {/* 필터 칩 */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
              {["전체", "지명", "공개모집", "추천", "서울 전역"].map((chip, i) => (
                <button
                  key={chip}
                  type="button"
                  className={`min-h-9 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {JOBS.map((job) => (
                <Card key={job.id} hover className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <JobTypeBadge type={job.type} urgent={job.urgent} />
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {job.patient}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-snug text-foreground">
                    {job.condition}
                  </p>
                  <dl className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Icon name="hospital" className="h-3.5 w-3.5 shrink-0" />
                      <dd>{job.hospital}</dd>
                      <Badge tone="muted" className="ml-auto">
                        심평원 검증
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0" />
                      <dd>{job.region}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="calendar" className="h-3.5 w-3.5 shrink-0" />
                      <dd>
                        {job.period} ({job.days}일)
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="tnum text-base font-bold text-primary">
                      {won(job.dailyRate)}
                      <span className="text-xs font-normal text-muted-foreground">
                        /일
                      </span>
                    </span>
                    <Button size="md" variant="outlined" onClick={() => openJob(job.id)}>
                      상세보기
                      <Icon name="chevronRight" className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScreenWrap>
        );

      case "jobDetail":
        return (
          <ScreenWrap>
            <ScreenTitle title="일자리 상세" onBack={() => go("jobs")} />
            <Card className="p-4">
              <JobTypeBadge type={selectedJob.type} urgent={selectedJob.urgent} />
              <p className="mt-2.5 text-base font-bold leading-snug text-foreground">
                {selectedJob.condition}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                환자 {selectedJob.patient}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-y-3 rounded-[var(--radius-md)] bg-muted p-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">병원</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {selectedJob.hospital}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">지역</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {selectedJob.region}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">기간</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {selectedJob.period}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">일수</dt>
                  <dd className="tnum mt-0.5 font-semibold text-foreground">
                    {selectedJob.days}일
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">일당</dt>
                  <dd className="tnum mt-0.5 font-semibold text-foreground">
                    {won(selectedJob.dailyRate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">예상 간병료</dt>
                  <dd className="tnum mt-0.5 font-bold text-primary">
                    {won(jobTotal)}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-bold text-foreground">
                보호자 요청사항
              </h3>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                <li className="flex gap-1.5">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  수술 후 보행 재활 보조와 화장실 이동 도움이 가능하신 분
                </li>
                <li className="flex gap-1.5">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  식사·투약 관리 및 일일 간병일지 작성 필수
                </li>
                <li className="flex gap-1.5">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  요양보호사 1급 자격 보유, 배상책임보험 가입 우대
                </li>
              </ul>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="lg"
                className="flex-1"
                onClick={() => go("negotiate")}
              >
                간병 신청
              </Button>
              <Button size="lg" className="flex-1" onClick={() => go("negotiate")}>
                간병비 제안
              </Button>
            </div>
          </ScreenWrap>
        );

      case "negotiate":
        return (
          <div className="flex flex-col">
            <div className="px-4 pt-5">
              <ScreenTitle
                title="간병비 협의"
                onBack={() => go("jobDetail")}
              />
            </div>
            <div className="mt-3">
              <KakaoChat
                messages={negotiateMessages}
                partnerName="보호자 (환자 보호자)"
              />
            </div>
            <div className="px-4 py-4">
              <Button size="lg" className="w-full" onClick={() => go("contract")}>
                <Icon name="checkCircle" className="h-5 w-5" />
                협의 완료 · 계약 진행
              </Button>
            </div>
          </div>
        );

      case "contract":
        return (
          <ScreenWrap>
            <ScreenTitle title="전자 중개계약서" onBack={() => go("negotiate")} />
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Icon name="fileText" className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-foreground">
                  간병 중개 표준계약서
                </span>
                <Badge tone="muted" className="ml-auto">
                  간병인용
                </Badge>
              </div>
              <dl className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">간병인</dt>
                  <dd className="font-semibold text-foreground">
                    {ME.name} (요양보호사 1급)
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">병원</dt>
                  <dd className="font-semibold text-foreground">
                    {selectedJob.hospital}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">간병 기간</dt>
                  <dd className="tnum font-semibold text-foreground">
                    {selectedJob.period} ({selectedJob.days}일)
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">일당</dt>
                  <dd className="tnum font-semibold text-foreground">
                    {won(selectedJob.dailyRate)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">중개 수수료</dt>
                  <dd className="tnum font-semibold text-foreground">
                    간병료의 {Math.round(FEE_RATE * 100)}%
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <dt className="font-semibold text-foreground">예상 간병료</dt>
                  <dd className="tnum text-sm font-bold text-primary">
                    {won(jobTotal)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 rounded-[var(--radius-sm)] bg-muted p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                본 계약은 간병마스터를 통한 간병 중개 표준계약으로, 간병인의
                성실 의무·배상책임·정산 조건 및 분쟁 해결 절차를 포함합니다.
              </p>
            </Card>

            <button
              type="button"
              onClick={() => setContractAgreed((v) => !v)}
              className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card px-3 py-2.5 text-left"
              aria-pressed={contractAgreed}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors ${
                  contractAgreed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                {contractAgreed && <Icon name="check" className="h-3.5 w-3.5" />}
              </span>
              <span className="text-sm text-foreground">
                계약 내용 및 약관에 모두 동의합니다
              </span>
            </button>

            <Button
              size="lg"
              className="w-full"
              onClick={() => contractAgreed && go("matched")}
              variant={contractAgreed ? "filled" : "outlined"}
            >
              <Icon name="edit" className="h-4 w-4" />
              서명 완료
            </Button>
            {!contractAgreed && (
              <p className="-mt-2 text-center text-xs text-muted-foreground">
                동의에 체크하면 서명할 수 있어요
              </p>
            )}
          </ScreenWrap>
        );

      case "matched":
        return (
          <ScreenWrap>
            <div className="flex flex-col items-center pt-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="checkCircle" className="h-9 w-9" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-foreground">
                매칭이 완료되었어요!
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {selectedJob.hospital} · {selectedJob.period}
                <br />
                전자계약서가 마이페이지에 보관되었습니다.
              </p>
            </div>

            {/* 배상책임보험 가입 안내 카드 */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="shieldCheck" className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">
                    배상책임보험 자동 가입
                  </p>
                  <p className="text-xs text-muted-foreground">
                    화재보험사 대외연계
                  </p>
                </div>
                <Badge tone="success">가입완료</Badge>
              </div>
              <dl className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">보장 한도</dt>
                  <dd className="tnum font-semibold text-foreground">
                    1사고당 {won0(50000000)}원
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">보험료</dt>
                  <dd className="tnum font-semibold text-foreground">
                    간병료에서 자동 납입
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">증권번호</dt>
                  <dd className="tnum font-semibold text-foreground">
                    CGM-2026-10318
                  </dd>
                </div>
              </dl>
            </Card>

            <Button size="lg" className="w-full" onClick={() => go("log")}>
              <Icon name="clipboard" className="h-5 w-5" />
              간병일지 쓰러 가기
            </Button>
          </ScreenWrap>
        );

      case "log":
        return (
          <ScreenWrap>
            <ScreenTitle title="간병일지 작성" />
            <Card className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="hospital" className="h-4 w-4 shrink-0" />
                강동경희대학교병원 · 여 / 71세 · 무릎 인공관절 재활
              </div>

              <label className="mt-4 block text-xs font-semibold text-foreground">
                날짜
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm text-foreground">
                <Icon name="calendar" className="h-4 w-4 text-muted-foreground" />
                <span className="tnum">2026. 6. 24. (화)</span>
              </div>

              <label
                htmlFor="log-status"
                className="mt-4 block text-xs font-semibold text-foreground"
              >
                환자 상태
              </label>
              <div className="relative mt-1.5">
                <select
                  id="log-status"
                  value={logStatus}
                  onChange={(e) => setLogStatus(e.target.value)}
                  className="min-h-11 w-full appearance-none rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 pr-9 text-sm text-foreground"
                >
                  <option value="양호">양호 · 안정적</option>
                  <option value="보통">보통 · 경과 관찰</option>
                  <option value="주의">주의 · 보호자 통보 필요</option>
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
              </div>

              {(["식사", "투약", "배변", "특이사항"] as const).map((field) => (
                <div key={field}>
                  <label className="mt-4 block text-xs font-semibold text-foreground">
                    {field}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      field === "식사"
                        ? "예) 아침·점심·저녁 완식"
                        : field === "투약"
                          ? "예) 진통제 1회, 혈압약 복용"
                          : field === "배변"
                            ? "예) 정상, 1회"
                            : "예) 오전 보행 재활 30분, 통증 호소 없음"
                    }
                    className="mt-1.5 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              ))}

              <label className="mt-4 block text-xs font-semibold text-foreground">
                사진 첨부
              </label>
              <div className="mt-1.5 flex h-24 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border-2 border-dashed border-border bg-muted text-muted-foreground">
                <Icon name="plus" className="h-6 w-6" />
                <span className="text-xs">사진을 첨부하세요 (선택)</span>
              </div>

              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={() => setLogSubmitted(true)}
              >
                <Icon name="check" className="h-5 w-5" />
                일지 제출
              </Button>
              {logSubmitted && (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
                  <Icon name="checkCircle" className="h-4 w-4" />
                  일지가 제출되어 보호자에게 전달되었어요
                </p>
              )}
            </Card>

            <div>
              <h3 className="mb-2 text-sm font-bold text-foreground">
                작성한 간병일지
              </h3>
              <div className="flex flex-col gap-2.5">
                {LOG_HISTORY.map((log) => (
                  <Card key={log.date} className="p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="tnum text-sm font-bold text-foreground">
                        {log.date}
                      </span>
                      <Badge tone={log.status === "주의" ? "warning" : "success"}>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">식사 </span>
                      {log.meal}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {log.note}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </ScreenWrap>
        );

      case "settle":
        return (
          <ScreenWrap>
            <ScreenTitle title="정산 내역" />
            {/* 이번 달 합계 강조 */}
            <Card className="border-primary/30 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-muted-foreground">
                이번 달 정산 합계 (수수료 차감 후)
              </p>
              <p className="tnum mt-1 text-2xl font-bold text-primary">
                {won(monthlyDone)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                정산완료 2건 · 정산예정 {won(monthlyEstimate)}
              </p>
            </Card>

            <div className="flex flex-col gap-2.5">
              {SETTLEMENTS.map((s) => {
                const gross = s.dailyRate * s.days;
                const fee = Math.round(gross * FEE_RATE);
                const net = gross - fee;
                return (
                  <Card key={s.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {s.hospital}
                      </span>
                      <Badge
                        tone={s.status === "정산완료" ? "success" : "warning"}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.patient} · {s.period} ({s.days}일)
                    </p>
                    <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">간병료</dt>
                        <dd className="tnum font-semibold text-foreground">
                          {won(gross)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          중개 수수료 ({Math.round(FEE_RATE * 100)}%)
                        </dt>
                        <dd className="tnum text-muted-foreground">
                          −{won(fee)}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-border pt-1.5">
                        <dt className="font-semibold text-foreground">
                          실수령액
                        </dt>
                        <dd className="tnum text-sm font-bold text-primary">
                          {won(net)}
                        </dd>
                      </div>
                    </dl>
                  </Card>
                );
              })}
            </div>

            <button
              type="button"
              className="text-center text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              정산 내역에 이의가 있으신가요? 이의신청
            </button>

            <div className="flex gap-2">
              <Button variant="outlined" size="md" className="flex-1">
                <Icon name="bank" className="h-4 w-4" />
                계좌정보 등록
              </Button>
              <Button variant="outlined" size="md" className="flex-1">
                <Icon name="download" className="h-4 w-4" />
                증명서 발급
              </Button>
            </div>
            <p className="-mt-2 text-center text-[11px] text-muted-foreground">
              활동이력 증명서 · 수수료 납부내역서 발급 가능
            </p>
          </ScreenWrap>
        );

      case "my":
        return (
          <ScreenWrap>
            <ScreenTitle title="마이페이지" />
            {/* 프로필 */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <PatientAvatar
                  color={ME.color}
                  label={ME.name.slice(0, 1)}
                  className="h-14 w-14 text-lg"
                />
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">
                    {ME.name}
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      {ME.gender} · {ME.age}세
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="star" className="h-3.5 w-3.5 text-accent" filled />
                    <span className="tnum font-semibold text-foreground">
                      {ME.rating}
                    </span>
                    ({ME.reviews})
                    <span className="mx-1 text-border">·</span>
                    경력 {ME.careerYears}년
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="success">
                  <Icon name="shieldCheck" className="h-3 w-3" />
                  배상책임보험 가입중
                </Badge>
                <Badge tone="primary">
                  <Icon name="verified" className="h-3 w-3" />
                  신원검증 완료
                </Badge>
              </div>
            </Card>

            {/* 자격증 */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-foreground">보유 자격증</h3>
              <ul className="mt-2.5 space-y-2">
                {ME.certs.map((cert) => (
                  <li
                    key={cert}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Icon
                      name="checkCircle"
                      className="h-4 w-4 shrink-0 text-primary"
                    />
                    {cert}
                  </li>
                ))}
              </ul>
            </Card>

            {/* 활동이력 통계 */}
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">활동이력</h3>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[var(--radius-md)] bg-muted py-3">
                  <dd className="tnum text-lg font-bold text-foreground">
                    {ME.reviews}건
                  </dd>
                  <dt className="mt-0.5 text-[11px] text-muted-foreground">
                    총 간병
                  </dt>
                </div>
                <div className="rounded-[var(--radius-md)] bg-muted py-3">
                  <dd className="tnum text-lg font-bold text-foreground">
                    3.4억
                  </dd>
                  <dt className="mt-0.5 text-[11px] text-muted-foreground">
                    누적 간병료
                  </dt>
                </div>
                <div className="rounded-[var(--radius-md)] bg-muted py-3">
                  <dd className="tnum text-lg font-bold text-foreground">68%</dd>
                  <dt className="mt-0.5 text-[11px] text-muted-foreground">
                    재요청률
                  </dt>
                </div>
              </dl>
            </Card>

            {/* 메뉴 */}
            <Card className="divide-y divide-border p-0">
              {(
                [
                  { label: "회원정보 수정", icon: "user" },
                  { label: "계좌정보 관리", icon: "bank" },
                  { label: "증명서 발급", icon: "fileText" },
                  { label: "1:1 문의", icon: "message" },
                  { label: "자주 묻는 질문(FAQ)", icon: "list" },
                ] as { label: string; icon: IconName }[]
              ).map((m) => (
                <button
                  key={m.label}
                  type="button"
                  className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted"
                >
                  <Icon name={m.icon} className="h-4.5 w-4.5 text-muted-foreground" />
                  <span className="flex-1">{m.label}</span>
                  <Icon
                    name="chevronRight"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </button>
              ))}
            </Card>

            <button
              type="button"
              className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <Icon name="logout" className="h-4 w-4" />
              로그아웃
            </button>
          </ScreenWrap>
        );

      default:
        return null;
    }
  };

  const currentTrackIndex = TRACK_INDEX[screen];

  return (
    <>
      <section className="bg-muted py-12 sm:py-16">
        <Container>
          {/* 인트로 */}
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="primary">
              <Icon name="briefcase" className="h-3.5 w-3.5" />
              간병인용 App
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              내게 맞는 간병 일자리를
              <br className="hidden sm:block" /> 손안에서
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              지명·공개모집·추천 일자리 탐색부터 간병비 협의, 전자계약,
              간병일지, 자동 정산까지 — 간병인 {ME.name} 님의 하루를 그대로
              체험해 보세요.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-border">
              <Icon name="phone" className="h-4 w-4 text-primary" />
              📱 일자리 탐색부터 정산까지 직접 눌러보세요
            </p>
          </div>

          {/* 쇼케이스: 데스크탑 좌측 트래커 + 폰 */}
          <div className="mt-12 flex flex-col items-start justify-center gap-8 lg:flex-row lg:gap-12">
            {/* 좌측 세로 스텝 트래커 (데스크탑 전용) */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <Eyebrow>간병인 여정</Eyebrow>
              <ol className="mt-5 space-y-1">
                {STEP_TRACK.map((step, idx) => {
                  const active = idx === currentTrackIndex;
                  const done = idx < currentTrackIndex;
                  return (
                    <li key={step.key}>
                      <button
                        type="button"
                        onClick={() => go(step.key)}
                        className={`flex w-full items-start gap-3 rounded-[var(--radius-md)] p-3 text-left transition-colors ${
                          active ? "bg-card shadow-sm ring-1 ring-border" : "hover:bg-card/60"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : done
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground ring-1 ring-border"
                          }`}
                        >
                          {done ? (
                            <Icon name="check" className="h-4 w-4" />
                          ) : (
                            <Icon name={step.icon} className="h-4.5 w-4.5" />
                          )}
                        </span>
                        <span className="flex-1 pt-0.5">
                          <span
                            className={`block text-sm font-semibold ${
                              active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {idx + 1}. {step.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {step.desc}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </aside>

            {/* 폰 프레임 */}
            <div className="w-full max-w-[380px]">
              <PhoneFrame
                tabBar={
                  <AppTabBar<TabKey>
                    tabs={TABS}
                    active={tab}
                    onChange={goTab}
                  />
                }
              >
                {renderScreen()}
              </PhoneFrame>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </>
  );
}
