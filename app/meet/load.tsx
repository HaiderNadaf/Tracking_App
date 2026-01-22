import { View, Button } from "react-native";
import { router } from "expo-router";

export default function Load() {
  return (
    <View>
      <Button
        title="YES - Load Happening"
        onPress={() => router.push("/meet/load-form")}
      />
      <Button
        title="NO - No Load"
        onPress={() => router.push("/meet/no-load")}
      />
    </View>
  );
}
