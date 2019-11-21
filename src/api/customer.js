import httpClient from './httpClient'

const { get:GET, post:POST } = httpClient

export const getCustomers = (_ID, { page = 1, isOnlyMember = true, q } = { }) => {
    let params = { user_id:_ID, member:isOnlyMember }
    if(!isOnlyMember)
      delete params.member
    if(!isNaN(page) && page > 0)
      params.page = page
    if(q)
      params.search = q
    return GET('api/pos/getCustomers', { params })
  }
  
  export const createCustomer = (first_name, last_name, { email, otpEmail }, { phone, otpPhone, trxid }, customer_group_id, gender, date_of_birth) => {
    let data = { first_name,last_name,customer_group_id }
    if (email) { data.email = email; data.otpEmail = otpEmail; }
    if (phone) { data.phone = phone; data.otpPhone = otpPhone; data.trxid = trxid; }
    if (gender) { data.gender = gender }
    if (date_of_birth) { data.date_of_birth = date_of_birth }
    return POST('api/pos/auth/addCustomer', data)
  }