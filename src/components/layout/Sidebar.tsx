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
      className={`flex flex-col bg-sidebar border-r border-border-subtle transition-all duration-200 ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center h-[56px] px-4 border-b border-border-subtle gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
          <span className="text-white font-bold text-[13px] tracking-tight">QB</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-text font-semibold text-sm leading-tight">qBittorrent</span>
            <span className="text-text-tertiary text-[11px] leading-tight">UniFi Style</span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent-subtle text-accent'
                  : 'text-text-secondary hover:text-text hover:bg-card'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-10 border-t border-border-subtle text-text-tertiary hover:text-text-secondary hover:bg-card transition-colors flex-shrink-0"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
