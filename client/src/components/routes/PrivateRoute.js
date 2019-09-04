import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';

class PrivateRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route 
        {...rest}
        render={props => {
          return this.props.auth ? (
            <div className="dt-root">
              <Header />
              <main className="dt-main">
                <Sidebar />
                <div className="dt-content-wrapper">
                  <div className="dt-content">
                    <Component {...props} />
                  </div>
                </div>
              </main>
            </div>
          ) : (
            <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          )
          }
        }
      />
    )
  }
}

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, null)(PrivateRoute);