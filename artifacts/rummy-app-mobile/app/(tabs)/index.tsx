import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useData, type AppConfig } from "@/contexts/DataContext";

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() || "";
}

function SafetyBadge({ status }: { status: "Verified" | "Caution" | "Unsafe" }) {
  const colors = useColors();
  const config = {
    Verified: { color: colors.success, label: "Verified" },
    Caution: { color: colors.caution, label: "Caution" },
    Unsafe: { color: colors.destructive, label: "Unsafe" },
  }[status] ?? { color: colors.mutedForeground, label: status };

  return (
    <View style={[styles.badge, { backgroundColor: config.color + "20" }]}>
      <View style={[styles.badgeDot, { backgroundColor: config.color }]} />
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function AppCard({ app }: { app: AppConfig }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => router.push(`/app/${app.slug}`)}
      style={({ pressed }) => [
        styles.appCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${app.name}`}
    >
      <Image
        source={app.icon_url || "https://via.placeholder.com/56"}
        style={styles.appIcon}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.appCardContent}>
        <View style={styles.appCardRow}>
          <Text style={[styles.appName, { color: colors.foreground }]} numberOfLines={1}>
            {app.name}
          </Text>
          {app.is_new && (
            <View style={[styles.newBadge, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.newBadgeText, { color: colors.primary }]}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={[styles.appCategory, { color: colors.mutedForeground }]} numberOfLines={1}>
          {app.category} · v{app.version}
        </Text>
        <View style={styles.appCardFooter}>
          <SafetyBadge status={app.safety_status} />
          {app.link_configured && (
            <View style={[styles.linkBadge, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="link" size={10} color={colors.primary} />
              <Text style={[styles.linkBadgeText, { color: colors.primary }]}>Link</Text>
            </View>
          )}
          <View style={styles.ratingRow}>
            <Feather name="star" size={10} color="#f59e0b" />
            <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
              {app.rating?.toFixed(1) ?? "5.0"}
            </Text>
          </View>
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

function FeaturedCard({ app }: { app: AppConfig }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => router.push(`/app/${app.slug}`)}
      style={({ pressed }) => [
        styles.featuredCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Image
        source={app.icon_url || "https://via.placeholder.com/72"}
        style={styles.featuredIcon}
        contentFit="cover"
        transition={200}
      />
      <Text style={[styles.featuredName, { color: colors.foreground }]} numberOfLines={2}>
        {app.name}
      </Text>
      <Text style={[styles.featuredCategory, { color: colors.mutedForeground }]} numberOfLines={1}>
        {app.category}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { apps, settings, loading, error, refresh } = useData();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const categories = useMemo(() => {
    if (settings.categories?.length) return settings.categories;
    const cats = Array.from(new Set(apps.map((a) => a.category).filter(Boolean)));
    return cats.slice(0, 12);
  }, [apps, settings.categories]);

  const filteredApps = useMemo(() => {
    let list = apps.filter((a) => !a.is_coming_soon);
    if (selectedCategory) {
      list = list.filter((a) => a.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.developer?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [apps, selectedCategory, search]);

  const featuredApps = useMemo(
    () => apps.filter((a) => a.is_featured && !a.is_coming_soon).slice(0, 6),
    [apps]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const tabBarHeight = Platform.OS === "ios" ? 84 : 64;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {settings.site_title || "RummyApp"}
        </Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.muted }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search apps..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading apps...</Text>
        </View>
      ) : error && apps.length === 0 ? (
        <View style={styles.centered}>
          <Feather name="wifi-off" size={48} color={colors.mutedForeground} />
          <Text style={[styles.errorTitle, { color: colors.foreground }]}>Unable to Load</Text>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{error}</Text>
          <Pressable
            onPress={refresh}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.retryBtnText, { color: colors.primaryForeground }]}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppCard app={item} />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + insets.bottom + 16 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              {/* Featured apps */}
              {featuredApps.length > 0 && !search && !selectedCategory && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                    {featuredApps.map((app) => (
                      <FeaturedCard key={app.id} app={app} />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Category chips */}
              {categories.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesScroll}
                  contentContainerStyle={styles.categoriesContent}
                >
                  <Pressable
                    onPress={() => setSelectedCategory(null)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: !selectedCategory ? colors.primary : colors.muted,
                        borderColor: !selectedCategory ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: !selectedCategory ? colors.primaryForeground : colors.foreground },
                      ]}
                    >
                      All
                    </Text>
                  </Pressable>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: cat === selectedCategory ? colors.primary : colors.muted,
                          borderColor: cat === selectedCategory ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: cat === selectedCategory ? colors.primaryForeground : colors.foreground },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              <Text style={[styles.sectionTitle, { color: colors.foreground, marginHorizontal: 16, marginTop: 8 }]}>
                {selectedCategory ? selectedCategory : search ? `Results for "${search}"` : "All Apps"}
                <Text style={[styles.countText, { color: colors.mutedForeground }]}>
                  {"  "}({filteredApps.length})
                </Text>
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="search" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No apps found
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  retryBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  listContent: {
    gap: 0,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
    marginTop: 16,
    marginHorizontal: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
  featuredScroll: {
    paddingLeft: 16,
  },
  featuredCard: {
    width: 110,
    marginRight: 12,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    gap: 6,
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  featuredName: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  featuredCategory: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  categoriesScroll: {
    marginTop: 4,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  appCardContent: {
    flex: 1,
    gap: 4,
  },
  appCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  appCategory: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  appCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  linkBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  linkBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  ratingText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  emptyContainer: {
    padding: 48,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
