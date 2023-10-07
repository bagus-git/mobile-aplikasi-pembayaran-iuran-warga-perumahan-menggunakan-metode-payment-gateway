import React from 'react';
import { SafeAreaView, View, StyleSheet, Platform, StatusBar, PixelRatio } from 'react-native';
import { Theme } from '../helpers/constants';
import { hp, wp } from '../helpers/responsive';

interface DefaultBoxI {
  children: JSX.Element | JSX.Element[];
}

const DefaultBox = ({ children }: DefaultBoxI) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapperNotSafe}>
        <View style={styles.background}></View>
        {children}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Theme.GRAY,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  wrapperNotSafe: {
    flex: 1,
    width: '100%',
  },
  background: {
    backgroundColor: Theme.PRIMARY_COLOR,
    height: hp(35),
    width: wp(100),
    position: 'absolute',
    zIndex: -1,
  },
});
export default DefaultBox;
