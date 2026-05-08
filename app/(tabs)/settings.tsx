import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

      {/* Profile card */}
      <View className="rounded-3xl border border-border bg-card p-5 flex-row items-center gap-4 mb-6">
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
          className="size-16 rounded-full"
        />
        <View className="flex-1 min-w-0">
          <Text className="text-base font-sans-bold text-primary" numberOfLines={1}>
            {displayName}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        className="items-center rounded-2xl bg-primary py-4"
        onPress={() => signOut()}
      >
        <Text className="text-base font-sans-bold text-background">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
