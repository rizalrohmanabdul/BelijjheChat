import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import RootNavigator from "./src/Routes/rootNavigator";
import SplashScreen from './src/Screen/Splash'
import OneSignal from 'react-native-onesignal'; 

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      iduser: '',
      token: '',
      view: <SplashScreen />

    }
    OneSignal.init("abeb2a58-2404-472b-a013-c3a1fa55acef");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); 	// triggers the ids event
  }
  
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="#075e54" />
        <SafeAreaView>
        <RootNavigator />
        </SafeAreaView>
      </Fragment>
    );
  }
  
};

export default App;
