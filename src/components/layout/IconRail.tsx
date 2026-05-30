import { LayoutDashboard, Download, Search, Rss, Settings } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'torrents', icon: Download, label: 'Torrents' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'rss', icon: Rss, label: 'RSS' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
}

export function IconRail({ active, onNavigate }: Props) {
  return (
    <nav className="w-[48px] flex flex-col items-center bg-panel-bg border-r border-border-subtle py-2 gap-1 flex-shrink-0">
      {/* Logo dot */}
      <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center mb-2 mt-1">
        <span className="text-white font-bold text-[10px]">QB</span>
      </div>

      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              isActive
                ? 'text-accent bg-accent-subtle'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-card-bg'
            }`}
            title={item.label}
          >
            <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
          </button>
        );
      })}
    </nav>
  );
}
