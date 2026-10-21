import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CatchesStackParamList } from "../types";
import { CatchesHomeScreen } from "../../screens/CatchesHomeScreen";
import { CatchDetailScreen } from "../../screens/CatchDetailScreen";

const Stack = createNativeStackNavigator<CatchesStackParamList>();

export function CatchesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CatchesHome"
        component={CatchesHomeScreen}
        options={{ title: "Catches" }}
      />
      <Stack.Screen
        name="CatchDetail"
        component={CatchDetailScreen}
        options={{ title: "Catch" }}
      />
    </Stack.Navigator>
  );
}
