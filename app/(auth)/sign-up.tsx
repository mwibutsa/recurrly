import { useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";
  const canSubmit = !!email.trim() && !!password.trim() && !isLoading;

  const handleSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as Href);
        },
      });
    }
  };

  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (needsVerification) {
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
                  Verify your email
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
                      errors?.fields?.code
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    value={code}
                    onChangeText={setCode}
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
                    !code || isLoading ? "bg-accent/45" : "bg-accent"
                  }`}
                  onPress={handleVerify}
                  disabled={!code || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff9e3" size="small" />
                  ) : (
                    <Text className="text-base font-sans-bold text-background">
                      Verify email
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  className="items-center rounded-2xl border border-accent/30 bg-accent/10 py-3"
                  onPress={() => signUp.verifications.sendEmailCode()}
                  disabled={isLoading}
                >
                  <Text className="text-sm font-sans-semibold text-accent">
                    Resend code
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
                Create account
              </Text>
              <Text className="mt-2 text-base font-sans-medium text-muted-foreground text-center max-w-xs">
                Track all your subscriptions in one place
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
                    errors?.fields?.emailAddress
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
                {errors?.fields?.emailAddress && (
                  <Text className="text-xs font-sans-medium text-destructive">
                    {errors.fields.emailAddress.message}
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
                    placeholder="At least 8 characters"
                    placeholderTextColor="rgba(8,17,38,0.35)"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={canSubmit ? handleSignUp : undefined}
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
                onPress={handleSignUp}
                disabled={!canSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-base font-sans-bold text-background">
                    Create account
                  </Text>
                )}
              </Pressable>

              {/* Legal */}
              <Text className="text-xs font-sans-medium text-muted-foreground text-center px-2">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </Text>

              {/* Switch to sign in */}
              <View className="flex-row items-center justify-center gap-1">
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  Already have an account?
                </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable>
                    <Text className="text-sm font-sans-bold text-accent">
                      Sign in
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* Required by Clerk for bot protection */}
            <View nativeID="clerk-captcha" />
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
