"use client";
import React, { useState } from "react";


function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "24px 0" }}>
      <div style={{
        width: 32,
        height: 32,
        border: "4px solid #222",
        borderTop: "4px solid #00bcd4",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#181a20",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      padding: 20,
      marginBottom: 18,
      border: "1px solid #222"
    }}>{children}</div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); // eslint-disable-line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/search", {
        method: "POST", headers: {"content-type":"application/json"},
        body: JSON.stringify({ query })
      });
      if (!r.ok) throw new Error("Search failed");
      setResults(await r.json());
    } catch (e: any) { // eslint-disable-line
      setError(e.message || "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      padding: 24,
      maxWidth: 800,
      margin: "0 auto",
      background: "#111217",
      minHeight: "100vh",
      color: "#e0e0e0"
    }}>
      <h1 style={{fontSize: "2.2rem", fontWeight: 700, marginBottom: 18, color: "#00bcd4"}}>📝 Note Search</h1>
      <div style={{display: "flex", gap: 12, marginBottom: 24}}>
        <input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search notes…"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #222",
            fontSize: 16,
            background: "#181a20",
            color: "#e0e0e0"
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            padding: "10px 22px",
            borderRadius: 8,
            background: loading ? "#222" : "#00bcd4",
            color: loading ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            transition: "transform 0.18s cubic-bezier(.4,2,.3,.7)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >{loading ? "Searching…" : "Search"}</button>
      </div>
      {error && (
        <div style={{color: "#ff5252", marginBottom: 18, fontWeight: 500, background: "#2d1a1a", padding: 10, borderRadius: 8}}>
          {error}
        </div>
      )}
      {loading && <Spinner />}
      <ul style={{marginTop:8, padding:0, listStyle: "none"}}>
          {results.map((r) => (
            <li key={r.id} style={{transition: "box-shadow 0.2s", borderRadius: 14, boxShadow: "0 0 0 rgba(0,0,0,0)", cursor: "pointer"}}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
            >
              <Card>
                <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 6}}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#00bcd4",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)"
                  }}>
                    {r.title?.[0]?.toUpperCase() || "N"}
                  </div>
                  <strong style={{fontSize: "1.1rem", color: "#fff"}}>{r.title}</strong>
                </div>
                <p style={{marginTop: 8, color: "#bdbdbd"}}>{r.content}</p>
              </Card>
            </li>
          ))}
        {!loading && results.length === 0 && query.trim() && !error && (
          <div style={{marginTop: 32, textAlign: "center", color: "#888"}}>
            <span>No results found.</span>
          </div>
        )}
      </ul>
    </main>
  );
}
