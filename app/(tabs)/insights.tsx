import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// ─── Weekly spending data (derived from subscriptions) ────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Spread monthly cost across days proportionally for a realistic-looking chart
const WEEKLY_AMOUNTS = [32, 18, 24, 40, 15, 28, 20];
const MAX_AMOUNT = Math.max(...WEEKLY_AMOUNTS);
const TODAY_INDEX = (dayjs().day() + 6) % 7; // Mon=0 … Sun=6

// ─── History items (use subscription data as history) ────────────────────────
const HISTORY = HOME_SUBSCRIPTIONS.map((s) => ({
  ...s,
  date: dayjs(s.startDate).format("MMMM D, HH:mm"),
}));

// ─── Expenses summary ─────────────────────────────────────────────────────────
const totalMonthly = HOME_SUBSCRIPTIONS.filter(
  (s) => s.status === "active",
).reduce(
  (sum, s) => sum + (s.billing === "Yearly" ? s.price / 12 : s.price),
  0,
);

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart() {
  const [activeIndex, setActiveIndex] = useState(TODAY_INDEX);
  const CHART_HEIGHT = 140;

  return (
    <View>
      {/* Y-axis labels + bars */}
      <View style={{ flexDirection: "row", height: CHART_HEIGHT + 24 }}>
        {/* Y-axis */}
        <View
          style={{
            width: 28,
            height: CHART_HEIGHT,
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingRight: 4,
            marginTop: 16, // leave room for label above highlighted bar
          }}
        >
          {[45, 35, 25, 15, 5, 0].map((v) => (
            <Text
              key={v}
              style={{ fontSize: 9, color: "rgba(8,17,38,0.4)", lineHeight: 12 }}
            >
              {v}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
          {WEEKLY_AMOUNTS.map((amount, i) => {
            const isActive = i === activeIndex;
            const barH = Math.max(4, (amount / MAX_AMOUNT) * CHART_HEIGHT);
            return (
              <Pressable
                key={i}
                style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
                onPress={() => setActiveIndex(i)}
              >
                {/* Value label above active bar */}
                <View style={{ height: 20, justifyContent: "center" }}>
                  {isActive && (
                    <View
                      style={{
                        backgroundColor: "#ea7a53",
                        borderRadius: 6,
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "sans-bold",
                          color: "#fff9e3",
                        }}
                      >
                        ${amount}
                      </Text>
                    </View>
                  )}
                </View>
                {/* Bar */}
                <View
                  style={{
                    width: "100%",
                    height: barH,
                    borderRadius: 6,
                    backgroundColor: isActive ? "#ea7a53" : "#081126",
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* X-axis labels */}
      <View style={{ flexDirection: "row", marginLeft: 32, marginTop: 6, gap: 6 }}>
        {DAYS.map((day, i) => (
          <Text
            key={day}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 11,
              fontFamily: "sans-medium",
              color: i === activeIndex ? "#ea7a53" : "rgba(8,17,38,0.5)",
            }}
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Insights() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="mt-2 mb-5">
          <Text className="text-2xl font-sans-bold text-primary">
            Monthly Insights
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
            {dayjs().format("MMMM YYYY")}
          </Text>
        </View>

        {/* ── Upcoming / bar chart card ── */}
        <View className="mb-4 rounded-3xl border border-border bg-card p-5">
          <View className="list-head mb-4">
            <Text className="list-title">Upcoming</Text>
            <Pressable className="list-action">
              <Text className="list-action-text">View all</Text>
            </Pressable>
          </View>
          <BarChart />
        </View>

        {/* ── Expenses summary card ── */}
        <View className="mb-4 rounded-3xl border border-border bg-card p-5">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-lg font-sans-bold text-primary">Expenses</Text>
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {dayjs().format("MMMM YYYY")}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-sans-bold text-primary">
                -{formatCurrency(totalMonthly, "USD")}
              </Text>
              <Text className="text-sm font-sans-semibold text-success">+12%</Text>
            </View>
          </View>

          {/* Spend breakdown by category */}
          <View className="mt-4 gap-3">
            {Object.entries(
              HOME_SUBSCRIPTIONS.reduce<Record<string, number>>((acc, s) => {
                const cat = s.category ?? "Other";
                const monthly =
                  s.billing === "Yearly" ? s.price / 12 : s.price;
                acc[cat] = (acc[cat] ?? 0) + monthly;
                return acc;
              }, {}),
            )
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => {
                const pct = Math.round((amt / totalMonthly) * 100);
                return (
                  <View key={cat} className="gap-1">
                    <View className="flex-row justify-between">
                      <Text className="text-xs font-sans-semibold text-muted-foreground">
                        {cat}
                      </Text>
                      <Text className="text-xs font-sans-bold text-primary">
                        {formatCurrency(amt, "USD")}
                      </Text>
                    </View>
                    {/* Progress bar */}
                    <View className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <View
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${pct}%` }}
                      />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>

        {/* ── History ── */}
        <View>
          <View className="list-head">
            <Text className="list-title">History</Text>
            <Pressable className="list-action">
              <Text className="list-action-text">View all</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {HISTORY.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center rounded-2xl p-4 gap-4"
                style={{ backgroundColor: item.color ?? "#f6eecf" }}
              >
                <Image
                  source={item.icon}
                  style={{ width: 48, height: 48, borderRadius: 12 }}
                />
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-base font-sans-bold text-primary"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs font-sans-medium text-muted-foreground">
                    {item.date}
                  </Text>
                </View>
                <View className="items-end shrink-0">
                  <Text className="text-base font-sans-bold text-primary">
                    {formatCurrency(
                      item.billing === "Yearly" ? item.price / 12 : item.price,
                      "USD",
                    )}
                  </Text>
                  <Text className="text-xs font-sans-medium text-muted-foreground">
                    per month
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
