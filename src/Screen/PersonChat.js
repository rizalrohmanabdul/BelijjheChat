import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  AsyncStorage,
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {Database, Auth} from '../../src/Public/Config/configDB';

export default class PersonChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesList: [],
      textMessage: '',
      email: null,
      uid: null,
      idPerson: props.navigation.getParam('id'),
      fullnameother: props.navigation.getParam('fullname'),
      imgother: props.navigation.getParam('img'),
      statusother: props.navigation.getParam('status'),
    };
  }

  componentDidMount = async () => {
    const email = await AsyncStorage.getItem('email');
    this.setState({email});
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid});
    Database.ref('messages')
      .child(this.state.uid)
      .child(this.state.idPerson)
      .on('child_added', value => {
        console.log(value);

        this.setState(prevData => {
          return {
            messagesList: [...prevData.messagesList, value.val()],
          };
        });
      });
  };

  send = async () => {
    if (this.state.textMessage != '') {
      let msgId = Database.ref('messages')
        .child(this.state.uid)
        .child(this.state.idPerson)
        .push().key;
      console.log(msgId);

      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: moment().format('DD/MM/YYYY HH:mm:ss'),
        from: this.state.email,
      };
      updates[
        'messages/' + this.state.uid + '/' + this.state.idPerson + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.idPerson + '/' + this.state.uid + '/' + msgId
      ] = message;
      Database.ref().update(updates);
      this.setState({textMessage: ''});
    }
  };
  render() {
    console.log('isinya', this.state.messagesList);
    return (
      <React.Fragment>
        <View style={items.navbar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <IconMaterial name="arrow-back" style={items.iconnavbar} />
          </TouchableOpacity>
          <View style={{position: 'absolute', marginLeft: '12%'}}>
            <Image
              style={{
                width: 35,
                height: 35,
                borderRadius: 100,
                overflow: 'hidden',
              }}
              source={{uri: this.state.imgother}}
            />
          </View>
          <Text style={items.textnavbar}>{this.state.fullnameother}</Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <IconMaterial name="more-vert" style={items.iconnavbarleft} />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView>
          <View style={component.body}>
            <FlatList
              style={component.chat}
              data={this.state.messagesList}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={
                      item.from === this.state.email
                        ? items.chatme
                        : items.chatfriend
                    }>
                    <View style={items.column}>
                      <Text
                        style={
                          item.from === this.state.email
                            ? items.msgMe
                            : items.msgFriend
                        }>
                        {item.message}
                      </Text>
                      <Text style={items.date}>
                        {/* {moment(item.time).format('h:mm')} */}
                        {item.time}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <View style={component.footer}>
            <View style={component.sendchat}>
              <TextInput
                style={items.inputChat}
                multiline={true}
                placeholder="Type message"
                value={this.state.textMessage}
                onChangeText={value => this.setState({textMessage: value})}
              />
              <TouchableOpacity style={items.sendChat} onPress={this.send}>
                <MaterialCommunityIcons
                  name="send-circle"
                  size={47}
                  color="#25d366"
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

const component = StyleSheet.create({
  header: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  footer: {
    width: '100%',
    marginTop: 510,
    // marginBottom: 15,
  },
  sendchat: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  chat: {
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
    // paddingBottom: 20,
    // margin: 10,
    height: 510,
    width: '100%',
    position: 'absolute',
  },
});

const items = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'sans-serif-thin',
  },
  chatme: {
    alignSelf: 'flex-end',
    paddingLeft: 10,
    flexDirection: 'row',
    maxWidth: '80%',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: '#25d366',
    margin: 3,
  },
  chatfriend: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    flexDirection: 'row',
    maxWidth: '80%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#25d366',
    borderWidth: 1,
    margin: 3,
  },
  image: {
    resizeMode: 'contain',
    width: 45,
    borderRadius: 500,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 5,
  },
  msgMe: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 15,
    fontFamily: 'sans-serif',
    color: '#ffffff',
  },
  msgFriend: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 15,
    fontFamily: 'sans-serif',
  },
  last: {
    flex: 1,
    fontFamily: 'sans-serif-thin',
  },
  person: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: 'sans-serif-medium',
  },
  inputChat: {
    borderRadius: 100,
    borderWidth: 1,
    height: 40,
    flex: 6,
    paddingLeft: 15,
    borderColor: '#25d366',
  },
  sendChat: {
    flex: 1,
  },
  date: {
    alignSelf: 'flex-end',
    paddingRight: 10,
    paddingBottom: 5,
    fontSize: 12,
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
    marginLeft: '23%',
  },
  iconnavbar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: '12%',
  },
  iconnavbarleft: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

//       <React.Fragment>
//         <View style={styles.navbar}>
//           <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
//             <IconMaterial name="arrow-back" style={styles.iconnavbar} />
//           </TouchableOpacity>
//           <View style={{position: 'absolute', marginLeft: '12%'}}>
//             <Image
//               style={{
//                 width: 35,
//                 height: 35,
//                 borderRadius: 100,
//                 overflow: 'hidden',
//               }}
//               source={require('../Assets/img/1564481740.jpg')}
//             />
//           </View>
//           <Text style={styles.textnavbar}>Tukang Sayur</Text>
//           <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
//             <IconMaterial name="more-vert" style={styles.iconnavbarleft} />
//           </TouchableOpacity>
//         </View>
//         <View style={{position: 'absolute', flex: 1}}>
//           <FlatChat
//             data={this.state.data}
//             onSend={() => this.sendMessage()}
//           />
//         </View>
//       </React.Fragment>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   body: {
//     width: '100%',
//     flex: 10,
//     backgroundColor: '#25d366',
//   },
// navbar: {
//   backgroundColor: '#075e54',
//   alignItems: 'center',
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   padding: 4,
//   elevation: 5,
//   shadowColor: '#111',
//   shadowOpacity: 0.2,
//   shadowRadius: 1.2,
//   top: 0,
//   left: '0%',
//   width: '100%',
//   height: 56,
//   position: 'relative',
// },
// textnavbar: {
//   position: 'absolute',
//   color: '#fff',
//   fontWeight: 'bold',
//   fontSize: 17,
//   marginTop: '2%',
//   marginLeft: '23%',
// },
// iconnavbar: {
//   fontSize: 20,
//   fontWeight: 'bold',
//   color: '#fff',
//   marginLeft: '12%',
// },
// iconnavbarleft: {
//   fontSize: 20,
//   fontWeight: 'bold',
//   color: '#fff',
// },
// });
