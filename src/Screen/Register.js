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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Database, Auth} from '../../src/Public/Config/configDB';
import GetLocation from 'react-native-get-location';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ImageSource: null,
      fullname: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      spinner: false,
    };
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response};
        this.setState({
          ImageSource: source,
        });
      }
    });
  }
  componentDidMount = async () => {
    await this.getCurrentPosition()
}

getCurrentPosition() {
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
        .then(location => {
            console.warn(location.latitude);

            let region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5
            }

            this.setState({
                mapRegion: region,
                latitude: location.latitude,
                longitude: location.longitude
            })
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
}

  _Register = () => {
    if (
      this.state.fullname === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) {
      alert('Mohon isi Dengan Lengkap');
    } else {
      Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
          console.warn(response);
          Database.ref('/user/' + response.user.uid).set({
            fullname: this.state.fullname,
            status: 'offline',
            email: this.state.email,
            img:
              'https://res.cloudinary.com/downloadaplikasi27/image/upload/v1566350468/zx6qbhblaellq1ezvpwc.jpg',
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          });
          this.props.navigation.navigate('Login');
        })
        .catch(error => {
          alert(error.message);

          this.props.navigation.navigate('Register');
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
        <ScrollView>
          <View style={style.formLogin}>
            <TextInput
              style={style.textInput}
              placeholder="Nama Lengkap"
              onChangeText={fullname => this.setState({fullname: fullname})}
            />
            <TextInput
              style={style.textInput}
              placeholder="email"
              textContentType= "emailAddress"
              onChangeText={email => this.setState({email: email})}
            />
            <TextInput
              style={style.textInput}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={password => this.setState({password: password})}
            />
            {this.state.ImageSource === null ? (
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View
                  style={{
                    minHeight: 100,
                    width: '100%',
                    paddingTop: 10,
                  }}>
                  <Image
                    style={{
                      width: '35%',
                      height: 70,
                      backgroundColor: 'green',
                    }}
                    source={require('../Assets/img/1564481740.jpg')}
                  />
                  <Text style={style.textPlease}>Upload your photos here</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View
                  style={{
                    minHeight: 100,
                    width: '100%',
                    paddingTop: 10,
                  }}>
                  <Image
                    style={{
                      width: '35%',
                      height: 70,
                      backgroundColor: 'green',
                    }}
                    source={this.state.ImageSource.uri}
                  />
                  <Text style={style.textPlease}>Upload your photos here</Text>
                </View>
              </TouchableOpacity>
            )}
            <Button
              color="#20a8e0"
              title="Daftar"
              onPress={() => this._Register()}
              accessibilityLabel="Learn more about this purple button"
            />
            <View style={style.bottom}>
              <Text>
                Sudah Punya Akun?
                <Text
                  style={style.link}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  {' '}
                  Masuk
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
  textKuy: {
    marginTop: '19%',
    marginLeft: '50%',
    color: '#f79237',
    position: 'absolute',
    fontSize: 38,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  textJos: {
    marginTop: '30%',
    marginLeft: '64%',
    color: '#f79237',
    position: 'absolute',
    fontSize: 14,
  },
  textGame: {
    marginTop: '20%',
    marginLeft: '58%',
    color: '#f79237',
    position: 'absolute',
    fontSize: 14,
  },
  textPlease: {
    marginTop: '10%',
    marginLeft: '39%',
    color: '#f79237',
    position: 'absolute',
    fontSize: 14,
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
