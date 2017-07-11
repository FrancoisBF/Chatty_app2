import React, {Component} from 'react';
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span className="userCount">{this.props.count} user(s) connect</span>
      </nav>
    );
  }
}
export default NavBar;