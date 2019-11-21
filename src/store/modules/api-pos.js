import axios from 'axios'
import { API as getApi } from './../getters'

const { get:G, post:P } = axios

export const API = {
   getters:{
     [ getApi.CONFIG ]:() => () =>
      G('/api/pos/config')
    ,[ getApi.AUTH.LOGIN ]:() => (usr, pwd, isRememberedMe) =>
      P('/api/pos/auth/login', {
         username:usr
        ,password:pwd
        ,remember:isRememberedMe
      })
    ,[ getApi.AUTH.REGISTER ]:() => (pwd, firstName, lastName, email, phone, type, { name:outletName, city:outletCity, state:outletState, address:outletAddress, postCode:outletPostCode }) =>
      P('api/pos/register', {
         first_name:firstName
        ,last_name:lastName
        ,email
        ,phone
        ,type
        ,password:pwd
        ,password_confirmation:pwd
        ,outlet_name:outletName
        ,outlet_state:outletState
        ,outlet_city:outletCity
        ,outlet_address:outletAddress
        ,outlet_postcode:outletPostCode
      })
    ,[ getApi.AUTH.LOGOUT ]:() => usrID =>
      P('api/pos/auth/destroy', { user_id:usrID })
    ,[ getApi.AUTH.OTP.CREATE ]:() => (requestedBy, type, action) =>
      P('api/pos/auth/requestOtp', { requestedBy, type, action })
    ,[ getApi.AUTH.OTP.VERIFY ]:() => (requestedBy, type, action, value, trxID) =>
      P('api/pos/auth/verifyOtp', { requestedBy, type, action, otp:value, trxid:trxID })
    ,[ getApi.ACTIVATION ]:() => license =>
      P('api/pos/auth/outlet-license-activation', { license })
    ,[ getApi.CUSTOMER.GET ]:() => (_ID, { page = 1, isOnlyMember = true, q } = { }) => {
      let params = { user_id:_ID, member:isOnlyMember }
      if(!isOnlyMember)
        delete params.member
      if(!isNaN(page) && page > 0)
        params.page = page
      if(q)
        params.search = q
      return G('api/pos/getCustomers', { params })
    }

    ,[ getApi.CUSTOMER.CREATE ]:() => ( first_name, last_name, { email, otpEmail }, { phone, otpPhone, trxid }, customer_group_id, gender, date_of_birth ) => {
      let data = { first_name,last_name,customer_group_id }
      if (email) { data.email = email; data.otpEmail = otpEmail; }
      if (phone) { data.phone = phone; data.otpPhone = otpPhone; data.trxid = trxid; }
      if (gender) { data.gender = gender }
      if (date_of_birth) { data.date_of_birth = date_of_birth }
      return P('api/pos/auth/addCustomer', data )
    }
    ,[ getApi.SALES.HISTORY ]:() => (usrID, orderID) =>
      G('api/pos/auth/getOrders', {
        params:{
           user_id:usrID
          ,filter_order_id:orderID
        }
      })
    ,[ getApi.TRANSACTION.ORDER ]:() => (order, posData) =>
      P('api/pos/auth/addOrder', {
         order_data:order
        ,pos_data:posData
      })

      // Profile Setting
      ,[ getApi.USER.UPDATE ]:() => (data) =>
      P('api/pos/auth/updateUser', data)

      /* ,[ getApi.USER.UPDATE ]:() => (usrID, firstName, lastName, email, otp, phone, previousPassword, password, passwordConfirm, action) =>
      P('api/pos/auth/updateUser', {
        user_id:usrID
        ,first_name:firstName
        ,last_name:lastName
        ,email: email
        ,otp: otp
        ,phone: phone
        ,previous_password: previousPassword
        ,password: password
        ,password_confirm: passwordConfirm
        ,action: action
      }) */
  }
}