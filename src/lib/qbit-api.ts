import axios, { type AxiosInstance } from 'axios';
import type {
  BuildInfo,
  AppPreferences,
  GlobalTransferInfo,
  TorrentInfo,
  TorrentFile,
  TorrentTracker,
  TorrentPeer,
  SyncMainDataResponse,
  TorrentCategory,
  SearchPlugin,
  SearchResult,
} from '@/types/qbit';

let apiClient: AxiosInstance | null = null;
let lastRid = 0;

export function createApiClient(baseURL = ''): AxiosInstance {
  if (apiClient) return apiClient;

  apiClient = axios.create({
    baseURL: baseURL || `${window.location.protocol}//${window.location.host}`,
    withCredentials: true,
    headers: {
      'Referer': `${window.location.protocol}//${window.location.host}`,
    },
  });

  // Clean up on 401 (session expired)
  apiClient.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        apiClient = null;
      }
      return Promise.reject(err);
    },
  );

  return apiClient;
}

export function getClient(): AxiosInstance {
  if (!apiClient) return createApiClient();
  return apiClient;
}

// ── Auth ──
export async function login(username: string, password: string) {
  const client = getClient();
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  await client.post('/api/v2/auth/login', form);
}

export async function logout() {
  const client = getClient();
  await client.post('/api/v2/auth/logout');
  apiClient = null;
}

// ── App ──
export async function getVersion(): Promise<string> {
  const { data } = await getClient().get<string>('/api/v2/app/version');
  return data;
}

export async function getWebApiVersion(): Promise<string> {
  const { data } = await getClient().get<string>('/api/v2/app/webapiVersion');
  return data;
}

export async function getBuildInfo(): Promise<BuildInfo> {
  const { data } = await getClient().get<BuildInfo>('/api/v2/app/buildInfo');
  return data;
}

export async function getPreferences(): Promise<AppPreferences> {
  const { data } = await getClient().get<AppPreferences>('/api/v2/app/preferences');
  return data;
}

export async function setPreferences(prefs: Partial<AppPreferences>) {
  const form = new URLSearchParams();
  form.append('json', JSON.stringify(prefs));
  await getClient().post('/api/v2/app/setPreferences', form);
}

export async function getDefaultSavePath(): Promise<string> {
  const { data } = await getClient().get<string>('/api/v2/app/defaultSavePath');
  return data;
}

// ── Sync ──
export async function syncMainData(rid = 0): Promise<SyncMainDataResponse> {
  const { data } = await getClient().get<SyncMainDataResponse>('/api/v2/sync/maindata', {
    params: { rid },
  });
  lastRid = data.rid ?? rid;
  return data;
}

// ── Transfer ──
export async function getGlobalTransferInfo(): Promise<GlobalTransferInfo> {
  const { data } = await getClient().get<GlobalTransferInfo>('/api/v2/transfer/info');
  return data;
}

export async function toggleSpeedLimitsMode() {
  await getClient().post('/api/v2/transfer/toggleSpeedLimitsMode');
}

export async function setDownloadLimit(limit: number) {
  const form = new URLSearchParams();
  form.append('limit', String(limit));
  await getClient().post('/api/v2/transfer/setDownloadLimit', form);
}

export async function setUploadLimit(limit: number) {
  const form = new URLSearchParams();
  form.append('limit', String(limit));
  await getClient().post('/api/v2/transfer/setUploadLimit', form);
}

// ── Torrents ──
export async function getTorrents(params?: Record<string, string>): Promise<TorrentInfo[]> {
  const { data } = await getClient().get<TorrentInfo[]>('/api/v2/torrents/info', { params });
  return data;
}

export async function getTorrentFiles(hash: string): Promise<TorrentFile[]> {
  const { data } = await getClient().get<TorrentFile[]>('/api/v2/torrents/files', {
    params: { hash },
  });
  return data;
}

export async function getTorrentTrackers(hash: string): Promise<TorrentTracker[]> {
  const { data } = await getClient().get<TorrentTracker[]>('/api/v2/torrents/trackers', {
    params: { hash },
  });
  return data;
}

