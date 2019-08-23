import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => dispatch => {
  axios.get('/api/current_user')
  .then(res => {
    dispatch({ type: FETCH_USER, payload: res.data });
  });
}

// export const authUser = values => dispatch => {
//   axios.post('/api/login', values)
//   .then(res => {
//     console.log('Succ', res);
//     dispatch({ type: FETCH_USER, payload: res.data });
//   })
//   .catch(err => console.log('Muj err', err));
// }

export const authUser = values => dispatch => {
  return new Promise((resolve, reject) => {
    axios.post('/api/login', values)
    .then(res => {
      dispatch({ type: FETCH_USER, payload: res.data });
      resolve(true);
    })
    .catch(err => reject(err));
  })
}

export const logoutUser = () => dispatch => {
  axios.get('/api/logout')
  .then(() => {
    console.log('finished');
    //dispatch({ type: FETCH_USER, payload: null });
  })
}