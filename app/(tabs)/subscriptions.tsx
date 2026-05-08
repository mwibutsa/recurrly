import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "../components/SubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

const STATUS_FILTERS = ["All", "Active", "Paused", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [query, setQuery]       = useState("");
  const [filter, setFilter]     = useState<StatusFilter>("All");
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    setCancellingId(id);
    // Simulate async cancellation
    setTimeout(() => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)),
      );
      setCancellingId(null);
    }, 800);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptions.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.category ?? "").toLowerCase().includes(q);
      const matchesFilter =
        filter === "All" || s.status?.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [query, filter, subscriptions]);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalMonthly = subscriptions
    .filter((s) => s.status === "active")
    .reduce(
      (sum, s) => sum + (s.billing === "Yearly" ? s.price / 12 : s.price),
      0,
    );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        extraData={{ expandedId, cancellingId }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <View className="items-center py-16 gap-2">
            <Text className="text-base font-sans-bold text-primary">
              No subscriptions found
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground text-center">
              Try adjusting your search or filter
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId((cur) => (cur === item.id ? null : item.id))
            }
            onCancelPress={() => handleCancel(item.id)}
            isCancelling={cancellingId === item.id}
          />
        )}
        ListHeaderComponent={
          <>
            {/* Title + summary */}
            <View className="mt-2 mb-2">
              <Text className="text-2xl font-sans-bold text-primary">
                My Subscriptions
              </Text>
              <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                {activeCount} active ·{" "}
                <Text className="font-sans-semibold text-primary">
                  {formatCurrency(totalMonthly, "USD")}
                </Text>
                {" "}/mo
              </Text>
            </View>

            {/* Search */}
            <View className="mb-3 mt-4">
              <TextInput
                className="rounded-2xl border border-border bg-card text-base font-sans-medium text-primary"
                style={{ paddingHorizontal: 20, paddingVertical: 14 }}
                value={query}
                onChangeText={setQuery}
                placeholder="Search subscriptions…"
                placeholderTextColor="rgba(8,17,38,0.35)"
                autoCapitalize="none"
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>

            {/* Status filter pills */}
            <View className="mb-4 flex-row gap-2">
              {STATUS_FILTERS.map((s) => (
                <Pressable
                  key={s}
                  className={clsx(
                    "rounded-full border px-4 py-1.5",
                    filter === s
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background",
                  )}
                  onPress={() => setFilter(s)}
                >
                  <Text
                    className={clsx(
                      "text-sm font-sans-semibold",
                      filter === s ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
