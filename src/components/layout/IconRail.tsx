import { LayoutDashboard, Download, Search, Rss, Settings } from 'lucide-react';

const items = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'torrents', icon: Download, label: 'Torrents' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'rss', icon: Rss, label: 'RSS' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function IconRail({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  return (
    <nav className="w-[52px] flex flex-col items-center bg-sidebar-bg border-r border-border-subtle py-4 gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center mb-4 shadow-[0_0_16px_rgba(0,111,255,0.25)]">
        <span className="text-white font-bold text-xs tracking-tight">QB</span>
      </div>
      {items.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              isActive ? 'text-accent bg-accent/10' : 'text-text-tertiary hover:text-text-secondary hover:bg-card-bg'
            }`}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
          </button>
        );
      })}
    </nav>
  );
}
