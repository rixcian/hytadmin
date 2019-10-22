import React, { useState } from 'react';
import axios from 'axios';

const ErrorText = (props) => <small className="form-text text-danger">{props.children}</small>;

export default props => {
  const [email, setEmail] = useState(props.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailChanged, setEmailChanged] = useState(false);

  const onFormSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (email === props.email) {
      setIsSubmitting(false);
      return setErrors({ email: 'Muhehe.. I gotcha' });
    }

    axios.put('/api/account/email', { email })
      .then(() => {
        setIsSubmitting(false);
        setEmailChanged(true);
        setTimeout(() => setEmailChanged(false), 1500);
      })
      .catch(err => {
        setIsSubmitting(false);
        setErrors({ email: err.response.data.err });
      });
  };

  return (
    <form onSubmit={onFormSubmit} style={{ padding: '2px 10px' }}>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Změna emailu"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="input-group-append">
          <button
            type="submit"
            className="btn btn-dark btn-sm text-uppercase"
            disabled={isSubmitting}
          >
            Změnit email
          </button>
        </div>
      </div>
      {errors.email && <ErrorText>{errors.email}</ErrorText>}
      {emailChanged && <small className="form-text text-success">Váš email byl úspěšně změněn.</small>}
    </form>
  )
}