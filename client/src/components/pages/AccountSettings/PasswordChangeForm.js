import React, { useState } from 'react';
import axios from 'axios';

const ErrorText = (props) => <small className="form-text text-danger">{props.children}</small>;

export default () => {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  const onFormSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (oldPassword === '' || newPassword === '' || newPasswordAgain === '') {
      setIsSubmitting(false);
      return setErrors({password: 'Vyplňte všechna pole.'});
    }

    if (newPassword !== newPasswordAgain) {
      setIsSubmitting(false);
      return setErrors({password: 'Nová hesla se neshodují.'})
    }

    axios.put('/api/account/password', { oldPassword, newPassword })
      .then(() => {
        setIsSubmitting(false);
        setPasswordChanged(true);
        setTimeout(() => setPasswordChanged(false), 1500);
      })
      .catch(err => {
        setIsSubmitting(false);
        setErrors({password: err.response.data.err});
      })
  };

  return (
    <form onSubmit={onFormSubmit} style={{ padding: '2px 10px' }}>
      <div className="form-group mb-2">
        <input
          type="password"
          name="previousPassword"
          className="form-control"
          placeholder="Stávající heslo"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
      </div>
      <div className="form-group mb-2">
        <input
          type="password"
          name="newPassword"
          className="form-control"
          placeholder="Nové heslo"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-group mb-2">
        <input
          type="password"
          name="newPasswordAgain"
          className="form-control"
          placeholder="Nové heslo znovu"
          value={newPasswordAgain}
          onChange={e => setNewPasswordAgain(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-dark btn-sm text-uppercase float-right"
        disabled={isSubmitting}
      >
        Změnit heslo
      </button>
      {errors.password && <ErrorText>{errors.password}</ErrorText>}
      {passwordChanged && <small className="form-text text-success">Heslo bylo úspěšně změněno</small>}
    </form>
  )
}