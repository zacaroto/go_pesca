import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "./types";
import { PokedexStack } from "./stacks/PokedexStack";
import { CatchesStack } from "./stacks/CatchesStack";
import { CommunityStack } from "./stacks/CommunityStack";
import { SpeciesStack } from "./stacks/SpeciesStack";
import { CustomTabBar } from "./components/CustomTabBar";

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Pokedex"
        component={PokedexStack}
        options={{ title: "Pokédex" }}
      />
      <Tab.Screen
        name="Catches"
        component={CatchesStack}
        options={{ title: "Catches" }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{ title: "Community" }}
      />
      <Tab.Screen
        name="Species"
        component={SpeciesStack}
        options={{ title: "Species" }}
      />
    </Tab.Navigator>
  );
}
