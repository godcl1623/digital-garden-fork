## What is MindStone?

MindStone is a free open-source alternative solution to [Obsidian Publish](https://obsidian.md/publish)

Here how it look like once published:

![](/images/CleanShot%202022-04-20%20at%2008.34.17%402x.png)

This website include a published version of default Obsidian Help vault, [[Start here]]

**MindStone features:**

- ✅**Drop-in** support for (default) **Obsidian Vault**
- ✅`[[Wiki Link]]` built-in support
- ✅**Folder-base** navigation side bar
- ✅ Backlink support out of the box
- ✅ Interactive Graph view
- ✅**Easy to deploy** to Netlify, Vercel...

## Getting started

### Run on your local machine

Steps to run it on your local machine:

1. Clone this [Github repo](https://github.com/godcl1623/digital-garden-fork)
2. Install [pnpm](https://pnpm.io/) package manager
3. Copy all of your **markdown** file (`.md` only) and folder to `/posts/` **except** `/posts/index.md` file
4. Go to root folder of your project, run `pnpm i && pnpm dev`
5. Open this link in your browser http://localhost:3000/

If you prefer video content have a look at 📺 [walk through video](https://youtu.be/7_SmWA-_Wx8)

### Publish to the internet

Setup environment (with Netlify)

1. Create your Github account and clone [this repository](https://github.com/godcl1623/digital-garden-fork)
2. Create Netlify account and
   follow [this instruction](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)

Your normal workflow for publishing content, after initial setup is:

1. Simply writing your content in Obisidian (or your favourite Markdown editor)
2. Commit your changes and Push it to your Github repo

If you prefer video content, watch 📺 [walk through video](https://youtu.be/n8QDO6l64aw) here

### Deploy Options

#### Option 1: Netlify (Recommended for content-heavy sites)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/your-repo)

#### Option 2: Vercel (For smaller projects)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

#### Option 3: GitHub Pages

[See deployment guide](https://docs.github.com/en/pages/quickstart)

These are just some basic features for MindStone v1, many more are coming (if I find enough of interest and this will
probably a premium/paid option):

- 🎯 Obsidian, Notion, VSCode Plugin
- 🎯 Page Preview (like Obsidian Core plugin)
- 🎯 Andy Sliding pane
- 🎯 Full text search with `Cmd + K`
- 🎯 Infinite canvas for browsing through notes and connections

### Some know issues

This an early version of MindStone, which mean there are bugs and issues. Below are some known issues, that I plan to
work on:

- Image link in wiki link style is not supported yet. `![[Image_link.png]]` will not work yet. see work around below
- Graph view layout and interaction is still very rough. More UI/UX improvements are needed.
- Transclusion is not working yet.
