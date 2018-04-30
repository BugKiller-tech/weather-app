import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userLoggedIn, userLoggedOut} from '../actions/users'
import api from '../api';


export default function configureStore() {
  const store = createStore(
    rootReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk, createLogger))
  );


  if(localStorage.user) {
    api.checkLogin()
    .then(res => {
      store.dispatch( userLoggedIn(JSON.parse(localStorage.user)))
    })
    .catch(error=>{
      localStorage.clear()
      store.dispatch( userLoggedOut())
      window.location = "/";
    })
  }

  return store;
}