// 간병마스터 데모 공용 목업 데이터. 모든 화면(랜딩/환자앱/간병인앱/관리자)이 공유해
// 일관된 인물·병원·수치가 등장하도록 한다. 실제 데이터/거래 없음(시연용).

export const won = (n: number) => n.toLocaleString("ko-KR") + "원";

export type Caregiver = {
  id: string;
  name: string;
  age: number;
  gender: "여" | "남";
  rating: number;
  reviews: number;
  careerYears: number;
  region: string;
  specialties: string[];
  certs: string[];
  dailyRate: number;
  insured: boolean;
  tag?: "추천" | "지명" | "신규";
  intro: string;
  color: string; // 아바타 배경
};

export const CAREGIVERS: Caregiver[] = [
  {
    id: "cg-1031",
    name: "김미숙",
    age: 54,
    gender: "여",
    rating: 4.9,
    reviews: 218,
    careerYears: 12,
    region: "서울 송파",
    specialties: ["수술 후 회복", "거동 불편", "치매"],
    certs: ["요양보호사 1급", "간병사", "심폐소생술(CPR)"],
    dailyRate: 130000,
    insured: true,
    tag: "추천",
    intro: "정형외과·신경외과 수술 후 회복 간병 경력이 풍부합니다. 보호자와 꼼꼼히 소통합니다.",
    color: "#0e9e6e",
  },
  {
    id: "cg-0987",
    name: "박정자",
    age: 58,
    gender: "여",
    rating: 4.8,
    reviews: 174,
    careerYears: 15,
    region: "서울 강동",
    specialties: ["뇌졸중", "와상 환자", "욕창 관리"],
    certs: ["요양보호사 1급", "간병사"],
    dailyRate: 135000,
    insured: true,
    tag: "추천",
    intro: "장기 와상 환자 케어와 욕창 예방 관리에 능숙합니다. 야간 간병도 가능합니다.",
    color: "#f2784b",
  },
  {
    id: "cg-1145",
    name: "이영호",
    age: 49,
    gender: "남",
    rating: 4.7,
    reviews: 96,
    careerYears: 8,
    region: "서울 강남",
    specialties: ["남성 환자", "재활 보조", "거동 불편"],
    certs: ["요양보호사 1급", "물리치료 보조"],
    dailyRate: 140000,
    insured: true,
    tag: "지명",
    intro: "남성 중증 환자 이동·재활 보조 전문. 힘이 필요한 간병에 강점이 있습니다.",
    color: "#2563eb",
  },
  {
    id: "cg-1203",
    name: "최순영",
    age: 61,
    gender: "여",
    rating: 4.9,
    reviews: 305,
    careerYears: 20,
    region: "서울 서초",
    specialties: ["치매", "노인성 질환", "임종 케어"],
    certs: ["요양보호사 1급", "간병사", "치매전문교육 이수"],
    dailyRate: 138000,
    insured: true,
    intro: "20년 경력의 베테랑. 치매 어르신 정서 케어와 가족 상담에 깊은 노하우가 있습니다.",
    color: "#7c3aed",
  },
  {
    id: "cg-1288",
    name: "정해숙",
    age: 52,
    gender: "여",
    rating: 4.6,
    reviews: 41,
    careerYears: 4,
    region: "서울 광진",
    specialties: ["수술 후 회복", "산모·신생아"],
    certs: ["요양보호사 1급", "산후관리사"],
    dailyRate: 125000,
    insured: true,
    tag: "신규",
    intro: "친절하고 성실한 케어로 신규 등록 후 빠르게 좋은 평가를 받고 있습니다.",
    color: "#d97706",
  },
];

export type Hospital = {
  name: string;
  dept: string;
  region: string;
  beds: number;
};

// 건강보험심사평가원(심평원) 대외 인터페이스 목업
export const HOSPITALS: Hospital[] = [
  { name: "서울아산병원", dept: "정형외과·신경외과", region: "서울 송파구", beds: 2715 },
  { name: "삼성서울병원", dept: "신경외과·재활의학과", region: "서울 강남구", beds: 1979 },
  { name: "강동경희대학교병원", dept: "정형외과", region: "서울 강동구", beds: 800 },
  { name: "건국대학교병원", dept: "재활의학과", region: "서울 광진구", beds: 870 },
];

