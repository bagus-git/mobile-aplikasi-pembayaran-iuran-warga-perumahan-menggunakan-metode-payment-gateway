import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Text } from "@rneui/themed";
import { useCallback } from "react";
import {
  PixelRatio,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Theme } from "../helpers/constants";
import { numberWithDots } from "../helpers/utils";
import { useAppSelector } from "../store/hooks";

interface BillInfoPropsI {
  navigation: StackNavigationProp<any, any>;
}

const BillInfo = ({ navigation }: BillInfoPropsI) => {
  const people = useAppSelector((state) => state.people);
  const onPress = () => {
    navigation.navigate("Checkout");
  };

  const bills = useCallback(() => {
    const allBill = people?.tagihan;
    if (allBill) {
      return Object.keys(allBill!)
        .map((bill) => {
          const month = bill.split("-")[1];
          const year = bill.split("-")[2];
          return `${month}/${year}`;
        })
        ?.toString();
    }
  }, [people]);

  const totalBill = useCallback(() => {
    let total = 0;
    const allBill = people?.tagihan;
    if (allBill) {
      Object.keys(allBill!).forEach((bill) => {
        total += Number(allBill![bill].bill);
      });
      return total;
    }
  }, [people]);

  const adminBill = useCallback(() => {
    const allBill = people?.tagihan;
    if (allBill) {
      const firstBill = allBill![Object.keys(allBill!)[0]];
      return Number(firstBill.cost);
    }
  }, [people]);

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.billInfoWrapper}>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Nomor Pelanggan</Text>
            <Text style={styles.itemValue}>{people.idNumber}</Text>
          </View>
          <View style={[styles.row, styles.gap]}>
            <Text style={styles.itemTitle}>Blok Jalan</Text>
            <Text style={styles.itemValue}>{people.roadBlock}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Nomor Rumah</Text>
            <Text style={styles.itemValue}>{people.houseNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Periode Tagihan</Text>
            <Text style={styles.itemValue}>{bills()}</Text>
          </View>
          <View style={[styles.row, styles.gap]}>
            <Text style={styles.itemTitleBold}>Detail Tagihan</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Jumlah Tagihan</Text>
            <Text style={styles.itemValue}>
              Rp. {numberWithDots(totalBill())},-
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Biaya Admin</Text>
            <Text style={styles.itemValue}>
              Rp. {numberWithDots(adminBill())},-
            </Text>
          </View>
          <View style={styles.button}>
            <View style={{ width: "80%" }}>
              <Button
                onPress={onPress}
                size="md"
                color={Theme.PRIMARY_COLOR}
                radius="lg"
              >
                Lanjutkan
              </Button>
            </View>
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
  billInfoWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20),
  },
  row: {
    paddingLeft: PixelRatio.getPixelSizeForLayoutSize(12),
    width: "100%",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gap: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(15),
  },
  itemTitle: {
    width: "50%",
    color: Theme.BLACK_COLOR,
  },
  itemTitleBold: {
    width: "100%",
    fontWeight: "bold",
    color: Theme.BLACK_COLOR,
  },
  itemValue: {
    width: "50%",
    textAlign: "left",
    color: Theme.BLACK_COLOR,
  },
  button: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: PixelRatio.getPixelSizeForLayoutSize(20),
  },
});

export default BillInfo;
