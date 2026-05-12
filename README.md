# WebCode Studio

VS Code + Figma in your browser — Code editor, design panel, GitHub sync, and Vercel deploy.

---

## Stack

- **React 18** + Vite
- **Monaco Editor** — VS Code editor engine
- **Design Panel** — Figma-like drag & drop canvas
- **Zustand** — state management
- **Tailwind CSS** — styling
- **GitHub OAuth** — authentication & file sync
- **Vercel Serverless Functions** — OAuth callback
- **react-resizable-panels** — resizable layout

---

## Step-by-step: Deploy to Vercel

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/webcode-studio.git
cd webcode-studio
npm install
```

### Step 2 — Create a GitHub OAuth App

1. Go to **https://github.com/settings/developers**
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `WebCode Studio`
   - **Homepage URL**: `https://your-app.vercel.app` (use `http://localhost:5173` for dev)
   - **Authorization callback URL**: `https://your-app.vercel.app/api/github-oauth`
     - For dev: `http://localhost:5173/api/github-oauth`
4. Click **"Register application"**
5. Copy your **Client ID** and generate a **Client Secret**

### Step 3 — Set up environment variables locally

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
VITE_APP_URL=http://localhost:5173
```

### Step 4 — Test locally

```bash
npm run dev
```

Open http://localhost:5173 — you should see the login page.

> **Note**: GitHub OAuth won't work fully in local dev without Vercel CLI.
> Install Vercel CLI to run serverless functions locally:
> ```bash
> npm i -g vercel
> vercel dev
> ```
> Then use http://localhost:3000 instead.

### Step 5 — Push to GitHub

```bash
git init   # if not already a git repo
git add .
git commit -m "Initial commit — WebCode Studio"
git remote add origin https://github.com/YOUR_USERNAME/webcode-studio.git
git push -u origin main
```

### Step 6 — Deploy to Vercel

#### Option A — Vercel Dashboard (easiest)

1. Go to **https://vercel.com/new**
2. Import your GitHub repository
3. Vercel auto-detects Vite — keep default settings
4. Click **"Environment Variables"** and add:
   | Name | Value |
   |------|-------|
   | `VITE_GITHUB_CLIENT_ID` | your GitHub OAuth Client ID |
   | `GITHUB_CLIENT_SECRET` | your GitHub OAuth Client Secret |
   | `VITE_APP_URL` | `https://your-app.vercel.app` |
5. Click **"Deploy"**

#### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel

# Follow prompts, then add env vars:
vercel env add VITE_GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add VITE_APP_URL

# Redeploy with env vars
vercel --prod
```

### Step 7 — Update GitHub OAuth App URLs

After deploy, go back to your GitHub OAuth App settings:
- **Homepage URL**: `https://your-app.vercel.app`
- **Callback URL**: `https://your-app.vercel.app/api/github-oauth`

### Step 8 — Done! ✅

Visit your Vercel URL and log in with GitHub.

---

## Local Development

```bash
npm run dev        # Start Vite dev server
vercel dev         # Start with serverless functions (for OAuth)
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Project Structure

```
webcode-studio/
├── api/
│   └── github-oauth.js      # Vercel serverless — OAuth handler
├── src/
│   ├── components/
│   │   ├── TitleBar.jsx
│   │   ├── ActivityBar.jsx
│   │   ├── Sidebar.jsx       # File explorer + GitHub repo browser
│   │   ├── EditorTabs.jsx
│   │   ├── MonacoEditor.jsx  # Monaco (VS Code engine)
│   │   ├── DesignPanel.jsx   # Figma-like canvas
│   │   ├── PropertiesPanel.jsx
│   │   ├── TerminalPanel.jsx
│   │   └── StatusBar.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── EditorPage.jsx    # Main layout
│   │   └── AuthCallback.jsx
│   ├── store/
│   │   └── useStore.js       # Zustand global state
│   ├── utils/
│   │   └── github.js         # GitHub API helpers
│   └── styles/
│       └── index.css
├── .env.example
├── vercel.json
├── vite.config.js
└── tailwind.config.js
```

---

## Features

| Feature | Status |
|---------|--------|
| Monaco Editor (VS Code engine) | ✅ |
| Syntax highlighting (20+ languages) | ✅ |
| Multiple tabs | ✅ |
| File explorer | ✅ |
| Design panel (drag & drop) | ✅ |
| Properties panel (Figma-like) | ✅ |
| Export design → React code | ✅ |
| Terminal (simulated) | ✅ |
| GitHub OAuth login | ✅ |
| Browse GitHub repos | ✅ |
| Read/write files to GitHub | ✅ |
| Vercel deploy | ✅ |
| Resizable panels | ✅ |
| Code/Split/Design modes | ✅ |
