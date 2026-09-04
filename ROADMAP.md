# DealLink — Roadmap to Production

Status: pre-launch. Stack: Next.js 14 (App Router) + Tailwind v4 + framer-motion + Auth.js v5 + MongoDB (mongoose) + Nodemailer (Google SMTP).

## ✅ Already shipped
- Design system: navy/blue/cyan identity, light + dark mode, niche accent palette
- Cinematic continuous-scroll landing (connection animation, pinned story beats, parallax)
- Landing polish: preloader, cursor glow, aurora canvas, scroll progress, magnetic CTAs
- Auth: Auth.js v5 (Credentials + Google), MongoDB User model, email verification, password reset, branded SMTP templates
- Auth experience: 3-step signup wizard, password strength meter, morphing submit buttons, error shake, parallax backgrounds, success burst
- Admin portal (legacy design, passcode-gated), seed script

> Note: development can continue with placeholder env values — landing and UI work fine;
> only real auth/db flows need the credentials, verified in Phase 6.

---

## Phase 1 — Business side (P1: the chosen "Apply → Approve → Invite" flow)
1. **BusinessApplication model** — company, website, contact, budget range, goals, timeline, `status: pending | approved | rejected`
2. **/business/apply page** — richer application form (upgrade from the lead form), designed like the signup experience
3. **Admin approval** — approve/reject applications in the admin portal
4. **Invite email** — on approval: branded email with magic link to set a password
5. **Business auth** — invite/set-password flow, `role` on the User model (creator | business | admin), session carries role
6. **Business dashboard** (redesigned) — browse the live marketplace, submit campaign briefs, track request status
7. **CampaignBrief model** — product, niche targets, audience size range, budget, deliverables, status

## Phase 2 — Creator side (P1)
1. **Creator dashboard redesign** — new design system: overview stats, profile editor, matches inbox, deals, notifications
2. **Live marketplace** — `/marketplace` backed by Mongo (search, niche filters, sort, pagination), replacing the static preview
3. **Public creator profiles** — `/creators/[id]` with channel, stats, bio, contact request
4. **Matching inbox** — briefs routed to creators whose niche/audience fits; accept / decline

## Phase 3 — Deal pipeline (P2: the actual product)
1. **Deal model** — statuses: `proposed → negotiating → active → completed → paid`, deal value, deliverables, timeline
2. **Offer flow** — business sends offer → creator accepts/counters (v1: accept/decline only)
3. **Payouts** — track owed/paid per deal (manual payment v1; Stripe Connect as v2)
4. **Email notifications** — match alerts, offer received, deal status changes

## Phase 4 — Admin & ops (P2)
1. **Admin portal redesign** — new design system; manage creators, businesses, applications, briefs, deals in one place
2. Admin: approve creators (optional curation tier), flag/report, search/export
3. Security pass — rate-limit auth + form endpoints, input validation, session hardening, secrets audit

## Phase 5 — Polish, performance, trust (P2)
1. Loading skeletons + empty/error states everywhere
2. SEO — metadata + OG images, sitemap, robots.txt
3. Legal pages — Privacy Policy, Terms of Service
4. Email deliverability — SPF/DKIM check, reply-to handling
5. Analytics events on key funnels (register, verify, apply, deal)
6. Performance — Lighthouse pass, image optimization, bundle trimming
7. Accessibility — contrast, focus states, aria labels, keyboard nav
8. Tests — Playwright smoke tests: signup, login, application, marketplace browse

## Phase 6 — Connect the backend (P1, last before deploy)
1. Fill `.env.local` (and Vercel env):
   - `MONGODB_URI`, `AUTH_SECRET` (`openssl rand -base64 32`)
   - `SMTP_USER` / `SMTP_PASS` (Gmail App Password)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
2. `npm run seed` — load demo creators + lead
3. Verify the full loop by hand: register → verify email → login → logout → forgot/reset → Google sign-in
4. Fix anything that breaks (rate limiting on auth endpoints, error handling)

## Phase 7 — Launch
1. Deploy to Vercel (env vars, custom domain)
2. Monitoring + error tracking (Sentry or Vercel logs), Mongo Atlas backups
3. Launch checklist: final copy pass, support mailbox, social links
4. Post-launch: analytics review, conversion tuning, next feature cycle

---

## Priority summary
| Phase | What | Priority |
|---|---|---|
| 1 | Business apply/approve/invite + dashboards | P1 |
| 2 | Creator dashboard + live marketplace + profiles | P1 |
| 3 | Deal pipeline + payouts + notifications | P2 |
| 4 | Admin redesign + security | P2 |
| 5 | Polish, SEO, performance, tests | P2 |
| 6 | Env + seed + verify auth loop | P1 (last, pre-deploy) |
| 7 | Vercel launch + monitoring | P1 (final) |

**Next action:** Phase 1 — the business Apply → Approve → Invite → Dashboard flow.
