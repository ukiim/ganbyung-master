import { BrandMark } from "@/components/Brand";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <BrandMark className="h-14 w-14" />
      <p className="mt-6 text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold text-foreground">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-muted-foreground">
        요청하신 페이지가 없거나 이동되었습니다. 아래에서 둘러보세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/" variant="filled">
          홈으로
        </Button>
        <Button href="/patient" variant="outlined">
          환자·보호자 앱
        </Button>
        <Button href="/caregiver" variant="outlined">
          간병인 앱
        </Button>
        <Button href="/admin" variant="outlined">
          관리자 콘솔
        </Button>
      </div>
    </div>
  );
}
