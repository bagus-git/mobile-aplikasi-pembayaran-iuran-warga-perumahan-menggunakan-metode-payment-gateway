import { StackActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@rneui/base";
import { Button, Icon } from "@rneui/themed";
import { useEffect, useState } from "react";
import { PixelRatio, StyleSheet, View } from "react-native";
import DefaultBox from "../components/DefaultBox";
import { Theme } from "../helpers/constants";
import { hp, wp } from "../helpers/responsive";
import { People } from "../models/Model";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLogin } from "../store/InitSlice";

interface AccountI {
  navigation: StackNavigationProp<any, any>;
}
type ObjectAssignType = {
  [key: string]: string;
};
const LABEL: ObjectAssignType = {
  phoneNumber: "Nomor Telepon",
  email: "Email",
  houseNumber: "Nomor Rumah",
  idNumber: "Nomor Pelanggan",
  name: "Nama",
  roadBlock: "Blok Jalan",
};
const Account = ({ navigation }: AccountI) => {
  const dispatch = useAppDispatch();
  const peopleSelector = useAppSelector((state) => state.people);
  const [people, setPeople] = useState<People>({
    phoneNumber: "",
    name: "",
    houseNumber: "",
    roadBlock: "",
    idNumber: "",
    email: "",
  });

  useEffect(() => {
    const clonePeople = { ...peopleSelector };
    delete clonePeople.idNumber;
    delete clonePeople.tagihan;
    delete clonePeople.password;
    delete clonePeople.status;
    delete clonePeople.pembayaran;
    setPeople(clonePeople);
  }, [peopleSelector]);

  const onLogoutPress = () => {
    dispatch(setLogin(false));
    navigation.dispatch(StackActions.replace("Login"));
  };
  return (
    <>
      <DefaultBox>
        <View style={styles.header}>
          <Text h2 style={styles.headerTitle}>
            {people.name}
          </Text>
          <Text style={styles.headerRoadBlock}>{people.roadBlock}</Text>
          <Text style={styles.headerHouseNumber}>{people.houseNumber}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.textTitle}>GREEN MUTIARA JAVA REGENCY</Text>
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Info Saya</Text>
          {Object.keys(people).map((key, index) => {
            const tPeople: ObjectAssignType =
              people as unknown as ObjectAssignType;
            return (
              <View key={`${index}${key}`} style={styles.itemWrapper}>
                <Text style={styles.itemTitle}>{LABEL[key]}</Text>
                <Text style={{ width: "5%" }}>:</Text>
                <Text style={styles.itemValue}>{tPeople[key]}</Text>
              </View>
            );
          })}
          <View style={styles.buttonLogoutWrapper}>
            <Button
              onPress={onLogoutPress}
              size="md"
              color={Theme.PRIMARY_COLOR}
              radius="sm"
            >
              <Icon
                name="exit-outline"
                type="ionicon"
                color={Theme.WHITE_COLOR}
                style={{ marginRight: 5 }}
              />
              Keluar
            </Button>
          </View>
        </View>
      </DefaultBox>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "column",
    marginTop: PixelRatio.getPixelSizeForLayoutSize(35),
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(15),
  },
  headerTitle: {
    color: Theme.WHITE_COLOR,
  },
  headerRoadBlock: {
    color: Theme.WHITE_COLOR,
    fontSize: Theme.FONT_SIZE_XXX_SMALL,
  },
  headerHouseNumber: {
    color: Theme.WHITE_COLOR,
    fontSize: Theme.FONT_SIZE_XXX_SMALL,
  },
  title: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(22.5),
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: "center",
    width: wp(85),
    borderRadius: 10,
    backgroundColor: Theme.WHITE_COLOR,
  },
  textTitle: {
    textAlign: "center",
    color: Theme.PRIMARY_COLOR,
    fontSize: Theme.FONT_SIZE_XXX_SMALL,
    fontWeight: "bold",
  },
  contentBox: {
    padding: 10,
    marginTop: PixelRatio.getPixelSizeForLayoutSize(10),
    alignSelf: "center",
    width: wp(85),
    backgroundColor: Theme.WHITE_COLOR,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
    position: "relative",
    height: hp(40),
  },
  contentTitle: {
    width: "100%",
    color: Theme.PRIMARY_COLOR,
  },
  itemWrapper: {
    width: "100%",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    width: "50%",
  },
  itemValue: {
    width: "45%",
    textAlign: "left",
  },
  buttonLogoutWrapper: {
    position: "absolute",
    width: "40%",
    bottom: 20,
    right: 20,
  },
});

export default Account;
