import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { useColors } from "@/hooks/useColors";
import { useData, type NewsItem } from "@/contexts/DataContext";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function NewsCard({ item }: { item: NewsItem }) {
  const colors = useColors();

  const handlePress = async () => {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    if (!domain) return;
    const url = item.link
      ? item.link.startsWith("http")
        ? item.link
        : `https://${domain}${item.link}`
      : `https://${domain}/news/${item.slug}`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      {item.logo_url ? (
        <Image
          source={item.logo_url}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.cardImagePlaceholder, { backgroundColor: colors.muted }]}>
          <Feather name="file-text" size={24} color={colors.mutedForeground} />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.cardDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.description || ""}
        </Text>
        <View style={styles.cardFooter}>
          {item.author && (
            <View style={styles.metaRow}>
              <Feather name="user" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {item.author}
              </Text>
            </View>
          )}
          {(item.date || item.published_at) && (
            <View style={styles.metaRow}>
              <Feather name="calendar" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {formatDate(item.date || item.published_at)}
              </Text>
            </View>
          )}
          {item.read_time && (
            <View style={styles.metaRow}>
              <Feather name="clock" size={11} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {item.read_time}
              </Text>
            </View>
          )}
          <Feather
            name="external-link"
            size={13}
            color={colors.primary}
            style={{ marginLeft: "auto" }}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function NewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { news, loading, refresh } = useData();
  const [refreshing, setRefreshing] = React.useState(false);
  const tabBarHeight = Platform.OS === "ios" ? 84 : 64;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>News</Text>
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
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
        renderItem={({ item }) => <NewsCard item={item} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            {loading ? (
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Loading...</Text>
            ) : (
              <>
                <Feather name="inbox" size={40} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No news articles yet
                </Text>
              </>
            )}
          </View>
        }
      />
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    flexWrap: "wrap",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
