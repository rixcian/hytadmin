import React from 'react';
import { connect } from "react-redux";
import * as actions from '../../../actions';

import PasswordChangeForm from './PasswordChangeForm';
import EmailChangeForm from './EmailChangeForm';
import AvatarUpload from "./AvatarUpload";

import userIconWEBP from "../../../assets/img/user_icons/rixcian_icon.webp";
import userIconPNG from "../../../assets/img/user_icons/rixcian_icon.png";

import('./AccountSettings.scss');

class AccountSettings extends React.Component {

  render() {
    const { username } = this.props.auth;

    return (
      <div className="profile page-account">

        <div className="profile__banner">

          <div className="profile__banner-top">
            <div className="dt-avatar-wrapper">
              <picture>
                <source srcSet={this.props.auth.avatarPath + `?${new Date().getTime()}`} type="image/webp"/>
                <source srcSet={this.props.auth.avatarPath + `?${new Date().getTime()}`} type="image/png"/>
                <img className="dt-avatar dt-avatar__shadow size-90 mr-sm-4" src={this.props.auth.avatarPath + `?${new Date().getTime()}`} alt={this.props.auth.username} />
              </picture>

              <div className="dt-avatar-info">
                <span className="dt-avatar-name display-4 mb-2 font-weight-medium">{username}</span>
                <span className="f-16 text-light font-weight-light">Nastavení účtu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="row">
            <div className="col-xl-8 order-xl-1">

              <div className="card">

                <div className="card-header card-nav bg-transparent d-flex justify-content-between">
                  <h2 style={{ marginBottom: '-10px' }}>Nastavení</h2>
                </div>

                <div className="card-body pb-2 pt-2 pt-0">
                  <div className="row pt-5 pb-5">

                    <div className="col-sm-6 col-12 mb-5">
                      <h4 className="">Heslo</h4>
                      <PasswordChangeForm />
                    </div>

                    <div className="col-sm-6 col-12 mb-5">
                      <h4 className="">Email</h4>
                      <EmailChangeForm email={this.props.auth.email} />
                    </div>

                    <div className="col-sm-6 col-12 mb-5">
                      <h4 className="">Avatar</h4>
                      <AvatarUpload
                        avatarPath={this.props.auth.avatarPath}
                        onUploadSuccess={() => this.props.fetchUser()}
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, actions.default)(AccountSettings);