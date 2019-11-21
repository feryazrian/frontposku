import httpClient from './httpClient'

const { get: GET, post: POST } = httpClient

export const loginUser = (username, password, remember) => {
  return POST('/api/pos/auth/login', { username, password, remember })
}

export const isLogin = () => {
  return GET('/api/pos/userlogin')
}

export const register = (password, firstName, lastName, email, phone, type, { name: outletName, city: outletCity, state: outletState, address: outletAddress, postCode: outletPostCode }) => {
  return POST('api/pos/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    type,
    password: password,
    password_confirmation: password,
    outlet_name: outletName,
    outlet_state: outletState,
    outlet_city: outletCity,
    outlet_address: outletAddress,
    outlet_postcode: outletPostCode
  })
}

export const logout = usrID => {
  return POST('api/pos/auth/destroy', { user_id: usrID })
}

export const createOTP = (requestedBy, type, action) => {
  return POST('api/pos/auth/requestOtp', { requestedBy, type, action })
}

export const verifyOTP = (requestedBy, type, action, value, trxID) => {
  return POST('api/pos/auth/verifyOtp', { requestedBy, type, action, otp: value, trxid: trxID })
}

export const activation = license => {
  return POST('api/pos/auth/outlet-license-activation', { license })
}

