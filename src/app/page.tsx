"use client";
import React, { useState, useRef, useEffect } from "react";


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

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); // eslint-disable-line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const isDark = theme === 'dark';

  return (
    <main style={{
      padding: 24,
      maxWidth: 800,
      margin: "0 auto",
      background: isDark ? "#111217" : "#f7f8fa",
      minHeight: "100vh",
      color: isDark ? "#e0e0e0" : "#222",
      transition: "background 0.3s, color 0.3s"
    }}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18}}>
        <h1 style={{fontSize: "2.2rem", fontWeight: 700, color: isDark ? "#00bcd4" : "#1976d2"}}>📝 Note Search</h1>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={{
            background: isDark ? "#222" : "#e3f2fd",
            color: isDark ? "#00bcd4" : "#1976d2",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "background 0.3s, color 0.3s"
          }}
        >
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <div style={{display: "flex", gap: 12, marginBottom: 24}}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !loading && query.trim()) {
              handleSearch();
            }
          }}
          placeholder="Search notes…"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: isDark ? "1px solid #222" : "1px solid #ccc",
            fontSize: 16,
            background: isDark ? "#181a20" : "#fff",
            color: isDark ? "#e0e0e0" : "#222"
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            padding: "10px 22px",
            borderRadius: 8,
            background: loading ? (isDark ? "#222" : "#eee") : (isDark ? "#00bcd4" : "#1976d2"),
            color: loading ? (isDark ? "#888" : "#aaa") : (isDark ? "#fff" : "#fff"),
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "transform 0.18s cubic-bezier(.4,2,.3,.7), background 0.3s, color 0.3s"
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.transform = "scale(1)")}
        >{loading ? "Searching…" : "Search"}</button>
      </div>
      {error && (
        <div style={{
          color: isDark ? "#ff5252" : "#d32f2f",
          marginBottom: 18,
          fontWeight: 500,
          background: isDark ? "#2d1a1a" : "#ffeaea",
          padding: 10,
          borderRadius: 8
        }}>
          {error}
        </div>
      )}
      {loading && <Spinner />}
      <ul style={{marginTop:8, padding:0, listStyle: "none"}}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {results.map((r, i) => (
          <li
            key={r.id}
            style={{
              transition: "box-shadow 0.2s",
              borderRadius: 14,
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              cursor: "pointer",
              opacity: 0,
              animation: `fadeIn 0.7s forwards`,
              animationDelay: `${i * 0.07}s`,
              background: isDark ? undefined : "#fff"
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLLIElement>) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)")}
            onMouseLeave={(e: React.MouseEvent<HTMLLIElement>) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
          >
            <Card>
              <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 6}}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isDark ? "#222" : "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 18,
                  color: isDark ? "#00bcd4" : "#1976d2",
                  boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  {r.title?.[0]?.toUpperCase() || "N"}
                </div>
                <strong style={{fontSize: "1.1rem", color: isDark ? "#fff" : "#222"}}>{r.title}</strong>
              </div>
              <p style={{marginTop: 8, color: isDark ? "#bdbdbd" : "#444"}}>{r.content}</p>
              <div style={{marginTop: 10, fontSize: 13, color: isDark ? "#8ecae6" : "#1976d2", display: "flex", gap: 16}}>
                {r.email && (
                  <span title="Author email" style={{display: "flex", alignItems: "center", gap: 4}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{verticalAlign: "middle"}}>
                      <path d="M4 4h16v16H4V4zm8 8l8-8H4l8 8z" fill={isDark ? "#8ecae6" : "#1976d2"}/>
                    </svg>
                    {r.email}
                  </span>
                )}
                {r.created_at && (
                  <span title="Created date" style={{display: "flex", alignItems: "center", gap: 4}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{verticalAlign: "middle"}}>
                      <path d="M12 8v4l3 3" stroke={isDark ? "#8ecae6" : "#1976d2"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke={isDark ? "#8ecae6" : "#1976d2"} strokeWidth="2" fill="none"/>
                    </svg>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Card>
          </li>
        ))}
        {!loading && results.length === 0 && query.trim() && !error && (
          <div style={{marginTop: 40, textAlign: "center", color: isDark ? "#888" : "#1976d2"}}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: 12, opacity: 0.7}}>
              <circle cx="32" cy="32" r="32" fill={isDark ? "#222" : "#e3f2fd"} />
              <path d="M20 44C20 38.4772 24.4772 34 30 34H34C39.5228 34 44 38.4772 44 44" stroke={isDark ? "#00bcd4" : "#1976d2"} strokeWidth="3" strokeLinecap="round"/>
              <ellipse cx="24" cy="28" rx="3" ry="4" fill={isDark ? "#00bcd4" : "#1976d2"} />
              <ellipse cx="40" cy="28" rx="3" ry="4" fill={isDark ? "#00bcd4" : "#1976d2"} />
            </svg>
            <div style={{fontSize: 18, fontWeight: 500}}>No results found</div>
            <div style={{fontSize: 14, marginTop: 4, color: isDark ? "#aaa" : "#1976d2"}}>Try a different search term.</div>
          </div>
        )}
      </ul>
    </main>
  );
}
