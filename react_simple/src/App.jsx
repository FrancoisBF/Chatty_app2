import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.addEventListener('message', (event) => {
      console.log('hello!!!', JSON.parse(event.data));
      //after server passes an object as a string later in the code,
      //I need to reverse it back to an object
      const msg = JSON.parse(event.data);
      if(msg.type === 'userCount'){
        this.state.userCount = msg.count;
        let countNew = this.state.userCount;
        this.setState({userCount: countNew});
      }else{
        //Add msg to the state;
        var stateNew = this.state.messages.concat(msg);
        this.setState({ messages: stateNew });
      }
    });
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      userCount: 1,
    };

    //force the context of sendNewMessage to refer to "this" in the contructor
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }
  handleChange(event) {
    if(event.key === "Enter"){
      const oldName = this.state.currentUser.name;
      const userName = event.target.value;
      //This will make sure the state is corrent when I send the notification to server
      this.setState({
        currentUser: {
          name: userName
        }
      });
      const note = {
        type: "postNotification",
        content: `${oldName} was changed to ${userName}`
      }
      this.socket.send(JSON.stringify(note));
    }
  }
  sendNewMessage(messageWithUser){
    //Construct a msg object containing the data that server needs to process the message from the chat client
    const msg = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: messageWithUser
    };
    //Send the msg object JSON formatted string
    this.socket.send(JSON.stringify(msg));
  //Blank the text input element, ready to receive the next line of text from the user
  }
  componentDidMount() {
    console.log("componentDidMount <App />");
  }
  render() {
    return (
      <div>
        <NavBar count={this.state.userCount} />
        <MessageList messages={this.state.messages}  />
        <ChatBar userName={this.state.currentUser.name} enterName={ this.handleChange.bind(this) } enterTrigger={this.sendNewMessage}/>
      </div>
      );
  }
}
export default App;






