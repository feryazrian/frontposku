<template>
    <div class="pos-hold-sale-detail mobile" v-if="isUserLogin">
        <div>
            <div class="pos-order-info">
                <div class="order-detail" v-if="selectedOrder.hold_status">
                    <div class="order_date_time">
                        {{ selectedOrder.hold_data.time }} - {{ selectedOrder.hold_data.date | moment('DD MMM YYYY') }}
                    </div>
                    <div class="order_note">
                        <i class="fa fa-info-circle"></i>
                        {{ $t('pos_sales.menu_content.hold_sales.text_note') }}
                    </div>
                </div>
                <div class="order_hold_note">
                    {{ selectedOrder.hold_data.note }}
                </div>

                <div class="order-product-container">
                    <div class="item-heading">
                        {{ $t('pos_sales.menu_content.hold_sales.text_hold_product_details') }}
                    </div>
                    <div class="item-list" v-if="isObject(selectedOrder)">
                        <div class="product_info" v-for="(product, i) in selectedOrder" :key="i">
                            <div v-if="product.name" >
                                <div class="product_name">
                                    {{ product.name }}
                                    <span class="product-attributes" v-if="product.type == 'configurable'" >
                                        <span v-for="(attributes, j) in product.additional.attributes" :key="j">
                                            <i> <b>{{ attributes.attribute_name }}</b>: {{ attributes.option_label }}, </i>
                                        </span>
                                    </span>
                                </div>
                                <div class="product_qty">
                                    x {{ product.qty_ordered }}
                                </div>
                                <div class="product_price" >
                                    {{ product.f_price }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixed-btm two-btn">
                <button class="btn btn-md action-btn-secondary" type="button" :text="$t('pos_sales.menu_content.hold_sales.button_delete')" @click="removeHoldCart(selectedIndex)">
                    <i class="fa fa-trash"></i>
                    {{ $t('pos_sales.menu_content.hold_sales.button_delete') }}
                </button>
                <button class="btn btn-md action-btn-green" type="button" :text="$t('pos_sales.menu_content.hold_sales.button_cart')" @click="addToCartBack(selectedIndex)">
                    <i class="fa fa-cart-plus"></i>
                    {{ $t('pos_sales.menu_content.hold_sales.button_cart') }} 
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { APP as getApp } from '@/store/getters'
    export default {
        props: ['selectedIndex', 'selectedOrder', 'localObject'],
        data() {
            return {
                pos_holds: [],
                pos_offline: 0,
                hold_count: 0,
                user_id: 0,
                current_currency_symbol: window.pos_currency_symbol,
                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                success_remove_hold: this.$t('pos_sales.menu_content.hold_sales.success_remove_hold'),
            };
        },
        created() {
            this.loadHoldCarts();
        },
        computed: {
            isUserLogin () {
                this.checkUserLogin();

                return this.user_id;
            },
            getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        methods: {
            checkUserLogin() {
                this.pos_offline = this.$root.$root.offline;
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            loadHoldCarts() {
                var hold_length = Object.keys(this.localObject.pos_holds).length;
                if ( hold_length > 0 ) {
                    this.hold_count = hold_length;
                    this.pos_holds = this.localObject.pos_holds;
                }
            },
            isObject(cart_data) {
                return typeof cart_data == "object"
            },
            grandTotal(items) {
                var total = 0
                $.each(items, (key, item) => {
                    if (item.name) {
                        total += item.base_total
                    }
                });
                return parseFloat(parseFloat(total).toFixed(2)).toLocaleString(this.getLocale)
            },
            getFormattedDate() {
                var d = new Date();
                return this.months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();
            },
            getFormattedTime() {
                var t = new Date();
                return t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
            },
            removeHoldCart(holdCartIndex) {
                if (holdCartIndex != 'null') {
                    
                    if (Object.keys(this.localObject.pos_holds).length > 0) {
                        var pos_holds = this.localObject.pos_holds;

                        pos_holds.splice(holdCartIndex, 1);
                        
                        EventBus.$emit('setLocalForage', {'key': 'pos_holds', 'data': JSON.stringify(pos_holds)});
                        
                        window.flashMessages = [{'type': 'alert-success', 'message': this.success_remove_hold }];

                        this.$root.addFlashMessages();

                        this.$router.push({ name: "pos_sales_hold"})
                    }
                }
            },
            addToCartBack(holdCartIndex) {
                if (holdCartIndex != 'null') {
                    this.localObject.pos_discount = {};
                    EventBus.$emit('deleteLocalForage', 'pos_discount');

                    this.current_hold_cart = this.localObject.pos_carts[this.localObject.pos_current_cart];

                    let current_hold = {};

                    if (this.localObject.pos_holds[holdCartIndex]) {
                        current_hold = this.localObject.pos_holds[holdCartIndex];
                        
                        delete current_hold.hold_status;
                        delete current_hold.hold_data;

                        // 1. remove from hold object
                        this.localObject.pos_holds.splice(holdCartIndex, 1);
                        
                        // 2. add current cart to hold object
                        //let length_holds = Object.keys(this.localObject.pos_holds).length;
                        if (this.current_hold_cart && Object.keys(this.current_hold_cart).length > 0) {
                            this.current_hold_cart.hold_status = true;
                            this.current_hold_cart.hold_data = {
                                        note: ' ',
                                        date: this.getFormattedDate(),
                                        time: this.getFormattedTime()
                                    };
                            this.localObject.pos_holds = this.localObject.pos_holds.concat(this.current_hold_cart);
                        }
                        
                        this.holdCartCount = Object.keys(this.localObject.pos_holds).length;
                        
                        EventBus.$emit('setLocalForage', {'key': 'pos_holds', 'data': JSON.stringify(this.localObject.pos_holds)});

                        // 3. move current cart to hold object
                        this.localObject.pos_carts.splice(this.localObject.pos_current_cart, 1);

                        this.localObject.pos_carts[this.localObject.pos_current_cart] = current_hold;

                        EventBus.$emit('setLocalForage', {'key': 'pos_carts', 'data': JSON.stringify(this.localObject.pos_carts)});

                        this.$toast.success(this.success_move_cart, {
                            position: 'top-right',
                            duration: 2000,
                        });

                        this.$router.push({ name: "pos_cart_details"})
                    }
                }
            }
        }
    }
</script>