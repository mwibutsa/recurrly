import {
  formatCurrency,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";
import { Image, Pressable, Text, View } from "react-native";

// Mask payment method: "Visa ending in 8530" → "*****8530"
function maskPayment(raw?: string): string {
  if (!raw) return "—";
  const match = raw.match(/(\d{4})$/);
  return match ? `*****${match[1]}` : raw;
}

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  onPress,
  expanded,
  paymentMethod,
  startDate,
  status,
  onCancelPress,
  isCancelling,
}: SubscriptionCardProps) => {
  const isCancelled = status === "cancelled";

  return (
    <Pressable
      className={clsx("sub-card", {
        "bg-card":          !expanded || !color,
        "sub-card-expanded": expanded,
      })}
      style={expanded && color ? { backgroundColor: color } : undefined}
      onPress={onPress}
    >
      {/* ── Collapsed header row ── */}
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {plan?.trim() || category?.trim() || ""}
            </Text>
          </View>
        </View>
        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {/* ── Expanded details ── */}
      {expanded && (
        <View className="sub-body">
          <View className="sub-details">

            {/* Payment info row */}
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment info: </Text>
                <Text className="sub-value" numberOfLines={1}>
                  {maskPayment(paymentMethod)}
                </Text>
              </View>
              <Pressable className="rounded-full border border-primary px-3 py-1">
                <Text className="text-xs font-sans-bold text-primary">Manage</Text>
              </Pressable>
            </View>

            {/* Plan details row */}
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Plan details: </Text>
                <Text className="sub-value font-sans-bold" numberOfLines={1}>
                  {plan?.trim() || "Standard"}
                </Text>
              </View>
              <Pressable className="rounded-full border border-primary px-3 py-1">
                <Text className="text-xs font-sans-bold text-primary">Change</Text>
              </Pressable>
            </View>

            {/* Start / renewal */}
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Started: </Text>
                <Text className="sub-value" numberOfLines={1}>
                  {startDate ? formatSubscriptionDateTime(startDate) : "—"}
                </Text>
              </View>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Renews: </Text>
                <Text className="sub-value" numberOfLines={1}>
                  {renewalDate ? formatSubscriptionDateTime(renewalDate) : "—"}
                </Text>
              </View>
            </View>

          </View>

          {/* Cancel button */}
          <Pressable
            className={clsx("sub-cancel mt-4", {
              "sub-cancel-disabled": isCancelled || isCancelling,
            })}
            onPress={onCancelPress}
            disabled={isCancelled || isCancelling}
          >
            <Text className="sub-cancel-text">
              {isCancelled
                ? "Subscription Cancelled"
                : isCancelling
                ? "Cancelling…"
                : "Cancel Subscription"}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
