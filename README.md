# ahmed.dev

Personal portfolio for Ahmed Abdelnaby. React 19, TypeScript and Vite, styled with plain CSS.

## Develop

```bash
npm install
npm run dev
```

All copy lives in `src/data.ts`. Each joke has a `serious` twin that shows in Recruiter Mode.

## Deploy (Vercel)

`vercel.json` is already set up (Vite preset, `dist` output, long-cache headers for hashed assets, basic security headers).

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. Settings are picked up from `vercel.json`, so just hit **Deploy**.
3. Optional: under **Settings → Domains**, point `ahmed-portfolio-beta.vercel.app` or a custom domain at it.

Or from the terminal: `npx vercel` (preview) and `npx vercel --prod`.
