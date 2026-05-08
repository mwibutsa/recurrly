import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import cls from "clsx";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-icon">
      <View className={cls("tabs-pill", focused && "tabs-active")}>
        <Image source={icon} className="tabs-glyph" />
      </View>
    </View>
  );
};

const tabBar = components.tabBar;

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          borderRadius: tabBar.radius,
          marginHorizontal: tabBar.horizontalInset,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
        },
      }}
    >
      {tabs.map((data) => (
        <Tabs.Screen
          key={data.name}
          name={data.name}
          options={{
            title: data.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={data.icon} />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="subscriptions/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
