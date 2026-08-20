import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { PokedexStackParamList } from "../types";
import { PokedexHomeScreen } from "../../screens/PokedexHomeScreen";
import { SpeciesDetailScreen } from "../../screens/SpeciesDetailScreen";
import { CatchDetailScreen } from "../../screens/CatchDetailScreen";

const Stack = createNativeStackNavigator<PokedexStackParamList>();

export function PokedexStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PokedexHome"
        component={PokedexHomeScreen}
        options={{ title: "Pokédex" }}
      />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={{ title: "Species" }}
      />
      <Stack.Screen
        name="CatchDetail"
        component={CatchDetailScreen}
        options={{ title: "Catch" }}
      />
    </Stack.Navigator>
  );
}
