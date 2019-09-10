import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import HeaderNotifications from '../../ui/HeaderNotifications';
import HeaderUserDetails from "../../ui/HeaderUserDetails";
import { Link } from 'react-router-dom';

import logoWEBP from '../../../assets/img/logo/logo.webp';
import logoPNG from '../../../assets/img/logo/logo.png';

import('./Header.scss');

class Index extends React.Component {

  handleWindowResize = () => {
    if (window.innerWidth >= 1200 && !this.props.sidebar) {
      this.props.toggleSidebar(true)
    }

    if (window.innerWidth < 1200 && this.props.sidebar) {
      this.props.toggleSidebar(false);
    }
  };

  componentDidMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }
  
  handleToggleSidebarClick = () => {
    if (window.innerWidth <= 1200 && this.props.sidebar) {
      return this.props.toggleSidebar(false);
    }

    if (window.innerWidth <= 1200 && !this.props.sidebar) {
      return this.props.toggleSidebar(true);
    }
  }

  render() {
    return (
      <header className="dt-header cp-header">
        <div className="dt-header__container">

          <div className="dt-brand" onClick={() => this.handleToggleSidebarClick()}>
            <div className="dt-brand__tool" data-toggle="main-sidebar">
              {this.props.sidebar
                ? <i className="icon icon-xl icon-menu-fold d-lg-inline-block"></i>
                : <i className="icon icon-xl icon-menu"></i>
              }
            </div>

            <span className="dt-brand__logo">
              <Link to="/" className="dt-brand__logo-link">
                <picture>
                  <source srcSet={logoWEBP} type="image/webp"/>
                  <source srcSet={logoPNG} type="image/png"/>
                  <img src={logoPNG} alt="Hytale Logo"/>
                </picture>
              </Link>
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

const mapStateToProps = ({sidebar}) => { return { sidebar } };

export default connect(mapStateToProps, actions.default)(Index);