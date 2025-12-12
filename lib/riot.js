// lib/riot.js

const ACCOUNT_REGION = process.env.RIOT_ACCOUNT_REGION || "asia";  // global routing
const VAL_REGION = process.env.RIOT_VAL_REGION || "ap";            // shard routing

const ACCOUNT_BASE = `https://${ACCOUNT_REGION}.api.riotgames.com`;
const VAL_BASE = `https://${VAL_REGION}.api.riotgames.com`;

const KEY = process.env.RIOT_API_KEY;

// ACCOUNT API (puuid lookup)
export async function getAccountByRiotId(name, tag) {
    return riotFetch(`${ACCOUNT_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
}

// VALORANT APIs (matchlist + match details)
export async function getMatchlistByPuuid(puuid, size = 5) {
    return riotFetch(`${VAL_BASE}/val/match/v1/matchlists/by-puuid/${puuid}?start=0&size=${size}`);
}

export async function getMatchById(matchId) {
    return riotFetch(`${VAL_BASE}/val/match/v1/matches/${matchId}`);
}

async function riotFetch(url) {

    // Append key correctly
    const separator = url.includes("?") ? "&" : "?";
    const finalUrl = `${url}${separator}api_key=${KEY}`;

    console.log("Request →", finalUrl);

    const res = await fetch(finalUrl);
    const text = await res.text();

    let json;
    try { json = JSON.parse(text); } catch { json = text; }

    if (!res.ok) {
        throw new Error(`Riot ${res.status}: ${typeof json === "string" ? json : JSON.stringify(json).slice(0, 200)}`);
    }

    return json;
}
