
import Router from 'vue-router'
import Vue from 'vue'

import Login from '../views/anonymous/login-form.vue';
import View from '../views/secured/view.vue';
import Home from '../views/secured/home.vue';

import Payment from '../views/secured/payment.vue';
import CashPayment from '../views/secured/payment/cash.vue';
import CreditPayment from '../views/secured/payment/credit.vue';

import Sales from '../views/secured/sales.vue';
import History from '../views/secured/sales/history.vue';
import Hold from '../views/secured/sales/hold.vue';
import Offline from '../views/secured/sales/offline.vue';

import Customer from '../views/secured/customer.vue';

import Cashier from '../views/secured/cashier.vue';
import CloseCounter from '../views/secured/cashier/closecounter.vue';
import TodayCash from '../views/secured/cashier/todaycash.vue';
import SalesHistory from '../views/secured/cashier/saleshistory.vue';

import Reports from '../views/secured/reports.vue';

import Product from '../views/secured/product.vue';
import LowStock from '../views/secured/product/low-stock.vue';
import RequestedProduct from '../views/secured/product/requested-product.vue';
import ProductSetting from '../views/secured/product/product-setting.vue';

import Setting from '../views/secured/setting.vue';
import Discount from '../views/secured/setting/discount.vue';
import Taxes from '../views/secured/setting/taxes.vue';
import Basic from '../views/secured/setting/basic.vue';
import Profile from '../views/secured/setting/profile.vue';

import Register from '../views/anonymous/Register'
import Activation from '../views/secured/Activation'

// Mobile Page
import ViewOutlet from '../views/secured/mobile/pos-view-outlet.vue'
import AddCustomProduct from '../components/cart/custom-product-form.vue'
import CartDetails from '../views/secured/mobile/pos-cart-mobile.vue'
import OrderSummary from '../views/secured/mobile/pos-order-summary.vue'
import HoldSaleDetail from '../views/secured/mobile/pos-hold-sale-detail.vue'
import OfflineSaleDetail from '../views/secured/mobile/pos-offline-sale-detail.vue'
import AddCustomer from '../views/secured/mobile/pos-add-customer.vue'
import FAQ from '../views/secured/mobile/help.vue';

import store from '../store'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes : [
        {
            path: '/pos/login',
            component: Login,
            name: 'pos_login',
            beforeEnter: (to, from, next) => {
                next()
            }
        },
        {
            path: '/pos/register',
            component: Register,
            name: 'pos_register'
        },
        {
            path: '/pos/',
            component: View,
            name: 'pos_view',
            beforeEnter: (to, from, next) => {            
                if (store.getters.getToken !== null) {
                    next()
                }
                else {
                    next({ name: "pos_login" })
                }
            },
            children: [
                {
                    path: 'home',
                    component: Home,
                    name: 'pos_home'
                },
                {
                    path: 'payment',
                    component: Payment,
                    children: [
                        {
                            path: '',
                            component: CashPayment,
                            name: 'pos_payment'
                        },
                        {
                            path: 'cash',
                            component: CashPayment,
                            name: 'pos_payment_cash'
                        },
                        {
                            path: 'credit',
                            component: CreditPayment,
                            name: 'pos_payment_credit'
                        },
                    ]
                },
                {
                    path: 'sales',
                    component: Sales,
                    children: [
                        {
                            path: '',
                            component: History,
                            name: 'pos_sales'
                        },
                        {
                            path: 'history',
                            component: History,
                            name: 'pos_sales_history'
                        },
                        {
                            path: 'hold',
                            component: Hold,
                            name: 'pos_sales_hold'
                        },
                        {
                            path: 'offline',
                            component: Offline,
                            name: 'pos_sales_offline'
                        }
                    ]
                },
                {
                    path: 'customer',
                    component: Customer,
                    name: 'pos_customer'
                },
                {
                    path: 'cashier',
                    component: Cashier,
                    children: [
                        {
                            path: '',
                            component: CloseCounter,
                            name: 'pos_cashier'
                        },
                        {
                            path: 'closecounter',
                            component: CloseCounter,
                            name: 'pos_cashier_closecounter'
                        },
                        {
                            path: 'todaycash',
                            component: TodayCash,
                            name: 'pos_cashier_todaycash'
                        },
                        {
                            path: 'saleshistory',
                            component: SalesHistory,
                            name: 'pos_cashier_saleshistory'
                        }
                    ]
                },
                {
                    path: 'reports',
                    component: Reports,
                    name: 'pos_reports'
                },
                {
                    path: 'product',
                    component: Product,
                    children: [
                        {
                            path: '',
                            component: LowStock,
                            name: 'pos_product'
                        },
                        {
                            path: 'lowstock',
                            component: LowStock,
                            name: 'pos_product_low_stock'
                        },
                        {
                            path: 'requested',
                            component: RequestedProduct,
                            name: 'pos_product_requested'
                        },
                        {
                            path: 'setting',
                            component: ProductSetting,
                            name: 'pos_product_setting'
                        }
                    ]
                },
                {
                    path: 'setting',
                    component: Setting,
                    children: [
                        {
                            path: '',
                            component: Discount,
                            name: 'pos_setting'
                        },
                        {
                            path: 'discount',
                            component: Discount,
                            name: 'pos_setting_discount'
                        },
                        {
                            path: 'taxes',
                            component: Taxes,
                            name: 'pos_setting_taxes'
                        },
                        {
                            path: 'basic',
                            component: Basic,
                            name: 'pos_setting_basic'
                        },
                        {
                            path: 'profile',
                            component: Profile,
                            name: 'pos_setting_profile'
                        }
                    ]
                }, 
                {
                    path: 'activation'
                    , component: Activation
                    , name: 'pos_activation'
                },
                // Mobile Route
                {
                    path: 'view-outlet',
                    component: ViewOutlet,
                    name: 'pos_view_outlet'
                },
                {
                    path: 'add-custom-product',
                    component: AddCustomProduct,
                    name: 'pos_add_custom_product',
                    props: true
                },
                {
                    path: 'cart-details',
                    component: CartDetails,
                    name: 'pos_cart_details',
                    props: true
                },
                {
                    path: 'order-summary',
                    component: OrderSummary,
                    name: 'pos_sale_order_summary',
                    props: true
                },
                {
                    path: 'hold-sale-detail',
                    component: HoldSaleDetail,
                    name: 'pos_hold_sale_detail',
                    props: true
                },
                {
                    path: 'offline-sale-detail',
                    component: OfflineSaleDetail,
                    name: 'pos_offline_sale_detail',
                    props: true
                },
                {
                    path: 'add-customer',
                    component: AddCustomer,
                    name: 'pos_add_customer',
                    props: true
                },
                {
                    path: 'help',
                    component: FAQ,
                    name: 'pos_help'
                }
            ]
        }
    ]
})
