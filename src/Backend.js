import firebase from 'firebase';

class Backend {
  uid = '';
  messageRef = null;

  //Initialize firebase backend
  // enter your key in '' provided
  constructor() {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUid(user.uid);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch(error => {
            alert(error.message);
          });
      }
    });
  }

  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }

  // retrieve the messages from the backend
  loadMessages(callback) {
    this.messageRef = firebase.database().ref('messages');
    this.messageRef.off();
    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    this.messageRef.limitToLast(20).on('child_added', onReceive);
  }

  //send the message to the backend

  sendMessage(message) {
    for (let i = 0; i < message.length; i++) {
      this.messageRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }
  }

  //close the connection to the backend
  closeChat() {
    if (this.messageRef) {
      this.messageRef.off();
    }
  }
}

export default new Backend();
