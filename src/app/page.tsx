import Link from "next/link";
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
  Card,
  Button,
  Badge,
} from "@/components/ui";
import { Icon } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import {
  won,
  CAREGIVERS,
  STATS,
  PAIN_POINTS,
  FEATURES,
  FLOW_STEPS,
  INTERFACES,
} from "@/lib/data";

const HERO_CG = CAREGIVERS[0]; // 김미숙

const SURFACES = [
  {
    icon: "user" as const,
    title: "환자·보호자 앱",
    desc: "간병 신청부터 간병인 선택, 간병비 협의, 전자계약, 결제, 실시간 일지 확인까지 한 번에.",
    href: "/patient",
  },
  {
    icon: "stethoscope" as const,
    title: "간병인 앱",
    desc: "지명·공개모집 일감 확인, 협의·계약 수락, 간병일지 작성, 간병료 정산까지 모바일로.",
    href: "/caregiver",
  },
  {
    icon: "dashboard" as const,
    title: "관리자 콘솔",
    desc: "회원·간병인 검증, 매칭 현황, 정산·분쟁 관리, 운영 지표를 한눈에 모니터링.",
    href: "/admin",
  },
  {
    icon: "building" as const,
    title: "기술·사업수행",
    desc: "시스템 아키텍처, 대외 연계, 데이터·보안 설계와 사업수행 체계를 한눈에 확인하세요.",
    href: "/architecture",
  },
];

const TRUST_ITEMS = [
  {
    title: "개인정보보호법 준수",
    desc: "수집·이용·파기 전 과정을 법정 기준에 맞춰 관리합니다.",
  },
  {
    title: "민감정보 AES-256 암호화",
    desc: "주민번호·건강정보 등 민감정보는 저장·전송 구간 모두 암호화합니다.",
  },
  {
    title: "행 수준 보안 (RLS)",
    desc: "보호자·간병인·관리자가 권한 범위의 데이터에만 접근하도록 통제합니다.",
  },
  {
    title: "신원검증·배상책임보험 의무화",
    desc: "자격·경력 검증을 거치고 배상책임보험에 가입한 간병인만 활동합니다.",
  },
];

const ACCESS_ITEMS = [
  { icon: "search" as const, title: "큰 글씨·명확한 대비", desc: "고령 보호자도 한눈에 읽히는 본문 크기와 충분한 색 대비." },
  { icon: "list" as const, title: "직관적인 단계 흐름", desc: "신청부터 정산까지 단계가 명확해 헤매지 않습니다." },
  { icon: "users" as const, title: "보호자 대리 이용", desc: "자녀·가족이 어르신을 대신해 신청하고 진행 상황을 공유합니다." },
  { icon: "phone" as const, title: "전화 상담 연결", desc: "앱이 어려우면 1588-7240으로 바로 상담원과 연결됩니다." },
];

