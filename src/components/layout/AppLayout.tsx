import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IconRail } from './IconRail';
import { StatusSidebar } from './StatusSidebar';
import { TopBar } from './TopBar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useTransferInfo, useMainData, useAppPreferences } from '@/hooks/use-qbit';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
});

export function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="flex h-full">
          <IconRail active={activePage} onNavigate={setActivePage} />
          <AppContent activePage={activePage} onNavigate={setActivePage} />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function AppContent({ activePage, onNavigate }: { activePage: string; onNavigate: (id: string) => void }) {
  const { data: transferInfo } = useTransferInfo();
  const { data: mainData } = useMainData();
  const { data: preferences } = useAppPreferences();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar title={pageTitles[activePage] ?? activePage} />
      <div className="flex-1 flex min-h-0">
        {/* Left status sidebar */}
        <StatusSidebar
          transferInfo={transferInfo}
          mainData={mainData}
          preferences={preferences}
        />
        {/* Main content */}
        <main className="flex-1 overflow-auto min-w-0">
          <div className="p-5">
            {activePage === 'dashboard' && <Dashboard transferInfo={transferInfo} mainData={mainData} preferences={preferences} />}
            {activePage !== 'dashboard' && <Placeholder title={pageTitles[activePage] ?? activePage} />}
          </div>
        </main>
      </div>
    </div>
  );
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  torrents: 'Torrents',
  search: 'Search',
  rss: 'RSS',
  settings: 'Settings',
};

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full text-text-tertiary">
      <div className="text-center">
        <div className="text-4xl mb-3 opacity-30">🚧</div>
        <div className="text-sm font-medium text-text-secondary">{title}</div>
        <div className="text-xs mt-1 opacity-50">Coming soon</div>
      </div>
    </div>
  );
}
