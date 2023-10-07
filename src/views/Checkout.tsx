import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, Text } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { PixelRatio, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../helpers/constants';
import { numberWithDots } from '../helpers/utils';
import { PaymentModel, PaymentResponse, TransactionPayloadModel } from '../models/Model';
import { useAppSelector } from '../store/hooks';
import Constants from 'expo-constants';
import { writeData } from '../firebase/firebase';
import { StackActions } from '@react-navigation/native';

interface CheckoutPropsI {
  navigation: StackNavigationProp<any, any>;
}

const Checkout = ({ navigation }: CheckoutPropsI) => {
  const people = useAppSelector((state) => state.people);
  const payment = useAppSelector((state) => state.payment);
  const [isSubmit, setIsSubmit] = useState(false);

  const totalBill = useCallback(() => {
    let total = 0;
    const allBill = people?.tagihan;
    Object.keys(allBill!).forEach((bill) => {
      total += Number(allBill![bill].bill);
    });
    return total;
  }, [people]);

  const adminBill = useCallback(() => {
    const allBill = people?.tagihan;
    const firstBill = allBill![Object.keys(allBill!)[0]];
    return Number(firstBill.cost);
  }, [people]);

  const goToPyamentMethod = () => {
    navigation.navigate('PaymentMethod');
  };

  const onCheckout = async () => {
    try {
      setIsSubmit(true);
      const serverKey = Constants.expoConfig?.extra?.midtransServerKeyEncoded;
      let payload: TransactionPayloadModel = {
        payment_type: 'bank_transfer',
        transaction_details: {
          order_id: `${people.phoneNumber}_${new Date().getTime()}`,
          gross_amount: totalBill() + adminBill(),
        },
      };
      switch (payment.paymentMethod) {
        case 'BANK BCA':
          payload.bank_transfer = {
            bank: 'bca',
          };
          break;
        case 'BANK BRI':
          payload.bank_transfer = {
            bank: 'bri',
          };
          break;
        case 'BANK BNI':
          payload.bank_transfer = {
            bank: 'bni',
          };
          break;
        case 'BANK MANDIRI':
          payload.echannel = {
            bill_info1: 'Payment:',
            bill_info2: 'Online purchase',
          };
          payload.payment_type = 'echannel';
          break;
      }
      let data = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${serverKey}`,
        },
      } as RequestInit;
      const paymentResponse = await fetch('https://api.sandbox.midtrans.com/v2/charge', data);
      const response: PaymentResponse = await paymentResponse.json();
      if (response.transaction_status === 'pending') {
        const paymentData: PaymentModel = {
          transactionTime: response.transaction_time,
          status: response.transaction_status,
          warga: people.phoneNumber,
          transactionAmount: response.gross_amount,
          periode: Object.keys(people.tagihan!).toString(),
          orderId: response.order_id,
        };
        console.log(response);
        if (response.bill_key && response.biller_code) {
          paymentData.billKey = response.bill_key;
          paymentData.billerCode = response.biller_code;
          paymentData.bank = 'mandiri';
        }
        if (response.va_numbers) {
          paymentData.bank = response.va_numbers[0].bank;
          paymentData.vaNumber = response.va_numbers[0].va_number;
        }
        await writeData('pembayaran', response.transaction_id, paymentData);
        await writeData(`warga/${people.phoneNumber}/pembayaran`, response.transaction_id, '');
        setIsSubmit(false);
        navigation.dispatch(StackActions.replace('Payment'));
      }
    } catch (e) {
      setIsSubmit(false);
      console.log(e);
    }
  };
  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.checkoutWrapper}>
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
            <Text style={styles.itemTitle}>Total Tagihan</Text>
            <Text style={styles.itemValue}>Rp. {numberWithDots(totalBill() + adminBill())},-</Text>
          </View>
          <View style={[styles.row, { alignItems: 'center' }]}>
            <Text style={[styles.itemTitle, { fontWeight: 'bold' }]}>$Metode Pembayaran</Text>
            <TouchableOpacity
              onPress={goToPyamentMethod}
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
              }}
            >
              {!!payment.paymentMethod && <Text style={[styles.itemValue, { width: '80%', justifyContent: 'center' }]}>{payment.paymentMethod}</Text>}
              {!payment.paymentMethod && <Text style={[styles.itemValue, { width: '80%', justifyContent: 'center' }]}>Silahkan pilih metode pembayaran</Text>}

              <Icon name="chevron-forward-outline" color={Theme.BLACK_COLOR} type="ionicon" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <View style={{ width: '80%' }}>
              <Button onPress={onCheckout} size="md" color={Theme.PRIMARY_COLOR} radius="lg" style={styles.button} disabled={!payment.paymentMethod || isSubmit}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    flex: 1,
                  }}
                >
                  <Text style={[styles.itemTitle, { width: '100%', color: Theme.WHITE_COLOR }]}>Total Pembayaran</Text>
                  <Text style={[styles.itemTitle, { width: '100%', color: Theme.WHITE_COLOR }]}>Rp. {numberWithDots(totalBill() + adminBill())},-</Text>
                </View>
                <Text style={[styles.itemValue, { textAlign: 'right', flex: 1, color: Theme.WHITE_COLOR }]}>Bayar Sekarang</Text>
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

export default Checkout;
