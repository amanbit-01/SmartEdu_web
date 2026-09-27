# SmartEdu — Vercel version

Read [VERCEL_SETUP.md](VERCEL_SETUP.md) for upload and deployment instructions.

Production build verified with `npm run build`. No public demo URL has been verified yet. After successful Vercel deployment, add the actual production URL here.

Windows PowerShell local setup:
```powershell
npm.cmd ci
npm.cmd run dev
```

For production preview: `npm.cmd run build`, then `npm.cmd start`.

This is a dummy-login prototype with browser-local data. Data does not sync across team devices. Offline/PWA functionality needs separate browser testing.
