<template>
    <div>
        <div class="pos-payment-main" v-if="isUserLogin" :class="{'mobile': isMobileOnly}">
            <div class="pos-payment-header" v-if="!isMobileOnly">
                <div class="title">
                    {{ $t('pos_payment.heading_title') }}
                    <i class="fa fa-close" @click="redirectToHome"></i>
                </div>
            </div>
            <div class="pos-product-container">
                <div class="checkout_details" v-if="customer_status">
                    <div v-if="isMobileOnly" class="payment_header">
                        <span>{{ cart_customer.name }}</span>
                        <h1><b>{{ current_currency }} {{ parseFloat(grand_total).toLocaleString(getLocale) }}</b></h1>
                        <span>{{ $t('pos_payment.text_total_amount_due') }}</span>
                    </div>
                    <div v-else class="customer_detail">
                        <div class="name"> 
                            <i class="fa fa-user-circle"></i>
                            <span>{{ cart_customer.name }}</span>
                        </div>
                        <div class="address" v-if="cart_customer.email">
                            <i class="fa fa-envelope"></i>
                            <span>{{ cart_customer.email }}</span>
                        </div>
                        <div class="address" v-if="cart_customer.faddresses">
                            <i class="fa fa-map-marker"></i>
                            <span>{{ cart_customer.faddresses }}</span>
                        </div>
                    </div>
                    <div v-if="isMobileOnly" class="payment_detail">
                        <div class="control-group" >
                            <label for="method" v-text="$t('pos_payment.label_payment_method')"></label>

                            <select name="method" class="control" v-model="payment_method" @change="changeMethod">
                                <option v-for="(menu, index) in tab_menus" :key="index" :value="menu.code">{{ menu.name }}</option>
                            </select>
                        </div>
                        
                        <div :class="{'vertical-tabcontent': !isMobileOnly}">
                            <router-view
                                :localObject="localObject"
                                replace
                            ></router-view>
                        </div>
                        
                    </div>
                    <div v-else class="payment_detail">
                        <ul class="vertical-tab">
                            <li v-for="(menu, index) in tab_menus" :key="index" :class="{ 'vertical-nav': true, 'active': index == active_tab }" @click="activeTab(index)">
                                <router-link :to="{ path: menu.route }">
                                    {{ menu.name }}
                                </router-link>
                            </li>
                        </ul>
                        
                        <div class="vertical-tabcontent">
                            <router-view
                                :localObject="localObject"
                            ></router-view>
                        </div>
                        
                    </div>
                </div>
            </div>
                
        </div>

        <div class="pos_order_component" v-if="active_print">
            <invoice-print
                :localObject="localObject"
                :orderData="order_details"
            ></invoice-print>
        </div>

        <pos-common-modal
            id="printOrderSuccess"
            :showClose='true'
            :is-open="this.$root.posCommonModal.printOrderSuccess"
            >
            <h4 slot="header">{{ $t('pos_payment.heading_order_print') }}</h4>
            
            <div slot="body">
                <div class="message-alert .text-success"> {{ $t('pos_payment.text_order_success') }} </div>
                
                <div class="pos-action text-right" v-bind:style="{ 'padding-right': '0px' }">
                    <button type="button" class="btn btn-lg btn-pos-dark" @click="printOrder('printOrderSuccess')">
                        <i class="fa fa-print"></i> {{ $t('pos_payment.btn_print') }}
                    </button>
                    <button type="button" class="btn btn-lg btn-pos-default" @click="skipPrint('printOrderSuccess')">
                        <i class="fa fa-arrow-circle-right"></i> {{ $t('pos_payment.btn_skip') }}
                    </button>
                </div>
            </div>
        </pos-common-modal>
    </div>
