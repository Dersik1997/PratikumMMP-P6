import { useEffect, useMemo, useState } from "react";
import { DiaryEntry } from "../context/DiaryContext";

export function useDiarySearch(entries: DiaryEntry[]) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // Tambahan state untuk filter mood
  const [moodFilter, setMoodFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const filteredEntries = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    // Gabungan query text dan filter mood menggunakan useMemo
    return entries.filter((entry) => {
      const matchQuery =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.preview.toLowerCase().includes(q) ||
        entry.date.toLowerCase().includes(q);

      const matchMood = !moodFilter || entry.mood === moodFilter;

      return matchQuery && matchMood;
    });
  }, [entries, debouncedQuery, moodFilter]);

  // Fungsi Reset Filter
  const resetFilter = () => {
    setQuery("");
    setMoodFilter("");
  };

  return {
    query,
    setQuery,
    moodFilter,
    setMoodFilter,
    resetFilter,
    filteredEntries,
    resultCount: filteredEntries.length,
  };
}
