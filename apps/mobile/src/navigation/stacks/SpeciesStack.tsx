import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SpeciesStackParamList } from "../types";
import { SpeciesHomeScreen } from "../../screens/SpeciesHomeScreen";
import { SpeciesDetailScreen } from "../../screens/SpeciesDetailScreen";

const Stack = createNativeStackNavigator<SpeciesStackParamList>();

export function SpeciesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SpeciesHome"
        component={SpeciesHomeScreen}
        options={{ title: "Species" }}
      />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={{ title: "Species" }}
      />
    </Stack.Navigator>
  );
}
