import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import NotFoundRoute from "./routes/NotFoundRoute";

import Loader from './loader';

import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn/SignIn';


class App extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        {this.props.auth !== null ? (
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PublicRoute exact path="/signin" component={SignIn} />
            <NotFoundRoute />
          </Switch>
        ) : <Loader />}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(
  mapStateToProps,
  actions
)(App);
