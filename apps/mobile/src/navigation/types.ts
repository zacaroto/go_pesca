import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Pokedex: undefined;
  Catches: undefined;
  NewCatch: undefined;
  Community: undefined;
  Species: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
