import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Text } from "@rneui/themed";
import {
  ActivityIndicator,
  PixelRatio,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Theme } from "../helpers/constants";
import * as Linking from "expo-linking";

interface RegisterPropsI {
  navigation: StackNavigationProp<any, any>;
}

const phoneAdmin = "6282280997037";
const Register = ({ navigation }: RegisterPropsI) => {
  const goToWhatsapp = () => {
    Linking.openURL(
      `https://wa.me/${phoneAdmin}?text=Saya%20ingin%20daftar%20aplikasil%20iuran%20GMJ`
    );
  };
  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.registerWrapper}>
          <Text
            style={[
              styles.text,
              {
                fontWeight: "bold",
                marginBottom: PixelRatio.getPixelSizeForLayoutSize(5),
              },
            ]}
          >
            Panduan pendaftaran akun aplikasi pembayaran:
          </Text>
          <Text
            style={[
              styles.text,
              { marginBottom: PixelRatio.getPixelSizeForLayoutSize(5) },
            ]}
          >
            Untuk mendaftar akun silahkan Hubungi Admin Via Whatsapp.
            Dipersilahkan mengirimkan data diri dan rumah ke admin. Sebagai
            berikut:
          </Text>
          <Text style={styles.text}>Nama Lengkap:</Text>
          <Text style={styles.text}>Nomor Rumah:</Text>
          <Text style={styles.text}>Blok Jalan:</Text>
          <Text style={styles.text}>Nomor Telepon:</Text>
          <Text style={styles.text}>Alamat Email:</Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: PixelRatio.getPixelSizeForLayoutSize(15),
            }}
          >
            <Image
              source={require("../../assets/images/logo-wa.png")}
              PlaceholderContent={<ActivityIndicator />}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={goToWhatsapp}>
              <Text
                style={{
                  textAlign: "center",
                  color: Theme.PRIMARY_COLOR,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Klik untuk Hubungi Admin Via Whatsapp
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  registerWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
    padding: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  text: {
    color: Theme.BLACK_COLOR,
    width: "100%",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  image: {
    width: PixelRatio.getPixelSizeForLayoutSize(10),
    height: PixelRatio.getPixelSizeForLayoutSize(10),
    marginRight: PixelRatio.getPixelSizeForLayoutSize(2),
  },
});

export default Register;
