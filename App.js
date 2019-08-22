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

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      iduser: '',
      token: '',
      view: <SplashScreen />
    }
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({
        view: <RootNavigator />
      })
    }, 2000)
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
