import { useSignIn } from "@clerk/expo";
import { styled } from "nativewind";
import { type Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  const canSubmit = !!email.trim() && !!password.trim() && !isLoading;

  const handleSignIn = async () => {
    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as Href);
        },
      });
    } else if (signIn.status === "needs_client_trust") {
      await signIn.mfa.sendEmailCode();
    }
  };

  const handleVerifyMfa = async () => {
    await signIn.mfa.verifyEmailCode({ code: mfaCode });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as Href);
        },
      });
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-5 pt-10 pb-10">
              <BrandBlock />

              <View className="mt-8 items-center">
                <Text className="text-3xl font-sans-bold text-primary">
                  Check your email
                </Text>
                <Text className="mt-2 text-base font-sans-medium text-muted-foreground text-center max-w-xs">
                  We sent a 6-digit code to{" "}
                  <Text className="font-sans-bold text-primary">{email}</Text>
                </Text>
              </View>

              <View className="mt-8 rounded-3xl border border-border bg-card p-5 gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-sans-semibold text-primary">
                    Verification code
                  </Text>
                  <TextInput
                    style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                  className={`rounded-2xl border text-base font-sans-medium text-primary bg-background ${
                      errors?.fields?.code ? "border-destructive" : "border-border"
                    }`}
                    value={mfaCode}
                    onChangeText={setMfaCode}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="rgba(8,17,38,0.35)"
                    keyboardType="number-pad"
                    autoFocus
                  />
                  {errors?.fields?.code && (
                    <Text className="text-xs font-sans-medium text-destructive">
                      {errors.fields.code.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  className={`items-center rounded-2xl py-4 ${
                    !mfaCode || isLoading ? "bg-accent/45" : "bg-accent"
                  }`}
                  onPress={handleVerifyMfa}
                  disabled={!mfaCode || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff9e3" size="small" />
                  ) : (
                    <Text className="text-base font-sans-bold text-background">
                      Verify
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  className="items-center rounded-2xl border border-accent/30 bg-accent/10 py-3"
                  onPress={() => signIn.mfa.sendEmailCode()}
                  disabled={isLoading}
                >
                  <Text className="text-sm font-sans-semibold text-accent">
                    Resend code
                  </Text>
                </Pressable>

                <Pressable
                  className="items-center py-1"
                  onPress={() => signIn.reset()}
                >
                  <Text className="text-sm font-sans-medium text-muted-foreground">
                    Start over
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-5 pt-10 pb-10">
            <BrandBlock />

            <View className="mt-8 items-center">
              <Text className="text-3xl font-sans-bold text-primary">
                Welcome back
              </Text>
              <Text className="mt-2 text-base font-sans-medium text-muted-foreground text-center max-w-xs">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            <View className="mt-8 rounded-3xl border border-border bg-card p-5 gap-4">
              {/* Email */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">
                  Email
                </Text>
                <TextInput
                  style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                  className={`rounded-2xl border text-base font-sans-medium text-primary bg-background ${
                    errors?.fields?.identifier
                      ? "border-destructive"
                      : "border-border"
                  }`}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(8,17,38,0.35)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
                {errors?.fields?.identifier && (
                  <Text className="text-xs font-sans-medium text-destructive">
                    {errors.fields.identifier.message}
                  </Text>
                )}
              </View>

              {/* Password */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">
                  Password
                </Text>
                <View>
                  <TextInput
                    style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                  className={`rounded-2xl border text-base font-sans-medium text-primary bg-background ${
                      errors?.fields?.password
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(8,17,38,0.35)"
                    secureTextEntry={!showPassword}
                    autoComplete="current-password"
                    returnKeyType="done"
                    onSubmitEditing={canSubmit ? handleSignIn : undefined}
                  />
                  <Pressable
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((v) => !v)}
                  >
                    <Text className="text-sm font-sans-semibold text-accent">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
                {errors?.fields?.password && (
                  <Text className="text-xs font-sans-medium text-destructive">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>

              {/* Global error */}
              {!!errors?.global?.length && (
                <View className="rounded-xl bg-destructive/10 px-4 py-3 gap-1">
                  {errors.global.map((e, i) => (
                    <Text key={i} className="text-sm font-sans-medium text-destructive">
                      {e.message}
                    </Text>
                  ))}
                </View>
              )}

              {/* CTA */}
              <Pressable
                className={`items-center rounded-2xl py-4 ${
                  !canSubmit ? "bg-accent/45" : "bg-accent"
                }`}
                onPress={handleSignIn}
                disabled={!canSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-base font-sans-bold text-background">
                    Sign in
                  </Text>
                )}
              </Pressable>

              {/* Switch to sign up */}
              <View className="flex-row items-center justify-center gap-1 pt-1">
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  New to Recurly?
                </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable>
                    <Text className="text-sm font-sans-bold text-accent">
                      Create an account
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BrandBlock() {
  return (
    <View className="items-center">
      <View className="flex-row items-center gap-3">
        <View className="size-14 items-center justify-center rounded-2xl bg-accent">
          <Text className="text-2xl font-sans-extrabold text-background">R</Text>
        </View>
        <View>
          <Text className="text-3xl font-sans-extrabold text-primary">Recurly</Text>
          <Text
            style={{ marginTop: -2 }}
            className="text-xs font-sans-semibold uppercase tracking-widest text-muted-foreground"
          >
            Smart Billing
          </Text>
        </View>
      </View>
    </View>
  );
}
