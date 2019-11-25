import React, {Component} from 'react';
import '../scss/menu.scss';
  
export default class Menu extends Component {
    constructor(props) {
        super(props);
    }
      
    render() {
        return (
            <div className="menu-container">
              <input type="checkbox" id="menuToggler" className="input-toggler" defaultChecked={this.props.menu} onChange={this.props.toggleMenu} />
              <label htmlFor="menuToggler" id="menuTogglerLabel" className="menu-toggler">
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
              </label>
              <nav id="sidebar" className="sidebar">
                <div>Check out Kayla's Stuff!</div>
                <ul id="menubar" className="menu">
                  <li className="menu__item"><a className="menu__link" href="#">Home</a></li>
                  <li className="menu__item"><a className="menu__link" href="#">Blog</a></li>
                  <li className="menu__item"><a className="menu__link" href="#">Portfolio</a></li>
                  <li className="menu__item"><a className="menu__link" href="#">About</a></li>
                  <li className="menu__item"><a className="menu__link" href="#">Contact</a></li>
                </ul>
              </nav>
            </div>
        );
    }
}