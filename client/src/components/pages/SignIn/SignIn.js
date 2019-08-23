import React from "react";

import SignInForm from './SignInForm';

import('./signin.scss');

export default class SignIn extends React.Component {
  render() {
    return (
      <div className="dt-root page-signin">
        <div className="dt-login--container dt-app-login--container">
          <div className="dt-login__content-wrapper">

            <div className="dt-login__content">
              <div className="dt-login__content-inner">

                <div className="text-center mb-8">
				  	      <h1>Přihlášení</h1>
                </div>

                <SignInForm />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
