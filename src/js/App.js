import React, {Component} from 'react';
import Viget from './Viget';
import Menu from './Menu';
import '../scss/app.scss';

export default class App extends Component {
  
  render() {
    return (
      <div className="App">
        <Viget />
        <Menu />
      </div>
    );
  }
}


