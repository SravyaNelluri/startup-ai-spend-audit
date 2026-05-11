\# Prompts



\## AI Summary Prompt



Write a short personalized AI spend audit summary for a startup founder or engineering manager.



Rules:



\- Use only the audit JSON provided.

\- Do not invent any numbers.

\- Mention monthly savings and annual savings if available.

\- If savings are above $500/month, mention that Credex may help capture more value through discounted AI credits.

\- If savings are below $100/month, be honest and say the stack looks mostly optimized.

\- Keep the tone practical and simple.



\## Why I used this prompt



I did not want AI to calculate savings because money-related calculations should be predictable. The actual savings logic is handled by TypeScript code. AI is only used to make the explanation easier to read.



If the API key is missing or the AI request fails, the app uses a fallback summary. This keeps the user experience working even without the AI service.

