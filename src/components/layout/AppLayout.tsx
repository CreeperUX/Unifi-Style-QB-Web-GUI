import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useTransferInfo } from '@/hooks/use-qbit';

export function AppLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const { data: transferInfo } = useTransferInfo();

  return (
    <div className="flex h-full">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar transferInfo={transferInfo} />
        <main className="flex-1 overflow-auto p-8">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'torrents' && <PlaceholderPage title="Torrents" />}
          {activePage === 'search' && <PlaceholderPage title="Search" />}
          {activePage === 'rss' && <PlaceholderPage title="RSS" />}
          {activePage === 'settings' && <PlaceholderPage title="Settings" />}
        </main>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh] text-text-tertiary">
      <div className="text-center">
        <div className="text-5xl mb-4 opacity-30">🚧</div>
        <p className="text-lg font-medium text-text-secondary">{title}</p>
        <p className="text-[13px] mt-1 opacity-60">Coming soon</p>
      </div>
    </div>
  );
}
