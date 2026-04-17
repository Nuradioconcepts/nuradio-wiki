# nuradio atlas

A technical reference wiki for 5G NR, O-RAN, and Computer Systems — built with [Docusaurus](https://docusaurus.io/).

The site includes interactive glossary tables, procedure breakdowns, and reference documentation covering:

- **5G NR** — UE, NG-RAN, 5G Core, and end-to-end system procedures
- **O-RAN** — architecture, interfaces, and working group reference
- **Computer Systems** — CPU, memory, networking, virtualization, and Linux fundamentals

---

## Prerequisites

Before you can run this site locally, you need two things installed on your computer:

### 1. Node.js (version 20 or higher)

Node.js is the runtime that powers the development server and build tools.

**Download:** https://nodejs.org/en/download

- Choose the **LTS** (Long Term Support) version
- Run the installer and follow the prompts
- To verify it installed correctly, open your terminal and run:
  ```
  node --version
  ```
  You should see something like `v22.9.0`

### 2. Git

Git is the version control tool used to download the code and track changes.

**Download:** https://git-scm.com/downloads

- Choose your operating system and follow the installer
- To verify it installed correctly, open your terminal and run:
  ```
  git --version
  ```
  You should see something like `git version 2.44.0`

> **What is a terminal?**
> - **Mac:** Open Spotlight (⌘ + Space), type `Terminal`, press Enter
> - **Windows:** Press the Windows key, type `cmd` or `PowerShell`, press Enter

---

## Getting the Code

### Step 1 — Clone the repository

"Cloning" downloads a full copy of the project to your computer. Run this in your terminal:

```bash
git clone https://github.com/Nuradioconcepts/nuradio-wiki.git
```

Replace `YOUR_USERNAME` with the GitHub username where this repo lives.

### Step 2 — Move into the project folder

```bash
cd nuradio-wiki
```

### Step 3 — Install dependencies

This downloads all the packages the project needs to run. You only need to do this once (and again any time new packages are added):

```bash
npm install
```

---

## Running the Site Locally

Start the development server:

```bash
npm start
```

This will:
1. Compile the site
2. Open it in your browser at `http://localhost:3000`
3. Automatically reload whenever you save a file

To stop the server, press `Ctrl + C` in your terminal.

---

## Building for Production

To generate a fully static version of the site (what gets deployed):

```bash
npm run build
```

The output goes into the `build/` folder. To preview the production build locally:

```bash
npm run serve
```

---

## Project Structure

```
nuradio-wiki-v2/
├── docs/                   # All wiki content (Markdown / MDX files)
│   ├── 5g-nr/              # 5G NR documentation
│   │   └── procedures/     # UE, NG-RAN, 5G Core, System procedures
│   ├── glossary/           # Glossary pages (5G NR, O-RAN, Computer Systems)
│   └── ...
├── src/
│   ├── components/         # Custom React components (tables, badges, etc.)
│   └── css/custom.css      # Global styles
├── static/                 # Static assets (images, fonts)
├── plugins/                # Custom Docusaurus plugins
│   └── recent-changes.js   # Auto-generates the "recent changes" feed
├── docusaurus.config.js    # Site configuration (title, navbar, footer)
├── sidebars.js             # Sidebar navigation structure
└── package.json            # Project dependencies and scripts
```

---

## Making Changes

All content lives in the `docs/` folder as `.md` or `.mdx` files. You can edit them in any text editor — [VS Code](https://code.visualstudio.com/) is recommended.

### Adding a new page

1. Create a new `.mdx` file in the appropriate `docs/` subfolder
2. Add a frontmatter block at the top:
   ```markdown
   ---
   title: My New Page
   description: What this page covers.
   ---
   ```
3. Add it to `sidebars.js` so it appears in the navigation

### Editing an existing page

Just open the file in a text editor and save — the dev server will reload automatically.

---

## Collaborating with Git

### Before you start working — pull latest changes

Always grab the latest version from GitHub before editing:

```bash
git pull
```

### After making changes — save and push

1. **Stage your changes** (tell Git which files to include):
   ```bash
   git add .
   ```

2. **Commit** (save a snapshot with a description):
   ```bash
   git commit -m "Brief description of what you changed"
   ```

3. **Push** (upload to GitHub):
   ```bash
   git push
   ```

### If someone else pushed changes while you were working

Run this to merge their changes with yours:

```bash
git pull
```

If there are conflicts (you and someone else edited the same line), Git will mark them in the file. Open the file, resolve the conflict, then commit again.

---

## Deploying to GitHub Pages

This site can be deployed for free using GitHub Pages.

### One-time setup

In `docusaurus.config.js`, make sure these fields match your GitHub account:

```js
url: 'https://Nuradioconcepts.github.io',
baseUrl: '/nuradio-wiki/',
organizationName: 'Nuradioconcepts',
projectName: 'nuradio-wiki',
```

### Deploy

```bash
GIT_USER=YOUR_USERNAME npm run deploy
```

This builds the site and pushes it to the `gh-pages` branch automatically.

---

## Common Commands Reference

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies (run once after cloning) |
| `npm start` | Start local dev server at localhost:3000 |
| `npm run build` | Build static site for production |
| `npm run serve` | Preview the production build locally |
| `git pull` | Download latest changes from GitHub |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Save a snapshot of your changes |
| `git push` | Upload your commits to GitHub |

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | ≥ 20 | JavaScript runtime |
| [Docusaurus](https://docusaurus.io) | 3.9.2 | Static site framework |
| [React](https://react.dev) | 19 | UI components |
| [MDX](https://mdxjs.com) | 3 | Markdown + JSX for interactive docs |
