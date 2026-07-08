# Soma Health 

A personal AI health dashboard built with React, TypeScript, and Gemini AI. Track your daily health metrics, visualize weekly trends, and get personalized health advice powered by Google Gemini.

## Screenshots

### Dashboard — Today's Metrics & 7-Day Averages
![Dashboard](Screenshot%202026-07-05%20191502.png)

### Charts — Interactive Health Trends
![Charts](Screenshot%202026-07-05%20191520.png)

### 3D Body Scanner — Click to Log Health Data
![3D Body Scanner](Screenshot%202026-07-05%20191533.png)

---

## Features

### 📊 Dashboard
- Today's health metrics at a glance — steps, heart rate, sleep, water intake, and calories
- Progress bars showing how close you are to your daily goals
- 7-day averages for every metric
- Clean dark UI with color-coded metric cards 

### 📈 Charts
- Interactive area chart for any metric — steps, heart rate, sleep, water, calories
- Switch between metrics with one click
- Mini trend charts for all metrics shown simultaneously
- Smooth animations and gradient fills

### 📝 Log Today
- Simple form to log today's health data
- Data saved to localStorage — persists across sessions
- Color-coded input fields for each metric
- Instant save confirmation

### 🤖 AI Insights
- Sends your health data to Google Gemini AI
- Returns a personalised health report including:
  - Overall health score out of 10
  - Top 3 things going well
  - Top 3 areas to improve with specific tips
  - A personalised weekly challenge
- Powered by Gemini 2.0 Flash

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Google Gemini API |
| Styling | CSS Variables + Inline styles |
| Storage | localStorage |

---

## How to Run Locally

**Prerequisites:** Node.js, Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

```bash
# 1. Clone the repo
git clone https://github.com/SANKETHEGADE/soma-health.git
cd soma-health

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
# Create a file called .env.local in the root folder:
# VITE_GEMINI_API_KEY=your_key_here

# 4. Start the app
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
soma-health/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx     # Today's metrics + 7-day averages
│   │   ├── MetricCard.tsx    # Reusable metric card with progress bar
│   │   ├── HealthChart.tsx   # Interactive area + line charts
│   │   ├── LogHealth.tsx     # Daily health data entry form
│   │   └── AIInsights.tsx    # Gemini AI health analysis
│   ├── App.tsx               # Main app + sidebar navigation
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles + CSS variables
├── .env.local                # Your Gemini API key (not committed)
├── index.html
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the root folder:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key at [aistudio.google.com](https://aistudio.google.com)

---

## What makes this different

- No backend needed — fully runs in the browser
- AI health coaching using Gemini — not just charts
- Data persists locally — no account or database required
- Clean, modern dark UI built from scratch
