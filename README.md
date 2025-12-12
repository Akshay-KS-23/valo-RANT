# Valorant Roast Prototype 🔥  
A fun web application that fetches a player’s Valorant statistics and generates personalized “roasts” based on their performance.  
Built using **Next.js**, **Node.js**, and the **Riot Games API**.

This project is currently a functional prototype and is being developed as part of a request for Riot API access for Valorant Match endpoints.

---

## 🚀 Features (Prototype Stage)

### ✔️ Enter a Riot ID (Name#Tag)  
The app uses the global **Account-V1** endpoint to convert Riot ID → PUUID.

### ✔️ Secure Backend API (Next.js Route Handler)  
All Riot API calls happen **server-side**, ensuring the API key is never exposed.

### ✔️ Roast Generator  
Based on available stats (or mock stats), the app produces fun, rule-based roast lines.

### ✔️ Riot Match API Integration (Pending Approval)  
The app is structured to fetch:
- Recent match history  
- Match details  
- KDA, ACS, winrate, clutches, agent usage  
- And more  

Match data is temporarily mocked until Riot grants access.

---

## 🛠️ Tech Stack

- **Next.js 14+ (App Router)**
- **React**
- **Node.js**
- **Riot Games API**
- **Serverless API Routes**
- **TailwindCSS** (planned)

---

## 🔒 Environment Variables

Your `.env.local` file should look like:

```env
RIOT_API_KEY=RGAPI-your-key-here

# Global routing for Account-V1 API
RIOT_ACCOUNT_REGION=asia

# Shard routing for Valorant Match APIs
RIOT_VAL_REGION=ap

MATCH_FETCH_COUNT=5
