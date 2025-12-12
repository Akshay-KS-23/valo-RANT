//minimal UI so we can focus on functionality.

"use client";
import { useState } from "react";

export default function Page() {
  const [riotId, setRiotId] = useState<string>("");
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function submit() {
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riotId }),
      });

      const json = await r.json();
      setRes(json);
    } catch (e: any) {
      setRes({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Valorant Roast Prototype</h1>

      <input
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        placeholder="Name#TAG (e.g. Akshay#IN)"
        style={{ padding: 8, width: 300 }}
      />

      <button onClick={submit} disabled={loading} style={{ marginLeft: 8 }}>
        {loading ? "Roasting..." : "Roast me 🔥"}
      </button>

      {res && (
        <section style={{ marginTop: 20 }}>
          {res.error && <pre style={{ color: "red" }}>{res.error}</pre>}

          {res.stats && (
            <div>
              <h3>Stats</h3>
              <pre>{JSON.stringify(res.stats, null, 2)}</pre>
            </div>
          )}

          {res.roast && (
            <div>
              <h3>Roasts</h3>
              <ul>
                {res.roast.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
