import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet } from "react-native";
import type { TabParamList } from "./types";

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#0891b2",
      }}
    >
      <Tab.Screen
        name="Pokedex"
        options={{ title: "Pokédex", tabBarLabel: "Pokédex" }}
      >
        {() => <PlaceholderScreen name="Pokédex" />}
      </Tab.Screen>
      <Tab.Screen
        name="Catches"
        options={{ title: "Catches", tabBarLabel: "Catches" }}
      >
        {() => <PlaceholderScreen name="Catches" />}
      </Tab.Screen>
      <Tab.Screen
        name="NewCatch"
        options={{ title: "New Catch", tabBarLabel: "+" }}
      >
        {() => <PlaceholderScreen name="New Catch" />}
      </Tab.Screen>
      <Tab.Screen
        name="Community"
        options={{ title: "Community", tabBarLabel: "Community" }}
      >
        {() => <PlaceholderScreen name="Community" />}
      </Tab.Screen>
      <Tab.Screen
        name="Species"
        options={{ title: "Species", tabBarLabel: "Species" }}
      >
        {() => <PlaceholderScreen name="Species" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
