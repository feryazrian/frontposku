<template>
    <div class="vertical-content" v-if="isUserLogin">
        <div :class="{'text-right': !isMobileOnly}">
            <div class="control-group" v-bind:style="{ 'margin': '0px' }" >
                <textarea class="control" name="comment" v-model="order_comment"  v-bind:style="{ 'width': isMobileOnly ? '100%' : '80%' }" :placeholder="$t('pos_payment.pos_cash.placeholder_order_comment')" v-validate="'max:250'" ></textarea>
                <span class="control-error" v-if="this.errors.has('comment')">{{ this.errors.first('comment') }}</span>
            </div>
        </div>

        <div class="pos-action text-right" v-bind:style="{ 'padding-right': '0px' }" @click="confirmOrder('confirmOrder')">
            <button type="button" class="btn btn-lg btn-pos-primary" :class="{'action-btn-green': isMobileOnly}">
                <i class="fa fa-credit-card"></i> {{ $t('pos_payment.pos_cash.button_confirm_pay') }}
            </button>
        </div>

        <pos-common-modal id="confirmOrder" :is-open="this.$root.posCommonModal.confirmOrder">
            <h4 slot="header">{{ $t('pos_home.pos_cart.text_confirm') }}</h4>
            
            <div slot="body">
                <div class="message-alert .text-default"> {{ $t('pos_home.pos_cart.text_confirm_msg') }} </div>
                <div class="pos-action text-right" v-bind:style="{ 'padding-right': '0px' }">
                    <button type="button" class="btn btn-lg btn-pos-dark" @click="validateOrder">
                        <i class="fa fa-check-circle"></i> {{ $t('pos_home.pos_cart.text_confirm') }}
                    </button>
                    <button type="button" class="btn btn-lg btn-pos-default" @click="hideCommonModal('confirmOrder')">
                        {{ $t('pos_home.pos_cart.text_cancel') }}
                    </button>
                </div>
            </div>
        </pos-common-modal>
    </div>
