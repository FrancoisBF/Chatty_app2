import React, {Component} from 'react';
class ChatBar extends Component {
  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.userName} onKeyUp={ this.props.enterName } />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={(event) => {
          if(event.key === 'Enter') {
            this.props.enterTrigger(event.target.value)
            event.target.value = "";
          }
        }} />
      </footer>
    );
  }
}
export default ChatBar;