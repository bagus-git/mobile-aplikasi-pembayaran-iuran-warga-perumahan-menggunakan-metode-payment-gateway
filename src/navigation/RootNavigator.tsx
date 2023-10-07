import React from "react";
import {
  NavigationContainer,
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { Icon, useTheme } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../views/Welcome";
import Login from "../views/Login";
import Home from "../views/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PixelRatio, Text, TouchableOpacity, View } from "react-native";
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { Theme } from "../helpers/constants";
import Account from "../views/Account";
import BillInfo from "../views/BillInfo";
import Checkout from "../views/Checkout";
import PaymentMethod from "../views/PaymentMethod";
import { useAppSelector } from "../store/hooks";
import Payment from "../views/Payment";
import DetailPayment from "../views/DetailPayment";
import Register from "../views/Register";

interface IconI {
  [key: string]: string;
}

const iconsTab: IconI = {
  Home: "home",
  Akun: "person-outline",
};

interface TabBarProps {
  descriptors: BottomTabDescriptorMap;
  navigation:
    | NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
    | any;
  state: TabNavigationState<ParamListBase>;
}

const MyTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Theme.WHITE_COLOR,
        height: PixelRatio.getPixelSizeForLayoutSize(30),
        justifyContent: "center",
        alignItems: "center",
        paddingTop: PixelRatio.getPixelSizeForLayoutSize(2),
        paddingBottom: PixelRatio.getPixelSizeForLayoutSize(2),
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const icon = iconsTab[label];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: "center",
              height: "100%",
            }}
            key={`${index}${label}`}
          >
            <Icon
              reverse
              name={icon}
              type="ionicon"
              size={PixelRatio.getPixelSizeForLayoutSize(5)}
              color={isFocused ? Theme.PRIMARY_COLOR : Theme.GRAY}
              reverseColor={Theme.WHITE_COLOR}
            />
            <Text
              style={{
                color: isFocused ? Theme.PRIMARY_COLOR : Theme.GRAY,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BillStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BillInfo">
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          title: "Info Tagihan",
          gestureEnabled: true,
        }}
        name="BillInfo"
        component={BillInfo}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          title: "Checkout",
          gestureEnabled: true,
        }}
        name="Checkout"
        component={Checkout}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          title: "PaymentMethod",
          gestureEnabled: true,
        }}
        name="PaymentMethod"
        component={PaymentMethod}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          title: "Payment",
          gestureEnabled: false,
          headerLeft: () => null,
        }}
        name="Payment"
        component={Payment}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          title: "DetailPayment",
          gestureEnabled: false,
          headerLeft: () => null,
        }}
        name="DetailPayment"
        component={DetailPayment}
      />
    </Stack.Navigator>
  );
};

const HomeBottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        options={{
          headerLeft: () => null,
          headerShown: false,
          tabBarLabel: "Home",
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          headerLeft: () => null,
          headerShown: false,
          tabBarLabel: "Akun",
        }}
        name="AccountBar"
        component={Account}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { isFreshInstall, isLogin } = useAppSelector((state) => state.init);
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme?.colors.background,
          primary: "",
          card: "",
          text: "",
          border: "",
          notification: "",
        },
        dark: theme.mode === "dark",
      }}
    >
      <Stack.Navigator
        initialRouteName={
          isFreshInstall ? "Welcome" : isLogin ? "HomeBottomNavigator" : "Login"
        }
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerLeft: () => null,
            headerShown: false,
            gestureEnabled: false,
          }}
          component={Login}
        />
        <Stack.Screen
          name="Register"
          options={{
            headerShown: true,
            gestureEnabled: true,
            title: "Daftar Akun",
            headerStyle: { backgroundColor: Theme.WHITE_COLOR },
          }}
          component={Register}
        />
        <Stack.Screen
          options={{
            headerLeft: () => null,
            headerShown: false,
            gestureEnabled: false,
          }}
          name="BillStackNavigator"
          component={BillStackNavigator}
        />
        <Stack.Screen
          options={{
            headerLeft: () => null,
            headerShown: false,
            gestureEnabled: true,
          }}
          name="HomeBottomNavigator"
          component={HomeBottomNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
