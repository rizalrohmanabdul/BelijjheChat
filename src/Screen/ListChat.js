import React, {Component} from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from 'react-native';
import {Database, Auth} from '../../src/Public/Config/configDB';
class ListChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: [],
      users: [],
      data: [],
      uid: null,
    };
  }

  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid});
    Database.ref('messages/' + this.state.uid).on('child_added', data => {
      let list = data.val();
      list.id = data.key;
      this.state.chat.push({
        id: list.id,
      });
      this.setState({chat: this.state.chat});
    });

    Database.ref('user/').once('value', result => {
      let data = result.val();
      if (data !== null) {
        let users = Object.values(data);
        this.setState({
          users,
          isLoading: false,
        });
      }
    });
  };
  _keyExtractor = (item, index) => item.uid+'';
  render() {
     const users = this.state.users;
        const chat = this.state.chat
        const datas = []
        chat.forEach((value, pass) => {
            datas[pass] = users.find((item) => 
            item.uid === value.id)
            
        })
    console.log('ini chat', datas)
    console.log('ini usernya', this.state.users)
    return (
      <React.Fragment>
        <View style={styles.navbar}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('PersonChat')}>
            <IconMaterial name="arrow-back" style={styles.iconnavbar} />
          </TouchableOpacity>
          <Text style={styles.textnavbar}>Belijjhe Chat</Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="search" style={styles.iconnavbar} />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            keyExtractor={this._keyExtractor}
            data={[datas]}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('PersonChat')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}>
                    <View>
                      <Image
                        style={{height: 60, width: 60, borderRadius: 50}}
                        source={require('../Assets/img/1564481740.jpg')}
                      />
                    </View>
                    <View style={{marginLeft: 10, width: 270}}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 17,
                          fontWeight: 'bold',
                        }}>
                          
                        coba
                      </Text>
                      <Text style={{color: 'black'}}>
                        Assalamulaiakum Hari ini Jualan Apa?
                      </Text>
                    </View>
                    <View
                      style={{borderBottomWidth: 3, borderColor: 'black'}}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            style={styles.flatlist}
          />
        </View>
      </React.Fragment>
    );
  }
}

export default ListChat;
const styles = StyleSheet.create({
  body: {
    width: '100%',
    flex: 10,
    backgroundColor: '#5ba4e5',
  },
  navbar: {
    backgroundColor: '#075e54',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    elevation: 5,
    shadowColor: '#111',
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    top: 0,
    left: '0%',
    width: '100%',
    height: 56,
    position: 'relative',
  },
  textnavbar: {
    position: 'absolute',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: '2%',
    marginLeft: '12%',
  },
  iconnavbar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '12%',
  },
  flatlist: {
    paddingVertical: 10,
  },
});