export type Job = {
  id: string;
  patient: string; // 익명화
  condition: string;
  hospital: string;
  region: string;
  period: string;
  days: number;
  dailyRate: number;
  type: "지명" | "공개모집" | "추천";
  urgent?: boolean;
};

export const JOBS: Job[] = [
  {
    id: "job-5521",
    patient: "남 / 72세",
    condition: "고관절 수술 후 회복 · 거동 불편",
    hospital: "서울아산병원",
    region: "서울 송파구",
    period: "6/25 ~ 7/9",
    days: 14,
    dailyRate: 130000,
    type: "지명",
    urgent: true,
  },
  {
    id: "job-5530",
    patient: "여 / 81세",
    condition: "뇌졸중 · 와상 · 욕창 관리 필요",
    hospital: "삼성서울병원",
    region: "서울 강남구",
    period: "6/26 ~ 7/26",
    days: 30,
    dailyRate: 135000,
    type: "공개모집",
  },
  {
    id: "job-5544",
    patient: "여 / 68세",
    condition: "무릎 인공관절 수술 후 재활 보조",
    hospital: "강동경희대학교병원",
    region: "서울 강동구",
    period: "6/27 ~ 7/4",
    days: 7,
    dailyRate: 125000,
    type: "추천",
  },
  {
    id: "job-5559",
    patient: "남 / 77세",
    condition: "파킨슨 · 일상생활 전반 보조",
    hospital: "건국대학교병원",
    region: "서울 광진구",
    period: "6/28 ~ 7/28",
    days: 30,
    dailyRate: 140000,
    type: "공개모집",
  },
];

// 랜딩 임팩트 통계
export const STATS = [
  { value: "12분", label: "평균 매칭 소요시간", sub: "신청 → 간병인 확정" },
  { value: "3,240+", label: "신원검증 완료 간병인", sub: "배상책임보험 가입" },
  { value: "4.8 / 5.0", label: "보호자 평균 만족도", sub: "누적 18,600건 평가" },
  { value: "92%↓", label: "정산 분쟁 감소", sub: "전자계약·자동정산 도입 후" },
];

// 기존 간병 중개의 페인포인트
export const PAIN_POINTS = [
  {
    icon: "phone" as const,
    title: "전화·수기로 떠도는 매칭",
    desc: "급할 때 일일이 전화 수소문. 누가 오는지, 믿을 만한지 알 수 없습니다.",
  },
  {
    icon: "coins" as const,
    title: "불투명한 간병비",
    desc: "현장에서 흥정되는 일당과 추가금. 보호자도 간병인도 불안합니다.",
  },
  {
    icon: "userCheck" as const,
    title: "검증되지 않은 신원",
    desc: "자격·경력·보험 가입 여부를 확인할 방법이 마땅치 않습니다.",
  },
  {
    icon: "fileText" as const,
    title: "분쟁 시 근거 부재",
    desc: "계약서도 정산 내역도 없이 분쟁이 생기면 책임 소재가 모호합니다.",
  },
];

// 핵심 기능
export const FEATURES = [
  {
    icon: "sparkles" as const,
    title: "스마트 간병인 매칭",
    desc: "검색·지명·추천·선택까지. 조건에 맞는 검증된 간병인을 빠르게 연결합니다.",
  },
  {
    icon: "kakao" as const,
    title: "카카오 알림톡 간병비 협의",
    desc: "보호자와 간병인이 알림톡으로 투명하게 간병비를 협의하고 확정합니다.",
  },
  {
    icon: "fileText" as const,
    title: "전자 중개계약서",
    desc: "협의 즉시 표준 중개계약서를 생성·서명·다운로드. 분쟁 근거를 남깁니다.",
  },
  {
    icon: "creditCard" as const,
    title: "안전결제 · 자동정산",
    desc: "은행 즉시이체·카드 결제, 간병 종료 후 자동 정산과 환급까지 처리합니다.",
  },
  {
    icon: "clipboard" as const,
    title: "실시간 간병일지",
    desc: "간병인이 기록한 일지를 보호자가 앱에서 바로 확인합니다.",
  },
  {
    icon: "shieldCheck" as const,
    title: "신원검증 · 배상책임보험",
    desc: "자격·경력 검증과 배상책임보험 가입으로 안심 간병을 보장합니다.",
  },
];

