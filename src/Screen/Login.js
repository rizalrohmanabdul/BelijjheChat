import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  AsyncStorage as storage
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Database, Auth} from '../../src/Public/Config/configDB';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ImageSource: null,
      spinner: false,
      users: [],
      email: '',
      password: '',
    };
  }

  _Login = async () => {
    this.setState({
      spinner: true
    });
    const {email, password} = this.state;
    if (email === '' || password === '') {
      alert('Data Kosong !! Mohon isi Dengan Lengkap');
    } else {
      Database.ref('/user')
        .orderByChild('email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          console.warn('datanya: ', data);

          if (data !== null) {
            let users = Object.values(data);

            storage.setItem('email', users[0].email);
            storage.setItem('fullname', users[0].fullname);
            storage.setItem('avatar', users[0].img);
            console.warn('datapribadi', users[0]);
          }
        });

      await Auth.signInWithEmailAndPassword(email, password)
        .then(response => {
          Database.ref('/user/' + response.user.uid).update({status: 'online'});
          storage.setItem('userid', response.user.uid);
          this.props.navigation.navigate('AuthPage');
          this.setState({
            spinner: false
          });
        })
        .catch(error => {
          alert(error.message);
        });
    }
  };
  render() {
    return (
      <Fragment>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 100,
          }}>
          <Image
            style={{
              width: 120,
              height: 120,
            }}
            source={require('../Assets/img/111.jpg')}
          />
        </View>
        <Spinner
          // visible={true}
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color: '#fff'}}
        />
        <ScrollView>
          <View style={style.formLogin}>
            <TextInput
              style={style.textInput}
              placeholder="Email"
              textContentType= "emailAddress"
              onChangeText={email => this.setState({email: email})}
            />
            <TextInput
              style={style.textInput}
              placeholder="Password"
              textContentType= "password"
              onChangeText={password => this.setState({password: password})}
            />

            <Button
              color="#20a8e0"
              title="Masuk"
              onPress={() => this._Login()}
              accessibilityLabel="Learn more about this purple button"
            />
            <View style={style.bottom}>
              <Text>
                Belum Punya Akun?
                <Text
                  style={style.link}
                  onPress={() => this.props.navigation.navigate('Register')}>
                  {' '}
                  Daftar
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </Fragment>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  textlogin: {
    position: 'absolute',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: '9%',
    marginLeft: '3%',
  },
  formLogin: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '10%',
  },
  textInput: {
    height: 40,
    backgroundColor: '#f5f5f1',
    borderRadius: 24,
    marginBottom: '5%',
    padding: 10,
  },
  bottom: {
    paddingTop: 10,
  },
  link: {
    color: '#5ba4e5',
  },
});
