import { LayoutDashboard, Download, Search, Rss, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'torrents', icon: Download, label: 'Torrents' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'rss', icon: Rss, label: 'RSS' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const collapsed = usePreferencesStore((s) => s.sidebarCollapsed);
  const toggle = usePreferencesStore((s) => s.toggleSidebar);

  return (
    <aside
      className={`flex flex-col bg-sidebar border-r border-border transition-all duration-200 ${
        collapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-border gap-2">
        <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">QB</span>
        </div>
        {!collapsed && (
          <span className="text-text font-semibold text-sm truncate">qBittorrent</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-accent-subtle text-accent hover:text-accent-hover'
                  : 'text-text-secondary hover:text-text hover:bg-card'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-10 border-t border-border text-text-tertiary hover:text-text-secondary hover:bg-card transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
