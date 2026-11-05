import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DiaryCard from "../../src/components/DiaryCard";
import { useDiary } from "../../src/context/DiaryContext";
import { useDiarySearch } from "../../src/hooks/useDiarySearch";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOODS = ["😌", "🎯", "🥰", "🥳"];

export default function HomeScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const {
    query,
    setQuery,
    moodFilter,
    setMoodFilter,
    resetFilter,
    filteredEntries,
    resultCount,
  } = useDiarySearch(entries);
  const searchRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const openDetail = useCallback(
    (id: number) => {
      router.push({ pathname: "/detail/[id]", params: { id: String(id) } });
    },
    [router],
  );

  const handleReset = useCallback(() => {
    resetFilter(); // Memanggil fungsi reset filter dan query
    searchRef.current?.focus();
  }, [resetFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>

      {/* Kolom Pencarian yang dipercantik */}
      <View style={styles.searchRow}>
        <TextInput
          ref={searchRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Cari diary..."
          style={styles.search}
        />
        <Pressable onPress={handleReset} style={styles.clearButton}>
          <Text style={styles.clearText}>Reset</Text>
        </Pressable>
      </View>

      {/* Tambahan UI Filter Mood */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}
        >
          {MOODS.map((m) => (
            <Pressable
              key={m}
              onPress={() => setMoodFilter(moodFilter === m ? "" : m)} // Klik ulang untuk membatalkan filter
              style={[
                styles.moodButton,
                moodFilter === m && styles.moodSelected,
              ]}
            >
              <Text style={styles.moodText}>{m}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.counter}>{resultCount} entri ditemukan</Text>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={likedIds.has(item.id)}
            onPress={() => openDetail(item.id)}
            onToggleLike={() => toggleLike(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Diary tidak ditemukan.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACE.l, backgroundColor: COLORS.background },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACE.m,
  },
  searchRow: { flexDirection: "row", gap: SPACE.s, marginBottom: SPACE.s },
  // UI Search diperhalus dengan bayangan (elevation)
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACE.m,
    backgroundColor: COLORS.surface,
    elevation: 1,
  },
  clearButton: {
    justifyContent: "center",
    paddingHorizontal: SPACE.l,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    elevation: 1,
  },
  clearText: { color: COLORS.surface, fontWeight: "bold" },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACE.s,
  },
  filterLabel: { fontWeight: "600", marginRight: SPACE.s, color: COLORS.text },
  moodRow: { gap: SPACE.s },
  moodButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
  },
  moodSelected: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: "#E0E7FF",
  },
  moodText: { fontSize: 18 },
  counter: { color: COLORS.muted, marginBottom: SPACE.m, fontWeight: "500" },
  list: { gap: SPACE.m, paddingBottom: SPACE.xl },
  empty: { textAlign: "center", color: COLORS.muted, paddingTop: 40 },
});
