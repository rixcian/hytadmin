import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import userIconWEBP from "../../../assets/img/user_icons/rixcian_icon.webp";
import userIconPNG from "../../../assets/img/user_icons/rixcian_icon.png";
import('./Sidebar.scss');

class Sidebar extends React.Component {
  render() {
    const { username, role } = this.props.auth;

    return (
      <aside id="main-sidebar" className="dt-sidebar cp-sidebar">
        <div className="dt-sidebar__container">

          <div className="dt-sidebar__notification  d-none d-lg-block">
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

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, null)(Sidebar);