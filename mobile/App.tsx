import { enableScreens } from "react-native-screens";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TodayScreen from "./src/screens/Today";
import SavedScreen from "./src/screens/Saved";
import HistoryScreen from "./src/screens/History";
import SettingsScreen from "./src/screens/Settings";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "./src/theme";
import { Pressable } from "react-native";

const Tab = createBottomTabNavigator();

export default function App() {
  enableScreens(true);
  return (
    <>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </>
  );
}

function AppInner() {
  const { isDark } = useTheme();
  return (
    <>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            headerRight: () => <ThemeToggle />,
          }}
        >
          <Tab.Screen
            name="Today"
            component={TodayScreen}
            options={{
              tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="sunny-outline" color={color} size={size ?? 20} />,
            }}
          />
          <Tab.Screen
            name="Saved"
            component={SavedScreen}
            options={{
              tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="bookmark-outline" color={color} size={size ?? 20} />,
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="calendar-outline" color={color} size={size ?? 20} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="settings-outline" color={color} size={size ?? 20} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

function ThemeToggle() {
  const { isDark, theme, setTheme } = useTheme();
  const next = theme === "system" ? (isDark ? "light" : "dark") : theme === "dark" ? "light" : "dark";
  return (
    <Pressable
      onPress={() => setTheme(next)}
      style={{ marginRight: 16 }}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
    >
      <Ionicons name={isDark ? "moon" : "sunny"} size={22} />
    </Pressable>
  );
}
