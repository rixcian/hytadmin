import React from 'react';
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import {Link} from "react-router-dom";

const ErrorText = (props) => <small className="form-text text-danger">{props.children}</small>;

class PasswordResetForm extends React.Component {

  validateForm = values => {
    let errors = {};

    if (!values.email) {
      errors.email = "Email je povinný údaj";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Špatný formát emailové adresy";
    }
  };

  onFormSubmit = (values, actions) => {
    axios.post('/api/password-reset', { email: values.email })
    .then(() => {
      this.setState({ passwordResetSend: true });
      actions.setSubmitting(false);
      this.props.onPasswordResetSuccess();
    })
    .catch(err => {
        actions.setSubmitting(false);
        actions.setFieldError(Object.keys(err)[0], err[Object.keys(err)[0]]);
    });
  };

  render() {
    return (
      <Formik
        initialValues={{ email: ''}}
        validate={values => this.validateForm(values)}
        onSubmit={(values, actions) => this.onFormSubmit(values, actions)}
        render={({ errors, isSubmitting }) => (
          <Form>

            <div className="form-group">
              <Field
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </div>

            <div className="form-group" style={{ textAlign: "right" }}>
              <span className="d-inline-block mr-4">
                <Link to="/signin" className="d-inline-block font-weight-medium">
                  Zpět na přihlášení
                </Link>
              </span>
              <button
                type="submit"
                className="btn btn-dark text-uppercase"
                disabled={isSubmitting}
              >
                Potvrdit
              </button>
            </div>

          </Form>
        )}
      />
    )
  }
}

export default PasswordResetForm;