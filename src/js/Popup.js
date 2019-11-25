import React, {Component} from 'react';
import '../scss/popup.scss';
  
export default class Popup extends Component {
    
    render() {
        return (
            <div className={`popup ${this.props.popup ? 'show' : 'hide'}`}></div>
        );
    }
}