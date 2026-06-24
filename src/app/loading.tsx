import { BrandMark } from "@/components/Brand";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <BrandMark className="h-12 w-12 animate-pulse-soft" />
      <p className="text-sm font-medium text-muted-foreground">불러오는 중…</p>
    </div>
  );
}
