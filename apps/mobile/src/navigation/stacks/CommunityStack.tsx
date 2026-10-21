import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../types";
import { CommunityHomeScreen } from "../../screens/CommunityHomeScreen";
import { CatchDetailScreen } from "../../screens/CatchDetailScreen";
import { UserProfileScreen } from "../../screens/UserProfileScreen";

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityHome"
        component={CommunityHomeScreen}
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="CatchDetail"
        component={CatchDetailScreen}
        options={{ title: "Catch" }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
}
