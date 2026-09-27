# SmartEdu — Vercel setup and inspection

## Findings
The uploaded ZIP contains src/app/page.tsx and src/app/layout.tsx, and all role page folders. No `(2)` duplicate files occur in this ZIP. Original ZIP entries used backslashes; this archive uses standard forward slashes to preserve folders across extraction tools.

The Vercel log says it cannot find an app/pages directory. This means its checked-out build root did not contain the expected app directory. This ZIP has that directory, but the remote repository and Vercel Root Directory have not been inspected directly.

## Changes
- Normalized ZIP paths.
- Changed Next configuration from static export to normal Next.js for Vercel. This supports the existing dynamic [id] review routes, which lack generateStaticParams and cannot use static export as written.
- Removed GitHub Pages base path from Vercel configuration.
- Fixed manifest and Apple icon links to root-relative URLs.
- Preserved application screens and business logic.

## Upload correctly
1. Extract this ZIP into a NEW empty folder. Do not merge with the old folder containing duplicate files.
2. Open the extracted folder containing package.json, src, and public.
3. Open the repository CONNECTED to Vercel: the screenshots show amanbit-01/SmartEdu_MoTa.
4. From the repository root, choose Add file > Upload files. Drag src and public as WHOLE folders, together with the root configuration files and package files. Do not flatten their contents. Do not upload this ZIP as the app source.
5. Confirm GitHub has src/app/page.tsx, src/app/layout.tsx and src/lib/store.ts.
6. Commit changes to main.
7. In Vercel use Next.js preset, repository root as Root Directory when package.json is at repository root, default output directory, and npm run build. Do not use src or src/app as Root Directory.
8. Deploy the LATEST commit. If it fails, copy the final build error lines.

The GitHub workflow now checks the build only. Vercel deploys through its GitHub integration. This configuration does not produce a static out directory for GitHub Pages.

## Local check on Windows PowerShell
npm.cmd ci
npm.cmd run build
npm.cmd start

For development: npm.cmd run dev

## Validation limits
ZIP integrity, folder structure and required source files were checked. npm ci completed and npm run build passed, including TypeScript checks and generation of all listed routes. Browser workflow and actual Vercel deployment were not tested. A successful deployment is still required before claiming the app is live. Offline/PWA behavior has not been certified; data remains local to each browser.
