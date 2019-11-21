import Vue from 'vue'
import Vuex from 'vuex'

import { API } from './modules/api-pos'
import auth from './modules/auth'
import { APP } from './mutations'
import { APP as setApp } from './actions'
import { APP as getApp} from './getters'
import { isMobileOnly } from 'mobile-device-detect'

Vue.use(Vuex)

export default new Vuex.Store({
   modules:{
     auth
    ,api:API
  }
  ,state:{
     app:{
       customer:{ currentDefault:null }
    }
  }
  ,mutations:{
    [ APP.CUSTOMER.CURRENT_DEFAULT ]:({ app }, value) => {
      app.customer.currentDefault = value
    }
  }
  ,actions:{
    [ setApp.CUSTOMER.CURRENT_DEFAULT ]:({ commit }, v) => Promise.resolve(commit(APP.CUSTOMER.CURRENT_DEFAULT, v))
  }
  ,getters:{
     [ getApp.LOCALE ]:() => v => {
      switch(v) {
        case 'IDR':
          return 'de-DE'
        default:
          return 'en-US'
      }
    }
    ,[ getApp.ISMOBILEONLY ]:() => isMobileOnly
    ,[ getApp.CUSTOMER.CURRENT_DEFAULT ]:({ app }) => app.customer.currentDefault
    ,[ getApp.LOCAL_STORE.TYPES ]:() => [
       { type:'pos_categories' }
      ,{ type:'pos_product_categories' }
      ,{ type:'pos_leftmenus' }
      ,{ type:'pos_cashier' }
      ,{ type:'pos_drawer' }
      ,{ type:'pos_products' }
      ,{ type:'pos_orders' }
      ,{ type:'pos_today_sales' }
      ,{ type:'pos_sale_history' }
      ,{ type:'pos_offline_orders' }
      ,{ type:'pos_carts' }
      ,{ type:'pos_discount' }
      ,{ type:'pos_holds' }
      ,{ type:'pos_cart_customer' }
      ,{ type:'pos_customers' }
      ,{ type:'pos_offline_customers' }
      ,{ type:'pos_customer_groups' }
      ,{ type:'pos_current_cart' }
      ,{ type:'pos_lowstock_products' }
      ,{ type:'pos_requested_products' }
      ,{ type:'pos_discounts' }
    ]
  }
})