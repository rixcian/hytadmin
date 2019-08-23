import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class PublicRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          return this.props.auth ? (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          ) : (
            <Component {...props} />
          );
        }}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps,null)(PublicRoute);
