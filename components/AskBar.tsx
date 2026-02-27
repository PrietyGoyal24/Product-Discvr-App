"use client";

import { useState, FormEvent, useEffect } from "react";

interface AskBarProps {
  onSubmit: (query: string) => void;
  loading: boolean;
  initialValue?: string;
}

export default function AskBar({ onSubmit, loading, initialValue = "" }: AskBarProps) {
  const [input, setInput] = useState(initialValue);
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("search_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Add to front, keep unique, limit to 5
    const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const query = input.trim();
    saveToHistory(query);
    onSubmit(query);
  };

  const handleChipClick = (query: string) => {
    if (loading) return;
    setInput(query);
    onSubmit(query);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("search_history");
  };

  return (
    <div className="w-full space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 sm:gap-3 w-full"
        role="search"
        aria-label="AI product search"
      >
        {/* Input wrapper */}
        <div className="relative flex-1">
          {/* Search icon */}
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>

          <input
            id="ai-ask-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'best headphones for travel' or 'gaming setup under $200'"
            disabled={loading}
            className="input-theme w-full pl-11 pr-4 py-3.5 text-sm sm:text-base disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
            aria-label="Describe the product you're looking for"
          />
        </div>

        {/* Submit */}
        <button
          id="ai-ask-submit"
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm sm:text-base whitespace-nowrap"
          aria-label={loading ? "Searching…" : "Ask AI"}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="hidden sm:inline">Thinking…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Ask AI</span>
            </>
          )}
        </button>
      </form>

      {/* History Chips */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mr-1">Recent:</span>
          {history.map((query, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(query)}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center gap-1.5 group"
            >
              <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {query}
            </button>
          ))}
          <button
            onClick={clearHistory}
            className="text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors ml-auto flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
