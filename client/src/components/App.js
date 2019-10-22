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
import NewArticle from "./pages/NewArticle";
import ArticleList from "./pages/ArticleList";
import EditArticle from "./pages/EditArticle";
import EditorList from "./pages/EditorList";
import EditorDetail from "./pages/EditorDetail";
import EditorNew from "./pages/NewEditor";
import PasswordReset from "./pages/PasswordReset";
import AccountSettings from "./pages/AccountSettings";

import('./App.scss');

class App extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter className="app">
        {this.props.auth !== null ? (
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PublicRoute exact path="/signin" component={SignIn} />
            <PublicRoute exact path="/password-reset" component={PasswordReset} />
            <PrivateRoute exact path="/articles" component={ArticleList} />
            <PrivateRoute exact path="/articles/new" component={NewArticle} />
            <PrivateRoute exact path="/articles/:id" component={EditArticle} />
            <PrivateRoute exact path="/editors/" component={EditorList} />
            <PrivateRoute exact path="/editors/new" component={EditorNew} />
            <PrivateRoute exact path="/editors/:id" component={EditorDetail} />
            <PrivateRoute exact path="/account/settings" component={AccountSettings} />
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
  actions.default
)(App);
