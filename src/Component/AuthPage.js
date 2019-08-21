import React, {Component} from 'react';
import {Text, View, AsyncStorage as storage} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class AuthPage extends Component {
  constructor(props) {
    super(props);

    this._handleAuth();
  }

  _handleAuth = async () => {
    const uid = await storage.getItem('userid');

    this.props.navigation.navigate(uid ? 'Dashboard' : 'Login');
  };

  render() {
    return (
      <View>
        <Spinner
          // visible={true}
          visible={true}
          textContent={'Loading...'}
          textStyle={{color: '#fff'}}
        />
      </View>
    );
  }
}
