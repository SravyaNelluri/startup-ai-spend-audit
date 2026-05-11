# StackLeak Audit

StackLeak Audit is a simple AI spend audit tool for startup teams. It helps founders and engineering managers check whether they are overspending on AI tools like Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, OpenAI API, Anthropic API, and Windsurf.

The user enters their team size, use case, AI tools, monthly spend, and number of seats. The app then shows estimated monthly savings, yearly savings, and tool-wise recommendations.

Live URL: ADD_YOUR_DEPLOYED_URL_HERE

## Why I built this

Many small teams start using AI tools quickly, but they do not always review the total monthly spend. A few unused seats or expensive plans can quietly become a recurring cost. This project tries to make that waste visible in a simple way.

## Features

- AI spend input form
- Tool and plan selection
- Monthly spend and seats input
- Savings calculation
- Result page with monthly and annual savings
- Per-tool recommendations
- Lead capture after showing the result
- AI summary fallback API
- 5 tests for the audit engine
- GitHub Actions CI workflow

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vitest
- GitHub Actions
- Optional Supabase
- Optional Resend
- Optional Anthropic API

## Run locally

```bash
npm install
npm run dev