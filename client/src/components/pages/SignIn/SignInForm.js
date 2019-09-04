import React from "react";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as actions from "../../../actions";

const ErrorText = (props) => <small className="form-text text-danger">{props.children}</small>;

class SignInForm extends React.Component {
  validateForm = values => {
    let errors = {};
    if (!values.email) {
      errors.email = "Email je povinný údaj";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Špatný formát emailové adresy";
    }

    if (!values.password) errors.password = "Heslo je povinný údaj";
    return errors;
  };

  onFormSubmit = (values, actions) => {
    this.props
      .authUser(values)
      .catch(err => {
        actions.setSubmitting(false);
        actions.setFieldError(Object.keys(err)[0], err[Object.keys(err)[0]]);
      });
  };

  render() {
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
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

            <div className="form-group">
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Heslo"
              />
              <ErrorMessage name="password" component={ErrorText} />
            </div>

            <div className="form-group" style={{ textAlign: "right" }}>
              <span className="d-inline-block mr-4">
                <a className="d-inline-block font-weight-medium" href="/">
                  Zapomněli jste heslo?
                </a>
              </span>
              <button
                type="submit"
                className="btn btn-dark text-uppercase"
                disabled={isSubmitting}
              >
                Přihlásit
              </button>
            </div>
          </Form>

        )}
      />
    );
  }
}

export default connect(
  null,
  actions.default
)(SignInForm);
