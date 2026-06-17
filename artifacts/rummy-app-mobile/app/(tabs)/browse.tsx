import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { useColors } from "@/hooks/useColors";
import { useData, type AppConfig } from "@/contexts/DataContext";

const CATEGORY_ICONS: Record<string, string> = {
  "Rummy": "layers",
  "Card Games": "credit-card",
  "Fantasy": "star",
  "Cricket": "activity",
  "Poker": "diamond",
  "Casino": "zap",
  "Sports": "award",
  "Ludo": "grid",
  "Chess": "box",
  "Puzzle": "cpu",
  "General": "package",
};

function getCategoryIcon(cat: string): string {
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return CATEGORY_ICONS[key];
  }
  return "layers";
}

function AppRow({ app }: { app: AppConfig }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => router.push(`/app/${app.slug}`)}
      style={({ pressed }) => [
        styles.appRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image
        source={app.icon_url || "https://via.placeholder.com/44"}
        style={styles.appRowIcon}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.appRowInfo}>
        <Text style={[styles.appRowName, { color: colors.foreground }]} numberOfLines={1}>
          {app.name}
        </Text>
        <Text style={[styles.appRowMeta, { color: colors.mutedForeground }]} numberOfLines={1}>
          v{app.version} · {app.developer}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { apps, settings, loading } = useData();
  const [selected, setSelected] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = settings.categories?.length
      ? settings.categories
      : Array.from(new Set(apps.map((a) => a.category).filter(Boolean)));
    return cats;
  }, [apps, settings.categories]);

  const filteredApps = useMemo(() => {
    if (!selected) return [];
    return apps.filter(
      (a) => !a.is_coming_soon && a.category?.toLowerCase().includes(selected.toLowerCase())
    );
  }, [apps, selected]);

  const tabBarHeight = Platform.OS === "ios" ? 84 : 64;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Browse</Text>
        </View>
        <View style={styles.centered}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Browse</Text>
        {selected && (
          <Pressable onPress={() => setSelected(null)} style={styles.backBtn}>
            <Feather name="arrow-left" size={16} color={colors.primary} />
            <Text style={[styles.backBtnText, { color: colors.primary }]}>All Categories</Text>
          </Pressable>
        )}
      </View>

      {!selected ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: tabBarHeight + insets.bottom + 16 },
          ]}
          renderItem={({ item: cat }) => {
            const count = apps.filter(
              (a) => !a.is_coming_soon && a.category?.toLowerCase().includes(cat.toLowerCase())
            ).length;
            return (
              <Pressable
                onPress={() => setSelected(cat)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Feather name={getCategoryIcon(cat) as any} size={24} color={colors.primary} />
                </View>
                <Text style={[styles.categoryName, { color: colors.foreground }]} numberOfLines={2}>
                  {cat}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.mutedForeground }]}>
                  {count} app{count !== 1 ? "s" : ""}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No categories yet
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.appList,
            { paddingBottom: tabBarHeight + insets.bottom + 16 },
          ]}
          ListHeaderComponent={
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              {selected}
              <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
                {"  "}({filteredApps.length})
              </Text>
            </Text>
          }
          renderItem={({ item }) => <AppRow app={item} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No apps in this category
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  grid: {
    padding: 12,
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  appList: {
    padding: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    marginBottom: 12,
  },
  countLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  appRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  appRowInfo: { flex: 1, gap: 3 },
  appRowName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  appRowMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