</template>
<script>
import { addOrder } from '@/api/order'
import { /* API as getApi, */ APP as getApp } from './../../store/getters'
// import { mapGetters } from 'vuex'

    export default {
        props: ['localObject'],

        data() {
            return {
                user_id: 0,
                cart_customer: [],
                offline_data: {},
                customer_status: false,
                active_tab: 0,
                tab_menus: [
                    {
                        'code': 'pos_payment_cash',
                        'name': this.$t('pos_payment.vertical_menu.text_cash'),
                        'route': '/pos/payment/cash'
                    },
                    {
                        'code': 'pos_payment_credit',
                        'name': this.$t('pos_payment.vertical_menu.text_credit'),
                        'route': '/pos/payment/credit'
                    }
                ],
                success_offline_order: this.$t('pos_payment.success_offline_order'),
                active_print: false,
                order_details: {},
                // mobile
                payment_method : 'pos_payment_cash',
                current_currency: window.pos_currency_symbol,
                pos_cashier: {},
                pos_carts: [],
                pos_current_cart: 0,
                order_items: [],
                total_cart_item: 0,
                total_cart_qty: 0,
                discount_total: 0,
                base_discount_total: 0,

                sub_total: 0,
                base_sub_total: 0,
                
                tax_total: 0,
                base_tax_total: 0,

                grand_total: 0,
                base_grand_total: 0,
            };
        },
        computed: {
            //...mapGetters({ addOrder:getApi.TRANSACTION.ORDER }),
            isUserLogin () {
                this.checkUserLogin();

                return this.user_id;
            },
            getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        beforeDestroy () {
            EventBus.$off('createOrder');
        },
        created() {
            EventBus.$on('createOrder', (order_data, pos_data) => {
                this.saveOrder(order_data, pos_data);
            });
        },
        mounted() {
            this.getCartTotal()
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;

                    if (this.localObject.pos_cart_customer.email) {
                        this.customer_status = true;
                        this.cart_customer = this.localObject.pos_cart_customer;
                    }
                }
            },
            activeTab(activeTab) {
                this.active_tab = activeTab;
            },
            redirectToHome() {
                this.$router.push({name: 'pos_home'});
            },
            saveOrder(orderData, posData) {
                if (this.$root.offline) {

                    this.offline_data = {
                        order_data: orderData,
                        pos_data: posData
                    }

                    this.localObject.pos_offline_orders = this.localObject.pos_offline_orders.concat(this.offline_data);

                    EventBus.$emit('setLocalForage', {'key': 'pos_offline_orders', 'data': JSON.stringify(this.localObject.pos_offline_orders)});
                    
                    this.$root.toggleButtonDisable(false);

                    var body = document.querySelector("body");
                    body.classList.remove("pos-modal-open");
                    $("body").find(".pos-navbar-top").removeClass('pos-overlay');
                    $("body").find(".pos-navbar-left").removeClass('pos-overlay');

                    this.$root.hideCommonModal('confirmOrder');

                    this.removeCart(true);

                    EventBus.$emit('loadCartContent');

                    this.order_details = orderData;
                    this.order_details.created_at = posData.order_date_time;
                    this.order_details.pos_order_note = posData.order_note;

                    setTimeout(() => {
                        this.$root.showCommonModal('printOrderSuccess');
                    });

                    this.$toast.success(this.success_offline_order, {
                        position: 'top-right',
                        duration: 2000,
                    });
                    
                } else {
                    //var thisthis = this;
                    
                    delete orderData.ref_id;
                    
                    //this.$http.post('/api/pos/auth/addOrder', {
                    //        order_data: orderData,
                    //        pos_data: posData
                    //})
                    //this.addOrder(orderData, posData)
                    addOrder(orderData, posData)
                    .then((response)  =>  {
                        if (!response.data.status) {
                            this.$toast.error(response.data.message, {
                                position: 'top-right',
                                duration: 2000,
                            });
                            this.$root.toggleButtonDisable(false);
                        } else {
                            this.updateProductQty(orderData);

                            this.$root.toggleButtonDisable(false);

                            this.$root.hideCommonModal('confirmOrder');

                            this.removeCart(true);
                            
                            EventBus.$emit('loadCartContent');
                            
                            this.order_details = orderData;
                            this.order_details.created_at = posData.order_date_time;
                            this.order_details.id = response.data.order_id;
                            this.order_details.pos_order_note = posData.order_note;
                            setTimeout(() => {
                                this.$root.showCommonModal('printOrderSuccess');
                            });
                        }
                    })
                    .catch(function() {});
                }
            },
            printOrder(modalId) {
                if (this.order_details) {

                    this.$root.hideCommonModal(modalId);
                    this.active_print = true;

                    var body = document.querySelector("body");
                    body.classList.add("pos-order-print");
                    
                    setTimeout(() => {
                        window.print();
                    
                        var body = document.querySelector("body");
                        body.classList.remove("pos-order-print");
                        this.active_print = false;
                        
                        this.skipPrint(modalId);
                    }, 50);
                }
            },
            skipPrint(modalId) {
                var body = document.querySelector("body");
                body.classList.remove("pos-modal-open");
                $("body").find(".pos-navbar-top").removeClass('pos-overlay');
                $("body").find(".pos-navbar-left").removeClass('pos-overlay');

                this.$root.hideCommonModal(modalId);

                if (this.$root.offline) {
                    this.$router.push({name: 'pos_sales_offline'});
                } else {
                    this.$router.push({name: 'pos_sales_history'});
                }
            },
            updateProductQty(orderData) {
                var thisthis = this;
                $.each(orderData.items, function(key_index, ordered_product) {
                    if (ordered_product.type == 'simple') {
                        /*var obj = */$.grep(thisthis.localObject.pos_products, function(obj, key){
                            if ( parseInt(ordered_product.id) == parseInt(obj.id) ) {
                                let prod_qty = JSON.parse(obj.quantity);

                                if (prod_qty[ordered_product.id]) {
                                    prod_qty[ordered_product.id] = parseInt(prod_qty[ordered_product.id]) - parseInt(ordered_product.qty_ordered);

                                    obj.quantity = JSON.stringify(prod_qty);
                                    thisthis.localObject.pos_products[key] = obj;
                                    return true;
                                }
                            }
                        });
                    } else {
                        if (ordered_product.additional.product) {
                            let parent_prod_id = parseInt(ordered_product.additional.product);

                            /*var obj = */$.grep(thisthis.localObject.pos_products, function(obj, key){
                                if ( parent_prod_id == parseInt(obj.id) ) {
                                    let prod_qty = JSON.parse(obj.quantity);

                                    if (prod_qty[ordered_product.id]) {
                                        prod_qty[ordered_product.id] = parseInt(prod_qty[ordered_product.id]) - parseInt(ordered_product.qty_ordered);

                                        obj.quantity = JSON.stringify(prod_qty);
                                        thisthis.localObject.pos_products[key] = obj;
                                        return true;
                                    }
                                }
                            });
                        }
                    }
                });
                EventBus.$emit('setLocalForage', {'key': 'pos_products', 'data': JSON.stringify(thisthis.localObject.pos_products)});
            },

            removeCart(removeStatus) {
                this.localObject.pos_discount = {};
                EventBus.$emit('deleteLocalForage', 'pos_discount');

                var next_cart = this.localObject.pos_current_cart;

                if (Object.keys(this.localObject.pos_carts).length > 1) {

                    this.localObject.pos_carts.splice(this.localObject.pos_current_cart, 1);
                    
                    next_cart = 0;
                } else {
                    if (removeStatus) {
                        this.localObject.pos_carts.splice(this.localObject.pos_current_cart, 1);
                        next_cart = 0;

                        if (this.localObject.pos_carts.length == 0) {
                            this.localObject.pos_carts[0] = {};
                            this.localObject.pos_current_cart = 0;
                        }
                    }
                }

                EventBus.$emit('cartActive', next_cart);

                EventBus.$emit('setLocalForage', {'key': 'pos_carts', 'data': JSON.stringify(this.localObject.pos_carts)});
                
                EventBus.$emit('setLocalForage', {'key': 'pos_current_cart', 'data': this.localObject.pos_current_cart});
            },

            //mobile
            getCartTotal() {                
                var thisthis = this;
                var total_item_count = 0;
                var total_item_qty = 0;
                
                var cart_sub_total = 0;
                var base_cart_sub_total = 0;
                
                var cart_tax_total = 0;
                var base_cart_tax_total = 0;

                var cart_grand_total = 0;
                var base_cart_grand_total = 0;
                
                if (Object.keys(thisthis.localObject.pos_carts).length > 0) {
                    thisthis.pos_carts = thisthis.localObject.pos_carts;
                }

                if (thisthis.localObject.pos_current_cart != 'null') {
                    thisthis.pos_current_cart = thisthis.localObject.pos_current_cart;
                }

                if (thisthis.localObject.pos_cart_customer.email) {
                    thisthis.customer_status = true;
                    thisthis.cart_customer = this.localObject.pos_cart_customer;
                }

                if (thisthis.pos_carts[thisthis.pos_current_cart] && Object.keys(thisthis.pos_carts[thisthis.pos_current_cart]).length > 0) {

                    $.each(thisthis.pos_carts[thisthis.pos_current_cart], (key, product) => {
                        total_item_count = total_item_count + 1;

                        total_item_qty = total_item_qty + product.qty_ordered;

                        cart_sub_total = (cart_sub_total + parseFloat(product.total));
                        base_cart_sub_total = (base_cart_sub_total + parseFloat(product.base_total));

                        if (product.tax_category_id != null && product.tax_category_id && product.tax_percent) {
                            cart_tax_total = (cart_tax_total + ( (parseFloat(product.total) * product.tax_percent) / 100 ) ) ;
                            
                            base_cart_tax_total = (base_cart_tax_total + ( (parseFloat(product.base_total) * product.tax_percent) / 100 ) ) ;
                        }
                    });

                    thisthis.total_cart_item = total_item_count;
                    thisthis.total_cart_qty = total_item_qty;

                    thisthis.sub_total = parseFloat(cart_sub_total).toFixed(2);
                    thisthis.base_sub_total = parseFloat(base_cart_sub_total).toFixed(2);

                    thisthis.tax_total = parseFloat(cart_tax_total).toFixed(2);
                    thisthis.base_tax_total = parseFloat(base_cart_tax_total).toFixed(2);

                    if ( thisthis.localObject.pos_discount.id) {

                        if ( (parseFloat(thisthis.localObject.pos_discount.converted_fromprice) <= parseFloat(thisthis.sub_total)) && parseFloat(thisthis.localObject.pos_discount.converted_toprice) >= parseFloat(thisthis.sub_total) ) {

                            if ( thisthis.localObject.pos_discount.type == 'percentage' ) {
                                thisthis.discount_total = parseFloat((thisthis.sub_total * thisthis.localObject.pos_discount.converted_value) / 100).toFixed(2);
                                thisthis.base_discount_total = parseFloat((thisthis.base_sub_total * thisthis.localObject.pos_discount.value) / 100).toFixed(2);
                            } else {
                                thisthis.discount_total = parseFloat(thisthis.localObject.pos_discount.converted_value).toFixed(2);
                                thisthis.base_discount_total = parseFloat(thisthis.localObject.pos_discount.value).toFixed(2);
                            }
                        }
                    }
    
                    if (thisthis.discount_total == 'NaN') {
                        thisthis.discount_total = 0;
                        thisthis.base_discount_total = 0;
                    }

                    cart_grand_total = (((parseFloat(thisthis.sub_total) + parseFloat(thisthis.tax_total)) - thisthis.discount_total));

                    base_cart_grand_total = (((parseFloat(thisthis.base_sub_total) + parseFloat(thisthis.base_tax_total)) - thisthis.base_discount_total));


                    thisthis.grand_total = parseFloat(cart_grand_total).toFixed(2);
                    thisthis.base_grand_total = parseFloat(base_cart_grand_total).toFixed(2);
                }
            },
            changeMethod(e) {
                this.$router.push({name: e.target.value});
            }
        }
    }
</script>