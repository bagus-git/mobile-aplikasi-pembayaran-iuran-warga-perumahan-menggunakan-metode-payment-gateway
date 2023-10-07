import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, Text } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { PixelRatio, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../helpers/constants';
import { numberWithDots } from '../helpers/utils';
import { useAppSelector } from '../store/hooks';
import { RouteProp, StackActions } from '@react-navigation/native';
import { PaymentModel } from '../models/Model';

type RootParamList = {
  DetailPayment: { payment: PaymentModel; success: boolean };
};

type BlurredSuccessRouteProp = RouteProp<RootParamList, 'DetailPayment'>;

interface CheckoutPropsI {
  navigation?: StackNavigationProp<any, any>;
  route?: BlurredSuccessRouteProp;
}

const Checkout = ({ navigation, route }: CheckoutPropsI) => {
  const { payment, success } = route!.params;
  const people = useAppSelector((state) => state.people);

  const onPressOK = () => {
    navigation!.dispatch(StackActions.replace('HomeBottomNavigator'));
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.checkoutWrapper}>
          <View style={styles.row}>
            <Text
              h4
              style={{
                width: '100%',
                color: Theme.PRIMARY_COLOR,
                textAlign: 'center',
              }}
            >
              {success ? `Transaksi Berhasil` : `Transaksi Gagal`}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: PixelRatio.getPixelSizeForLayoutSize(10) }]}>
            <Text style={[styles.itemTitle, { fontWeight: 'bold' }]}>Detail Tranksaksi :</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Total Pembayaran</Text>
            <Text style={styles.itemValue}>Rp. {numberWithDots(Number(payment.transactionAmount))},-</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Nomor Pelanggan</Text>
            <Text style={styles.itemValue}>{people.idNumber}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Blok Jalan</Text>
            <Text style={styles.itemValue}>{people.roadBlock}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Nomor Rumah</Text>
            <Text style={styles.itemValue}>{people.houseNumber}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Periode Tagihan</Text>
            <Text style={styles.itemValue}>{payment.periode}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Waktu Pembayaran</Text>
            <Text style={styles.itemValue}>{payment.transactionTime}</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <View style={{ width: '80%' }}>
              <Button onPress={onPressOK} size="md" color={Theme.PRIMARY_COLOR} radius="lg" style={styles.button}>
                Ok
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
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  checkoutWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  rowBorder: {
    borderBottomColor: Theme.GRAY,
    borderBottomWidth: PixelRatio.getPixelSizeForLayoutSize(1),
  },
  row: {
    paddingLeft: PixelRatio.getPixelSizeForLayoutSize(12),
    paddingBottom: PixelRatio.getPixelSizeForLayoutSize(5),
    width: '100%',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    width: '50%',
    color: Theme.BLACK_COLOR,
  },
  itemValue: {
    width: '50%',
    textAlign: 'left',
    color: Theme.BLACK_COLOR,
  },
  buttonWrapper: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: PixelRatio.getPixelSizeForLayoutSize(20),
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default Checkout;
