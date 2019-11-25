import React, {Component} from 'react';
import Viget from './Viget';
import Menu from './Menu';
import '../scss/app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state  = {
        menu: true
    };
}
  
toggleMenu = () => {
    this.setState({
        menu: !this.state.menu
    });
};
  render() {
    return (
      <div className="App">
        <Viget menu={this.state.menu} />
        <Menu menu={this.state.menu} toggleMenu={this.toggleMenu} />
      </div>
    );
  }
}


