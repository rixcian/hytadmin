import React from "react";
import axios from "axios";
import { notification, Radio } from "antd";

import("./NewEditor.scss");

const ErrorText = (props) => <small className="text-danger mr-3">{props.children}</small>;

class NewEditor extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    role: "redaktor",
    errorMessage: null
  };

  validateForm = e => {
    e.preventDefault();

    const { username, email, password,
            passwordConfirmation, role } = this.state;
    
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    this.setState({ errorMessage: null });

    if (username === "" || email === "" || password === "" ||
        passwordConfirmation === "" || role === "") {
      this.setState({ errorMessage: "Vyplňte všechny údaje!" });
      return;
    }
    else if (password !== passwordConfirmation) {
      this.setState({ errorMessage: "Hesla se neshodují!" });
      return;
    }
    else if (!re.test(String(email).toLowerCase())) {
      this.setState({ errorMessage: "Špatný formát emailové adresy!" });
      return;
    }
    else {
      axios.post('/api/register', {username, email, password, role})
        .then(() => {
          notification['success']({
            message: 'Redaktor byl vytvořen',
            description: 'Nový redaktor byl úspěšně vytvořen.',
            placement: 'bottomRight'
          });
          this.props.history.push('/editors');
        })
        .catch(errResponse => {
          this.setState({errorMessage: errResponse.response.data.err})
        })
    }
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <div className="row">
        <div className="col-md-4 col-12">
          <div className="dt-page__header">
            <h1 className="dt-page__title">Nový redaktor</h1>
          </div>

          <div className="dt-card">
            <div className="dt-card__body">
              <form onSubmit={this.validateForm} onChange={() => errorMessage && this.setState({ errorMessage: null })}>
                <div className="form-group">
                  <label>Už. jméno</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.username}
                    onChange={e => this.setState({ username: e.target.value })}
                    placeholder="Uživatelské jméno"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                    placeholder="Emailová adresa"
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label>Heslo</label>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                    placeholder="Heslo"
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label>Potvrdit Heslo</label>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.passwordConfirmation}
                    onChange={e =>
                      this.setState({ passwordConfirmation: e.target.value })
                    }
                    placeholder="Potvrdit heslo"
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <div className="text-center">
                    <Radio.Group
                      onChange={e => this.setState({ role: e.target.value })}
                      value={this.state.role}
                      defaultValue={"redaktor"}
                    >
                      <Radio value="redaktor">Redaktor</Radio>
                      <Radio value="administrátor">Administrátor</Radio>
                    </Radio.Group>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  {errorMessage && <ErrorText children={errorMessage} />}
                  <button
                    type="submit"
                    className="btn btn-dark"
                    onClick={() => {}}
                  >
                    Vytvořit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewEditor;
