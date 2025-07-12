import { View, Text } from "react-native";
import { COLORS } from "../constants/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
