window.jQuery = window.$ = require('jquery');

import Vue from 'vue';
// import VueRouter from 'vue-router';
import router from './router'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n';
import axios from 'axios';
import VueLocalForage from 'vue-localforage'
import store from './store'
import VueToast from 'vue-toast-notification';
import LiquorTree from 'liquor-tree'
import Croppa from 'vue-croppa';

import { messages } from './locales';
// import { routes } from './router/routes';

import 'vue-toast-notification/dist/index.css';
import 'vue-croppa/dist/vue-croppa.css';

import '@/assets/styles/app.scss'
import '@/assets/styles/mobile.app.scss'
import '@/assets/ui/css/ui.css'
import '@/assets/scripts/initial'

import App from './App'

// axios
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.transformResponse = [
    data => {
        switch (typeof data) {
            case 'string':
                data = JSON.parse(data)
                break;
        }
        let route
        if ((route = data.route) && route === 'pos_activation') {
            router.push({ name: route })
        }
        return data
    }
]
axios.defaults.headers.common = { "X-Requested-With": "XMLHttpRequest"}

// Vue.use(VueRouter);
Vue.use(VeeValidate);
Vue.use(VueI18n);
Vue.use(VueLocalForage);
Vue.use(VueToast);
Vue.use(LiquorTree);
Vue.use(Croppa);
Vue.use(require('vue-moment'));

// const router = new VueRouter({
//     mode: 'history',
//     base: window.base_dir_url,
//     routes
// });

let base_locale = window.pos_default_locale || 'en';

router.beforeEach((to, from, next) => {
    // console.log("beforeEach")
    if (to.name) {
        if (!messages[base_locale]) {
            document.title = '';
        } else {
            document.title = messages[base_locale][to.name].title;
        }
        next()
    }
})


// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: base_locale, // set locale
    messages, // set locale messages
});

import { Validator } from 'vee-validate'

Validator.extend('pwdVerifier', {
    getMessage:() => 'Confirm password doesn\'t match'
    , validate:(v, [x]) => v === x
}, { hasTarget:true })
Validator.extend('dateResolver', {
    getMessage:() => 'Date format wasn\'t incorrect'
    , validate:v => {
        if((v = v.split('-')).length !== 3) return false
        let result = ''
        try {
          let x
          if(isNaN(x = parseInt(v[0]))) return false
          result += x
          if(isNaN(x = parseInt(v[1])) || x >= 13) return false
          result += '-' + x
          if(isNaN(x = parseInt(v[2])) || x >= 33) return false
          result += '-' + x
        } catch(e) { return false }
        return result
    }
})
const MSISDN = {
  ID:[ '8', '08', '628' ]
}
Validator.extend('orEmailPhone', {
  getMessage:() => 'Username must be phone or email'
  , validate:v => {
    let { numeric, email } = VeeValidate.Rules
    let phone = v => {
      if(!v || !numeric(v)) return false
      switch(window.pos_currency_code) {
        case 'IDR':
          v = String(v)
          for(let e of MSISDN.ID)
            if(v.startsWith(e)) return true
          return false
        default: return true
      }
    }
    if(email(v)) {
      return 1
    }
    if(phone(v)) {
      return 2
    }
    return false
  }
})

window.EventBus = new Vue();


import BagistoProgressBar from "./components/bagisto-pos-progress-bar.vue"

import PosModal from './components/pos-modal.vue'
import PosCommonModal from './components/pos-common-modal.vue'
import PosNavtopSearch from './components/pos-navtop-search.vue'
import PosNavtop from './components/pos-navtop.vue'
import PosNavleft from './components/pos-navleft.vue'
import PosCart from './components/pos-cart.vue'
import PosAccordion from './components/pos-accordion.vue'
import PosHomeProduct from './components/pos-home-products.vue'
import ProductOptions from './components/pos-product-options.vue'
import PosPagination from './components/pos-pagination.vue'

import CustomProductForm from './components/cart/custom-product-form.vue'
import DiscountList from './components/cart/discount-list.vue'
import HoldNote from './components/cart/hold-note.vue'
import DrawerForm from './components/cashier/drawer-form.vue'
import SaleDetails from './components/cashier/sale-details.vue'
import PosCategories from './components/categories/pos-categories.vue'
import PosCategoryNav from './components/categories/pos-category-nav.vue'
import PosCategoryItem from './components/categories/pos-category-item.vue'
import CustomerView from './components/customer/customerview.vue'
import CustomerForm from './components/customer/customer-form.vue'
import RequestForm from './components/product/request-form.vue'
import AddProduct from './components/product/add-product.vue'
import InvoicePrint from './components/sales/invoice-print.vue'
import DiscountForm from './components/setting/discount-form.vue'

import PosMobileHeader from './components/mobile/pos-mobile-header'
import PosNavtopMobile from './components/mobile/pos-navtop-mobile.vue'
import PosSidemenuMobile from './components/mobile/pos-sidemenu-mobile.vue'
import PosNavbottomMobile from './components/mobile/pos-navbottom-mobile.vue'


