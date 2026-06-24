import type { Metadata } from "next";
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
  Card,
  Badge,
  Button,
} from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { INTERFACES, type Interface } from "@/lib/data";

export const metadata: Metadata = {
  title: "기술·사업수행 | 간병마스터",
  description:
    "검증된 기술 아키텍처와 명확한 수행 계획. 시스템 구성도, 대외연계, 보안 설계, API 설계, WBS 일정, 인력 구성, 유지보수·기술지원까지 — 약속한 일정에 안정적으로 구축합니다.",
};

// ── 1. 요약 지표 ──────────────────────────────────────────────
const HERO_METRICS = [
  { value: "4~6개월", label: "구축 기간", sub: "2026.6 착수 · 단계별 오픈" },
  { value: "5년", label: "유지보수", sub: "무상 하자보수 + SLA 보장" },
  { value: "99.9%", label: "목표 가동률", sub: "이중화 · 무중단 배포" },
  { value: "6종", label: "대외 연계", sub: "은행·카드·심평원 등" },
];

// ── 2. 아키텍처 4계층 ─────────────────────────────────────────
type Node = { icon: IconName; title: string; desc: string };

const CLIENT_NODES: Node[] = [
  { icon: "user", title: "환자·보호자 앱", desc: "신청·매칭·결제·일지" },
  { icon: "stethoscope", title: "간병인 앱", desc: "일감·계약·정산" },
  { icon: "dashboard", title: "관리자 웹", desc: "운영·검증·정산관리" },
];

const SERVICE_NODES: Node[] = [
  { icon: "sparkles", title: "매칭 엔진", desc: "조건·지명·추천 후보 산출" },
  { icon: "creditCard", title: "결제 서비스", desc: "승인·취소·환급" },
  { icon: "coins", title: "정산 서비스", desc: "간병료 자동 정산" },
  { icon: "fileText", title: "전자계약", desc: "표준계약서·전자서명" },
  { icon: "shieldCheck", title: "인증·인가", desc: "본인확인·자격검증" },
  { icon: "bell", title: "알림 서비스", desc: "알림톡·푸시·SMS" },
];

const DATA_NODES: Node[] = [
  { icon: "list", title: "PostgreSQL", desc: "트랜잭션 DB · RLS 적용" },
  { icon: "refresh", title: "Redis 캐시", desc: "세션·매칭후보·조회 캐시" },
  { icon: "lock", title: "S3 스토리지", desc: "계약서·증빙 · SSE 암호화" },
];

// ── 4. RLS 권한 매트릭스 ──────────────────────────────────────
type Cell = "full" | "own" | "none";
const RLS_ROWS: { resource: string; cells: [Cell, Cell, Cell] }[] = [
  { resource: "환자 개인정보", cells: ["own", "own", "full"] },
  { resource: "간병 기록·일지", cells: ["own", "own", "full"] },
  { resource: "정산·결제 내역", cells: ["own", "own", "full"] },
  { resource: "계정·권한 설정", cells: ["own", "own", "full"] },
];
const RLS_COLS = ["보호자", "간병인", "관리자"];

const ENCRYPTION_CARDS = [
  {
    icon: "lock" as IconName,
    title: "AES-256 저장 암호화",
    desc: "주민번호·CI/DI, 건강·진료정보, 계좌번호 등 민감정보를 컬럼 단위로 암호화 저장합니다.",
  },
  {
    icon: "shieldCheck" as IconName,
    title: "전송구간 TLS 1.3",
    desc: "모든 클라이언트·서버·대외연계 통신을 TLS로 암호화하고 HSTS를 강제합니다.",
  },
  {
    icon: "download" as IconName,
    title: "S3 서버사이드 암호화",
    desc: "계약서·증빙 파일은 SSE-KMS로 암호화하고 Pre-signed URL로만 접근을 허용합니다.",
  },
  {
    icon: "fileText" as IconName,
    title: "접근통제 · 감사로그",
    desc: "민감정보 조회·수정 이력을 전수 기록하고, 최소권한 원칙으로 접근을 통제합니다.",
  },
];

