import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold text-green-400">
                Welcome to Native wind!
            </Text>
            <Link href="/onboarding"  className="mt-4 rounded p-4 bg-primary text-white">Go to onboarding</Link>
            <Link href="/(auth)/sign-in" className="mt-4 rounded p-4 bg-primary text-white">Go to sign in</Link>
            <Link href="/(auth)/sign-up" className="mt-4 rounded p-4 bg-primary text-white">Go to sign up</Link>
        </View>
    );
}