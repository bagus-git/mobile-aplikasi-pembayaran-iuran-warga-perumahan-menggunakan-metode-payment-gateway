import { StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { Alert, PixelRatio, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { deleteData, readData, writeData } from '../firebase/firebase';
import { BANK_LIST_MAP, Theme } from '../helpers/constants';
import { PaymentModel, People, StatusResponse } from '../models/Model';
import * as Clipboard from 'expo-clipboard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPaymentMethod } from '../store/PaymentSlice';
import Constants from 'expo-constants';
import { numberWithDots } from '../helpers/utils';

interface PaymentPropsI {
  navigation: StackNavigationProp<any, any>;
}

let interval: NodeJS.Timer;

const Payment = ({ navigation }: PaymentPropsI) => {
  const dispatch = useAppDispatch();
  const people = useAppSelector((state) => state.people);
  const [paymentState, setPaymentState] = useState<PaymentModel>();
  useEffect(() => {
    fetchData();
    return () => {
      if (interval) {
        return clearInterval(interval);
      }
    };
  }, []);

  const intervalChecking = (payment: PaymentModel) => {
    interval = setInterval(async () => {
      try {
        const serverKey = Constants.expoConfig?.extra?.midtransServerKeyEncoded;
        let data = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${serverKey}`,
          },
        } as RequestInit;
        const statusResponse = await fetch(`https://api.sandbox.midtrans.com/v2/${payment.orderId}/status`, data);
        const { transaction_status, transaction_id }: StatusResponse = await statusResponse.json();
        console.log('PAYMENT STATUS', transaction_id, transaction_status);
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
          const periods = payment.periode.split(',');
          await Promise.all(
            periods.map(async (periode) => {
              await deleteData(`warga/${payment.warga}/tagihan`, periode);
            })
          );
          const bills = await readData(`warga/${payment.warga}`, 'tagihan');
          if (!bills) {
            await writeData(`warga/${payment.warga}`, 'status', true);
          }
          await writeData(`pembayaran/${transaction_id}`, 'status', transaction_status);
          let saldoKas: number = (await readData('dashboard/saldoKas')) || 0;
          saldoKas += Number(payment.transactionAmount);

          await writeData(`dashboard`, 'saldoKas', saldoKas);
          navigation.dispatch(StackActions.replace('DetailPayment', { payment, success: true }));
        } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
          await deleteData('pembayaran', transaction_id);
          await deleteData(`warga/${payment.warga}/pembayaran`, transaction_id);
          navigation.dispatch(StackActions.replace('DetailPayment', { payment, success: false }));
        }
      } catch (e) {
        console.log('PAYMENT STATUS ERROR', e);
      }
    }, 5000);
  };

  const fetchData = async () => {
    const newPeople = await readData<People>('warga', people.phoneNumber);
    if (newPeople && newPeople.pembayaran) {
      const payments = await Promise.all(
        Object.keys(newPeople.pembayaran).map(async (transactionId) => {
          const payment = await readData<PaymentModel>('pembayaran', transactionId);
          return payment;
        })
      );
      const payment = payments.find((item) => item?.status === 'pending');
      if (payment) {
        intervalChecking(payment);
        setPaymentState(payment);
      }
    }
  };

  const onPressOk = () => {
    dispatch(setPaymentMethod(''));
    navigation.dispatch(StackActions.replace('HomeBottomNavigator'));
  };

  const copyToClipboard = async (item: string) => {
    await Clipboard.setStringAsync(item);
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.paymentWrapper}>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Total Pembayaran</Text>
            <Text style={styles.itemValue}>Rp. {numberWithDots(Number(paymentState?.transactionAmount))},-</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.itemTitle}>Periode</Text>
            <Text style={styles.itemValue}>{paymentState?.periode}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder, { alignItems: 'center' }]}>
            <Icon name="card-outline" color={Theme.BLACK_COLOR} type="ionicon" size={PixelRatio.getPixelSizeForLayoutSize(10)} />
            <Text style={styles.itemTitle}>{BANK_LIST_MAP.find((item) => item.key === paymentState?.bank)?.value}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Text
                style={{
                  width: '100%',
                  color: Theme.BLACK_COLOR,
                  marginBottom: PixelRatio.getPixelSizeForLayoutSize(5),
                }}
              >
                Virtual Account
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <Text style={styles.itemTitle}>{paymentState?.bank === 'mandiri' ? paymentState.billKey : paymentState?.vaNumber}</Text>
                <TouchableOpacity
                  onPress={() => {
                    copyToClipboard((paymentState?.bank === 'mandiri' ? paymentState.billKey : paymentState?.vaNumber)!);
                  }}
                  style={{ width: '50%' }}
                >
                  <Text
                    style={{
                      width: '100%',
                      color: 'blue',
                      textAlign: 'right',
                      textDecorationLine: 'underline',
                      paddingRight: PixelRatio.getPixelSizeForLayoutSize(15),
                    }}
                  >
                    Salin
                  </Text>
                </TouchableOpacity>
              </View>
              {paymentState?.bank === 'mandiri' && (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignContent: 'space-between',
                  }}
                >
                  <Text style={styles.itemTitle}>{paymentState.billerCode}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      copyToClipboard(paymentState.billerCode!);
                    }}
                    style={{ width: '50%' }}
                  >
                    <Text
                      style={{
                        width: '100%',
                        color: 'blue',
                        textAlign: 'right',
                        textDecorationLine: 'underline',
                        paddingRight: PixelRatio.getPixelSizeForLayoutSize(15),
                      }}
                    >
                      Salin
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <View style={{ width: '80%' }}>
              <Button onPress={onPressOk} size="md" color={Theme.PRIMARY_COLOR} radius="lg" style={styles.button}>
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
  paymentWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20),
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

export default Payment;
