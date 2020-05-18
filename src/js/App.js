import React, {Component} from 'react';
import Scene from './Scene';
import Menu from './Menu';
import '../scss/app.scss';

export default class App extends Component {
  state = {
    menu: false
  };
  
  toggleMenu = () => {
      this.setState(prevState => ({
        menu: !prevState.menu
      }));
  };
  
  render() {
    return (
      <div className="App">
        <Scene menu={this.state.menu} />
        <Menu menu={this.state.menu} toggleMenu={this.toggleMenu} />
      </div>
    );
  }
}




