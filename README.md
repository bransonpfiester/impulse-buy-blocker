# Impulse Buy Blocker

A simple web app that helps you avoid impulse purchases by enforcing a 48-hour waiting period.

## Features

- 📸 Add items with name, price, and optional image
- ⏰ 48-hour countdown timer for each item
- 💰 Track total money saved from avoided purchases
- 📊 View items in "Waiting Period" and "Money Saved" categories
- 💾 All data stored locally (no backend needed)
- 📱 Fully responsive design

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- localStorage for persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## How It Works

1. Add an item you want to buy
2. Wait 48 hours (the timer counts down)
3. After 48 hours, decide: "Buy it" or "I don't need it"
4. Choosing "I don't need it" adds the price to your savings total!

## License

Free to use and modify.
