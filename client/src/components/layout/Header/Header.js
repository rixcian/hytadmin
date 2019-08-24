import React from 'react';

import HeaderNotifications from '../../ui/HeaderNotifications';
import HeaderUserDetails from "../../ui/HeaderUserDetails";

import logoWEBP from '../../../assets/img/logo/logo.webp';
import logoPNG from '../../../assets/img/logo/logo.png';

import('./Header.scss');

class Header extends React.Component {
  render() {
    return (
      <header className="dt-header cp-header">
        <div className="dt-header__container">

          <div className="dt-brand">
            <div className="dt-brand__tool" data-toggle="main-sidebar">
              <i className="icon icon-xl icon-menu-fold d-none d-lg-inline-block"></i>
              <i className="icon icon-xl icon-menu d-lg-none"></i>
            </div>

            <span className="dt-brand__logo">
              <a className="dt-brand__logo-link" href="index.html">
                <picture>
                  <source srcSet={logoWEBP} type="image/webp"/>
                  <source srcSet={logoPNG} type="image/png"/>
                  <img src={logoPNG} alt="Hytale Logo"/>
                </picture>
              </a>
            </span>
          </div>

          <div className="dt-header__toolbar">
            <div className="dt-nav-wrapper">

              <HeaderNotifications />
              <HeaderUserDetails />

            </div>
          </div>

        </div>
      </header>
    )
  }
}

export default Header;