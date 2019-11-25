import React, {Component} from 'react';
import '../scss/menu.scss';
  
export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            menu: true
        };
    }
      
    toggleMenu = () => {
        console.log('click');
        this.setState({
            menu: !this.state.menu
        });
    };
    
    render() {
        return (
            <div className="menu-container">
              <input type="checkbox" id="menuToggler" className="input-toggler" defaultChecked={this.state.menu} onChange={this.toggleMenu} />
              <label htmlFor="menuToggler" id="menuTogglerLabel" className="menu-toggler">
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
                <span className="menu-toggler__line"></span>
              </label>
              <nav id="sidebar" className="sidebar" role="navigation">
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