export const API = {
   CONFIG:'getPOSAPI_Config'
  ,AUTH:{
     LOGIN:'getPOSAPI_Auth_Login'
    ,REGISTER:'getPOSAPI_Auth_Register'
    ,LOGOUT:'getPOSAPI_Auth_Logout'
    ,OTP:{
       CREATE:'getPOSAPI_Auth_OTP_Request'
      ,VERIFY:'getPOSAPI_Auth_OTP_Verify'
    }
  }
  ,CUSTOMER:{
     GET:'getPOSAPI_Customer_Get'
    ,CREATE:'getPOSAPI_Customer_Create'
    ,UPDATE:'getPOSAPI_Customer_Update'
  }
  ,USER:{
    UPDATE: 'getPOSAPI_User_Update'
  }
  ,ACTIVATION:'getPOSAPI_Activation'
  ,SALES:{
    HISTORY:'getPOSAPI_Sales_History'
  }
  ,TRANSACTION:{
    ORDER:'getPOSAPI_Transaction_Order'
  }
}

export const APP = {
   LOCALE:'getApp_Locale'
  ,ISMOBILEONLY: 'getApp_isMobileOnly'
  ,CUSTOMER:{ CURRENT_DEFAULT:'getApp_Customer_CurrentDefault' }
  ,LOCAL_STORE:{ TYPES:'getApp_LocalStore_Types' }
}