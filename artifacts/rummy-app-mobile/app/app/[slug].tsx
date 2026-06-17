import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useData, type AppConfig } from "@/contexts/DataContext";

function stripHtml(html: string): string {
  return (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function StarRating({ rating }: { rating: number }) {
  const colors = useColors();
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name={i <= Math.round(rating) ? "star" : "star"}
          size={13}
          color={i <= Math.round(rating) ? "#f59e0b" : colors.border}
        />
      ))}
      <Text style={[styles.ratingNum, { color: colors.mutedForeground }]}>
        {rating?.toFixed(1) ?? "5.0"}
      </Text>
    </View>
  );
}

function SafetyBadge({ status }: { status: AppConfig["safety_status"] }) {
  const colors = useColors();
  const cfg = {
    Verified: { color: colors.success, icon: "shield" as const, label: "Verified Safe" },
    Caution: { color: colors.caution, icon: "alert-triangle" as const, label: "Use Caution" },
    Unsafe: { color: colors.destructive, icon: "shield-off" as const, label: "Unsafe" },
  }[status] ?? { color: colors.mutedForeground, icon: "info" as const, label: status };

  return (
    <View style={[styles.safetyBadge, { backgroundColor: cfg.color + "18", borderColor: cfg.color + "40" }]}>
      <Feather name={cfg.icon} size={14} color={cfg.color} />
      <Text style={[styles.safetyBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function InfoChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.infoChip, { backgroundColor: colors.muted }]}>
      <Feather name={icon as any} size={13} color={colors.mutedForeground} />
      <View>
        <Text style={[styles.infoChipLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.infoChipValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function AppDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { apps } = useData();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const app = useMemo(
    () => apps.find((a) => a.slug === slug),
    [apps, slug]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: app?.name ?? "App Details",
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        color: colors.foreground,
        fontFamily: "Inter_600SemiBold",
        fontSize: 16,
      },
    });
  }, [navigation, app, colors]);

  const handleMoreInfo = async () => {
    if (!app) return;
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    if (!domain) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `https://${domain}/gateway/${app.slug}`;
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: colors.primary,
    });
  };

  if (!app) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Feather name="search" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFoundTitle, { color: colors.foreground }]}>App Not Found</Text>
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
            This app could not be found.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.backButtonText, { color: colors.primaryForeground }]}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const descriptionText = stripHtml(app.description_html);
  const featuresText = app.features_html ? stripHtml(app.features_html) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={[styles.appHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={app.icon_url || "https://via.placeholder.com/80"}
            style={styles.appHeaderIcon}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.appHeaderInfo}>
            <Text style={[styles.appHeaderName, { color: colors.foreground }]} numberOfLines={2}>
              {app.name}
            </Text>
            <Text style={[styles.appHeaderDev, { color: colors.mutedForeground }]}>
              {app.developer}
            </Text>
            <StarRating rating={app.rating || 5} />
            <View style={styles.tagsRow}>
              {app.is_new && (
                <View style={[styles.tag, { backgroundColor: colors.primary + "20" }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>NEW</Text>
                </View>
              )}
              {app.is_featured && (
                <View style={[styles.tag, { backgroundColor: "#f59e0b20" }]}>
                  <Text style={[styles.tagText, { color: "#f59e0b" }]}>FEATURED</Text>
                </View>
              )}
              <View style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{app.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety + Quick Info */}
        <View style={styles.section}>
          <SafetyBadge status={app.safety_status} />
        </View>

        {/* Info chips grid */}
        <View style={styles.infoGrid}>
          <InfoChip icon="code" label="Version" value={app.version || "—"} />
          <InfoChip icon="hard-drive" label="Size" value={app.file_size || "—"} />
          <InfoChip icon="star" label="Rating" value={`${app.rating?.toFixed(1) ?? "5.0"}/5`} />
          <InfoChip icon="user" label="Developer" value={app.developer || "—"} />
        </View>

        {/* Red warning box */}
        {!!app.red_box_msg && (
          <View style={[styles.alertBox, { backgroundColor: "#ff3b3015", borderColor: "#ff3b3040" }]}>
            <Feather name="alert-circle" size={16} color={colors.destructive} />
            <Text style={[styles.alertText, { color: colors.destructive }]}>{app.red_box_msg}</Text>
          </View>
        )}

        {/* Yellow notice box */}
        {!!app.yellow_box_msg && (
          <View style={[styles.alertBox, { backgroundColor: "#ff950015", borderColor: "#ff950040" }]}>
            <Feather name="alert-triangle" size={16} color={colors.caution} />
            <Text style={[styles.alertText, { color: colors.caution }]}>{app.yellow_box_msg}</Text>
          </View>
        )}

        {/* Idea box */}
        {!!app.idea_box_msg && (
          <View style={[styles.alertBox, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "35" }]}>
            <Feather name="info" size={16} color={colors.primary} />
            <Text style={[styles.alertText, { color: colors.primary }]}>{app.idea_box_msg}</Text>
          </View>
        )}

        {/* Description */}
        {!!descriptionText && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
            <Text style={[styles.bodyText, { color: colors.foreground }]}>{descriptionText}</Text>
          </View>
        )}

        {/* Features */}
        {!!featuresText && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Features</Text>
            <Text style={[styles.bodyText, { color: colors.foreground }]}>{featuresText}</Text>
          </View>
        )}

        {/* Custom admin box */}
        {!!app.custom_admin_box_html && (
          <View style={[styles.customBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {app.custom_admin_box_heading && (
              <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 6 }]}>
                {app.custom_admin_box_heading}
              </Text>
            )}
            <Text style={[styles.bodyText, { color: colors.foreground }]}>
              {stripHtml(app.custom_admin_box_html)}
            </Text>
          </View>
        )}

        {/* Screenshots */}
        {app.screenshots?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Screenshots</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {app.screenshots.map((src, i) => (
                <Image
                  key={i}
                  source={src}
                  style={styles.screenshot}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* FAQs */}
        {app.faqs && app.faqs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>FAQ</Text>
            {app.faqs.map((faq, i) => (
              <View
                key={i}
                style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.faqQuestion, { color: colors.foreground }]}>
                  {faq.question}
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>
                  {faq.answer}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Release Notes */}
        {!!app.release_notes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Release Notes</Text>
            <View style={[styles.releaseBox, { backgroundColor: colors.muted }]}>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{app.release_notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky bottom CTA */}
      {!app.is_coming_soon && (
        <View
          style={[
            styles.ctaContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {app.link_configured ? (
            <Pressable
              onPress={handleMoreInfo}
              style={({ pressed }) => [
                styles.ctaButton,
                {
                  backgroundColor: app.safety_status === "Verified"
                    ? colors.primary
                    : app.safety_status === "Caution"
                    ? colors.caution
                    : colors.destructive,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Feather name="external-link" size={18} color="#fff" />
              <Text style={styles.ctaButtonText}>More Information</Text>
            </Pressable>
          ) : (
            <View style={[styles.ctaButton, { backgroundColor: colors.muted }]}>
              <Feather name="clock" size={18} color={colors.mutedForeground} />
              <Text style={[styles.ctaButtonText, { color: colors.mutedForeground }]}>
                Link Not Configured
              </Text>
            </View>
          )}
        </View>
      )}

      {app.is_coming_soon && (
        <View
          style={[
            styles.ctaContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={[styles.ctaButton, { backgroundColor: colors.muted }]}>
            <Feather name="clock" size={18} color={colors.mutedForeground} />
            <Text style={[styles.ctaButtonText, { color: colors.mutedForeground }]}>
              Coming Soon
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 16,
    gap: 0,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  notFoundTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  notFoundText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  backButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, marginTop: 8 },
  backButtonText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  appHeader: {
    flexDirection: "row",
    padding: 16,
    gap: 14,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  appHeaderIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  appHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  appHeaderName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    lineHeight: 24,
  },
  appHeaderDev: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  ratingNum: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginLeft: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    marginBottom: 10,
  },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  safetyBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 7,
    minWidth: "47%",
    flex: 1,
  },
  infoChipLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  infoChipValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  customBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  screenshot: {
    width: 160,
    height: 284,
    borderRadius: 12,
    marginRight: 10,
  },
  faqItem: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    gap: 6,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  releaseBox: {
    padding: 12,
    borderRadius: 12,
  },
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});
