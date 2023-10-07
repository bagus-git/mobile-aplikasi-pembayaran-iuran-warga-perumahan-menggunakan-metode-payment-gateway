import { StackNavigationProp } from "@react-navigation/stack";
import { Button, CheckBox, Icon, Text } from "@rneui/themed";
import { useState } from "react";
import {
  PixelRatio,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { BANK_LIST_MAP, Theme } from "../helpers/constants";
import { BankType } from "../models/Model";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPaymentMethod } from "../store/PaymentSlice";

interface PaymentMethodPropsI {
  navigation: StackNavigationProp<any, any>;
}

const PaymentMethod = ({ navigation }: PaymentMethodPropsI) => {
  const dispatch = useAppDispatch();
  const payment = useAppSelector((state) => state.payment);
  const [bankSelected, setBankSelected] = useState<BankType>(
    payment.paymentMethod
  );

  const onConfirm = () => {
    dispatch(setPaymentMethod(bankSelected));
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.paymentMethodWrapper}>
          {BANK_LIST_MAP.map(({ key, value }, index) => (
            <View key={index} style={[styles.row, styles.rowBorder]}>
              <Icon
                name="card-outline"
                color={Theme.BLACK_COLOR}
                type="ionicon"
                size={PixelRatio.getPixelSizeForLayoutSize(10)}
              />
              <Text style={styles.itemTitle}>{value}</Text>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={Theme.SECONDARY_COLOR}
                containerStyle={{ backgroundColor: Theme.WHITE_COLOR }}
                checked={bankSelected === value}
                size={PixelRatio.getPixelSizeForLayoutSize(10)}
                onPress={() => {
                  setBankSelected(value);
                }}
              />
            </View>
          ))}

          <View style={styles.buttonWrapper}>
            <View style={{ width: "80%" }}>
              <Button
                onPress={onConfirm}
                size="md"
                color={Theme.PRIMARY_COLOR}
                radius="lg"
                style={styles.button}
              >
                Konfirmasi
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
  paymentMethodWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20),
  },
  rowBorder: {
    borderBottomColor: Theme.GRAY,
    borderBottomWidth: PixelRatio.getPixelSizeForLayoutSize(1),
  },
  row: {
    paddingLeft: PixelRatio.getPixelSizeForLayoutSize(12),
    paddingBottom: PixelRatio.getPixelSizeForLayoutSize(2),
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: Theme.FONT_SIZE_XXX_SMALL,
    width: "50%",
    color: Theme.BLACK_COLOR,
  },
  buttonWrapper: {
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: PixelRatio.getPixelSizeForLayoutSize(20),
  },
  button: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
  },
});

export default PaymentMethod;