</template>
<script>
import { APP as getApp } from './../../../store/getters'

    export default {
        props: ['localObject'],

        data() {
            return {
                user_id: 0,
                active_digit: '',
                cart_customer: [],
                customer_status: false,
                current_currency: window.pos_currency_symbol,
                tendered_amount: 0,
                tendered_string: '',
                change_amount: 0,
                order_comment: '',
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

                tendered_limit: 10000000,
                final_order: {},
                
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            };
        },
        computed: {
            isUserLogin () {
                this.checkUserLogin();

                return this.user_id;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        mounted() {
            this.getCartTotal();
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                    this.pos_cashier = this.localObject.pos_cashier;
                }
            },
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
                    thisthis.cart_customer = thisthis.localObject.pos_cart_customer;
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
            confirmOrder(modalId) {
                EventBus.$emit('showCommonModal', modalId);
            },
            hideCommonModal(modalId) {
                EventBus.$emit('hideCommonModal', modalId);
            },
            validateOrder() {
                this.$root.toggleButtonDisable(true);
                var validate_status = false;
                var error_message = '';
                var thisthis = this;

                if (Object.keys(thisthis.localObject.pos_carts).length == 0) {
                    validate_status = true;
                    error_message = this.$t('pos_home.pos_cart.error.error_no_cart');
                }

                if (thisthis.localObject.pos_carts[thisthis.localObject.pos_current_cart] && Object.keys(thisthis.localObject.pos_carts[thisthis.localObject.pos_current_cart]).length == 0) {
                    validate_status = true;
                    error_message = this.$t('pos_home.pos_cart.error.error_no_product');
                }

                if ( !thisthis.localObject.pos_cart_customer.email ) {
                    validate_status = true;
                    error_message = this.$t('pos_home.pos_cart.error.error_no_customer');
                }

                if (validate_status) {
                    window.flashMessages = [{'type': 'alert-warning', 'message': error_message }];

                    this.$root.addFlashMessages();
                } else {
                    var current_date_time = new Date();
                    thisthis.final_order = {};
                    thisthis.pos_order = {};
                    
                    var cashier_address = thisthis.pos_cashier.outlet_address;

                    var shipping_address = {};
                    var billing_address = {};

                    // shipping_address = cashier_address;
                    shipping_address.first_name = thisthis.cart_customer.first_name; 
                    shipping_address.last_name = thisthis.cart_customer.last_name;
                    shipping_address.email = thisthis.cart_customer.email;
                    shipping_address.address1 = cashier_address.address1;
                    shipping_address.address2 = cashier_address.address2;
                    shipping_address.country = cashier_address.country;
                    shipping_address.state = cashier_address.state;
                    shipping_address.city = 'Noida';
                    shipping_address.postcode = cashier_address.postcode;
                    let customer_phone
                    if (thisthis.cart_customer.phone) {
                        customer_phone = thisthis.cart_customer.phone;
                    } else {
                        customer_phone = '0123456789';
                    }
                    shipping_address.phone = customer_phone;
                    shipping_address.address_type = 'shipping';

                    if (thisthis.cart_customer.addresses && Object.keys(thisthis.cart_customer.addresses).length > 0) {
                        billing_address = thisthis.cart_customer.addresses;
                    } else {
                        billing_address.address1 = cashier_address.address1;
                        billing_address.address2 = cashier_address.address2;
                        billing_address.country = cashier_address.country;
                        billing_address.state = cashier_address.state;
                        billing_address.postcode = cashier_address.postcode;
                    }
                    billing_address.first_name = thisthis.cart_customer.first_name;
                    billing_address.last_name = thisthis.cart_customer.last_name;
                    billing_address.email = thisthis.cart_customer.email;
                    billing_address.city = 'Noida';
                    billing_address.phone = customer_phone;
                    billing_address.address_type = 'billing';

                    delete billing_address.default_address;
                    delete billing_address.name;
                    delete billing_address.id;

                    /*var total_item_count = */Object.keys(thisthis.localObject.pos_carts[thisthis.localObject.pos_current_cart]).length;
                    
                    thisthis.final_order.cart_id = '';
                    thisthis.final_order.is_guest = 0;
                    // thisthis.final_order.customer_id = thisthis.cart_customer.id;
                    thisthis.final_order.customer_email = thisthis.cart_customer.email;
                    thisthis.final_order.customer_first_name = thisthis.cart_customer.first_name;
                    thisthis.final_order.customer_last_name = thisthis.cart_customer.last_name;
                    thisthis.final_order.customer = thisthis.cart_customer;
                    thisthis.final_order.shipping_method = 'free_free';
                    thisthis.final_order.shipping_title = 'Free Shipping - Free Shipping';
                    thisthis.final_order.shipping_description = 'This is a free shipping POS Order';
                    thisthis.final_order.shipping_amount = 0;
                    thisthis.final_order.base_shipping_amount = 0;
                    thisthis.final_order.total_item_count = thisthis.total_cart_item;
                    thisthis.final_order.total_qty_ordered = thisthis.total_cart_qty;
                    
                    thisthis.final_order.base_currency_code = window.base_currency.code;
                    thisthis.final_order.channel_currency_code = window.pos_currency_code;
                    thisthis.final_order.order_currency_code = window.pos_currency_code;
                    
                    thisthis.final_order.grand_total = thisthis.grand_total;
                    thisthis.final_order.base_grand_total = thisthis.base_grand_total;
                    thisthis.final_order.sub_total = thisthis.sub_total;
                    thisthis.final_order.base_sub_total = thisthis.base_sub_total;
                    thisthis.final_order.discount_amount = thisthis.discount_total;
                    thisthis.final_order.base_discount_amount = thisthis.base_discount_total;
                    thisthis.final_order.tax_amount = thisthis.tax_total;
                    thisthis.final_order.base_tax_amount = thisthis.base_tax_total;
                    thisthis.final_order.tendered_amount = thisthis.grand_total;
                    thisthis.final_order.change_amount = 0;
                    thisthis.final_order.payment_mode = 'card';
                    
                    var current_month = current_date_time.getMonth();
                    if (current_month < 10) {
                        current_month = '0'+current_month;
                    }
                    
                    thisthis.final_order.created_at = current_date_time.getFullYear() + '-' + current_month + '-' + current_date_time.getDate() + ' ' + current_date_time.getHours() + ':' + current_date_time.getMinutes() + ':' + current_date_time.getSeconds();
                    
                    thisthis.final_order.shipping_address = shipping_address;
                    thisthis.final_order.billing_address = billing_address;
                    thisthis.final_order.payment = {
                        method: 'cashondelivery',
                        method_title: 'Card Payment',
                    };
                    thisthis.final_order.channel = window.default_channel;
                    thisthis.final_order.items = thisthis.pos_carts[thisthis.pos_current_cart];

                    thisthis.pos_order.user_id = thisthis.user_id;
                    thisthis.pos_order.outlet_id = thisthis.pos_cashier.outlet_id;
                    thisthis.pos_order.order_note = thisthis.order_comment;
                    thisthis.pos_order.discount_amount = thisthis.discount_total;
                    thisthis.pos_order.base_discount_amount = thisthis.base_discount_total;
                    thisthis.pos_order.order_currency = window.pos_currency_code;
                    
                    thisthis.pos_order.order_date = this.months[current_date_time.getMonth()] + ' ' + current_date_time.getDate() + ', ' + current_date_time.getFullYear();

                    thisthis.pos_order.order_time = current_date_time.getHours() + ':' + current_date_time.getMinutes() + ':' + current_date_time.getSeconds();

                    thisthis.pos_order.order_date_time = thisthis.pos_order.order_date + ' ' + thisthis.pos_order.order_time;

                    thisthis.final_order.ref_id = thisthis.cart_customer.first_name.charAt(0) + thisthis.cart_customer.last_name.charAt(0) + '-' + current_date_time.getTime();

                    if ( thisthis.final_order ) {
                        EventBus.$emit('createOrder', thisthis.final_order, thisthis.pos_order);
                    }
                }
            }
        }
    }
</script>