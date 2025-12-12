// rule-based roasts are simple and safe for the prototype.
export function generateRoastFromStats(stats) {
  const lines = [];
  if (stats.matchesPlayed < 3) lines.push("You have too few matches; this roast is on probation.");
  if (stats.winRate < 45) lines.push("Your win rate is an art form — tragic, but consistent.");
  if (parseFloat(stats.kda) < 1) lines.push("Your KDA is negative. Even the scoreboard feels bad.");
  if (stats.avgAcs < 150) lines.push("Your ACS is charmingly decorative.");
  if (stats.mostPlayedAgent) {
    const a = stats.mostPlayedAgent.toLowerCase();
    if (a.includes("jett")) lines.push("Another Jett main — drama, dashes, and missed shots.");
    if (a.includes("sage")) lines.push("Sage main? Thank you for the heals and the self-esteem boost.");
  }
  if (lines.length === 0) lines.push("Not bad... suspiciously not bad. Don't get cocky.");
  return lines;
}
