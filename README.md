# Unifi-Style QB Web GUI

A modern alternative WebUI for qBittorrent with Ubiquiti UniFi-inspired design language.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- TanStack Query (data fetching)
- Recharts (charts)
- Zustand (local state)

## Development

```bash
# Install dependencies (requires NODE_ENV=development for devDependencies)
NODE_ENV=development npm install

# Dev server (proxies /api to qBittorrent at localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment as qBittorrent Alternative WebUI

1. Build the project: `npm run build`
2. Copy `dist/` contents to a folder accessible by qBittorrent (e.g., `/opt/qb-webui/`)
3. In qBittorrent: Settings → WebUI → Enable "Use alternative WebUI"
4. Set Root Folder to the folder containing the built files
5. Restart qBittorrent or refresh browser

## UniFi Design Language

This project mimics Ubiquiti's UniFi Network Controller design system:

- **Dark theme** (default): Background `#0D1117`, cards `#1C2128`
- **Accent blue**: `#1A6AFF`
- **Left sidebar navigation** with collapsible icons
- **Dashboard stat cards** with key metrics
- **Real-time throughput chart** (AreaChart, download/upload)
- **Data tables** with progress bars, monospace fonts for technical data
- **Inter** font family for UI, **JetBrains Mono** for technical data

## API

Uses qBittorrent Web API v2 (`/api/v2/...`) with cookie-based authentication.
