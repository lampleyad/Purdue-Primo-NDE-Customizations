# ILLiad My Account Integration

Two components live here, offering two levels of ILLiad integration for the
My Library Account overview section:

1. **`IllQuickLinksComponent`** (`ill-quick-links.component.ts`) — **currently
   wired**. Parity with Purdue's legacy AngularJS `prmLoansOverviewAfter`
   component: three static links out to ILLiad's own hosted pages
   (`purdue.illiad.oclc.org/illiad/illiad.dll?Action=10&Form=...`). No API
   calls, no API key, no server-side proxy — ILLiad handles patron auth and
   rendering itself once they click through.
2. **`IllLoansOverviewComponent`** — **built but not wired**. NDE port of
   [lampleyad/Ex-Libris-NDE-ILLiad-My-Account-Integration](https://github.com/lampleyad/Ex-Libris-NDE-ILLiad-My-Account-Integration)
   (based on [primo-explore-my-ill](https://github.com/alliance-pcsg/primo-explore-my-ill)),
   which fetches the patron's pending requests and delivered articles via
   the ILLiad Web Platform API and renders them inline in Primo. This
   requires a server-side API key, so it needs the PHP proxy in
   `server/illiad.php` deployed before it can be wired in — see below.

## Wiring

- `IllQuickLinksComponent` is mapped to the `nde-account-overview-after`
  selector in `src/app/custom1-module/customComponentMappings.ts`.
- To switch to (or add) `IllLoansOverviewComponent`, import it in
  `customComponentMappings.ts` and add/replace the mapping entry — see the
  commented-out note left in that file.
- `IllLoansOverviewComponent` requires `provideHttpClient()` in
  `src/app/app.module.ts` (already provided for the
  [HathiTrust component](../hathi-trust/README.md)) and the `jwt-decode`
  npm package (already installed) — used by `IllUserService`
  (`src/app/services/ill-user-service.ts`) to read the patron's
  username/group from the `primoExploreJwt` session token.

## Configuring IllLoansOverviewComponent

Edit `src/app/ill/illiad-options.constant.ts`:

|Option|Type|Description|
|------|----|-----------|
|`groups`|string[]|Alma user group codes permitted to see the ILL pane (e.g. `'ALUM'`, `'UNDGRDUR'`). Empty by default — **the pane is hidden for everyone until this is filled in.**|
|`remoteScript`|string|URL of the deployed PHP proxy (see below).|
|`boxTitle`|string|Pane heading. Defaults to "Interlibrary Loan".|
|`illiadURL`|string|Purdue's ILLiad OPAC URL: `https://purdue.illiad.oclc.org/illiad/illiad.dll`.|

## PHP proxy (`server/illiad.php`)

The ILLiad Web Platform API requires a server-side API key that must never
be exposed to the browser, so requests are relayed through a small PHP
script. **This is not part of the Angular build** — `src/app/ill/server/`
is reference-only. To deploy:

1. Copy `server/illiad.php` and `server/htaccess.example` to a PHP-capable
   web server you control (rename `htaccess.example` to `.htaccess`).
2. In `illiad.php`, fill in:
   - `$whitelist` — the domains allowed to call the proxy (include
     `localhost:4201` for local dev via `useLocalCustomPackage=true`, and
     Purdue's production Primo domain).
   - `$key` — Purdue's [ILLiad Web Platform API key](https://prometheus.atlas-sys.com/display/illiad/The+ILLiad+Web+Platform+API).
   - `$illiadDomain` is already set to `purdue.illiad.oclc.org`.
3. In `.htaccess`, update the `RewriteCond` referer check to Purdue's
   production Primo/Alma domain.
4. Point `remoteScript` in `illiad-options.constant.ts` at the deployed
   script's URL.
5. Wire `IllLoansOverviewComponent` into `customComponentMappings.ts`
   (in place of, or alongside, `IllQuickLinksComponent`).

## Notes

- `ill-user.component.ts` is carried over from the upstream repo but is not
  referenced by any selector mapping — patron identity is read via
  `IllUserService` instead. It's kept for parity with upstream; safe to
  delete if unused.
