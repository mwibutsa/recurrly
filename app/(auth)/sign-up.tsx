import {View,Text} from 'react-native';
import {Link} from "expo-router";

const SignUp = () => {
    return <View>
        <Text>Sign In</Text>
        <Link href="/(auth)/sign-in">Login</Link>
    </View>
}

export default SignUp;