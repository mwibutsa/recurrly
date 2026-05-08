import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import clsx from "clsx";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Entertainment", color: "#f5c542" },
  { label: "AI Tools",      color: "#b8d4e3" },
  { label: "Developer Tools", color: "#e8def8" },
  { label: "Design",        color: "#f5c5c5" },
  { label: "Productivity",  color: "#c5e8c5" },
  { label: "Cloud",         color: "#c5d5e8" },
  { label: "Music",         color: "#e8d4f5" },
  { label: "Other",         color: "#e8e8e8" },
] as const;

type Category = (typeof CATEGORIES)[number]["label"];
type Frequency = "Monthly" | "Yearly";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName]           = useState("");
  const [price, setPrice]         = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory]   = useState<Category | "">("");
  const [submitting, setSubmitting] = useState(false);

  const priceNum  = parseFloat(price);
  const nameValid  = name.trim().length > 0;
  const priceValid = !isNaN(priceNum) && priceNum > 0;
  const canSubmit  = nameValid && priceValid && !submitting;

  const reset = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("");
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);

    const startDate   = dayjs().toISOString();
    const renewalDate = frequency === "Monthly"
      ? dayjs().add(1, "month").toISOString()
      : dayjs().add(1, "year").toISOString();

    const chosenCategory = category || "Other";
    const catConfig = CATEGORIES.find((c) => c.label === chosenCategory);

    const subscription: Subscription = {
      id:            `sub-${Date.now()}`,
      name:          name.trim(),
      price:         priceNum,
      currency:      "USD",
      billing:       frequency,
      category:      chosenCategory,
      status:        "active",
      startDate,
      renewalDate,
      icon:          icons.wallet,
      color:         catConfig?.color,
    };

    onSubmit(subscription);
    reset();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <Pressable className="flex-1 bg-black/50" onPress={handleClose} />

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <View className="rounded-t-3xl bg-background max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <Text className="text-xl font-sans-bold text-primary">
              New Subscription
            </Text>
            <Pressable
              className="size-8 items-center justify-center rounded-full bg-muted"
              onPress={handleClose}
            >
              <Text className="text-lg font-sans-bold text-primary">✕</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <View className="gap-2">
              <Text className="text-sm font-sans-semibold text-primary">
                Name
              </Text>
              <TextInput
                className={clsx(
                  "rounded-2xl border bg-card text-base font-sans-medium text-primary",
                  nameValid || !name ? "border-border" : "border-destructive",
                )}
                style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Spotify"
                placeholderTextColor="rgba(8,17,38,0.35)"
                returnKeyType="next"
              />
              {!nameValid && name.length > 0 && (
                <Text className="text-xs font-sans-medium text-destructive">
                  Name is required
                </Text>
              )}
            </View>

            {/* Price */}
            <View className="gap-2">
              <Text className="text-sm font-sans-semibold text-primary">
                Price (USD)
              </Text>
              <TextInput
                className={clsx(
                  "rounded-2xl border bg-card text-base font-sans-medium text-primary",
                  !price || priceValid ? "border-border" : "border-destructive",
                )}
                style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="rgba(8,17,38,0.35)"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
              {!!price && !priceValid && (
                <Text className="text-xs font-sans-medium text-destructive">
                  Enter a valid price greater than 0
                </Text>
              )}
            </View>

            {/* Frequency */}
            <View className="gap-2">
              <Text className="text-sm font-sans-semibold text-primary">
                Billing frequency
              </Text>
              <View className="flex-row gap-3">
                {(["Monthly", "Yearly"] as Frequency[]).map((f) => (
                  <Pressable
                    key={f}
                    className={clsx("picker-option", {
                      "picker-option-active": frequency === f,
                    })}
                    onPress={() => setFrequency(f)}
                  >
                    <Text
                      className={clsx("picker-option-text", {
                        "picker-option-text-active": frequency === f,
                      })}
                    >
                      {f}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Category */}
            <View className="gap-2">
              <Text className="text-sm font-sans-semibold text-primary">
                Category
              </Text>
              <View className="category-scroll">
                {CATEGORIES.map(({ label }) => (
                  <Pressable
                    key={label}
                    className={clsx("category-chip", {
                      "category-chip-active": category === label,
                    })}
                    onPress={() =>
                      setCategory((prev) => (prev === label ? "" : label))
                    }
                  >
                    <Text
                      className={clsx("category-chip-text", {
                        "category-chip-text-active": category === label,
                      })}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Submit */}
            <Pressable
              className={clsx("items-center rounded-2xl py-4 mt-2", {
                "bg-accent":     canSubmit,
                "bg-accent/45":  !canSubmit,
              })}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#fff9e3" size="small" />
              ) : (
                <Text className="text-base font-sans-bold text-background">
                  Add subscription
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
