import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '@rneui/base';
import { Button, Image } from '@rneui/themed';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, PixelRatio, StyleSheet, View } from 'react-native';
import DefaultBox from '../components/DefaultBox';
import { readData } from '../firebase/firebase';
import { Theme } from '../helpers/constants';
import { hp, wp } from '../helpers/responsive';
import { PaymentModel, People } from '../models/Model';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPeople } from '../store/PeopleSlice';

interface HomePropsI {
  navigation: StackNavigationProp<any, any>;
}
const Home = ({ navigation }: HomePropsI) => {
  const isFocused = useIsFocused();
  const people = useAppSelector((state) => state.people);
  const [isFetching, setIsFetching] = useState(false);
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const dispatch = useAppDispatch();
  const onPress = useCallback(() => {
    if (isPendingPayment) {
      navigation.navigate('BillStackNavigator', { screen: 'Payment' });
    } else {
      navigation.navigate('BillStackNavigator');
    }
  }, [isPendingPayment]);

  useEffect(() => {
    const initData = async () => {
      setIsPendingPayment(false);
      if (people.phoneNumber) {
        setIsFetching(true);
        const newPeople = await readData<People>('warga', people.phoneNumber);
        if (newPeople && newPeople.pembayaran) {
          const payments = await Promise.all(
            Object.keys(newPeople.pembayaran).map(async (transactionId) => {
              const payment = await readData<PaymentModel>('pembayaran', transactionId);
              return payment;
            })
          );
          if (payments.length && payments.filter((item) => item?.status === 'pending').length) {
            setIsPendingPayment(true);
          }
        }
        dispatch(setPeople({ ...newPeople!, phoneNumber: people.phoneNumber }!));
        setIsFetching(false);
      }
    };
    initData();
  }, [isFocused, navigation]);

  // muncul tidaknya tombol bayar
  const isHavingBill = useCallback(() => {
    if (isFetching) {
      return false;
    }
    if (isPendingPayment) {
      return true;
    }
    if (people?.tagihan) {
      if (Object.keys(people.tagihan).length) {
        return true;
      }
    }
    return false;
  }, [people, isFetching, isPendingPayment]);

  return (
    <>
      <DefaultBox>
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} PlaceholderContent={<ActivityIndicator />} style={styles.image} resizeMode="contain" />
          <Text h3 style={styles.headerTitle}>
            GMJR
          </Text>
        </View>
        <View style={styles.titleWrapper}>
          <Text h1 style={styles.title}>
            Hallo, Warga GMJR!
          </Text>
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>GREEN MUTIARA JAVA REGENCY</Text>
          {isHavingBill() && (
            <View style={styles.buttonPayWrapper}>
              <Button onPress={onPress} size="md" color={Theme.PRIMARY_COLOR} radius="lg">
                Bayar Iuran
              </Button>
            </View>
          )}
        </View>
      </DefaultBox>
    </>
  );
};

const styles = StyleSheet.create({
  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(100),
    justifyContent: 'flex-start',
  },
  image: {
    width: PixelRatio.getPixelSizeForLayoutSize(20),
    height: PixelRatio.getPixelSizeForLayoutSize(20),
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(2),
  },
  headerTitle: {
    color: Theme.WHITE_COLOR,
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(2),
    marginTop: PixelRatio.getPixelSizeForLayoutSize(4),
  },
  //end header
  // title
  titleWrapper: {
    paddingLeft: PixelRatio.getPixelSizeForLayoutSize(5),
    paddingRight: PixelRatio.getPixelSizeForLayoutSize(5),
    width: wp(100),
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20),
  },
  title: {
    color: Theme.WHITE_COLOR,
  },
  // end
  // content box
  contentBox: {
    width: wp(80),
    height: hp(30),
    backgroundColor: Theme.WHITE_COLOR,
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(5),
    marginTop: PixelRatio.getPixelSizeForLayoutSize(15),
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  contentText: {
    color: Theme.PRIMARY_COLOR,
    fontSize: Theme.FONT_SIZE_XXX_SMALL,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonPayWrapper: {
    width: wp(35),
    position: 'absolute',
    bottom: PixelRatio.getPixelSizeForLayoutSize(5),
    right: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  //end
});

export default Home;