export default function Home() {
  return (
    <>
      {/* 1) HERO */}
      <div className="relative overflow-hidden bg-background">
        <div
          aria-hidden="true"
          className="animate-hero-shift pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 78% 18%, rgba(14,158,110,0.14), transparent 70%), radial-gradient(45% 45% at 12% 90%, rgba(242,120,75,0.08), transparent 70%)",
          }}
        />
        <Container className="relative">
          <div className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
            {/* 좌 */}
            <div className="animate-fade-up">
              <Eyebrow>
                <Icon name="sparkles" className="animate-pulse-soft h-4 w-4" />
                제니엘메디컬 간병인 중개 플랫폼
              </Eyebrow>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                간병의 모든 순간을
                <br />
                <span className="text-primary">신뢰</span>로 연결합니다
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                보호자와 검증된 간병인을 스마트하게 매칭하고, 카카오 알림톡으로
                간병비를 투명하게 협의합니다. 전자계약과 안전결제로 마무리까지 —
                간병의 처음부터 끝까지 간병마스터가 함께합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/patient" variant="filled" size="lg">
                  환자·보호자 앱 체험
                  <Icon name="arrowRight" className="h-5 w-5" />
                </Button>
                <Button href="/admin" variant="outlined" size="lg">
                  관리자 콘솔 보기
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
                <li className="inline-flex items-center gap-2">
                  <Icon name="shieldCheck" className="h-5 w-5 text-primary" />
                  신원검증
                </li>
                <li className="inline-flex items-center gap-2">
                  <Icon name="verified" className="h-5 w-5 text-primary" />
                  배상책임보험
                </li>
                <li className="inline-flex items-center gap-2">
                  <Icon name="lock" className="h-5 w-5 text-primary" />
                  개인정보보호
                </li>
              </ul>
            </div>

            {/* 우 — 히어로 비주얼 */}
            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[#13b67e] to-[#0b8a5f] p-6 shadow-lg">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.45), transparent 55%)",
                  }}
                />

                {/* ① 매칭된 간병인 카드 */}
                <div
                  className="animate-fade-up absolute left-5 top-6 w-[78%] rounded-[var(--radius-md)] border border-border bg-card p-4 shadow-lg"
                  style={{ animationDelay: "320ms" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                      style={{ backgroundColor: HERO_CG.color }}
                    >
                      {HERO_CG.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">
                          {HERO_CG.name}
                        </span>
                        {HERO_CG.tag && (
                          <Badge tone="primary">{HERO_CG.tag}</Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon
                          name="star"
                          className="h-4 w-4 text-accent"
                          filled
                        />
                        <span className="tnum font-semibold text-foreground">
                          {HERO_CG.rating}
                        </span>
                        <span className="tnum">({HERO_CG.reviews})</span>
                        <span aria-hidden="true">·</span>
                        <span className="tnum">경력 {HERO_CG.careerYears}년</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Icon name="shieldCheck" className="h-4 w-4" />
                      배상책임보험 가입
                    </span>
                    <span className="tnum text-sm font-bold text-foreground">
                      {won(HERO_CG.dailyRate)}
                      <span className="font-normal text-muted-foreground">
                        /일
                      </span>
                    </span>
                  </div>
                </div>

                {/* ② 카카오 알림톡 미니 말풍선 */}
                <div
                  className="animate-fade-up absolute bottom-20 right-4 w-[72%] rounded-[var(--radius-md)] bg-card p-3 shadow-lg"
                  style={{ animationDelay: "460ms" }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-kakao text-kakao-foreground">
                      <Icon name="kakao" className="h-3 w-3" filled />
                    </span>
                    카카오 알림톡 · 간병비 협의
                  </div>
                  <div className="mt-2 rounded-[var(--radius-sm)] bg-kakao px-3 py-2 text-sm font-medium text-kakao-foreground">
                    간병비 일 {won(HERO_CG.dailyRate)}로 협의 완료되었습니다.
                  </div>
                  <div className="mt-1.5 text-right text-[11px] font-semibold text-primary">
                    확정 · 전자계약 진행 →
                  </div>
                </div>

                {/* ③ 통계 칩 */}
                <div
                  className="animate-fade-up absolute bottom-6 left-5 inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 shadow-lg"
                  style={{ animationDelay: "600ms" }}
                >
                  <Icon name="clock" className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    평균 매칭{" "}
                    <CountUp value="12분" className="text-primary" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 2) STATS */}
      <Section muted>
        <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <dd className="text-3xl font-bold text-primary sm:text-4xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-2 font-semibold text-foreground">{s.label}</dt>
              <p className="mt-1 text-sm text-muted-foreground">{s.sub}</p>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* 3) PAIN POINTS */}
      <Section id="problem">
        <Reveal>
          <SectionHeading
            eyebrow="왜 간병마스터인가"
            title="간병, 이렇게 불편했습니다"
            description="급할 때 일일이 전화하고, 누가 오는지도 모른 채 흥정하던 간병. 보호자도 간병인도 불안했습니다."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} className="h-full">
              <Card hover className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-accent/10">
                  <Icon name={p.icon} className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 4) SOLUTION */}
      <Section muted id="about">
        <Reveal>
          <SectionHeading
            eyebrow="간병마스터의 해법"
            title="하나의 플랫폼, 네 개의 연결"
            description="환자·보호자, 간병인, 운영자를 한 흐름으로 잇고, 기술·사업수행까지 한 화면에서 확인합니다. 모든 연결의 중심에 간병마스터가 있습니다."
          />
        </Reveal>

        {/* 다이어그램 */}
        <div className="mt-12">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center">
            {/* 중심 노드 */}
            <div className="flex flex-col items-center rounded-[var(--radius-lg)] bg-primary px-8 py-5 text-center text-primary-foreground shadow-md">
              <Icon name="heartPulse" className="animate-pulse-soft h-7 w-7" filled />
              <span className="mt-1.5 text-lg font-bold">간병마스터 플랫폼</span>
              <span className="text-sm text-primary-foreground/80">
                매칭 · 협의 · 계약 · 결제 · 정산
              </span>
            </div>
            {/* 연결선 */}
            <div className="h-8 w-px bg-border" aria-hidden="true" />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((s, i) => {
              const isArch = s.href === "/architecture";
              return (
              <Reveal key={s.title} delay={i * 70} className="h-full">
                <Card hover className="flex h-full flex-col text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                    <Icon name={s.icon} className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <div className="mt-4">
                    <Button href={s.href} variant="ghost">
                      {isArch ? "기술·사업수행 보기" : "체험하기"}
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 5) FEATURES */}
      <Section id="features">
        <Reveal>
          <SectionHeading
            eyebrow="핵심 기능"
            title="신뢰를 만드는 핵심 기능"
            description="검증된 매칭부터 투명한 협의, 전자계약, 안전결제까지 — 간병의 모든 단계를 책임집니다."
          />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="h-full">
              <Card hover className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                  <Icon name={f.icon} className="h-6 w-6 text-primary" filled={f.icon === "kakao"} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6) FLOW */}
      <Section muted id="flow">
        <Reveal>
          <SectionHeading
            eyebrow="매칭 프로세스"
            title="신청부터 정산까지, 8단계"
            description="복잡했던 간병 절차를 명확한 8단계로. 어느 단계에 있는지 항상 한눈에 확인할 수 있습니다."
          />
        </Reveal>
        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW_STEPS.map((step, i) => {
            // lg 4열 그리드에서 각 행의 마지막(4번째, 8번째)에는 연결선을 그리지 않음
            const isRowEnd = (i + 1) % 4 === 0;
            return (
            <li key={step.no} className="relative">
              {/* 연결선 (lg, 행 끝 제외) */}
              {!isRowEnd && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+1.75rem)] top-7 hidden h-px w-[calc(100%-3.5rem)] bg-border lg:block"
                />
              )}
              <Reveal delay={i * 70} className="relative flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Icon name={step.icon} className="h-6 w-6" />
                </span>
                <span className="tnum mt-3 text-xs font-bold text-primary">
                  STEP {step.no}
                </span>
                <h3 className="mt-1 font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </Reveal>
            </li>
            );
          })}
        </ol>
      </Section>

      {/* 7) INTERFACE */}
      <Section id="interface">
        <Reveal>
          <SectionHeading
            eyebrow="대외 연계"
            title="검증된 대외 연계"
            description="은행·카드·심평원·보험사·인증·메시징까지, 실제 운영에 필요한 외부 시스템과 안정적으로 연동합니다."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
          {INTERFACES.map((it, i) => (
            <Reveal key={it.title} delay={i * 70} className="h-full">
              <Card hover className="flex h-full items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                  <Icon
                    name={it.icon}
                    className="h-6 w-6 text-primary"
                    filled={it.icon === "kakao"}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{it.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 8) TRUST */}
      <Section muted id="trust">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* 좌: 보안 체크리스트 */}
          <div>
            <Eyebrow>
              <Icon name="lock" className="h-4 w-4" />
              보안 · 신뢰
            </Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              안심하고 맡기는 이유
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              간병 정보는 입찰 전 기밀에 준하는 민감정보입니다. 간병마스터는
              법정 기준 이상의 보안 체계로 데이터를 보호합니다.
            </p>
            <ul className="mt-8 space-y-5">
              {TRUST_ITEMS.map((t) => (
                <li key={t.title} className="flex gap-4">
                  <Icon
                    name="checkCircle"
                    className="mt-0.5 h-6 w-6 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="font-bold text-foreground">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 우: 고령 사용자 접근성 카드 */}
          <Card className="bg-card">
            <Badge tone="accent">고령 사용자 접근성</Badge>
            <h3 className="mt-4 text-xl font-bold text-foreground">
              어르신도, 보호자도 쉽게
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              어려운 기술이 아니라, 누구나 쓸 수 있는 서비스를 지향합니다.
            </p>
            <ul className="mt-6 space-y-4">
              {ACCESS_ITEMS.map((a) => (
                <li key={a.title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent/10">
                    <Icon name={a.icon} className="h-5 w-5 text-accent" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {a.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* 9) CTA 밴드 */}
      <section
        id="contact"
        className="scroll-mt-20 bg-primary py-20 text-primary-foreground"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              간병마스터로 시작하세요
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">
              검증된 간병인, 투명한 비용, 안전한 계약. 지금 바로 체험해 보세요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/patient" variant="inverted" size="lg">
                데모 둘러보기
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Link
                href="/architecture"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-primary-foreground/40 px-7 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 active:scale-[0.98]"
              >
                기술·사업수행 보기
                <Icon name="arrowUpRight" className="h-5 w-5" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-primary-foreground/40 px-7 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 active:scale-[0.98]"
              >
                관리자 콘솔
              </Link>
            </div>
            <p className="mt-8 text-sm text-primary-foreground/75">
              제니엘메디컬 · 1588-7240 · contact@zenielmedical.co.kr
            </p>
          </div>
        </Container>
      </section>

      {/* 10) Footer */}
      <SiteFooter />
    </>
  );
}
