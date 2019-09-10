import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import OutsideClickAlerter from '../../ui/OutsideClickAlerter';

import userIconWEBP from "../../../assets/img/user_icons/rixcian_icon.webp";
import userIconPNG from "../../../assets/img/user_icons/rixcian_icon.png";
import('./Sidebar.scss');

class Sidebar extends React.Component {

  sidebarRef = React.createRef();

  handleClick = e => {
    if (e.target.classList.contains('dt-side-nav__text') && window.innerWidth <= 1200) {
      setTimeout(() =>
        this.props.toggleSidebar(false)
      , 50);
    }

    if (this.sidebarRef.current &&
        !this.sidebarRef.current.contains(e.target) &&
        this.props.sidebar &&
        window.innerWidth <= 1200) {
      console.log('Click outside of a sidebar ...');
      console.log(e.target.classList);
      if (!e.target.classList.contains('icon-menu-fold')) {
        this.props.toggleSidebar(false);
      }
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  render() {
    const { username, role } = this.props.auth;

    return (
        <aside ref={this.sidebarRef} id="main-sidebar" className={`${!this.props.sidebar ? 'sb-closed' : 'sb-opened'} dt-sidebar cp-sidebar`}>
          <div className="dt-sidebar__container">

            <div className="dt-sidebar__notification d-lg-block">
              <div className="dropdown mb-6" id="user-menu-dropdown">

                <div className="dropdown-toggle dt-avatar-wrapper text-body"
                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <picture>
                    <source srcSet={userIconWEBP} type="image/webp"/>
                    <source srcSet={userIconPNG} type="image/png"/>
                    <img className="dt-avatar size-40" src={userIconPNG} alt="rixcian"/>
                  </picture>
                  <span className="dt-avatar-info">
                  <span className="dt-avatar-name">{ username }</span>
                  <span className="f-12 text-light-gray text-capitalize">{ role }</span>
                </span>
                </div>

              </div>
            </div>
            <ul className="dt-side-nav">

              <li className="dt-side-nav__item dt-side-nav__header">
                <span className="dt-side-nav__text">Přehled</span>
              </li>

              <li className="dt-side-nav__item">
                <div className="dt-side-nav__link" title="Přehled">
                  <i className="icon icon-dashboard icon-fw icon-xl"/>
                  <Link to="/" className="dt-side-nav__text">Statistiky</Link>
                </div>
              </li>



              <li className="dt-side-nav__item dt-side-nav__header">
                <span className="dt-side-nav__text">články</span>
              </li>

              <li className="dt-side-nav__item">
                <div className="dt-side-nav__link" title="Přehled článků">
                  <i className="icon icon-copy icon-fw icon-xl"/>
                  <Link to="/articles" className="dt-side-nav__text">Přehled článků</Link>
                </div>
              </li>

              <li className="dt-side-nav__item">
                <div className="dt-side-nav__link" title="Přehled článků">
                  <i className="icon icon-add icon-fw icon-xl"/>
                  <Link to="/articles/new" className="dt-side-nav__text">Nový článek</Link>
                </div>
              </li>



              {role === 'administrátor' && (
                <>
                  <li className="dt-side-nav__item dt-side-nav__header">
                    <span className="dt-side-nav__text">redaktoři</span>
                  </li>

                  <li className="dt-side-nav__item">
                    <div className="dt-side-nav__link" title="Přehled redaktorů">
                      <i className="icon icon-auth-screen icon-fw icon-xl"/>
                      <Link to="/editors" className="dt-side-nav__text">Přehled redaktorů</Link>
                    </div>
                  </li>

                  <li className="dt-side-nav__item">
                    <div className="dt-side-nav__link" title="Nový redaktor">
                      <i className="icon icon-add icon-fw icon-xl"/>
                      <Link to="/editors/new" className="dt-side-nav__text">Nový redaktor</Link>
                    </div>
                  </li>
                </>
              )}

            </ul>
          </div>
        </aside>
    );
  }
}

const mapStateToProps = ({ auth, sidebar }) => { return { auth, sidebar } };

export default connect(mapStateToProps, actions.default)(Sidebar);