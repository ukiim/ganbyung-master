import { Icon, type IconName } from "@/components/Icon";

export type AppTab = {
  key: string;
  label: string;
  icon: IconName;
};

export function AppTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: AppTab[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <nav className="z-20 flex shrink-0 items-stretch border-t border-border bg-background/95 px-1 pb-1 pt-1.5 backdrop-blur">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key as T)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 transition-colors"
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              name={tab.icon}
              className={`h-6 w-6 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-[11px] ${
                isActive
                  ? "font-bold text-primary"
                  : "font-medium text-muted-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
