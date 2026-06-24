"use client";

import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { LineChart, BarChart, DonutChart } from "@/components/Charts";
import { CountUp } from "@/components/CountUp";
import { won } from "@/lib/data";

// ── 데스크탑용 로컬 토스트 (우하단 고정) ──────────────────────────
// 공용 useToast(Toast.tsx)는 폰 프레임 하단 중앙용이므로, 콘솔에는
// fixed bottom-right 토스트를 별도로 둔다.
type DeskToast = { id: number; message: string; icon: IconName; tone: "success" | "accent" } | null;

function useDeskToast() {
  const [toast, setToast] = useState<DeskToast>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, icon: IconName = "checkCircle", tone: "success" | "accent" = "success") => {
      setToast({ id: Date.now(), message, icon, tone });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 2600);
    },
    []
  );

  const node = toast ? (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex justify-end">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="animate-toast-in flex max-w-xs items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg"
      >
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            toast.tone === "accent"
              ? "bg-accent/10 text-accent"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Icon name={toast.icon} className="h-4 w-4" />
        </span>
        {toast.message}
      </div>
    </div>
  ) : null;

  return { show, node };
}

// ── 네비게이션 정의 ───────────────────────────────────────────────
type NavKey = "dashboard" | "userCheck" | "coins" | "message";

const NAV: { key: NavKey; label: string; icon: IconName }[] = [
  { key: "dashboard", label: "통합관제", icon: "dashboard" },
  { key: "userCheck", label: "회원 승인", icon: "userCheck" },
  { key: "coins", label: "정산 관리", icon: "coins" },
  { key: "message", label: "고객의 소리", icon: "message" },
];

const SECTION_TITLE: Record<NavKey, string> = {
  dashboard: "통합관제",
  userCheck: "회원 승인 · 신원검증 대기열",
  coins: "정산 관리",
  message: "고객의 소리",
};

// ── 공통 소형 컴포넌트 ────────────────────────────────────────────
function StatusBadge({
  tone,
  children,
}: {
  tone: "primary" | "accent" | "muted" | "success" | "warning";
  children: ReactNode;
}) {
  return <Badge tone={tone}>{children}</Badge>;
}

function CardTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full font-bold text-white`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════
// 1) 통합관제 (Dashboard)
// ════════════════════════════════════════════════════════════════
const KPIS: {
  label: string;
  value: string;
  icon: IconName;
  iconTone: string;
  delta: string;
  deltaIcon: IconName;
  deltaTone: string;
}[] = [
  {
    label: "진행중 간병",
    value: "1,284",
    icon: "heartPulse",
    iconTone: "bg-primary/10 text-primary",
    delta: "전주 대비 +3.2%",
    deltaIcon: "trendingUp",
    deltaTone: "text-primary",
  },
  {
    label: "금일 신규 매칭",
    value: "87",
    icon: "handshake",
    iconTone: "bg-primary/10 text-primary",
    delta: "어제 대비 +12건",
    deltaIcon: "trendingUp",
    deltaTone: "text-primary",
  },
  {
    label: "신원검증 승인대기",
    value: "12",
    icon: "userCheck",
    iconTone: "bg-accent/10 text-accent",
    delta: "확인 필요",
    deltaIcon: "alert",
    deltaTone: "text-accent",
  },
  {
    label: "금일 정산액",
    value: won(42180000),
    icon: "coins",
    iconTone: "bg-primary/10 text-primary",
    delta: "정산 완료 312건",
    deltaIcon: "check",
    deltaTone: "text-muted-foreground",
  },
];

type LiveRow = {
  patient: string;
  caregiver: string;
  color: string;
  hospital: string;
  period: string;
  status: "간병중" | "매칭완료" | "정산대기";
  fee: number;
};

const LIVE_ROWS: LiveRow[] = [
  {
    patient: "김O O / 72",
    caregiver: "김미숙",
    color: "#0e9e6e",
    hospital: "서울아산병원",
    period: "6/12 ~ 6/26",
    status: "간병중",
    fee: 1820000,
  },
  {
    patient: "이O O / 81",
    caregiver: "박정자",
    color: "#f2784b",
    hospital: "삼성서울병원",
    period: "6/20 ~ 7/20",
    status: "간병중",
    fee: 4050000,
  },
  {
    patient: "정O O / 68",
    caregiver: "정해숙",
    color: "#d97706",
    hospital: "강동경희대학교병원",
    period: "6/27 ~ 7/4",
    status: "매칭완료",
    fee: 875000,
  },
  {
    patient: "최O O / 77",
    caregiver: "이영호",
    color: "#2563eb",
    hospital: "건국대학교병원",
    period: "6/28 ~ 7/28",
    status: "매칭완료",
    fee: 4200000,
  },
  {
    patient: "한O O / 84",
    caregiver: "최순영",
    color: "#7c3aed",
    hospital: "삼성서울병원",
    period: "6/5 ~ 6/22",
    status: "정산대기",
    fee: 2346000,
  },
  {
    patient: "오O O / 70",
    caregiver: "김미숙",
    color: "#0e9e6e",
    hospital: "서울아산병원",
    period: "6/1 ~ 6/15",
    status: "정산대기",
    fee: 1950000,
  },
];

const STATUS_TONE: Record<LiveRow["status"], "success" | "primary" | "warning"> = {
  간병중: "success",
  매칭완료: "primary",
  정산대기: "warning",
};

type ToastFn = (message: string, icon?: IconName, tone?: "success" | "accent") => void;

function DashboardSection({ show }: { show: ToastFn }) {
  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-start justify-between">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${k.iconTone}`}
              >
                <Icon name={k.icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{k.label}</p>
            <CountUp
              value={k.value}
              className="mt-1 block text-2xl font-bold tnum text-foreground"
            />
            <p
              className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${k.deltaTone}`}
            >
              <Icon name={k.deltaIcon} className="h-3.5 w-3.5" />
              {k.delta}
            </p>
          </Card>
        ))}
      </div>

      {/* 차트 행 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle
            title="주간 매칭 추이"
            sub="최근 7일 신규 매칭 건수"
            right={
              <span className="text-right">
                <span className="block text-xl font-bold tnum text-foreground">
                  1,272건
                </span>
                <span className="text-xs font-semibold text-primary">
                  전주 대비 +8.4%
                </span>
              </span>
            }
          />
          <LineChart
            data={[142, 168, 151, 189, 205, 176, 231]}
            labels={["월", "화", "수", "목", "금", "토", "일"]}
            unit="건"
          />
        </Card>

        <Card>
          <CardTitle
            title="지역별 간병 분포"
            sub="진행중 간병 1,284건 기준"
          />
          <div className="flex justify-center pt-2">
            <DonutChart
              centerValue="1,284"
              centerLabel="진행중"
              segments={[
                { label: "송파", value: 412, color: "#0e9e6e" },
                { label: "강남", value: 318, color: "#f2784b" },
                { label: "강동", value: 246, color: "#2563eb" },
                { label: "광진", value: 184, color: "#7c3aed" },
                { label: "기타", value: 124, color: "#94a3b8" },
              ]}
            />
          </div>
        </Card>
      </div>

      {/* 월별 거래액 */}
      <Card>
        <CardTitle
          title="월별 거래액"
          sub="플랫폼 통과 간병비 결제 총액 (단위: 백만원)"
          right={
            <span className="text-right">
              <span className="block text-xl font-bold tnum text-foreground">
                {won(1187000000)}
              </span>
              <span className="text-xs text-muted-foreground">최근 6개월 누계</span>
            </span>
          }
        />
        <BarChart
          data={[
            { label: "1월", value: 162 },
            { label: "2월", value: 178 },
            { label: "3월", value: 195 },
            { label: "4월", value: 210 },
            { label: "5월", value: 224 },
            { label: "6월", value: 218 },
          ]}
          unit="백만원"
        />
      </Card>

      {/* 실시간 간병 현황 테이블 */}
      <Card>
        <CardTitle
          title="실시간 간병 현황"
          sub="진행중 · 매칭완료 · 정산대기 건"
          right={
            <Button
              variant="outlined"
              size="md"
              className="hidden sm:inline-flex"
              onClick={() => show("실시간 간병 현황 CSV를 내려받았습니다", "download")}
            >
              <Icon name="download" className="h-4 w-4" />
              내보내기
            </Button>
          }
        />
        <div className="-mx-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">환자</th>
                <th className="px-6 py-3">간병인</th>
                <th className="px-6 py-3">병원</th>
                <th className="px-6 py-3">기간</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3 text-right">간병비</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LIVE_ROWS.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-muted/60">
                  <td className="px-6 py-3.5 font-medium text-foreground tnum">
                    {r.patient}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <Avatar name={r.caregiver} color={r.color} size="sm" />
                      <span className="font-medium text-foreground">
                        {r.caregiver}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">
                    {r.hospital}
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground tnum">
                    {r.period}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge tone={STATUS_TONE[r.status]}>
                      {r.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-foreground tnum">
                    {won(r.fee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 2) 회원 승인 (신원검증 대기열)
// ════════════════════════════════════════════════════════════════
type DocCheck = { 자격증: boolean; 신분증: boolean; 건강검진: boolean; 보험: boolean };

type Applicant = {
  name: string;
  color: string;
  gender: "여" | "남";
  age: number;
  cert: string;
  careerYears: number;
  region: string;
  docs: DocCheck;
  submitted: string;
};

const APPLICANTS: Applicant[] = [
  {
    name: "정해숙",
    color: "#d97706",
    gender: "여",
    age: 52,
    cert: "요양보호사 1급 · 산후관리사",
    careerYears: 4,
    region: "서울 광진",
    docs: { 자격증: true, 신분증: true, 건강검진: true, 보험: true },
    submitted: "2026-06-23",
  },
  {
    name: "강복순",
    color: "#0e9e6e",
    gender: "여",
    age: 57,
    cert: "요양보호사 1급 · 간병사",
    careerYears: 11,
    region: "서울 송파",
    docs: { 자격증: true, 신분증: true, 건강검진: true, 보험: false },
    submitted: "2026-06-23",
  },
  {
    name: "윤태경",
    color: "#2563eb",
    gender: "남",
    age: 46,
    cert: "요양보호사 1급 · 물리치료 보조",
    careerYears: 6,
    region: "서울 강남",
    docs: { 자격증: true, 신분증: true, 건강검진: false, 보험: false },
    submitted: "2026-06-22",
  },
  {
    name: "박정자",
    color: "#f2784b",
    gender: "여",
    age: 58,
    cert: "요양보호사 1급 · 간병사",
    careerYears: 15,
    region: "서울 강동",
    docs: { 자격증: true, 신분증: true, 건강검진: true, 보험: true },
    submitted: "2026-06-22",
  },
];

const DOC_KEYS: (keyof DocCheck)[] = ["자격증", "신분증", "건강검진", "보험"];

function DocPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        ok
          ? "bg-emerald-50 text-emerald-700"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon name={ok ? "check" : "x"} className="h-3 w-3" />
      {label}
    </span>
  );
}

type Decision = "pending" | "approved" | "rejected";

function UserCheckSection({ show }: { show: ToastFn }) {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const decide = (a: Applicant, next: "approved" | "rejected") => {
    setDecisions((prev) => ({ ...prev, [a.name]: next }));
    if (next === "approved") {
      show(`${a.name} 간병인을 승인했습니다`, "checkCircle", "success");
    } else {
      show(`${a.name} 신청을 반려했습니다`, "x", "accent");
    }
  };

  const decisionOf = (name: string): Decision => decisions[name] ?? "pending";

  const total = APPLICANTS.length;
  const pendingCount = APPLICANTS.filter(
    (a) => decisionOf(a.name) === "pending"
  ).length;
  const approvedCount = APPLICANTS.filter(
    (a) => decisionOf(a.name) === "approved"
  ).length;
  const ready = APPLICANTS.filter((a) => DOC_KEYS.every((k) => a.docs[k])).length;

  return (
    <div className="space-y-6">
      {/* 요약 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">승인 대기</p>
          <CountUp
            value={`${pendingCount}명`}
            className="mt-1 block text-2xl font-bold tnum text-foreground"
          />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">금일 승인</p>
          <CountUp
            value={`${approvedCount}명`}
            className="mt-1 block text-2xl font-bold tnum text-primary"
          />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">서류 완비</p>
          <CountUp
            value={`${ready}명`}
            className="mt-1 block text-2xl font-bold tnum text-primary"
          />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">서류 보완 필요</p>
          <CountUp
            value={`${total - ready}명`}
            className="mt-1 block text-2xl font-bold tnum text-accent"
          />
        </Card>
      </div>

      {/* 대기열 리스트 */}
      <Card>
        <CardTitle
          title="신원검증 대기열"
          sub="자격·경력·서류·배상책임보험 가입 여부를 확인한 뒤 승인하세요"
        />
        <ul className="space-y-3">
          {APPLICANTS.map((a) => {
            const complete = DOC_KEYS.every((k) => a.docs[k]);
            const decision = decisionOf(a.name);
            const handled = decision !== "pending";
            return (
              <li
                key={a.name}
                className={`rounded-[var(--radius-md)] border p-4 transition-colors ${
                  handled
                    ? "border-border bg-muted/40 opacity-70"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar name={a.name} color={a.color} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">
                          {a.name}
                        </span>
                        <span className="text-sm text-muted-foreground tnum">
                          {a.gender} · {a.age}세 · {a.region}
                        </span>
                        {decision === "approved" && (
                          <Badge tone="success">
                            <Icon name="checkCircle" className="h-3 w-3" />
                            승인됨
                          </Badge>
                        )}
                        {decision === "rejected" && (
                          <Badge tone="accent">
                            <Icon name="x" className="h-3 w-3" />
                            반려됨
                          </Badge>
                        )}
                        {complete ? (
                          <Badge tone="success">서류 완비</Badge>
                        ) : (
                          <Badge tone="warning">서류 보완</Badge>
                        )}
                        <Badge tone={a.docs.보험 ? "primary" : "muted"}>
                          <Icon name="shieldCheck" className="h-3 w-3" />
                          배상책임보험 {a.docs.보험 ? "가입" : "미가입"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {a.cert} · 경력 {a.careerYears}년
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {DOC_KEYS.map((k) => (
                          <DocPill key={k} label={k} ok={a.docs[k]} />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground tnum">
                        제출일 {a.submitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    {handled ? (
                      <span className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-5 text-sm font-semibold text-muted-foreground lg:w-28">
                        <Icon
                          name={decision === "approved" ? "checkCircle" : "x"}
                          className="h-4 w-4"
                        />
                        {decision === "approved" ? "승인 완료" : "반려 완료"}
                      </span>
                    ) : (
                      <>
                        <Button
                          size="md"
                          variant="filled"
                          className="flex-1 lg:w-28"
                          onClick={() => decide(a, "approved")}
                        >
                          <Icon name="check" className="h-4 w-4" />
                          승인
                        </Button>
                        <Button
                          size="md"
                          variant="outlined"
                          className="flex-1 lg:w-28"
                          onClick={() => decide(a, "rejected")}
                        >
                          <Icon name="x" className="h-4 w-4" />
                          반려
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 3) 정산 관리
// ════════════════════════════════════════════════════════════════
type SettleRow = {
  date: string;
  patient: string;
  caregiver: string;
  color: string;
  method: "즉시이체" | "카드";
  amount: number;
  fee: number;
  status: "정산완료" | "정산대기";
};

const SETTLE_ROWS: SettleRow[] = [
  { date: "6/24", patient: "김O O / 72", caregiver: "김미숙", color: "#0e9e6e", method: "즉시이체", amount: 1820000, fee: 182000, status: "정산완료" },
  { date: "6/24", patient: "이O O / 81", caregiver: "박정자", color: "#f2784b", method: "카드", amount: 4050000, fee: 405000, status: "정산완료" },
  { date: "6/23", patient: "한O O / 84", caregiver: "최순영", color: "#7c3aed", method: "즉시이체", amount: 2346000, fee: 234600, status: "정산대기" },
  { date: "6/23", patient: "오O O / 70", caregiver: "김미숙", color: "#0e9e6e", method: "카드", amount: 1950000, fee: 195000, status: "정산대기" },
  { date: "6/22", patient: "정O O / 68", caregiver: "정해숙", color: "#d97706", method: "즉시이체", amount: 875000, fee: 87500, status: "정산완료" },
  { date: "6/22", patient: "최O O / 77", caregiver: "이영호", color: "#2563eb", method: "카드", amount: 4200000, fee: 420000, status: "정산완료" },
  { date: "6/21", patient: "장O O / 79", caregiver: "박정자", color: "#f2784b", method: "즉시이체", amount: 2700000, fee: 270000, status: "정산완료" },
  { date: "6/21", patient: "서O O / 66", caregiver: "최순영", color: "#7c3aed", method: "카드", amount: 1380000, fee: 138000, status: "정산대기" },
  { date: "6/20", patient: "윤O O / 88", caregiver: "김미숙", color: "#0e9e6e", method: "즉시이체", amount: 3250000, fee: 325000, status: "정산완료" },
  { date: "6/20", patient: "임O O / 74", caregiver: "이영호", color: "#2563eb", method: "카드", amount: 1560000, fee: 156000, status: "정산완료" },
];

const METHOD_ICON: Record<SettleRow["method"], IconName> = {
  즉시이체: "bank",
  카드: "creditCard",
};

type SettleStatusFilter = "전체" | "정산완료" | "정산대기";
type SettlePeriodFilter = "전체" | "6/24" | "6/23" | "6/22" | "6/21" | "6/20";

function CoinsSection({ show }: { show: ToastFn }) {
  const [statusFilter, setStatusFilter] = useState<SettleStatusFilter>("전체");
  const [periodFilter, setPeriodFilter] = useState<SettlePeriodFilter>("전체");

  const filtered = SETTLE_ROWS.filter(
    (r) =>
      (statusFilter === "전체" || r.status === statusFilter) &&
      (periodFilter === "전체" || r.date === periodFilter)
  );

  const monthVolume = 1187000000;
  const feeRevenue = SETTLE_ROWS.reduce((s, r) => s + r.fee, 0) + 96420000;
  const done = SETTLE_ROWS.filter((r) => r.status === "정산완료").length;
  const pending = SETTLE_ROWS.filter((r) => r.status === "정산대기").length;

  const summary: { label: string; value: string; icon: IconName; tone: string }[] =
    [
      { label: "금월 거래액", value: won(monthVolume), icon: "coins", tone: "bg-primary/10 text-primary" },
      { label: "중개수수료 수익", value: won(feeRevenue), icon: "wallet", tone: "bg-primary/10 text-primary" },
      { label: "정산 완료", value: `${done + 304}건`, icon: "checkCircle", tone: "bg-emerald-50 text-emerald-700" },
      { label: "정산 대기", value: `${pending + 8}건`, icon: "clock", tone: "bg-amber-50 text-amber-700" },
    ];

  const statusTabs: SettleStatusFilter[] = ["전체", "정산완료", "정산대기"];
  const periodTabs: SettlePeriodFilter[] = ["전체", "6/24", "6/23", "6/22", "6/21", "6/20"];

  return (
    <div className="space-y-6">
      {/* 요약 KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="p-5">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${s.tone}`}
            >
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
            <CountUp
              value={s.value}
              className="mt-1 block text-2xl font-bold tnum text-foreground"
            />
          </Card>
        ))}
      </div>

      {/* 결제·정산 내역 */}
      <Card>
        <CardTitle
          title="결제 · 정산 내역"
          sub="중개수수료 10% · 간병 종료 후 자동 정산"
          right={
            <Button
              variant="outlined"
              size="md"
              className="hidden sm:inline-flex"
              onClick={() =>
                show(
                  `정산서 ${filtered.length}건을 PDF로 출력했습니다`,
                  "download"
                )
              }
            >
              <Icon name="download" className="h-4 w-4" />
              정산서 출력
            </Button>
          }
        />

        {/* 필터 */}
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-1.5">
            <Icon name="filter" className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">상태</span>
            <div className="flex gap-1">
              {statusTabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setStatusFilter(t)}
                  aria-pressed={statusFilter === t}
                  className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors ${
                    statusFilter === t
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">기간</span>
            <div className="flex flex-wrap gap-1">
              {periodTabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPeriodFilter(t)}
                  aria-pressed={periodFilter === t}
                  className={`min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium tnum transition-colors ${
                    periodFilter === t
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <span className="ml-auto text-xs text-muted-foreground tnum">
            {filtered.length}건 표시
          </span>
        </div>

        <div className="-mx-6 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">일자</th>
                <th className="px-6 py-3">환자</th>
                <th className="px-6 py-3">간병인</th>
                <th className="px-6 py-3">결제수단</th>
                <th className="px-6 py-3 text-right">결제금액</th>
                <th className="px-6 py-3 text-right">수수료</th>
                <th className="px-6 py-3">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    조건에 해당하는 정산 내역이 없습니다.
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-muted/60">
                  <td className="px-6 py-3.5 text-muted-foreground tnum">
                    {r.date}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-foreground tnum">
                    {r.patient}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <Avatar name={r.caregiver} color={r.color} size="sm" />
                      <span className="font-medium text-foreground">
                        {r.caregiver}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Icon name={METHOD_ICON[r.method]} className="h-4 w-4" />
                      {r.method}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-foreground tnum">
                    {won(r.amount)}
                  </td>
                  <td className="px-6 py-3.5 text-right text-muted-foreground tnum">
                    {won(r.fee)}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge
                      tone={r.status === "정산완료" ? "success" : "warning"}
                    >
                      {r.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 4) 고객의 소리 (VOC / Q&A)
// ════════════════════════════════════════════════════════════════
type Voc = {
  from: "보호자" | "간병인";
  name: string;
  color: string;
  title: string;
  category: "정산이의" | "매칭" | "계정" | "기타";
  status: "답변완료" | "대기";
  date: string;
};

const VOCS: Voc[] = [
  { from: "보호자", name: "김O O", color: "#0e9e6e", title: "정산 금액이 협의한 일당과 다르게 청구되었어요", category: "정산이의", status: "대기", date: "6/24" },
  { from: "간병인", name: "박정자", color: "#f2784b", title: "지명 요청이 들어왔는데 알림을 못 받았습니다", category: "매칭", status: "대기", date: "6/24" },
  { from: "보호자", name: "이O O", color: "#2563eb", title: "간병인 변경을 신청하고 싶습니다", category: "매칭", status: "답변완료", date: "6/23" },
  { from: "간병인", name: "김미숙", color: "#0e9e6e", title: "배상책임보험 갱신 서류는 어디에 올리나요?", category: "계정", status: "답변완료", date: "6/23" },
  { from: "보호자", name: "정O O", color: "#7c3aed", title: "전자계약서를 PDF로 다시 받을 수 있나요?", category: "기타", status: "답변완료", date: "6/22" },
  { from: "간병인", name: "이영호", color: "#2563eb", title: "카드 정산 입금일이 평소보다 늦습니다", category: "정산이의", status: "대기", date: "6/22" },
  { from: "보호자", name: "최O O", color: "#d97706", title: "비밀번호 재설정 메일이 오지 않습니다", category: "계정", status: "답변완료", date: "6/21" },
];

const CATEGORY_TONE: Record<Voc["category"], "primary" | "accent" | "muted"> = {
  정산이의: "accent",
  매칭: "primary",
  계정: "muted",
  기타: "muted",
};

const SATISFACTION = [
  { star: 5, count: 14820 },
  { star: 4, count: 2740 },
  { star: 3, count: 680 },
  { star: 2, count: 240 },
  { star: 1, count: 120 },
];

type VocFilter = "전체" | "대기" | "답변완료";

function MessageSection({ show }: { show: ToastFn }) {
  const [vocFilter, setVocFilter] = useState<VocFilter>("전체");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const pending = VOCS.filter((v) => v.status === "대기").length;
  const answered = VOCS.length - pending;
  const totalReviews = SATISFACTION.reduce((s, v) => s + v.count, 0);
  const maxCount = Math.max(...SATISFACTION.map((s) => s.count));

  const filtered = VOCS.map((v, idx) => ({ v, idx })).filter(
    ({ v }) => vocFilter === "전체" || v.status === vocFilter
  );

  const filterTabs: { key: VocFilter; label: string; count: number }[] = [
    { key: "전체", label: "전체", count: VOCS.length },
    { key: "대기", label: "답변대기", count: pending },
    { key: "답변완료", label: "답변완료", count: answered },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 문의 리스트 */}
      <div className="lg:col-span-2">
        <Card>
          <CardTitle
            title="문의 · 1:1 상담"
            sub={`전체 ${VOCS.length}건 · 미답변 ${pending}건`}
            right={<Badge tone="warning">대기 {pending}</Badge>}
          />

          {/* 상태 필터 */}
          <div className="mb-3 flex flex-wrap gap-1">
            {filterTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setVocFilter(t.key);
                  setOpenIdx(null);
                }}
                aria-pressed={vocFilter === t.key}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors ${
                  vocFilter === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
                <span className="tnum text-xs opacity-70">{t.count}</span>
              </button>
            ))}
          </div>

          <ul className="divide-y divide-border">
            {filtered.map(({ v, idx }) => {
              const open = openIdx === idx;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : idx)}
                    aria-expanded={open}
                    className="flex w-full items-start gap-3 py-3.5 text-left transition-colors hover:bg-muted/40"
                  >
                    <Avatar name={v.name} color={v.color} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {v.name}
                        </span>
                        <Badge tone={v.from === "보호자" ? "primary" : "accent"}>
                          {v.from}
                        </Badge>
                        <Badge tone={CATEGORY_TONE[v.category]}>
                          {v.category}
                        </Badge>
                      </div>
                      <p
                        className={`mt-1 text-sm text-muted-foreground ${
                          open ? "" : "truncate"
                        }`}
                      >
                        {v.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge
                        tone={v.status === "답변완료" ? "success" : "warning"}
                      >
                        {v.status}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground tnum">
                        {v.date}
                      </span>
                    </div>
                    <Icon
                      name="chevronDown"
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="animate-fade-up mb-3 ml-11 rounded-[var(--radius-md)] border border-border bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        문의 내용
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                        {v.title}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground tnum">
                        접수 {v.date} · {v.from} {v.name}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {v.status === "대기" ? (
                          <Button
                            size="md"
                            variant="filled"
                            onClick={() =>
                              show(
                                `${v.name}님께 답변을 전송했습니다`,
                                "checkCircle"
                              )
                            }
                          >
                            <Icon name="message" className="h-4 w-4" />
                            답변 등록
                          </Button>
                        ) : (
                          <span className="inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-emerald-700">
                            <Icon name="checkCircle" className="h-4 w-4" />
                            답변 완료된 문의입니다
                          </span>
                        )}
                        <Button
                          size="md"
                          variant="outlined"
                          onClick={() =>
                            show(`${v.name}님 상담 이력을 열었습니다`, "user")
                          }
                        >
                          <Icon name="user" className="h-4 w-4" />
                          상담 이력
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="py-10 text-center text-sm text-muted-foreground">
                해당 상태의 문의가 없습니다.
              </li>
            )}
          </ul>
        </Card>
      </div>

      {/* 고객만족도 */}
      <div>
        <Card>
          <CardTitle title="고객 만족도" sub={`누적 ${totalReviews.toLocaleString("ko-KR")}건 평가`} />
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tnum text-foreground">4.8</span>
            <span className="pb-1 text-sm text-muted-foreground">/ 5.0</span>
          </div>
          <div className="mt-1 flex gap-0.5 text-accent">
            {[1, 2, 3, 4, 5].map((s) => (
              <Icon key={s} name="star" className="h-4 w-4" filled />
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {SATISFACTION.map((s) => (
              <div key={s.star} className="flex items-center gap-2 text-sm">
                <span className="flex w-8 items-center gap-0.5 text-muted-foreground tnum">
                  {s.star}
                  <Icon name="star" className="h-3 w-3 text-accent" filled />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-14 text-right text-xs text-muted-foreground tnum">
                  {s.count.toLocaleString("ko-KR")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 페이지 셸
// ════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const { show, node: toastNode } = useDeskToast();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {toastNode}
      {/* 좌측 사이드바 (데스크탑) */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
        <div className="px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            관리자 콘솔
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">간병마스터</p>
        </div>
        <nav className="px-3" aria-label="관리자 메뉴">
          <ul className="space-y-1">
            {NAV.map((n) => {
              const on = active === n.key;
              return (
                <li key={n.key}>
                  <button
                    type="button"
                    onClick={() => setActive(n.key)}
                    aria-current={on ? "page" : undefined}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors ${
                      on
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon name={n.icon} className="h-5 w-5" />
                    {n.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 메인 */}
      <div className="flex min-w-0 flex-1 flex-col bg-muted">
        {/* 모바일 가로 스크롤 탭 */}
        <div className="border-b border-border bg-card lg:hidden">
          <div className="flex gap-1 overflow-x-auto px-3 py-2">
            {NAV.map((n) => {
              const on = active === n.key;
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => setActive(n.key)}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors ${
                    on
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon name={n.icon} className="h-4 w-4" />
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 lg:p-8">
          {/* 상단 바 */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {SECTION_TITLE[active]}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
                <Icon name="calendar" className="h-3.5 w-3.5" />
                2026.06.24 · 오늘
                <Icon name="chevronDown" className="h-3.5 w-3.5" />
              </span>
              <button
                type="button"
                aria-label="검색"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
                onClick={() => show("검색 패널은 준비 중입니다", "search", "accent")}
              >
                <Icon name="search" className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="알림 3건"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => show("새 알림 3건이 있습니다", "bell", "accent")}
              >
                <Icon name="bell" className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
              </button>
              <span className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
                <Avatar name="김운영" color="#0e9e6e" size="sm" />
                <span className="hidden text-sm font-semibold text-foreground sm:inline">
                  관리자 김운영
                </span>
              </span>
            </div>
          </div>

          {/* 섹션 내용 */}
          <div key={active} className="animate-screen-in">
            {active === "dashboard" && <DashboardSection show={show} />}
            {active === "userCheck" && <UserCheckSection show={show} />}
            {active === "coins" && <CoinsSection show={show} />}
            {active === "message" && <MessageSection show={show} />}
          </div>
        </div>
      </div>
    </div>
  );
}
