import * as types from './ActionTypes';
import api from '../api';

export function fetchedFtpAccounts(ftps) {
  return {
    type: types.FETCHED_ALL_FTP_ACCOUNTS,
    ftps
  }
}







export const fetchAllFtpAccounts = () => dispatch => {
  api.getAllFtpAccount()
  .then(res => {
    dispatch(fetchedFtpAccounts(res.data.ftps));
  })
}