import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
export default class PersonChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      // <React.Fragment>
      //   <View style={styles.navbar}>
      //     <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
      //       <IconMaterial name="arrow-back" style={styles.iconnavbar} />
      //     </TouchableOpacity>
      //     <View style={{position: 'absolute', marginLeft: '12%'}}>
      //       <Image
      //         style={{
      //           width: 35,
      //           height: 35,
      //           borderRadius: 100,
      //           overflow: 'hidden',
      //         }}
      //         source={require('../Assets/img/1564481740.jpg')}
      //       />
      //     </View>
      //     <Text style={styles.textnavbar}>Tukang Sayur</Text>
      //     <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
      //       <IconMaterial name="more-vert" style={styles.iconnavbarleft} />
      //     </TouchableOpacity>
      //   </View>
      //   <View style={{position: 'absolute'}}>
      //     <ChatScreen
      //       ref={e => (this.chat = e)}
      //       messageList={this.state.messages}
      //       androidHeaderHeight=66
      //       sendMessage={this.sendMessage}
      //     />
      //   </View>
      // </React.Fragment>
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

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
