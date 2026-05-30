// qBittorrent Web API v5.x types

export interface LoginResponse {
  cookie: string; // SID cookie value
}

export interface BuildInfo {
  qt: string;
  libtorrent: string;
  boost: string;
  openssl: string;
  bitness: number;
}

export interface AppPreferences {
  locale: string;
  save_path: string;
  temp_path_enabled: boolean;
  temp_path: string;
  dl_limit: number;
  up_limit: number;
  alt_dl_limit: number;
  alt_up_limit: number;
  dht: boolean;
  pex: boolean;
  lsd: boolean;
  encryption: number;
  anonymous_mode: boolean;
  max_active_downloads: number;
  max_active_torrents: number;
  max_active_uploads: number;
  [key: string]: unknown;
}

export type TorrentState =
  | 'error'
  | 'missingFiles'
  | 'uploading'
  | 'pausedUP'
  | 'queuedUP'
  | 'stalledUP'
  | 'checkingUP'
  | 'forcedUP'
  | 'allocating'
  | 'downloading'
  | 'metaDL'
  | 'pausedDL'
  | 'queuedDL'
  | 'stalledDL'
  | 'checkingDL'
  | 'forcedDL'
  | 'checkingResumeData'
  | 'moving'
  | 'unknown';

export interface TorrentInfo {
  added_on: number;
  amount_left: number;
  auto_tmm: boolean;
  availability: number;
  category: string;
  completed: number;
  completion_on: number;
  content_path: string;
  dl_limit: number;
  dlspeed: number;
  downloaded: number;
  downloaded_session: number;
  eta: number;
  f_l_piece_prio: boolean;
  force_start: boolean;
  hash: string;
  last_activity: number;
  magnet_uri: string;
  max_ratio: number;
  max_seeding_time: number;
  name: string;
  num_complete: number;
  num_incomplete: number;
  num_leechs: number;
  num_seeds: number;
  priority: number;
  progress: number;
  ratio: number;
  ratio_limit: number;
  save_path: string;
  seeding_time: number;
  seeding_time_limit: number;
  seen_complete: number;
  seq_dl: boolean;
  size: number;
  state: TorrentState;
  super_seeding: boolean;
  tags: string;
  time_active: number;
  total_size: number;
  tracker: string;
  up_limit: number;
  uploaded: number;
  uploaded_session: number;
  upspeed: number;
}

export interface TorrentFile {
  index: number;
  name: string;
  size: number;
  progress: number;
  priority: number;
  is_seed: boolean | null;
  piece_range: [number, number];
  availability: number;
}

export interface TorrentTracker {
  url: string;
  status: number;
  tier: number;
  num_peers: number;
  num_seeds: number;
  num_leeches: number;
  num_downloaded: number;
  msg: string;
}

export interface TorrentPeer {
  ip: string;
  port: number;
  country: string;
  country_code: string;
  client: string;
  progress: number;
  dl_speed: number;
  up_speed: number;
  downloaded: number;
  uploaded: number;
  connection: string;
  flags: string;
  relevance: number;
  files: string;
}

export interface GlobalTransferInfo {
  dl_info_speed: number;
  dl_info_data: number;
  up_info_speed: number;
  up_info_data: number;
  dl_rate_limit: number;
  up_rate_limit: number;
  dht_nodes: number;
  connection_status: 'connected' | 'firewalled' | 'disconnected';
}

export interface SyncMainDataResponse {
  rid: number;
  full_update?: boolean;
  torrents?: Record<string, TorrentInfo>;
  torrents_removed?: string[];
  categories?: Record<string, { name: string; savePath: string }>;
  tags?: string[];
  server_state?: ServerState;
}

export interface ServerState {
  alltime_dl: number;
  alltime_ul: number;
  average_time_queue: number;
  connection_status: 'connected' | 'firewalled' | 'disconnected';
  dht_nodes: number;
  dl_info_data: number;
  dl_info_speed: number;
  dl_rate_limit: number;
  free_space_on_disk: number;
  global_ratio: string;
  queued_io_jobs: number;
  queueing: boolean;
  read_cache_hits: string;
  read_cache_overload: string;
  refresh_interval: number;
  total_buffers_size: number;
  total_peer_connections: number;
  total_queued_size: number;
  total_wasted_session: number;
  up_info_data: number;
  up_info_speed: number;
  up_rate_limit: number;
  use_alt_speed_limits: boolean;
  use_subcategories: boolean;
}

export type TorrentCategory = Record<string, { name: string; savePath: string }>;

export interface SearchPlugin {
  name: string;
  version: string;
  enabled: boolean;
  url: string;
}

export interface SearchResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  nbSeeders: number;
  nbLeechers: number;
  siteUrl: string;
  descrLink: string;
  site_name: string;
}
