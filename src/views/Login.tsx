import React, { useState } from 'react';
import { Button, Icon, Image, Input, Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, PixelRatio, ActivityIndicator, Platform, StatusBar, View } from 'react-native';
import { Theme } from '../helpers/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { setLogin } from '../store/InitSlice';
import { readData } from '../firebase/firebase';
import { People } from '../models/Model';
import { setPeople } from '../store/PeopleSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface LoginProps {
  navigation: StackNavigationProp<any, any>;
}

const Login = ({ navigation }: LoginProps) => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const onLoginPress = async () => {
    try {
      const people = await readData<People>('warga', phoneNumber);
      if (people) {
        if (people?.password === password) {
          dispatch(setPeople({ ...people, phoneNumber: phoneNumber }));
          dispatch(setLogin(true));
          navigation.dispatch(StackActions.replace('HomeBottomNavigator'));
        } else {
          setErrorPassword('Password salah');
        }
      } else {
        setErrorPhoneNumber('Phone number tidak ditemukan');
      }
    } catch (e) {
      setErrorPhoneNumber('Phone number tidak valid');
      setErrorPassword('Password tidak valid');
    }
  };

  const goToRegisterPage = () => {
    navigation.navigate('Register');
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={{ padding: 10 }}>
          <Image source={require('../../assets/images/logo.png')} PlaceholderContent={<ActivityIndicator />} style={styles.image} resizeMode="contain" />
          <Text h4 style={styles.title}>
            Masuk ke Aplikasi
          </Text>
          <View style={styles.formWrapper}>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={{ marginBottom: 10 }}
              leftIconContainerStyle={styles.leftIconStyle}
              rightIconContainerStyle={{ backgroundColor: Theme.GRAY }}
              errorMessage={errorPhoneNumber}
              value={phoneNumber}
              onChangeText={(e) => setPhoneNumber(e)}
              leftIcon={<Icon name="person-outline" color={Theme.PRIMARY_COLOR} type="ionicon" size={20} />}
              rightIcon={<Icon onPress={() => setPhoneNumber('')} name="close" color={Theme.PRIMARY_COLOR} size={20} />}
              placeholder="Masukan no telp"
            />
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={{ marginBottom: 10 }}
              leftIconContainerStyle={styles.leftIconStyle}
              rightIconContainerStyle={{ backgroundColor: Theme.GRAY }}
              errorMessage={errorPassword}
              value={password}
              onChangeText={(e) => setPassword(e)}
              leftIcon={<Icon name="lock-closed-outline" color={Theme.PRIMARY_COLOR} type="ionicon" size={20} />}
              rightIcon={<Icon onPress={() => setPassword('')} name="close" color={Theme.PRIMARY_COLOR} size={20} />}
              placeholder="Masukan password"
              secureTextEntry
            />
            <View style={styles.buttonPayWrapper}>
              <Button onPress={onLoginPress} size="md" color={Theme.PRIMARY_COLOR} radius="sm">
                Masuk
              </Button>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
              }}
            >
              <Text>Belum punya akun? </Text>
              <TouchableOpacity onPress={goToRegisterPage}>
                <Text style={{ textDecorationLine: 'underline' }}>Daftar</Text>
              </TouchableOpacity>
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
    width: '100%',
    backgroundColor: Theme.SECONDARY_COLOR,
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  image: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20),
    width: PixelRatio.getPixelSizeForLayoutSize(30),
    height: PixelRatio.getPixelSizeForLayoutSize(30),
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(2),
  },
  title: {
    fontSize: Theme.FONT_SIZE_LARGE,
    color: Theme.WHITE_COLOR,
    marginTop: PixelRatio.getPixelSizeForLayoutSize(8),
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(3.5),
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 'auto',
    marginTop: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  inputStyle: {
    backgroundColor: Theme.GRAY,
    padding: 5,
    color: Theme.BLACK_COLOR,
  },
  leftIconStyle: {
    backgroundColor: Theme.GRAY,
    padding: 10,
  },
  buttonPayWrapper: {
    justifyContent: 'center',
    width: '98%',
  },
});
export default Login;
