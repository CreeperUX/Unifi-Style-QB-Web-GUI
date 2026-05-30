interface Props {
  title: string;
}

export function TopBar({ title }: Props) {
  return (
    <header className="h-10 bg-panel-bg border-b border-border-subtle flex items-center px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-[13px] font-medium text-text-primary">{title}</span>
      </div>
      <div className="flex-1" />
      <span className="text-[11px] text-text-tertiary">UniFi QB WebUI</span>
    </header>
  );
}
