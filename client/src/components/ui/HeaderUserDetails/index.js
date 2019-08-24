import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import userIconWEBP from '../../../assets/img/user_icons/rixcian_icon.webp';
import userIconPNG from '../../../assets/img/user_icons/rixcian_icon.png';
import('./HeaderUserDetails.scss');

const DropdownItems = (props) => {
  const { username } = props.user;
  return (
    <div className="dropdown-menu dropdown-menu-right">
      <div className="dt-avatar-wrapper flex-nowrap p-6 mt--5 bg-gradient-dark text-white rounded-top">
        <picture>
          <source srcSet={userIconWEBP} type="image/webp"/>
          <source srcSet={userIconPNG} type="image/png"/>
          <img className="dt-avatar" src={userIconPNG} alt={username}/>
        </picture>
        <span className="dt-avatar-info">
          <span className="dt-avatar-name">{username}</span>
          <span className="f-12 text-light-gray">Administrator</span>
        </span>
      </div>
      <div className="dropdown-item">
        <i className="icon icon-user-o icon-fw mr-2 mr-sm-1"/>
        <span className="dropdown-item-info">Profil</span>
      </div>
      <div className="dropdown-item">
        <i className="icon icon-setting icon-fw mr-2 mr-sm-1"/>
        <span className="dropdown-item-info">Nastavení</span>
      </div>
      <div className="dropdown-item" onClick={() => props.onLogout()}>
        <i className="icon icon-signin icon-fw mr-2 mr-sm-1"/>
        <span className="dropdown-item-info">Odhlásit</span>
      </div>
    </div>
  )
};

class HeaderUserDetails extends React.Component {

  state = {
    showDetails: false
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  };

  render() {
    return (
      <ul className="dt-nav cp-header-userdetails">
        <li className="dt-nav__item dropdown">

          <div onClick={() => this.toggleDetails()} className="dt-nav__link dropdown-toggle no-arrow dt-avatar-wrapper"
             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <picture>
              <source srcSet={userIconWEBP} type="image/webp"/>
              <source srcSet={userIconPNG} type="image/png"/>
              <img className="dt-avatar size-40" src={userIconPNG} alt="rixcian"/>
            </picture>
          </div>

          {this.state.showDetails &&
            <DropdownItems
              user={this.props.auth}
              onLogout={() => this.props.logoutUser()}
            />
          }

        </li>
      </ul>
    );
  }
}

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, actions)(HeaderUserDetails);