import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Pokedex: { focused: "grid", unfocused: "grid-outline" },
  Catches: { focused: "list", unfocused: "list-outline" },
  Species: { focused: "search", unfocused: "search-outline" },
  Community: { focused: "people", unfocused: "people-outline" },
};

const ACTIVE_COLOR = "#0891b2";
const INACTIVE_COLOR = "#9ca3af";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tabRoutes = state.routes;
  const fabIndex = Math.floor(tabRoutes.length / 2);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {tabRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconConfig = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
              ? options.title
              : route.name;

        return (
          <React.Fragment key={route.key}>
            {index === fabIndex && (
              <Pressable
                style={styles.fabWrapper}
                onPress={() => rootNavigation.navigate("NewCatch")}
                accessibilityLabel="New Catch"
                accessibilityRole="button"
              >
                <View style={styles.fabButton}>
                  <Ionicons name="add" size={28} color="#fff" />
                </View>
                <Text style={styles.fabLabel}>New Catch</Text>
              </Pressable>
            )}
            <Pressable
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityLabel={label}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={styles.tab}
            >
              {iconConfig && (
                <Ionicons
                  name={isFocused ? iconConfig.focused : iconConfig.unfocused}
                  size={24}
                  color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
              )}
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR },
                ]}
              >
                {label}
              </Text>
              {isFocused && <View style={styles.indicator} />}
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    alignItems: "flex-end",
    paddingTop: 6,
    overflow: "visible",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
    marginTop: 1,
  },
  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 4,
    gap: 2,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
    shadowColor: "#0891b2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: "#0891b2",
  },
  fabLabel: {
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
    color: "#0891b2",
  },
});
