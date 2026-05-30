export function TopBar({ title }: { title: string }) {
  return (
    <header className="h-12 bg-sidebar-bg border-b border-border flex items-center px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,111,255,0.5)]" />
        <span className="text-base font-semibold text-text-primary">{title}</span>
      </div>
      <div className="flex-1" />
      <span className="text-[11px] text-text-tertiary font-mono">v5</span>
    </header>
  );
}
