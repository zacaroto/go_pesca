import type { NavigatorScreenParams } from "@react-navigation/native";

// Per-tab stack param lists
export type PokedexStackParamList = {
  PokedexHome: undefined;
  SpeciesDetail: { speciesId: string };
  CatchDetail: { catchId: string };
};

export type CatchesStackParamList = {
  CatchesHome: undefined;
  CatchDetail: { catchId: string };
};

export type CommunityStackParamList = {
  CommunityHome: undefined;
  CatchDetail: { catchId: string };
  UserProfile: { userId: string };
};

export type SpeciesStackParamList = {
  SpeciesHome: undefined;
  SpeciesDetail: { speciesId: string };
};

// Tab navigator
export type TabParamList = {
  Pokedex: NavigatorScreenParams<PokedexStackParamList>;
  Catches: NavigatorScreenParams<CatchesStackParamList>;
  Community: NavigatorScreenParams<CommunityStackParamList>;
  Species: NavigatorScreenParams<SpeciesStackParamList>;
};

// Root stack (tabs + modals)
export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  NewCatch: undefined;
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
