# MedIQ lavender UI redesign

Integration branch: `feat/lavender-ui-redesign`.

The existing working application was preserved first in commit `52d749a` on local branch `checkpoint/mediq-functional-baseline`. The redesign is a separate commit on top of that baseline. No production deployment or merge into main is part of this work.

## Implemented workstreams

1. **Design system:** canonical white/lavender/purple tokens in `frontend/src/styles/theme.css`, legacy alias compatibility, Inter typography, consistent controls/surfaces/focus states, semantic text companions, and reduced-motion defaults. Replaced the old continuously animated particle canvas with a quiet decorative surface.
2. **Homepage and navigation:** new responsive landing composition, shared public navigation/footer, role-aware workspace shells, mobile drawers, consistent branding and page headers.
3. **Dashboards and operations:** white-card admin/vendor/customer dashboards, violet chart accents, responsive statistics, tables, toolbars, settings and module pages.
4. **Medicine data screens:** redesigned catalog/filter rail/product cards/details/favorites. Existing API requests, search, pagination, currency conversion and synthetic-data restrictions remain. Mobile filters support keyboard dismissal and focus management.
5. **Chatbot:** lavender assistant bubbles, violet user bubbles, typing state, responsive conversation panel, keyboard trap/Escape/focus restoration and live announcements. Existing Groq-backed API and history calls remain.
6. **Authentication and secondary screens:** responsive login/signup/onboarding, profile, cart, checkout, payment, orders, support, legal, and shared account controls. Admin sign-in query parameters and form validation remain intact.
7. **QA:** production build, existing backend/data/chat tests, responsive browser checks and automated accessibility audit. Exact tested routes/results and remaining limitations are documented in `ui-redesign-qa.md`.

Implementation was split across six agents plus the root design-system/integration owner with exclusive file ownership; all changes were integrated on the shared branch without discarding existing work.

## Palette and accessibility

Mandatory tokens retain the requested exact values: white `#FFFFFF`, lavender surface `#F5F3FF`, primary `#7C3AED`, hover `#6D28D9`, lavender `#DDD6FE`, orchid `#E9D5FF`, text `#1F2937`, muted `#64748B`, border `#E9E5F2`, success `#0D9488`, warning `#D97706`, error `#DC2626`.

The exact muted color has insufficient contrast for small text on lavender (4.33:1), so tinted surfaces use companion `#536279`. Semantic text similarly uses darker success/warning companions; original semantic tokens remain available for icons/surfaces. Labels, icon-only navigation names, focus rings and reduced-motion behavior were checked during integration.

## Preserved behavior

- Neon-backed catalog and the 80 clearly labeled read-only demo medicines.
- Actual medicine search, pagination, pricing/currency conversion and detail navigation.
- Authentication/role guards, admin sign-in, customer/vendor workspaces.
- Existing database and backend APIs, Groq chatbot, dataset import isolation.
- Existing checkout/cart guards: synthetic medicines do not become purchasable.

Backend files are unchanged relative to the checkpoint commit. The checkpoint includes the previously implemented backend/account/chat/dataset functionality so that branch checkout retains the working app.

## Checks

From `frontend/`: `npm run build`.

From repository root: `node --test backend/test/*.test.cjs` and, from backend, `npm run test:pricing`.

The frontend package does not define lint or TypeScript-check scripts, so those are not claimed as executed. Browser checks use intercepted authentication/data fixtures for protected routes, plus read-only calls to the deployed demo catalog. No real checkout, payment or new user account is created for UI testing.