Vue.component("bagisto-pos-progress-bar", BagistoProgressBar);

Vue.component("pos-modal", PosModal);
Vue.component("pos-common-modal", PosCommonModal);
Vue.component("pos-accordion", PosAccordion);
Vue.component("navtop-search", PosNavtopSearch);
Vue.component("pos-navtop", PosNavtop);
Vue.component("pos-navleft", PosNavleft);
Vue.component("pos-categories", PosCategories);
Vue.component("pos-category-nav", PosCategoryNav);
Vue.component("pos-category-item", PosCategoryItem);
Vue.component("pos-home-products", PosHomeProduct);
Vue.component("product-options", ProductOptions);
Vue.component("pos-pagination", PosPagination);

Vue.component("pos-cart", PosCart);
Vue.component("discount-form", DiscountForm);
Vue.component("request-form", RequestForm);
Vue.component("customerview", CustomerView);
Vue.component("customer-form", CustomerForm);
Vue.component("drawer-form", DrawerForm);
Vue.component("sale-details", SaleDetails);
Vue.component("custom-product-form", CustomProductForm);
Vue.component("discount-list", DiscountList);
Vue.component("hold-note", HoldNote);
Vue.component("invoice-print", InvoicePrint);
Vue.component("add-product", AddProduct);

// Mobile Components
Vue.component("mobileHeader", PosMobileHeader)
Vue.component("pos-navtop-mobile", PosNavtopMobile);
Vue.component("pos-sidemenu-mobile", PosSidemenuMobile);
Vue.component("pos-navbottom-mobile", PosNavbottomMobile);

/* Vue.component("pos-modal", require("./components/pos-modal.vue"));
Vue.component("pos-common-modal", require("./components/secured/common/pos-common-modal.vue").default);
Vue.component("bagisto-pos-progress-bar", require("./components/bagisto-pos-progress-bar.vue"));

Vue.component("ajax-loader", require("./components/secured/common/ajax-loader.vue"));
Vue.component("navtop-search", require("./components/secured/common/navtop-search.vue").default);
Vue.component("pos-navtop", require("./components/secured/common/pos-navtop.vue").default);
Vue.component("pos-navleft", require("./components/secured/common/pos-navleft.vue").default);
Vue.component("pos-categories", require("./components/secured/common/categories/pos-categories.vue").default);
Vue.component("pos-category-nav", require("./components/secured/common/categories/pos-category-nav.vue"));
Vue.component("pos-category-item", require("./components/secured/common/categories/pos-category-item.vue"));
Vue.component("pos-home-products", require("./components/secured/common/pos-home-products.vue").default);
Vue.component("product-options", require("./components/secured/common/product-options.vue"));
Vue.component("pos-cart", PosCart);
Vue.component("discount-form", require("./components/secured/setting/discount-form.vue"));
Vue.component("request-form", require("./components/secured/product/request-form.vue"));
Vue.component("customerview", require("./components/secured/customer/customerview.vue"));
Vue.component("customer-form", require("./components/secured/customer/customer-form.vue"));
Vue.component("drawer-form", require("./components/secured/cashier/drawer-form.vue"));
Vue.component("custom-product-form", require("./components/secured/common/cart/custom-product-form.vue"));
Vue.component("discount-list", require("./components/secured/common/cart/discount-list.vue"));
Vue.component("hold-note", require("./components/secured/common/cart/hold-note.vue"));
Vue.component("invoice-print", require("./components/secured/sales/invoice-print.vue"));
Vue.component("footer-link", require("./components/footer-link.vue"));
Vue.component("add-product", require("./components/secured/product/add-product.vue"));
Vue.component("mobileHeader", require("./components/anonymous/ui/MobileHeader").default)

// Mobile Components
Vue.component("pos-navtop-mobile", require("./components/secured/mobile/pos-navtop-mobile.vue").default);
Vue.component("pos-sidemenu-mobile", require("./components/secured/mobile/pos-sidemenu-mobile.vue").default);
Vue.component("pos-navbottom-mobile", require("./components/secured/mobile/pos-navbottom-mobile.vue").default);
Vue.component("pos-accordion", require("./components/anonymous/ui/pos-accordion.vue").default); */