export async function getTorrentPeers(hash: string): Promise<TorrentPeer[]> {
  const { data } = await getClient().get<TorrentPeer[]>('/api/v2/torrents/peers', {
    params: { hash },
  });
  return data;
}

export async function pauseTorrents(hashes: string[]) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  await getClient().post('/api/v2/torrents/pause', form);
}

export async function resumeTorrents(hashes: string[]) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  await getClient().post('/api/v2/torrents/resume', form);
}

export async function deleteTorrents(hashes: string[], deleteFiles = false) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  form.append('deleteFiles', String(deleteFiles));
  await getClient().post('/api/v2/torrents/delete', form);
}

export async function recheckTorrents(hashes: string[]) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  await getClient().post('/api/v2/torrents/recheck', form);
}

export async function addTorrent(urls: string, savePath?: string, category?: string) {
  const form = new URLSearchParams();
  form.append('urls', urls);
  if (savePath) form.append('savepath', savePath);
  if (category) form.append('category', category);
  await getClient().post('/api/v2/torrents/add', form);
}

export async function addTorrentFile(file: File, savePath?: string, category?: string) {
  const form = new FormData();
  form.append('torrents', file);
  if (savePath) form.append('savepath', savePath);
  if (category) form.append('category', category);
  await getClient().post('/api/v2/torrents/add', form);
}

export async function setTorrentCategory(hashes: string[], category: string) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  form.append('category', category);
  await getClient().post('/api/v2/torrents/setCategory', form);
}

export async function addTorrentTags(hashes: string[], tags: string) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  form.append('tags', tags);
  await getClient().post('/api/v2/torrents/addTags', form);
}

export async function removeTorrentTags(hashes: string[], tags: string) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  form.append('tags', tags);
  await getClient().post('/api/v2/torrents/removeTags', form);
}

export async function setTorrentLocation(hashes: string[], location: string) {
  const form = new URLSearchParams();
  form.append('hashes', hashes.join('|'));
  form.append('location', location);
  await getClient().post('/api/v2/torrents/setLocation', form);
}

// ── Categories ──
export async function getCategories(): Promise<TorrentCategory> {
  const { data } = await getClient().get<TorrentCategory>('/api/v2/torrents/categories');
  return data;
}

export async function createCategory(name: string, savePath: string) {
  const form = new URLSearchParams();
  form.append('category', name);
  form.append('savePath', savePath);
  await getClient().post('/api/v2/torrents/createCategory', form);
}

// ── Tags ──
export async function getAllTags(): Promise<string[]> {
  const { data } = await getClient().get<string[]>('/api/v2/torrents/tags');
  return data;
}

// ── Search ──
export async function getSearchPlugins(): Promise<SearchPlugin[]> {
  const { data } = await getClient().get<SearchPlugin[]>('/api/v2/search/plugins');
  return data;
}

export async function startSearch(
  pattern: string,
  plugins: string[] = ['all'],
  category = 'all',
): Promise<number> {
  const form = new URLSearchParams();
  form.append('pattern', pattern);
  form.append('plugins', plugins.join('|'));
  form.append('category', category);
  const { data } = await getClient().post<{ id: number }>('/api/v2/search/start', form);
  return data.id;
}

export async function stopSearch(id: number) {
  const form = new URLSearchParams();
  form.append('id', String(id));
  await getClient().post('/api/v2/search/stop', form);
}

export async function getSearchResults(id: number, offset = 0, limit = 50) {
  const { data } = await getClient().get('/api/v2/search/results', {
    params: { id, offset, limit },
  });
  return data;
}

export async function getSearchStatus(id?: number) {
  const { data } = await getClient().get('/api/v2/search/status', {
    params: id ? { id } : {},
  });
  return data;
}

// ── Log ──
export async function getLog(normal = true, info = true, warning = true, critical = true) {
  const { data } = await getClient().get('/api/v2/log/main', {
    params: { normal, info, warning, critical },
  });
  return data;
}
