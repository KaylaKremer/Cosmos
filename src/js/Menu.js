import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faPalette, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import '../scss/menu.scss';
  
const Menu = props => {
    return (
        <div className="menu-container">
          <input type="checkbox" id="menu-toggler" className="input-checkbox" defaultChecked={props.menu} onChange={props.toggleMenu} />
          <label htmlFor="menu-toggler" id="menuTogglerLabel" className="menu-toggler">
            <span className="menu-toggler__line"></span>
            <span className="menu-toggler__line"></span>
            <span className="menu-toggler__line"></span>
          </label>
          <nav id="sidebar" className="sidebar">
            <div>Check out Kayla's Stuff!</div>
            <ul id="menubar" className="menu">
              <li className="menu__item"><a className="menu__link" target="_blank" rel="noopener noreferrer" href="https://github.com/KaylaKremer"><FontAwesomeIcon icon={faGithub} /> GitHub</a></li>
              <li className="menu__item"><a className="menu__link" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kaylakremer/"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a></li>
              <li className="menu__item"><a className="menu__link" target="_blank" rel="noopener noreferrer" href="https://www.kaylakremer.com/"><FontAwesomeIcon icon={faPalette} /> Portfolio</a></li>
              <li className="menu__item"><a className="menu__link" target="_blank" rel="noopener noreferrer" href="https://twitter.com/home"><FontAwesomeIcon icon={faTwitter} /> Twitter</a></li>
              <li className="menu__item"><a className="menu__link" href="mailto:kremer.kayla@gmail.com"><FontAwesomeIcon icon={faEnvelope} /> Contact</a></li>
            </ul>
          </nav>
        </div>
    );
}

export default Menu;
