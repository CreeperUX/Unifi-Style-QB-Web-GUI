export function TopBar({ title }: { title: string }) {
  return (
    <header className="h-[44px] bg-panel-bg border-b border-border flex items-center px-5 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(0,111,255,0.4)]" />
        <span className="text-[15px] font-semibold text-text-primary">{title}</span>
      </div>
      <div className="flex-1" />
      <span className="text-[10px] text-text-tertiary font-mono">v4</span>
    </header>
  );
}
