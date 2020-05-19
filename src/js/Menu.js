import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faPalette, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import '../scss/menu.scss';
import logo from '../images/logo.png';
  
const Menu = props => {
    return (
        <div className="menu-container">
          <input type="checkbox" id="menu-toggler" className="input-checkbox" defaultChecked={props.menu} onChange={props.toggleMenu} />
          <label htmlFor="menu-toggler" id="menuTogglerLabel" className="menu-toggler">
            <span className="menu-toggler-line"></span>
            <span className="menu-toggler-line"></span>
            <span className="menu-toggler-line"></span>
          </label>
          <nav id="sidebar" className="sidebar">
            <div className="image-container">
                <img alt="Kayla Kremer" className="image" src={logo} />
                <span className="name">Kayla Kremer</span>
            </div>
            <div className="menubar-container">
                <ul id="menubar" className="menu">
                    <li className="menu-item"><a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://github.com/KaylaKremer"><FontAwesomeIcon icon={faGithub} /> GitHub</a></li>
                    <li className="menu-item"><a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kaylakremer/"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a></li>
                    <li className="menu-item"><a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.kaylakremer.com/"><FontAwesomeIcon icon={faPalette} /> Portfolio</a></li>
                    <li className="menu-item"><a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://twitter.com/Kayla_Kremer"><FontAwesomeIcon icon={faTwitter} /> Twitter</a></li>
                    <li className="menu-item"><a className="menu-link" href="mailto:kremer.kayla@gmail.com"><FontAwesomeIcon icon={faEnvelope} /> Contact</a></li>
                </ul>
            </div>
          </nav>
        </div>
    );
}

export default Menu;
