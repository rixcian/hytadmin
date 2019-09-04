import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import OutsideClickAlerter from '../OutsideClickAlerter';
import DropdownItems from './DropdownItems';

import userIconWEBP from '../../../assets/img/user_icons/rixcian_icon.webp';
import userIconPNG from '../../../assets/img/user_icons/rixcian_icon.png';
import('./HeaderUserDetails.scss');

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
              <img className="dt-avatar size-40" src={userIconPNG} alt={this.props.auth.username}/>
            </picture>
          </div>

          {this.state.showDetails &&
            <OutsideClickAlerter onOutsideClick={() => this.toggleDetails()}>
              <DropdownItems
                user={this.props.auth}
                onLogout={() => this.props.logoutUser()}
              />
            </OutsideClickAlerter>
          }

        </li>
      </ul>
    );
  }
}

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, actions.default)(HeaderUserDetails);