import React from 'react';
import { Link } from 'react-router-dom';

import PasswordResetForm from './PasswordResetForm';

class PasswordReset extends React.Component {

  state = {
    passwordResetSuccess: false
  };

  render() {
    return (
      <div className="dt-root page-signin">
        <div className="dt-login--container dt-app-login--container">
          <div className="dt-login__content-wrapper">

            <div className="dt-login__content">
              <div className="dt-login__content-inner">

                <div className="text-center mb-8">
                  <h1>Zapomenuté heslo</h1>
                </div>

                <p className="text-sm-center font-weight-light mb-5">
                  Zadejte Vaši emailovou adresu, se kterou jste se zaregistrovali.
                  Po potvrzení formuláře Vám bude zasláno na email nově vygenerované heslo.
                </p>

                {!this.state.passwordResetSuccess
                  ? <PasswordResetForm
                      onPasswordResetSuccess={() => this.setState({ passwordResetSuccess: true })}
                    />
                  :
                  <div className="form-group" style={{ textAlign: 'center' }}>
                    <p className="text-success text-center mb-5 mt-3">Na Váš email bylo zasláno nové heslo.</p>
                    <Link to="/signin" className="btn btn-dark text-uppercase">
                      Zpět na přihlášení
                    </Link>
                  </div>
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;