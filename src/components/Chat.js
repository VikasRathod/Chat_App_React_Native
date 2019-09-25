import React from 'react';
import PropTypes from 'prop-types';
import {GiftedChat} from 'react-native-gifted-chat';
import Backend from '../Backend';

class Chat extends React.Component {
  state = {
    messages: [],
  };

  componentWillMount() {}

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={message => {
          //send message to your backend
          Backend.sendMessage(message);
        }}
        user={{
          _id: Backend.getUid(),
          name: this.props.enteredName,
        }}
      />
    );
  }

  componentDidMount() {
    Backend.loadMessages(message => {
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }

  componentWillMount() {
    Backend.closeChat();
  }
}

Chat.defaultProps = {
  enteredName: 'Blizz',
};

Chat.propTypes = {
  enteredName: PropTypes.string,
};

export default Chat;
