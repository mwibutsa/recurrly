import { useRouter } from "expo-router";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:    "#ea7a53", // accent orange
  cream: "#fff9e3", // background cream
  dark:  "#081126", // primary navy
  teal:  "#8fd1bd", // subscription teal
  sand:  "#d4a97a", // muted sandy
} as const;

// ─── Shape primitives ─────────────────────────────────────────────────────────

/** Full circle */
function Circle({ size, color }: { size: number; color: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

/**
 * Quarter-circle: a square cell whose overflow is hidden,
 * containing an oversized circle offset to show only one quadrant.
 * quadrant: "TL" | "TR" | "BL" | "BR"
 */
function Quarter({
  size,
  color,
  q,
}: {
  size: number;
  color: string;
  q: "TL" | "TR" | "BL" | "BR";
}) {
  const offset = size; // circle diameter = 2× cell
  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <View
        style={{
          width: offset * 2,
          height: offset * 2,
          borderRadius: offset,
          backgroundColor: color,
          position: "absolute",
          ...(q === "TL" && { bottom: 0, right: 0 }),
          ...(q === "TR" && { bottom: 0, left: 0 }),
          ...(q === "BL" && { top: 0, right: 0 }),
          ...(q === "BR" && { top: 0, left: 0 }),
        }}
      />
    </View>
  );
}

/** Solid filled square cell */
function Square({ size, color }: { size: number; color: string }) {
  return <View style={{ width: size, height: size, backgroundColor: color }} />;
}

/** Empty cell — just accent background */
function Empty({ size }: { size: number }) {
  return <View style={{ width: size, height: size }} />;
}

// ─── Geometric art grid ───────────────────────────────────────────────────────
function GeometricArt({ cellSize: C_ }: { cellSize: number }) {
  /*
   * 4-column grid, rows top→bottom, matching the Figma design.
   * Each entry is a React element that's C_×C_ in size.
   */
  const rows: React.ReactElement[][] = [
    // Row 0
    [
      <Empty key="0-0" size={C_} />,
      <Circle key="0-1" size={C_} color={C.sand} />,
      <Quarter key="0-2" size={C_} color={C.cream} q="TR" />,
      <Quarter key="0-3" size={C_} color={C.cream} q="TL" />,
    ],
    // Row 1
    [
      <Circle key="1-0" size={C_} color={C.cream} />,
      <Circle key="1-1" size={C_} color={C.teal} />,
      <Circle key="1-2" size={C_} color={C.sand} />,
      <Quarter key="1-3" size={C_} color={C.cream} q="BR" />,
    ],
    // Row 2
    [
      <Quarter key="2-0" size={C_} color={C.cream} q="TR" />,
      <Square  key="2-1" size={C_} color={C.dark} />,
      <Square  key="2-2" size={C_} color={C.dark} />,
      <Square  key="2-3" size={C_} color={C.sand} />,
    ],
    // Row 3
    [
      <Square  key="3-0" size={C_} color={C.dark} />,
      <Quarter key="3-1" size={C_} color={C.cream} q="BL" />,
      <Quarter key="3-2" size={C_} color={C.cream} q="BR" />,
      <Square  key="3-3" size={C_} color={C.dark} />,
    ],
    // Row 4
    [
      <Quarter key="4-0" size={C_} color={C.cream} q="BL" />,
      <Square  key="4-1" size={C_} color={C.dark} />,
      <Circle  key="4-2" size={C_} color={C.dark} />,
      <Circle  key="4-3" size={C_} color={C.teal} />,
    ],
    // Row 5 (partial — teal bleed)
    [
      <Empty   key="5-0" size={C_} />,
      <Empty   key="5-1" size={C_} />,
      <Empty   key="5-2" size={C_} />,
      <Quarter key="5-3" size={C_} color={C.teal} q="TL" />,
    ],
  ];

  return (
    <View style={{ overflow: "hidden" }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row" }}>
          {row}
        </View>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cellSize = Math.floor(width / 4);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.bg }}
      edges={["top", "bottom"]}
    >
      {/* Art — fills upper portion */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <GeometricArt cellSize={cellSize} />
      </View>

      {/* Bottom copy + CTA */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 32, gap: 8 }}>
        <Text
          style={{
            fontFamily: "sans-extrabold",
            fontSize: 36,
            color: C.cream,
            lineHeight: 44,
          }}
        >
          Gain Financial Clarity
        </Text>
        <Text
          style={{
            fontFamily: "sans-medium",
            fontSize: 16,
            color: "rgba(255,249,227,0.75)",
            marginBottom: 28,
          }}
        >
          Track, analyze and cancel with ease
        </Text>

        {/* Get Started */}
        <Pressable
          onPress={() => router.replace("/(auth)/sign-up")}
          style={({ pressed }) => ({
            backgroundColor: C.cream,
            borderRadius: 100,
            paddingVertical: 18,
            alignItems: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: "sans-bold",
              fontSize: 16,
              color: C.dark,
            }}
          >
            Get Started
          </Text>
        </Pressable>

        {/* Already have an account */}
        <Pressable
          onPress={() => router.replace("/(auth)/sign-in")}
          style={{ alignItems: "center", paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: "sans-medium",
              fontSize: 14,
              color: "rgba(255,249,227,0.65)",
            }}
          >
            Already have an account?{" "}
            <Text style={{ fontFamily: "sans-bold", color: C.cream }}>
              Sign in
            </Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
