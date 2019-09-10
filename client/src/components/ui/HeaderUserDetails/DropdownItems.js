import React from 'react';

import { Link } from 'react-router-dom';

import userIconWEBP from "../../../assets/img/user_icons/rixcian_icon.webp";
import userIconPNG from "../../../assets/img/user_icons/rixcian_icon.png";

export default (props) => {
  const { username, role, _id } = props.user;

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
          <span className="f-12 text-light-gray text-capitalize">{role}</span>
        </span>
      </div>
      <Link to={`/editors/${_id}`} className="dropdown-item">
        <i className="icon icon-user-o icon-fw mr-2 mr-sm-1"/>
        <span className="dropdown-item-info">Profil</span>
      </Link>
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