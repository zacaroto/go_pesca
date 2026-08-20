import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { TabNavigator } from "./TabNavigator";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: true, title: "Login" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: true, title: "Register" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
