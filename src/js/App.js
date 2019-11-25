import React, {Component} from 'react';
import Viget from './Viget';
import Popup from './Popup';
import '../scss/app.scss';

export default class App extends Component {
  
  state = {
    popup: false
  };
  
  displayPopup = () => {
    this.setState({
      popup: !this.state.popup
    });
  };
  
  render() {
    const {popup} = this.state;
    return (
      <div className="App">
        <Viget displayPopup={this.displayPopup} />
        <Popup popup={popup}/>
      </div>
    );
  }
}


