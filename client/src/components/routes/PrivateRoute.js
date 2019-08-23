import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route 
        {...rest}
        render={props => {
          return this.props.auth ? (
            <Component {...props} />
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