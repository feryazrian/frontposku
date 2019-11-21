<template>
    <div class="pos-order-summary mobile" v-if="isUserLogin">
        <div>
            <div class="pos-order-info">
                <div class="order-info" v-if="selected_order.id">
                    <label class="order_title">{{ $t('pos_sales.menu_content.sales_history.text_order_id') }}</label>
                    <div class="order_id"> #{{ selected_order.id }} </div>
                    <div class="order_customer">
                        {{ selected_order.created_at | moment('DD MMM YYYY') }} | {{ selected_order.customer_email }}
                    </div>
                </div>

                <div class="order-summary" v-if="selected_order.items">
                    <label class="order_title">{{ $t('pos_sales.menu_content.sales_history.text_order_summary') }}</label>
                    <div class="order_items">
                        <div class="order_item" v-for="(item, index) in selected_order.items" :key="index">
                            <div class="product_info">
                                <span class="product_name">{{ item.name }}
                                    <span class="product-attributes" v-if="item.type == 'configurable'" >
                                        <span v-for="(attributes, index) in item.additional.attributes" :key="index">
                                            <i> <b>{{ attributes.attribute_name }}</b>: {{ attributes.option_label }}, </i>
                                        </span>
                                    </span>
                                </span>
                                <span class="product_unit">
                                    {{ item.qty_ordered }}
                                    {{ $t('pos_sales.menu_content.sales_history.text_units') }}
                                </span>
                            </div>
                            <div class="price_info">
                                <span class="product_price" v-if="current_currency == selected_order.order_currency_code">
                                    {{ current_currency_symbol }} {{ formatPrice(item.total) }}
                                </span>
                                <span class="product_price" v-else>
                                    {{ base_symbol }} {{ formatPrice(item.base_total) }}
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div v-if="current_currency == selected_order.order_currency_code">
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">{{ $t('pos_sales.menu_content.sales_history.text_sub_total') }}</div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.sub_total) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_discount') }}
                            </div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.discount_amount) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_taxes') }}
                            </div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.tax_amount) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value grand_total">
                            <div class="total_text">
                                <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                            </div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.grand_total) }} 
                            </div>
                        </div>
                    </div>

                    <div class="order_row" v-bind:style="{ 'border-top': 'none', 'margin': '0px', 'padding-top': '0px' }">
                        <div class="total_row_value">
                            <div class="total_text" v-if="selected_order.payment_mode == 'Cash'">
                                {{ $t('pos_sales.menu_content.sales_history.text_mode_cash') }}
                            </div>
                            <div class="total_text" v-else >{{ $t('pos_sales.menu_content.sales_history.text_mode_card') }}
                            </div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.tendered_amount) }}
                            </div>
                        </div>
                    </div>

                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text"><b>{{ $t('pos_sales.menu_content.sales_history.text_balance') }}</b>
                            </div>
                            <div class="total_value">
                                {{ current_currency_symbol }} {{ formatPrice(selected_order.change_amount) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_sub_total') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_sub_total) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_discount') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_discount_amount) }} 
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_taxes') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_tax_amount) }} 
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value grand_total">
                            <div class="total_text">
                                <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_grand_total) }} 
                            </div>
                        </div>
                    </div>

                    <div class="order_row" v-bind:style="{ 'border-top': 'none', 'padding-top': '0px' }">
                        <div class="total_row_value">
                            <div class="total_text" v-if="selected_order.payment_mode == 'Cash'">
                                {{ $t('pos_sales.menu_content.sales_history.text_mode_cash') }}
                            </div>
                            <div class="total_text" v-else >{{ $t('pos_sales.menu_content.sales_history.text_mode_card') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_tendered_amount) }}
                            </div>
                        </div>
                    </div>

                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text"><b>{{ $t('pos_sales.menu_content.sales_history.text_balance') }}</b>
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selected_order.base_change_amount) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixed-btm">
                <button type="button" class="btn btn-lg btn-pos-primary action-btn-green" @click="sendInvoice(selected_order)">
                    <i class="fa fa-envelope"></i> {{ $t('pos_sales.menu_content.sales_history.button_send_invoice') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { APP as getApp } from './../../../store/getters'

    export default {
        props: ['selected_order', 'localObject'],
        data() {
            return {
                pos_offline: 0,
                user_id: 0,
                current_currency: window.pos_currency_code,
                current_currency_symbol: window.pos_currency_symbol,
                base_symbol: window.base_currency_symbol
            };
        },
        computed: {
            isUserLogin () {
                //this.pos_offline = this.$root.$root.offline;
                this.checkUserLogin();
                return this.user_id;
            }
            ,getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        methods: {
            checkUserLogin() {
                this.pos_offline = this.$root.$root.offline
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            formatPrice(price) {
                return parseFloat(parseFloat(price).toFixed(2)).toLocaleString(this.getLocale)
            },
            sendInvoice(order_data) {
                console.log(order_data)
                alert("API doesn't provided yet !");
            }
        }
    }
</script>