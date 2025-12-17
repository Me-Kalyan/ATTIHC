import { View, Text } from "react-native";
import { useTheme } from "../theme";

export default function SettingsScreen() {
  const { isDark } = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: isDark ? "#000" : "#fff" }}>
      <Text style={{ color: isDark ? "#fff" : "#000" }}>Settings</Text>
    </View>
  );
}
