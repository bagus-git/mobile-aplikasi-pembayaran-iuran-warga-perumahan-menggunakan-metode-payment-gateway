import { StackActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Image, Text } from "@rneui/themed";
import {
  ActivityIndicator,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Theme } from "../helpers/constants";
import { useAppDispatch } from "../store/hooks";
import { falseFreshInstall } from "../store/InitSlice";

interface WelcomeProps {
  navigation: StackNavigationProp<any, any>;
}

const Welcome = ({ navigation }: WelcomeProps) => {
  const dispatch = useAppDispatch();
  const onPress = () => {
    dispatch(falseFreshInstall());
    navigation.dispatch(StackActions.replace("Login"));
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <Image
          source={require("../../assets/images/logo.png")}
          PlaceholderContent={<ActivityIndicator />}
          style={styles.image}
          resizeMode="contain"
        />
        <Text h1 style={styles.title}>
          GMJR
        </Text>
        <Text style={styles.subTitle}>
          PERUMAHAN GREEN MUTIARA JAVA REGENCY
        </Text>
        <View style={styles.button}>
          <Button
            onPress={onPress}
            size="lg"
            color={Theme.PRIMARY_COLOR}
            radius="lg"
          >
            Yuk Bayar Iuran Sekarang!
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.WHITE_COLOR,
    alignItems: "center",
  },
  image: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(40),
    width: PixelRatio.getPixelSizeForLayoutSize(80),
    height: PixelRatio.getPixelSizeForLayoutSize(80),
  },
  title: {
    fontSize: Theme.FONT_SIZE_LARGE,
    color: Theme.PRIMARY_COLOR,
  },
  subTitle: {
    fontSize: Theme.FONT_SIZE_XX_SMALL,
    textAlign: "center",
    color: Theme.PRIMARY_COLOR,
  },
  button: {
    position: "absolute",
    bottom: PixelRatio.getPixelSizeForLayoutSize(10),
    padding: PixelRatio.getPixelSizeForLayoutSize(2),
  },
});

export default Welcome;
