import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import OutsideClickAlerter from '../OutsideClickAlerter';
import DropdownItems from './DropdownItems';

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
              <source srcSet={this.props.auth.avatarPath + `?${new Date().getTime()}`} type="image/webp"/>
              <source srcSet={this.props.auth.avatarPath + `?${new Date().getTime()}`} type="image/png"/>
              <img className="dt-avatar size-40" src={this.props.auth.avatarPath + `?${new Date().getTime()}`} alt={this.props.auth.username}/>
            </picture>
          </div>

          {this.state.showDetails &&
            <OutsideClickAlerter onOutsideClick={this.toggleDetails}>
              <DropdownItems
                user={this.props.auth}
                onLogout={() => this.props.logoutUser()}
                toggleDetails={this.toggleDetails}
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