```md

\# Architecture



\## Overview



The app follows a simple product flow. A user lands on the homepage, enters their AI tool spend, generates an audit, and sees a result page with savings and recommendations. After the value is shown, the user can enter their email to capture the report.



\## System diagram



Homepage → Spend Input Form → Audit Engine → Result Page → Lead Capture Form → Lead API



The AI summary API can use Anthropic if an API key is available. If not, it returns a fallback summary.



\## Data flow



The user enters company name, team size, primary use case, tool name, plan, monthly spend, and seats.



The audit engine takes this data and calculates:



\- Total monthly spend

\- Recommended spend

\- Possible monthly savings

\- Annual savings

\- Per-tool recommendations



The audit result is saved in localStorage and shown on a dynamic result page. The lead capture form is shown after the result, so the user sees value before entering an email.



\## Why I used Next.js



I used Next.js because it supports both frontend pages and backend API routes in one project. This made the MVP easier to build and deploy. TypeScript helped me keep the audit input and output structure clear.



\## Current storage choice



For this MVP, audit results are stored in localStorage. This is simple and works for a demo, but it has a limitation: result links are not truly shareable across devices. In production, I would store audit results in a database.



\## How I would scale it



If this product had to handle 10,000 audits per day, I would:



\- Store audits in Postgres or Supabase

\- Add Redis rate limiting

\- Store public audit data separately from private lead data

\- Queue AI summary generation in background jobs

\- Cache pricing data

\- Add analytics for audit completion and email capture

\- Add structured logs and monitorining