// 매칭 프로세스 (신청 → 정산)
export const FLOW_STEPS = [
  { no: 1, title: "간병 신청", desc: "환자 상태·병원·기간 입력", icon: "edit" as const },
  { no: 2, title: "간병인 매칭", desc: "검색·추천·지명으로 후보 확인", icon: "search" as const },
  { no: 3, title: "간병인 선택", desc: "프로필·평점·경력 비교 후 선택", icon: "userCheck" as const },
  { no: 4, title: "간병비 협의", desc: "카카오 알림톡으로 금액 확정", icon: "kakao" as const },
  { no: 5, title: "전자계약", desc: "중개계약서 생성·서명", icon: "fileText" as const },
  { no: 6, title: "안전결제", desc: "즉시이체·카드로 결제", icon: "creditCard" as const },
  { no: 7, title: "간병 진행", desc: "실시간 일지·진행상태 확인", icon: "clipboard" as const },
  { no: 8, title: "정산·평가", desc: "자동 정산·환급, 만족도 평가", icon: "checkCircle" as const },
];

// 대외 연계 인터페이스 (랜딩=icon/title/desc, 아키텍처 페이지=상세 필드)
export type Interface = {
  icon:
    | "bank"
    | "creditCard"
    | "hospital"
    | "shieldCheck"
    | "phone"
    | "kakao";
  title: string;
  desc: string;
  provider: string;
  method: string;
  auth: string;
  direction: "송신" | "수신" | "양방향";
  spec: string;
  fallback: string;
};

export const INTERFACES: Interface[] = [
  {
    icon: "bank",
    title: "은행 즉시이체",
    desc: "간병비 결제·간병료 정산",
    provider: "금융결제원 오픈뱅킹",
    method: "REST/HTTPS",
    auth: "OAuth2 + 전자서명",
    direction: "양방향",
    spec: "출금이체/입금이체 API, 잔액·거래내역 조회",
    fallback: "타임아웃 시 결제 보류·재시도 큐, 가상계좌 폴백",
  },
  {
    icon: "creditCard",
    title: "신용카드 결제승인",
    desc: "카드 결제·취소·환급",
    provider: "PG사(KSNET/NICE)",
    method: "REST/HTTPS",
    auth: "API Key + 가맹점 인증",
    direction: "양방향",
    spec: "승인/취소/부분취소/정기결제 토큰",
    fallback: "승인 지연 시 멱등키로 중복결제 방지",
  },
  {
    icon: "hospital",
    title: "건강보험심사평가원",
    desc: "병원 검색·조회",
    provider: "심평원 공공데이터 OpenAPI",
    method: "REST/HTTPS",
    auth: "서비스키",
    direction: "수신",
    spec: "병원·약국 기본정보, 진료과목·병상 조회",
    fallback: "장애 시 내부 캐시(일 1회 동기화) 사용",
  },
  {
    icon: "shieldCheck",
    title: "화재보험사",
    desc: "간병인 배상책임보험",
    provider: "손해보험사 단체보험 I/F",
    method: "SOAP/전문(파일)",
    auth: "전용선 + 기관 인증서",
    direction: "양방향",
    spec: "가입/해지 신청, 보험료 납입내역",
    fallback: "배치 재전송, 미가입 간병인 매칭 차단",
  },
  {
    icon: "phone",
    title: "휴대폰 본인인증",
    desc: "회원 가입·신원확인",
    provider: "PASS(통신 3사)",
    method: "REST/HTTPS",
    auth: "CP 인증 + 콜백 서명",
    direction: "양방향",
    spec: "본인확인 요청/결과 검증(CI/DI)",
    fallback: "실패 시 아이핀·신분증 인증 대체",
  },
  {
    icon: "kakao",
    title: "카카오 알림톡",
    desc: "간병비 협의·알림",
    provider: "카카오 비즈메시지",
    method: "REST/HTTPS",
    auth: "API Key + 발신프로필",
    direction: "송신",
    spec: "템플릿 발송, 전송 결과 수신(webhook)",
    fallback: "미수신 시 SMS(LMS) 자동 대체 발송",
  },
];