// ── 5. API 설계 예시 ──────────────────────────────────────────
type ApiSpec = {
  method: "POST" | "GET" | "PUT";
  path: string;
  title: string;
  desc: string;
  request: string;
  response: string;
};

const API_SPECS: ApiSpec[] = [
  {
    method: "POST",
    path: "/api/v1/matching/search",
    title: "간병인 매칭 검색",
    desc: "환자 조건에 맞는 검증 간병인 후보를 점수순으로 반환",
    request: `{
  "patientId": "pt-20481",
  "region": "서울 송파구",
  "condition": ["수술 후 회복", "거동 불편"],
  "period": { "start": "2026-06-25", "days": 14 },
  "dailyRateMax": 140000
}`,
    response: `{
  "candidates": [
    {
      "caregiverId": "cg-1031",
      "name": "김미숙",
      "matchScore": 96.4,
      "rating": 4.9,
      "dailyRate": 130000,
      "insured": true
    }
  ],
  "total": 8
}`,
  },
  {
    method: "POST",
    path: "/api/v1/settlement/calculate",
    title: "간병료 정산 계산",
    desc: "간병 종료 후 일수·수수료·환급액을 산정",
    request: `{
  "contractId": "ct-77310",
  "actualDays": 13,
  "dailyRate": 130000,
  "feeRate": 0.12
}`,
    response: `{
  "grossAmount": 1690000,
  "platformFee": 202800,
  "caregiverPayout": 1487200,
  "refundToGuardian": 130000,
  "status": "calculated"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/auth/phone-verify",
    title: "휴대폰 본인인증",
    desc: "PASS 본인확인 결과(CI/DI)를 검증·발급",
    request: `{
  "txId": "pass-9f3a21",
  "name": "이정훈",
  "phone": "010-****-1234",
  "carrier": "SKT"
}`,
    response: `{
  "verified": true,
  "ci": "Q1w2...e5R6 (88byte)",
  "di": "Z9y8...x7W6 (64byte)",
  "verifiedAt": "2026-06-24T10:32:11+09:00"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/contracts",
    title: "전자 중개계약 생성",
    desc: "협의 확정 즉시 표준 중개계약서 생성·서명 요청",
    request: `{
  "patientId": "pt-20481",
  "caregiverId": "cg-1031",
  "dailyRate": 130000,
  "period": { "start": "2026-06-25", "end": "2026-07-09" }
}`,
    response: `{
  "contractId": "ct-77310",
  "status": "awaiting_signature",
  "documentUrl": "/files/contracts/ct-77310.pdf",
  "expiresAt": "2026-06-24T23:59:59+09:00"
}`,
  },
];

// ── 6. WBS / 간트 ─────────────────────────────────────────────
// 24주(약 6개월) 타임라인, 각 phase는 [시작주, 종료주] (1-base)
const TOTAL_WEEKS = 24;
type Phase = {
  no: number;
  name: string;
  range: [number, number];
  color: string;
  detail: string;
  milestone: string;
};
const PHASES: Phase[] = [
  {
    no: 1,
    name: "분석·설계",
    range: [1, 4],
    color: "var(--primary)",
    detail: "요구사항 정의 · 화면설계 · DB/아키텍처 설계 · 보안 설계",
    milestone: "설계 산출물 검수",
  },
  {
    no: 2,
    name: "코어 개발",
    range: [4, 14],
    color: "var(--accent)",
    detail: "환자·간병인 앱 · 관리자 백오피스 · 매칭 엔진 · 전자계약",
    milestone: "내부 알파 빌드",
  },
  {
    no: 3,
    name: "연계·결제·정산",
    range: [11, 19],
    color: "#2563eb",
    detail: "대외연계 6종 · 결제/정산 · 본인인증 · 알림톡 연동",
    milestone: "연계 통합 완료",
  },
  {
    no: 4,
    name: "보안·통합테스트·오픈",
    range: [17, 24],
    color: "#7c3aed",
    detail: "보안점검 · 통합/부하 테스트 · 안정화 · 인수인계 · 정식 오픈",
    milestone: "정식 서비스 오픈",
  },
];
const MONTH_TICKS = ["2026.6", "7월", "8월", "9월", "10월", "11월"];

// ── 7. 인력 구성 ──────────────────────────────────────────────
const TEAM_ROWS: { role: string; count: number; period: string; mm: number }[] =
  [
    { role: "PM (총괄)", count: 1, period: "전 기간 (M1~M6)", mm: 6 },
    { role: "PL / 아키텍트", count: 1, period: "전 기간 (M1~M6)", mm: 6 },
    { role: "백엔드 개발", count: 3, period: "M1~M6", mm: 16 },
    { role: "프론트 (앱·웹)", count: 2, period: "M1~M6", mm: 11 },
    { role: "UI/UX 디자인", count: 1, period: "M1~M4", mm: 4 },
    { role: "QA / 테스트", count: 1, period: "M3~M6", mm: 4 },
  ];
const TEAM_TOTAL_HEAD = TEAM_ROWS.reduce((a, r) => a + r.count, 0);
const TEAM_TOTAL_MM = TEAM_ROWS.reduce((a, r) => a + r.mm, 0);

// ── 8. SLA ────────────────────────────────────────────────────
const SLA_ROWS = [
  {
    grade: "P1",
    tone: "warning" as const,
    define: "서비스 전면 중단 · 결제·정산 불가",
    response: "30분 이내",
    recover: "4시간 이내",
  },
  {
    grade: "P2",
    tone: "accent" as const,
    define: "핵심 기능 장애 · 대외연계 지연",
    response: "2시간 이내",
    recover: "당일 이내",
  },
  {
    grade: "P3",
    tone: "muted" as const,
    define: "일부 화면 오류 · 경미한 결함",
    response: "당일 접수",
    recover: "영업일 3일",
  },
];

const MAINTENANCE_CARDS = [
  {
    icon: "calendar" as IconName,
    title: "정기 점검",
    desc: "월간 정기 점검과 분기 보안 패치, 성능 리포트를 정례 제공합니다.",
  },
  {
    icon: "phone" as IconName,
    title: "24/7 핫라인",
    desc: "P1 장애 대응을 위한 24시간 비상 연락 체계와 온콜 인력을 운영합니다.",
  },
  {
    icon: "users" as IconName,
    title: "정기 교육",
    desc: "운영 담당자 대상 반기 사용자 교육과 신규 기능 워크숍을 제공합니다.",
  },
  {
    icon: "fileText" as IconName,
    title: "기술 문서",
    desc: "운영 매뉴얼·API 명세·인프라 구성도를 최신 상태로 유지·인계합니다.",
  },
];

const directionTone = (d: Interface["direction"]) =>
  d === "송신" ? "accent" : d === "수신" ? "primary" : "success";

function cellMark(c: Cell) {
  if (c === "full")
    return { mark: "○", label: "전체", cls: "text-primary font-bold" };
  if (c === "own")
    return { mark: "△", label: "본인/담당", cls: "text-accent font-bold" };
  return { mark: "✕", label: "차단", cls: "text-muted-foreground" };
}

function gantt(range: [number, number]) {
  const [s, e] = range;
  const left = ((s - 1) / TOTAL_WEEKS) * 100;
  const width = ((e - s) / TOTAL_WEEKS) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

export default function ArchitecturePage() {
  return (
    <>
      {/* ── 1. 인트로 ───────────────────────────────────────── */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>기술·사업수행</Eyebrow>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            검증된 기술로, 약속한 일정에 구축합니다
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            확장 가능한 4계층 아키텍처, 6종 대외연계, 개인정보보호법을 충족하는
            보안 설계 위에 간병마스터를 구축합니다. 명확한 WBS와 전담 수행
            조직으로 단계별로 안정적으로 오픈합니다.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {HERO_METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 70}>
              <Card className="h-full text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  <CountUp value={m.value} />
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {m.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.sub}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── 2. 시스템 아키텍처 구성도 ───────────────────────── */}
      <Section muted id="diagram">
        <SectionHeading
          eyebrow="시스템 아키텍처"
          title="4계층 + 대외연계 구성도"
          description="클라이언트부터 데이터 계층까지 책임을 분리하고, 6종 대외 시스템과 안정적으로 연동합니다."
        />

        <Reveal className="mt-12">
          <div className="space-y-3">
            {/* 클라이언트 */}
            <LayerBlock
              tag="Client"
              title="클라이언트 계층"
              note="3개 접점 · 반응형/네이티브"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {CLIENT_NODES.map((n) => (
                  <NodeBox key={n.title} node={n} accent="primary" />
                ))}
              </div>
            </LayerBlock>

            <Connector label="HTTPS / TLS 1.3" />

            {/* API Gateway */}
            <div className="rounded-[var(--radius-lg)] border border-dashed border-primary/40 bg-primary/5 p-4">
              <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                  API Gateway
                </span>
                <span className="text-sm font-medium text-foreground">
                  인증·인가 · Rate Limit · 라우팅 · 요청 검증 · 감사 로깅
                </span>
              </div>
            </div>

            <Connector label="내부 서비스 호출" />

            {/* 애플리케이션 서비스 */}
            <LayerBlock
              tag="Service"
              title="애플리케이션 서비스 계층"
              note="도메인별 마이크로서비스"
            >
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {SERVICE_NODES.map((n) => (
                  <NodeBox key={n.title} node={n} accent="accent" compact />
                ))}
              </div>
            </LayerBlock>

            <Connector label="ORM / 캐시 / 객체스토리지" />

            {/* 데이터 계층 */}
            <LayerBlock
              tag="Data"
              title="데이터 계층"
              note="RLS · 암호화 · 이중화"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {DATA_NODES.map((n) => (
                  <NodeBox key={n.title} node={n} accent="data" />
                ))}
              </div>
            </LayerBlock>

            <Connector label="전용 연계 어댑터 (재시도·폴백)" />

            {/* 대외연계 */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
                  External
                </span>
                <span className="text-sm font-semibold text-foreground">
                  대외연계 6종
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {INTERFACES.map((it) => (
                  <div
                    key={it.title}
                    className="flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-muted px-2 py-3 text-center"
                  >
                    <Icon name={it.icon} className="h-5 w-5 text-foreground" />
                    <span className="text-[11px] font-semibold leading-tight text-foreground">
                      {it.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 범례 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <LegendDot color="var(--primary)" label="클라이언트 / 게이트웨이" />
            <LegendDot color="var(--accent)" label="애플리케이션 서비스" />
            <LegendDot color="#2563eb" label="데이터 계층" />
            <LegendDot color="var(--foreground)" label="대외 연계 시스템" />
          </div>
        </Reveal>
      </Section>

      {/* ── 3. 대외연계 인터페이스 ──────────────────────────── */}
      <Section id="interface">
        <SectionHeading
          eyebrow="대외 연계"
          title="6종 외부 시스템, 안정 연동"
          description="은행·카드·심평원·화재보험·휴대폰인증·카카오. 각 연계는 인증·통신방식·폴백까지 설계되어 장애에도 끊기지 않습니다."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INTERFACES.map((it, i) => (
            <Reveal key={it.title} delay={i * 70}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                      <Icon name={it.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-bold text-foreground">{it.title}</h3>
                      <p className="text-xs text-muted-foreground">{it.desc}</p>
                    </div>
                  </div>
                  <Badge tone={directionTone(it.direction)}>{it.direction}</Badge>
                </div>

                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <SpecRow label="제공" value={it.provider} />
                  <SpecRow label="방식" value={it.method} />
                  <SpecRow label="인증" value={it.auth} />
                  <SpecRow label="규격" value={it.spec} />
                </dl>

                <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-md)] bg-muted px-3 py-2.5">
                  <Icon
                    name="refresh"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      폴백 ·{" "}
                    </span>
                    {it.fallback}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── 4. 보안 아키텍처 ────────────────────────────────── */}
      <Section muted id="security">
        <SectionHeading
          eyebrow="보안 아키텍처"
          title="개인정보보호법을 충족하는 설계"
          description="행 수준 보안(RLS)으로 권한을 통제하고, 민감정보는 저장·전송 전 구간을 암호화합니다."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* RLS 매트릭스 */}
          <Reveal>
            <Card className="h-full">
              <div className="flex items-center gap-2">
                <Icon name="lock" className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">
                  RLS 권한 매트릭스
                </h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                역할별 행 수준 접근 권한. 본인·담당 데이터만 노출됩니다.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-3 font-semibold text-foreground">
                        리소스
                      </th>
                      {RLS_COLS.map((c) => (
                        <th
                          key={c}
                          className="px-2 py-2 text-center font-semibold text-foreground"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RLS_ROWS.map((row) => (
                      <tr
                        key={row.resource}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-2.5 pr-3 text-muted-foreground">
                          {row.resource}
                        </td>
                        {row.cells.map((c, idx) => {
                          const m = cellMark(c);
                          return (
                            <td
                              key={idx}
                              className="px-2 py-2.5 text-center"
                            >
                              <span
                                className={`text-base tnum ${m.cls}`}
                                title={m.label}
                              >
                                {m.mark}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <span className="font-bold text-primary">○</span> 전체 접근
                </span>
                <span>
                  <span className="font-bold text-accent">△</span> 본인/담당만
                </span>
                <span>
                  <span className="font-bold">✕</span> 접근 차단
                </span>
              </div>
            </Card>
          </Reveal>

          {/* 암호화 카드 */}
          <Reveal delay={90}>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {ENCRYPTION_CARDS.map((c) => (
                <Card key={c.title} className="h-full">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <h4 className="mt-3 text-sm font-bold text-foreground">
                    {c.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {c.desc}
                  </p>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── 5. API 설계 예시 ────────────────────────────────── */}
      <Section id="api">
        <SectionHeading
          eyebrow="API 설계"
          title="핵심 엔드포인트 설계 예시"
          description="RESTful 규격(/api/v1)으로 일관되게 설계합니다. 요청·응답 스키마는 명세 문서로 함께 인계됩니다."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {API_SPECS.map((api, i) => (
            <Reveal key={api.path} delay={i * 70}>
              <Card className="h-full">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {api.method}
                  </span>
                  <code className="font-mono text-sm font-semibold text-foreground">
                    {api.path}
                  </code>
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {api.title}
                </h3>
                <p className="text-xs text-muted-foreground">{api.desc}</p>

                <div className="mt-4 space-y-3">
                  <CodeBlock label="Request" code={api.request} tone="dim" />
                  <CodeBlock label="Response 200" code={api.response} tone="ok" />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── 6. WBS / 개발 일정 ──────────────────────────────── */}
      <Section muted id="wbs">
        <SectionHeading
          eyebrow="개발 일정 (WBS)"
          title="2026.6 착수 · 4~6개월 구축"
          description="4단계로 병렬·중첩 진행하여 일정을 단축하고, 단계별 마일스톤으로 품질을 검수합니다."
        />

        <Reveal className="mt-12">
          <Card>
            {/* 월 눈금 */}
            <div className="mb-4 ml-0 sm:ml-44">
              <div className="grid grid-cols-6 text-[11px] font-medium text-muted-foreground">
                {MONTH_TICKS.map((m) => (
                  <span key={m} className="border-l border-border pl-1.5">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {PHASES.map((p) => {
                const pos = gantt(p.range);
                return (
                  <div
                    key={p.no}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center"
                  >
                    {/* 라벨 */}
                    <div className="flex w-full shrink-0 items-center gap-2 sm:w-44">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.no}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        Phase {p.no}. {p.name}
                      </span>
                    </div>
                    {/* 바 트랙 */}
                    <div className="relative h-9 flex-1 rounded-[var(--radius-md)] bg-muted">
                      <div
                        className="absolute top-1/2 flex h-7 -translate-y-1/2 items-center rounded-[var(--radius-sm)] px-2.5"
                        style={{
                          left: pos.left,
                          width: pos.width,
                          backgroundColor: p.color,
                        }}
                      >
                        <span className="truncate text-[11px] font-semibold text-white">
                          {p.range[1] - p.range[0]}주
                        </span>
                        {/* 마일스톤 점 (바 끝) */}
                        <span
                          className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-2 border-white"
                          style={{ backgroundColor: p.color }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* phase 상세 */}
            <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {PHASES.map((p) => (
                <div key={p.no} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold text-foreground">
                      Phase {p.no}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {p.detail}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <Icon name="checkCircle" className="h-3.5 w-3.5" />
                    {p.milestone}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </Section>

      {/* ── 7. 인력 구성 ────────────────────────────────────── */}
      <Section id="team">
        <SectionHeading
          eyebrow="수행 조직"
          title="전담 수행 인력 구성"
          description={`PM부터 QA까지 ${TEAM_TOTAL_HEAD}인의 전담 조직이 투입됩니다. 총 투입 공수 ${TEAM_TOTAL_MM} M/M.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* 조직 요약 카드 */}
          <Reveal className="lg:col-span-2">
            <Card className="h-full">
              <div className="flex items-center gap-2">
                <Icon name="users" className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">조직 구성</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatBox value={`${TEAM_TOTAL_HEAD}명`} label="투입 인력" />
                <StatBox value={`${TEAM_TOTAL_MM} M/M`} label="총 투입 공수" />
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  "PM이 일정·이슈·산출물을 단일 창구로 관리",
                  "PL/아키텍트가 설계 일관성과 코드 품질 책임",
                  "QA는 Phase 3부터 상시 테스트로 결함 조기 차단",
                  "오픈 후 동일 핵심 인력이 유지보수 연속 수행",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {/* 역할·투입 표 */}
          <Reveal delay={90} className="lg:col-span-3">
            <Card className="h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2.5 pr-3 font-semibold text-foreground">
                        역할
                      </th>
                      <th className="px-2 py-2.5 text-center font-semibold text-foreground">
                        인원
                      </th>
                      <th className="px-2 py-2.5 font-semibold text-foreground">
                        투입 기간
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold text-foreground">
                        M/M
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_ROWS.map((r) => (
                      <tr
                        key={r.role}
                        className="border-b border-border/60"
                      >
                        <td className="py-2.5 pr-3 font-medium text-foreground">
                          {r.role}
                        </td>
                        <td className="px-2 py-2.5 text-center tnum text-muted-foreground">
                          {r.count}
                        </td>
                        <td className="px-2 py-2.5 text-muted-foreground">
                          {r.period}
                        </td>
                        <td className="px-2 py-2.5 text-right tnum text-muted-foreground">
                          {r.mm}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold text-foreground">
                      <td className="py-2.5 pr-3">합계</td>
                      <td className="px-2 py-2.5 text-center tnum">
                        {TEAM_TOTAL_HEAD}
                      </td>
                      <td className="px-2 py-2.5 text-muted-foreground">
                        2026.6 ~ 2026.11
                      </td>
                      <td className="px-2 py-2.5 text-right tnum text-primary">
                        {TEAM_TOTAL_MM}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── 8. 유지보수·기술지원 ────────────────────────────── */}
      <Section muted id="maintenance">
        <SectionHeading
          eyebrow="유지보수 · 기술지원"
          title="오픈 이후 5년, 끝까지 책임집니다"
          description="장애 등급별 SLA를 보장하고, 정기 점검·24/7 핫라인·교육·문서로 안정 운영을 지원합니다."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* SLA 표 */}
          <Reveal className="lg:col-span-3">
            <Card className="h-full">
              <div className="flex items-center gap-2">
                <Icon name="alert" className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-foreground">
                  장애 대응 SLA
                </h3>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2.5 pr-3 font-semibold text-foreground">
                        등급
                      </th>
                      <th className="px-2 py-2.5 font-semibold text-foreground">
                        정의
                      </th>
                      <th className="px-2 py-2.5 font-semibold text-foreground">
                        대응 시간
                      </th>
                      <th className="px-2 py-2.5 font-semibold text-foreground">
                        복구 목표
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLA_ROWS.map((s) => (
                      <tr
                        key={s.grade}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-3 pr-3">
                          <Badge tone={s.tone}>{s.grade}</Badge>
                        </td>
                        <td className="px-2 py-3 text-muted-foreground">
                          {s.define}
                        </td>
                        <td className="px-2 py-3 font-medium text-foreground">
                          {s.response}
                        </td>
                        <td className="px-2 py-3 font-medium text-foreground">
                          {s.recover}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Reveal>

          {/* 지원 카드 */}
          <Reveal delay={90} className="lg:col-span-2">
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
              {MAINTENANCE_CARDS.map((c) => (
                <Card key={c.title} className="h-full">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-accent/10 text-accent">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <h4 className="mt-3 text-sm font-bold text-foreground">
                    {c.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {c.desc}
                  </p>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── 9. CTA 밴드 ─────────────────────────────────────── */}
      <section className="bg-primary">
        <Container className="py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              기술과 수행 역량을, 직접 확인해 보세요
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-primary-foreground/85">
              설계 그대로 동작하는 데모로 환자·간병인·관리자 전 화면을 둘러볼 수
              있습니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/patient" variant="inverted" size="lg">
                데모 둘러보기
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Button
                href="/admin"
                variant="ghost"
                size="lg"
                className="text-primary-foreground hover:bg-white/10"
              >
                관리자 콘솔 보기
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <SiteFooter />
    </>
  );
}

/* ───────────────────────── 보조 컴포넌트 ───────────────────────── */

function LayerBlock({
  tag,
  title,
  note,
  children,
}: {
  tag: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
          {tag}
        </span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">{note}</span>
      </div>
      {children}
    </div>
  );
}

function NodeBox({
  node,
  accent,
  compact = false,
}: {
  node: Node;
  accent: "primary" | "accent" | "data";
  compact?: boolean;
}) {
  const ring =
    accent === "primary"
      ? "border-primary/30 bg-primary/5"
      : accent === "accent"
        ? "border-accent/30 bg-accent/5"
        : "border-[#2563eb]/30 bg-[#2563eb]/5";
  const iconColor =
    accent === "primary"
      ? "text-primary"
      : accent === "accent"
        ? "text-accent"
        : "text-[#2563eb]";
  return (
    <div
      className={`flex items-center gap-2.5 rounded-[var(--radius-md)] border ${ring} ${
        compact ? "px-2.5 py-2.5" : "px-3 py-3"
      }`}
    >
      <Icon name={node.icon} className={`h-5 w-5 shrink-0 ${iconColor}`} />
      <div className="min-w-0">
        <div
          className={`font-semibold text-foreground ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {node.title}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">
          {node.desc}
        </div>
      </div>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5">
      <span className="h-4 w-px bg-border" />
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <span className="h-4 w-px bg-border" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-12 shrink-0 text-xs font-semibold text-muted-foreground">
        {label}
      </dt>
      <dd className="text-xs leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

function CodeBlock({
  label,
  code,
  tone,
}: {
  label: string;
  code: string;
  tone: "dim" | "ok";
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] bg-foreground">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-background/55">
          {label}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${
            tone === "ok" ? "bg-primary" : "bg-accent"
          }`}
        />
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 text-[11px] leading-relaxed text-background/90">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-muted px-3 py-3 text-center">
      <div className="text-xl font-bold text-primary">
        <CountUp value={value} />
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
