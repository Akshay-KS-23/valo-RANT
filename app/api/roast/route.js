// This endpoint runs on the server (safe) and returns stats + roast.
import { getAccountByRiotId, getMatchlistByPuuid, getMatchById } from "@/lib/riot";
import { generateRoastFromStats } from "@/lib/roastEngine";

export async function POST(req) {
  try {
    const body = await req.json();
    const { riotId } = body;
    if (!riotId || !riotId.includes("#")) return new Response(JSON.stringify({ error: "Enter Riot ID as Name#TAG" }), { status: 400 });
    const [name, tag] = riotId.split("#");

    const account = await getAccountByRiotId(name, tag);
    const puuid = account?.puuid;
    if (!puuid) throw new Error("PUUID not found for that Riot ID.");

    const size = parseInt(process.env.MATCH_FETCH_COUNT || "5", 10);
    const matchlist = await getMatchlistByPuuid(puuid, size);
    const matchIds = (matchlist.history || []).map(m => m.matchId).slice(0, size);

    const matches = [];
    for (const id of matchIds) {
      try {
        const details = await getMatchById(id);
        matches.push(details);
      } catch (e) {
        console.warn("match fetch failed", id, e.message);
      }
    }

    const stats = calculateStatsFromMatches(matches, puuid);
    const roast = generateRoastFromStats(stats);

    return new Response(JSON.stringify({ stats, roast }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

function calculateStatsFromMatches(matches, puuid) {
  const result = { matchesPlayed: 0, totalKills: 0, totalDeaths: 0, totalAssists: 0, wins: 0, avgAcs: 0, mostPlayedAgent: null, clutchPercentage: 0 };
  const agentCounts = {};
  let acsSum = 0, clutchCount = 0;
  for (const match of matches) {
    const allPlayers = (match?.players?.allPlayers) || (match?.players) || [];
    const me = allPlayers.find(p => p?.puuid === puuid);
    if (!me) continue;
    result.matchesPlayed++;
    const s = me.stats || {};
    result.totalKills += s.kills || 0;
    result.totalDeaths += s.deaths || 0;
    result.totalAssists += s.assists || 0;
    acsSum += s.score || 0;
    if (s.win) result.wins++;
    if (s.clutches) clutchCount += s.clutches;
    const agent = me.character || me.characterId || (me?.actor) || null;
    if (agent) agentCounts[agent] = (agentCounts[agent] || 0) + 1;
  }
  result.kda = Number(((result.totalKills + result.totalAssists) / Math.max(1, result.totalDeaths)).toFixed(2));
  result.winRate = result.matchesPlayed ? Math.round((result.wins / result.matchesPlayed) * 100) : 0;
  result.avgAcs = result.matchesPlayed ? Math.round(acsSum / result.matchesPlayed) : 0;
  const sorted = Object.entries(agentCounts).sort((a,b)=>b[1]-a[1]);
  result.mostPlayedAgent = sorted.length ? sorted[0][0] : null;
  result.clutchPercentage = result.matchesPlayed ? Math.round((clutchCount / Math.max(1,result.matchesPlayed))*100) : 0;
  return result;
}
