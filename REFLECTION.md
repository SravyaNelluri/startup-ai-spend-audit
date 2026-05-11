\# Reflection



\## 1. The hardest bug I hit this week, and how I debugged it



The hardest bug was the audit result flow. At one point, I thought the Generate Audit button was not working because it looked like the app was staying on the same page. I checked the terminal logs and saw that the audit request returned successfully and the result route also loaded successfully.



That made me realize the issue was not just the button. After checking the behavior more carefully, I found that the result route was loading but the wrong UI was being shown. I fixed the result page so that `/result/\[id]` displayed the actual audit result instead of looking like the homepage.



\## 2. A decision I reversed mid-week, and what made me reverse it



Initially, I wanted the homepage to call the audit API route for generating the result. When I saw fetch-related issues, I considered moving the calculation directly into the homepage. Later, after debugging, I understood that the API route was not the only issue and the result page rendering also needed to be fixed.



This made me think more carefully about the flow. I kept the backend route for the assignment structure, but also focused on making the user flow stable.



\## 3. What I would build in week 2 if I had it



In week 2, I would store audit results in a database so result URLs work across different devices. I would also add PDF export, invoice upload, real pricing sync, and an admin dashboard for Credex.



The dashboard would help Credex see which leads have the highest savings potential and follow up with the right users.



\## 4. How I used AI tools



I used AI tools to understand the assignment, plan the project structure, debug errors, and draft documentation. I did not rely on AI to calculate final savings. The savings logic is written in TypeScript so the output is controlled and predictable.



AI helped me move faster, but I still had to test the project, fix errors, and understand what each file was doing.



\## 5. Self-rating



\*\*Discipline:\*\* 8/10  

I worked across multiple days and kept making progress.



\*\*Code quality:\*\* 7/10  

The main flow works, but database-backed result pages would make it stronger.



\*\*Design sense:\*\* 7/10  

The UI is clean and understandable.



\*\*Problem-solving:\*\* 8/10  

I debugged Git issues, package errors, test errors, GitHub Actions errors, and result-page rendering problems.



\*\*Entrepreneurial thinking:\*\* 7/10  

The product has a clear lead-generation purpose, but real user interviews should still improve it.

