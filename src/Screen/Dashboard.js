import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Text,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Database, Auth} from '../../src/Public/Config/configDB';
import GetLocation from 'react-native-get-location';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      uidnow: '',
      avatar: '',
      fullname: '',
      isModalVisible: false,
      isModalVisibleusers: false,
      mapRegion: null,
      latitude: 0,
      longitude: 0,
      users: [],
      usersdetail: [],
      spinner: true
    };
  }

  componentWillMount = async () => {
    await this.user();
    await this.getCurrentPosition();
    // await this.currentlocationupdate()
  };

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
          longitudeDelta: 0.00421 * 1.5,
        };

        this.setState({
          mapRegion: region,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        // Database.ref('/user/' + this.state.uidnow).update({
        //   longitude: location.longitude,
        // });
        // Database.ref('/user/' + this.state.uidnow).update({
        //   latitude: location.latitude,
        // });
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }

  user = async () => {
    Database.ref('/user').once('value', result => {
      let data = result.val();
      if (data !== null) {
        let users = Object.values(data);
        this.setState({
          users: users,
          spinner: false
        });
      }
    });
  };
  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  toggleModalClose = () => {
    this.setState({isModalVisibleusers: false});
  };

  toggleModalUsers = email => {
    this.setState({
      isModalVisibleusers: !this.state.isModalVisibleusers,
    });
    Database.ref('/user')
      .orderByChild('email')
      .equalTo(email)
      .once('value', result => {
        let data = Object.values(result.val());
        console.log('cek data', data)
        this.setState({
          usersdetail: data[0],
        });
      });

  };

  componentDidMount() {
    AsyncStorage.getItem('email', (err, result) => {
      if (result) {
        this.setState({email: result});
      }
    });

    AsyncStorage.getItem('userid', (err, result) => {
      if (result) {
        this.setState({uidnow: result});
      }
    });

    AsyncStorage.getItem('fullname', (err, result) => {
      if (result) {
        this.setState({fullname: result});
      }
    });

    AsyncStorage.getItem('avatar', (err, result) => {
      if (result) {
        this.setState({avatar: result});
      }
    });
  }

  _Logout = async () => {
    const userToken = await AsyncStorage.getItem('userid');
    console.log(userToken);
    Database.ref('/user/' + userToken).update({status: 'offline'});
    Auth.signOut()
      .then(() => {
        AsyncStorage.clear();
        this.props.navigation.navigate('AuthPage');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  render() {
    console.log('ini xxx', this.state.usersdetail);
    return (
      <Fragment>
        {/* <Spinner
          // visible={true}
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color: '#fff'}}
        /> */}
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            showsMyLocationButton={true}
            showsIndoorLevelPicker={true}
            showsUserLocation={true}
            zoomControlEnabled={true}
            showsCompass={true}
            showsTraffic={true}
            showsBuildings={true}
            showsScale={true}
            region={this.state.mapRegion}>
            {this.state.users.map(item => {
              return (
                <Marker
                  onPress={() => this.toggleModalUsers(item.email)}
                  draggable
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={`${item.fullname} - ${item.status}`}
                  description={`${item.latitude} / ${item.longitude}`}>
                  {/* <TouchableOpacity > */}
                  <Image
                    source={{uri: item.img}}
                    style={{width: 40, height: 40, borderRadius: 100 / 2}}
                  />
                  <View style={{width: 10, height: 10, borderRadius: 100 / 2, backgroundColor:item.status == 'online'? '#25d366' : 'red', position: 'absolute'}}/>
                </Marker>
              );
            })}
          </MapView>
        </View>

        <View style={styles.boxsearch}>
          <Icon
            name="search"
            style={{fontSize: 30, color: '#e0dfdc', padding: '3%'}}
          />
          <TextInput
            style={{width: '72%', height: 50, color: '#000', fontSize: 16}}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Cari Belijje Di Sekitar Anda"
            placeholderTextColor="#e0dfdc"
            selectionColor="#fff"
          />
          <Icon
            name="bars"
            style={{fontSize: 30, color: '#000', padding: '3%'}}
          />
        </View>
        <View style={styles.floatmenu}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Listchat')}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              elevation: 5,
              marginEnd: 100,
              backgroundColor: '#25d366',
            }}>
            <IconMaterial
              name="chat"
              style={{fontSize: 30, margin: '24%', color: '#fff'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.floatmenuProfil}>
          <TouchableOpacity
            onPress={this.toggleModal}
            style={{
              width: 60,
              height: 60,
              marginEnd: 100,
              elevation: 5,
              borderRadius: 100,
              backgroundColor: '#25d366',
            }}>
            <Image
              style={{
                width: 50,
                height: 50,
                margin: '9%',
                borderRadius: 100,
                backgroundColor: 'green',
              }}
              source={{uri: this.state.avatar}}
            />
          </TouchableOpacity>
        </View>

        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              backgroundColor: '#fff',
              height: 150,
              borderRadius: 10,
              flexDirection: 'column',
              padding: 10,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  backgroundColor: 'green',
                }}
                source={{uri: this.state.avatar}}
              />
              <Text style={{fontSize: 19, fontWeight: 'bold'}}>
                {this.state.fullname}
              </Text>
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                {this.state.email}
              </Text>
            </View>
            <View style={{position: 'absolute', alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={this.toggleModal}>
                <IconMaterial
                  name="close"
                  style={{fontSize: 30, color: '#000'}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{position: 'absolute', marginLeft: 250, marginTop: 40}}>
              <TouchableOpacity onPress={() => this._Logout()}>
                <Icon name="sign-out" style={{fontSize: 50, color: '#000'}} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalVisibleusers}>
          <View
            style={{
              backgroundColor: '#fff',
              height: 150,
              borderRadius: 10,
              flexDirection: 'column',
              padding: 10,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  backgroundColor: 'green',
                }}
                source={{uri: this.state.usersdetail.img}}
              />
              <Text style={{fontSize: 19, fontWeight: 'bold'}}>
                {this.state.usersdetail.fullname}
              </Text>
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                {this.state.usersdetail.email}
              </Text>
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                {this.state.usersdetail.status}
              </Text>
            </View>
            <View style={{position: 'absolute', alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={this.toggleModalClose}>
                <IconMaterial
                  name="close"
                  style={{fontSize: 30, color: '#000'}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{position: 'absolute', marginLeft: 250, marginTop: 40}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PersonChat', {
                  id: this.state.usersdetail.uid,
                  img: this.state.usersdetail.img,
                  fullname: this.state.usersdetail.fullname,
                  status: this.state.usersdetail.status
              })}>
                <IconMaterial
                  name="chat"
                  style={{fontSize: 50, color: '#000'}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Fragment>
    );
  }
}
export default Dashboard;

const styles = StyleSheet.create({
  container: {
    height: 900,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    height: 900,
    width: '100%',
    flex: 1,
  },
  boxsearch: {
    backgroundColor: '#fff',
    width: '96%',
    height: 50,
    position: 'absolute',
    margin: '2%',
    flexDirection: 'row',
    borderRadius: 35,
    justifyContent: 'space-between',
  },
  floatmenu: {
    flexDirection: 'column',
    position: 'absolute',
    margin: '77%',
    marginTop: '130%',
    width: '100%',
    height: 100,
  },
  floatmenuProfil: {
    flexDirection: 'column',
    position: 'absolute',
    margin: '77%',
    marginTop: '150%',
    width: '100%',
    height: 100,
  },
});
