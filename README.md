# 🎂 Birthday Quiz!

A fun, kids-themed birthday quiz website. Pure static — HTML + CSS + vanilla JavaScript.
No framework, no build step, no dependencies.

## How it works

- 10 questions, each with two options: **A** (soft orange) and **B** (light green).
- Answer correctly → fun transition to the next question. 🎉
- Answer wrong → **back to question 1!** 😅
- Get all 10 right → celebration with confetti and a cartoon kid in a party hat holding a birthday cake. 🥳

## Run locally

Option 1 — just open the file:

```bash
open index.html
```

Option 2 — serve it (recommended):

```bash
npx serve -l 3000 .
# → http://localhost:3000

# or with Python
python3 -m http.server 3000
```

## Edit the questions

All questions live in [questions.js](questions.js) — one array, each entry:

```js
{ text: 'Question?', optionA: 'Answer A', optionB: 'Answer B', correct: 'A' }
```

Change text or `correct` ('A' or 'B'); no other file needs touching.

## Deploy to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `birthday`).
2. Push this folder:

   ```bash
   git remote add origin git@github.com:<your-username>/birthday.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick branch `main`, folder `/ (root)`, save.
4. Wait ~1 minute — site is live at `https://<your-username>.github.io/birthday/`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | All screens: start, quiz, oops overlay, celebration (incl. inline SVG character) |
| `style.css` | Kids birthday theme, layout, responsive rules, all animations |
| `questions.js` | The 10 questions (data only) |
| `script.js` | Quiz engine: rendering, answer checking, transitions, confetti, sounds |
