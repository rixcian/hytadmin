import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class NotFoundRoute extends Component {
  render() {
    return (
      <Route 
        render={props =>
          this.props.auth ?
              <Redirect to={{ pathname: '/', state: { from: props.location } }} /> : 
              <Redirect to={{ pathname: '/signin', state: { from: props.location } }} /> 
        }
      />
    )
  }
}

const mapStateToProps = ({ auth }) => { return { auth } };

export default connect(mapStateToProps, null)(NotFoundRoute);
