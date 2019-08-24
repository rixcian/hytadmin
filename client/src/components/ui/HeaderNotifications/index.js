import React from 'react';

import('./HeaderNotifications.scss');

class HeaderNotifications extends React.Component {

  state = {
    showNotifications: false
  };

  toggleNotifications = () => {
    this.setState({ showNotifications: !this.state.showNotifications });
  };

  render() {
    return (
      <ul className="dt-nav cp-header-notifications">
        <li className="dt-nav__item dt-notification dropdown">

          <div onClick={() => this.toggleNotifications()} className="dt-nav__link dropdown-toggle no-arrow" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
            <i className="icon icon-notification icon-fw dt-icon-alert"/>
          </div>

          {this.state.showNotifications && (
            <div className="dropdown-menu dropdown-menu-right dropdown-menu-media">
              <div className="dropdown-menu-header">
                <h4 className="title">Notifications (1)</h4>

                <div className="ml-auto action-area">
                  <span>Mark All Read</span>
                  <span className="ml-2">
                    <i className="icon icon-setting icon-lg text-light-gray"/>
                  </span>
                </div>
              </div>

              <div className="dropdown-menu-body ps-custom-scrollbar">
                <div className="h-auto">

                  <div className="media">
                    <img className="dt-avatar mr-3" src="https://via.placeholder.com/150x150" alt="User"/>
                    <span className="media-body">
                    <span className="message">
                      <span className="user-name">Stella Johnson</span> and
                      <span className="user-name"> Chris Harris </span>
                      have birthdays today. Help them celebrate!
                    </span>
                    <span className="meta-date">8 hours ago</span>
                  </span>
                  </div>

                </div>
              </div>

              <div className="dropdown-menu-footer">
                <div className="card-link"> See All
                  <i className="icon icon-arrow-right icon-fw"/>
                </div>
              </div>
            </div>
          )}

        </li>
      </ul>
    )
  }
}

export default HeaderNotifications;