$(document).ready(function () {

    function onlineWifiStatus() {
        app.browserNetwork();
    }

    window.addEventListener('online', onlineWifiStatus);
    window.addEventListener('offline', onlineWifiStatus);

    const app = new Vue({
        el: "#app",
        router,
        store,
        i18n,
        VueLocalForage,
        VueToast,
        data: {
            posModalId: 'modal_1',
            pos_print_status: false,
            posModalStatus: false,
            posCommonModal: {},
            offline: 0,
            current_currency: window.pos_currency_symbol
        },
        created() {
            axios.interceptors.response.use(
                function (response) {
                    return response;
                },
                this.errorResponseHandler
            );

            // this.checkPosUserLogin();
            EventBus.$on('closeModal', (id) => {
                console.log(id)
                this.posModalId = '';
                this.posModalStatus = false;
            });
            EventBus.$on('showCommonModal', (id) => {
                this.showCommonModal(id);
            });
            EventBus.$on('hideCommonModal', (id) => {
                this.hideCommonModal(id);
            });
            EventBus.$on('posPrintOn', () => {
                this.hideNonPrint();
            });
            EventBus.$on('posPrintOff', () => {
                this.showNonPrint();
            });
            EventBus.$on('checkWifi', (statusWifi) => {
                this.onlineStatus(statusWifi);
            });
        },
        mounted() {
            // this.addFlashMessages();
            this.$router.push({ name: 'pos_home' });
        },
        methods: {
            errorResponseHandler(error) {
                if (error.response.status == 401) {
                    EventBus.$emit('clearLocalForage');
                    location.reload();
                    // this.$router.push({name: 'pos_login'});
                    // } else if (error.response.status == 419) {
                    // location.reload() };
                } else {
                    return Promise.reject(error);
                }
            },
            /*
            checkPosUserLogin() {
                this.$root.$getItem('pos_auth', (err, value) => {
                    if (value !== null) {
                        const authData = JSON.parse(value)
                        this.$http.defaults.headers.common["Authorization"] = authData.token_type + authData.access_token;
                        this.$http.get('/api/pos/userlogin')
                        .then((response) => {
                            if ( !response.data.status && response.data.route) {
                                this.$router.push({name: response.data.route});
                            }
                            else if (response.data.status && response.data.route) {
                                this.$store.dispatch("login", authData);
                                this.$router.push({name: response.data.route});
                            }
                        })
                        .catch((err) => {
                            this.$router.push({ name: 'pos_login' });
                            console.error(err)
                        })
                    }
                    else {
                        console.log(err)
                        this.$router.push({ name: 'pos_login' });
                    }
                })
            },
            */
            addFlashMessages() {
                //const flashes = this.$refs.flashes;
                flashMessages.forEach(function (flash) {
                    if (flash.type == 'alert-success') {
                        this.$toast.success(flash.message, {
                            position: 'top-right',
                            duration: 2000,
                        });
                    } else if (flash.type == 'alert-warning') {
                        this.$toast.warning(flash.message, {
                            position: 'top-right',
                            duration: 2000,
                        });
                    } else if (flash.type == 'alert-error') {
                        this.$toast.error(flash.message, {
                            position: 'top-right',
                            duration: 2000,
                        });
                    }
                }, this);
            },
            showModal(id) {
                this.posModalId = id;
                this.posModalStatus = true;
            },
            closeModal(id) {
                console.log(id)
                this.posModalId = '';
                this.posModalStatus = false;
            },
            showCommonModal(modalId) {
                this.$set(this.posCommonModal, modalId, true);
            },
            hideCommonModal(modalId) {
                this.$set(this.posCommonModal, modalId, false);
            },
            toggleButtonDisable(value) {
                var buttons = document.getElementsByTagName("button");

                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].disabled = value;
                }
            },
            toggleCategoryDisable(status) {
                if (status) {
                    $('.related_category').css('pointer-events', 'none');
                } else {
                    $('.related_category').css('pointer-events', 'unset');
                }
            },
            hideNonPrint() {
                this.pos_print_status = true;
                var body = document.querySelector("body");
                body.classList.add("pos-order-print");
            },
            showNonPrint() {
                this.pos_print_status = false;
                var body = document.querySelector("body");
                body.classList.remove("pos-order-print");
            },
            onlineStatus(wifiStatus) {
                var wifi_label = $('.nav-wifi');
                if (wifi_label.hasClass('offline_label')) {
                    if (navigator.onLine) {
                        if (wifiStatus) {
                            this.$toast.success('Success: You have successfully entered in online mode!', {
                                position: 'top-right',
                                duration: 2000,
                            });
                        }
                        wifi_label.removeClass('offline_label').addClass('online_label');
                        this.offline = 0;
                    }
                } else {
                    if (wifiStatus) {
                        this.$toast.warning('Warning: You have successfully entered in offline mode!', {
                            position: 'top-right',
                            duration: 2000,
                        });
                    }
                    wifi_label.removeClass('online_label').addClass('offline_label');
                    this.offline = 1;
                }
            },
            browserNetwork() {
                var wifi_label = $('.nav-wifi');
                if (navigator.onLine) {
                    wifi_label.removeClass('offline_label').addClass('online_label');
                    this.offline = 0;
                    this.$toast.success('Success: You have successfully entered in online mode!', {
                        position: 'top-right',
                        duration: 2000,
                    });
                } else {
                    wifi_label.removeClass('online_label').addClass('offline_label');
                    this.offline = 1;
                    this.$toast.warning('Warning: You have entered in offline mode!', {
                        position: 'top-right',
                        duration: 2000,
                    });
                }
            }
        },
        render: h => h(App)
    }).$mount('#app')

});