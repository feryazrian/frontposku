<template>
    <div class="pos-invoice-panel" v-if="isUserLogin">
        <div class="pos_thermal">
            <div class="pos_shop_detail">
                <div class="pos_logo_thumb" v-if="pos_logo_result" >
                    <img :src="pos_logo" class="pos_logo" />
                </div>
                <div class="pos_logo_thumb" v-else >
                    <img :src="pos_logo_default" class="pos_logo" />
                </div>
                <div class="details_row">
                    <span class="main_heading">Date: </span>
                    <span class="detail_value">{{ orderData.created_at }}</span>
                </div>
                <div class="details_row" v-if="orderData.id || orderData.order_id">
                    <span class="main_heading">Order ID: </span>
                    <span class="detail_value bold_content">#{{ orderData.id }}</span>
                </div>
                <div class="details_row" v-if="orderData.ref_id">
                    <span class="main_heading">Order Ref. ID: </span>
                    <span class="detail_value bold_content">#{{ orderData.ref_id }}</span>
                </div>
                <div class="details_row">
                    <span class="main_heading">Cashier: </span>
                    <span class="detail_value">{{ pos_cashier.firstname }} {{ pos_cashier.lastname }}</span>
                </div>

                <div class="details_row">
                    <span class="main_heading">Customer: </span>
                    <span class="detail_value padding_content">
                        <i class="fa fa-id-card"></i>
                        {{ orderData.customer_first_name }} {{ orderData.customer_last_name }}
                    </span>
                    
                </div>
                <div class="details_row">
                    <span class="main_heading"></span>
                    <span class="detail_value padding_content">
                        <i class="fa fa-envelope"></i>
                        {{ orderData.customer_email }}
                    </span>
                </div>

                <div class="details_row">
                    <span class="main_heading">Mode Of Shipping: </span>
                    <span class="detail_value">Pick Up</span>
                </div>
                <div class="details_row">
                    <span class="main_heading">Mode Of Payment: </span>
                    <span class="detail_value" v-if="orderData.payment_mode == 'Cash' || orderData.payment_mode == 'cash'">Cash Payment</span>
                    <span class="detail_value" v-if="orderData.payment_mode == 'Card' || orderData.payment_mode == 'card'">Card Payment</span>
                </div>
            </div>
            <div class="order_items">
                <table class="itams_table">
                    <tr>
                        <th class="item_head">Product</th>
                        <th class="item_head">Qty</th>
                        <th class="item_head">Price</th>
                        <th class="item_head">Amount</th>
                    </tr>

                    <tr v-for="(item, index) in orderData.items" :key="index">
                        <td class="invoice_product_name">
                            <div class="product_name">{{ item.name }}
                                <span class="product-attributes" v-if="item.type == 'configurable'" >
                                    <span v-for="(attributes, index) in item.additional.attributes" :key="index">
                                        <i> <b>{{ attributes.attribute_name }}</b>: {{ attributes.option_label }}, </i>
                                    </span>
                                </span>
                            </div>
                        </td>
                        <td>{{ item.qty_ordered }}</td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                    {{ current_currency_symbol }}{{ formatPrice(item.price) }}
                            </span>
                            <span v-else>
                                    {{ base_currency_symbol }}{{ formatPrice(item.base_price) }}
                            </span>
                        </td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                    {{ current_currency_symbol }}{{ formatPrice(item.total) }}
                            </span>
                            <span v-else>
                                    {{ base_currency_symbol }}{{ formatPrice(item.base_total) }}
                            </span>
                        </td>
                    </tr>
                </table>
                
                <table class="itams_table">
                    <tr>
                        <td>Total Quantity: </td>
                        <td>{{ orderData.total_qty_ordered }}</td>
                        
                        <td>Sub Total: </td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                {{ current_currency_symbol }}{{ formatPrice(orderData.sub_total) }}
                            </span>
                            <span v-else>
                                {{ base_currency_symbol }}{{ formatPrice(orderData.base_sub_total) }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td>Discount: </td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                {{ current_currency_symbol }}{{ formatPrice(orderData.discount_amount) }}
                            </span>
                            <span v-else>
                                {{ base_currency_symbol }}{{ formatPrice(orderData.base_discount_amount) }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td>Tax: </td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                {{ current_currency_symbol }}{{ formatPrice(orderData.tax_amount) }}
                            </span>
                            <span v-else>
                                {{ base_currency_symbol }}{{ formatPrice(orderData.base_tax_amount) }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td><b>Total: </b></td>
                        <td>
                            <span v-if="orderData.order_currency_code == current_currency_code">
                                <b>{{ current_currency_symbol }}{{ formatPrice(orderData.grand_total) }}</b>
                            </span>
                            <span v-else>
                                <b>{{ base_currency_symbol }}{{ formatPrice(orderData.base_grand_total) }}</b>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td>
                            <span v-if="orderData.payment_mode == 'cash'"> Cash Payment: </span>
                            <span v-else > Card Payment: </span>
                        </td>
                        <td>
                            <div v-if="orderData.tendered_amount">
                                <span>
                                    {{ current_currency_symbol }}{{ formatPrice(orderData.tendered_amount) }}
                                </span>
                            </div>
                            <div v-else>
                                0.00
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td><b>Balance: </b></td>
                        <td>
                            <div v-if="orderData.change_amount">
                                <span>
                                    <b>{{ current_currency_symbol }}{{ formatPrice(orderData.change_amount) }}</b>
                                </span>
                            </div>
                            <div v-else>
                                0.00
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="pos_order_note">
                <div class="details_row">
                    <span class="main_heading">Order Note: </span>
                    <span class="detail_value">{{ orderData.pos_order_note }}</span>
                </div>
            </div>
            <div class="footer_note">
                <span>Have a nice day</span>
                <span>Thank You. Visit Again</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['localObject', 'orderData'],
        data() {
            return {
                user_id: 0,
                pos_cashier: {},
                pos_logo: window.pos_logo_image,
                pos_logo_result: window.pos_logo_result,
                pos_logo_default: window.pos_logo_default,
                current_currency_code: window.pos_currency_code,
                current_currency_symbol: window.pos_currency_symbol,
                base_currency_symbol: window.base_currency_symbol,
            };
        },
        computed: {
            isUserLogin () {
                console.log(this.orderData);
                this.checkUserLogin();

                return this.user_id;
            }
        },
        methods: {
            checkUserLogin() {
                if (window.channel_logo) {
                    this.pos_shop_logo = window.channel_logo;
                }
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                    this.pos_cashier = this.localObject.pos_cashier;
                }
            },
            formatPrice(price) {
                return parseFloat(price).toFixed(2);
            },
        }
    }
</script>