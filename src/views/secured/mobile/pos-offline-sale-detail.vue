<template>
    <div class="pos-offline-sale-detail mobile" v-if="isUserLogin">
        <div>
            <div class="pos-order-info">
                <div class="order-header">
                    <label class="order_title">{{ selectedOrder.order_data.id ? $t('pos_offline_sale_detail.text_order_id') : $t('pos_offline_sale_detail.text_order_ref_id')}}</label>
                    <div class="order_id"> #{{ selectedOrder.order_data.id ? selectedOrder.order_data.id : selectedOrder.order_data.ref_id}} </div>
                </div>
                <div class="order-date-customer">
                    <div>
                        <label>{{ $t('pos_offline_sale_detail.text_customer_detail') }}</label>
                        {{ selectedOrder.order_data.customer_first_name }} {{ selectedOrder.order_data.customer_last_name }}
                    </div> 
                    <div>
                        <label>{{ $t('pos_offline_sale_detail.text_order_date') }}</label>
                        {{ selectedOrder.order_data.created_at | moment('h:mm:ss - DD MMMM YYYY') }}
                    </div>
                </div>
                <div class="order-summary" v-if="selectedOrder.order_data.items">
                    <label class="order_title">{{ $t('pos_sales.menu_content.sales_history.text_order_summary') }}</label>
                    <div class="order_items">
                        <div class="order_item" v-for="(item, index) in selectedOrder.order_data.items" :key="index">
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
                                <span class="product_price" v-if="current_currency == selectedOrder.order_data.order_currency_code">
                                    {{ currency_symbol }} {{ formatPrice(item.total) }}
                                </span>
                                <span class="product_price" v-else>
                                    {{ base_symbol }} {{ formatPrice(item.base_total) }}
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div v-if="current_currency == selectedOrder.order_data.order_currency_code">
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">{{ $t('pos_sales.menu_content.sales_history.text_sub_total') }}</div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.sub_total) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_discount') }}
                            </div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.discount_amount) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_taxes') }}
                            </div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.tax_amount) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value grand_total">
                            <div class="total_text">
                                <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                            </div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.grand_total) }} 
                            </div>
                        </div>
                    </div>

                    <div class="order_row" v-bind:style="{ 'border-top': 'none', 'margin': '0px', 'padding-top': '0px' }">
                        <div class="total_row_value">
                            <div class="total_text" v-if="selectedOrder.order_data.payment_mode == 'Cash'">
                                {{ $t('pos_sales.menu_content.sales_history.text_mode_cash') }}
                            </div>
                            <div class="total_text" v-else >{{ $t('pos_sales.menu_content.sales_history.text_mode_card') }}
                            </div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.tendered_amount) }}
                            </div>
                        </div>
                    </div>

                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text"><b>{{ $t('pos_sales.menu_content.sales_history.text_balance') }}</b>
                            </div>
                            <div class="total_value">
                                {{ currency_symbol }} {{ formatPrice(selectedOrder.order_data.change_amount) }}
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
                                {{ base_symbol }} {{ formatPrice(selectedOrder.order_data.base_sub_total) }}
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_discount') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selectedOrder.order_data.base_discount_amount) }} 
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value">
                            <div class="total_text">
                                {{ $t('pos_sales.menu_content.sales_history.text_taxes') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selectedOrder.order_data.base_tax_amount) }} 
                            </div>
                        </div>
                    </div>
                    <div class="order_row">
                        <div class="total_row_value grand_total">
                            <div class="total_text">
                                <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selectedOrder.order_data.base_grand_total) }} 
                            </div>
                        </div>
                    </div>

                    <div class="order_row" v-bind:style="{ 'border-top': 'none', 'padding-top': '0px' }">
                        <div class="total_row_value">
                            <div class="total_text" v-if="selectedOrder.order_data.payment_mode == 'Cash'">
                                {{ $t('pos_sales.menu_content.sales_history.text_mode_cash') }}
                            </div>
                            <div class="total_text" v-else >{{ $t('pos_sales.menu_content.sales_history.text_mode_card') }}
                            </div>
                            <div class="total_value">
                                {{ base_symbol }} {{ formatPrice(selectedOrder.order_data.base_tendered_amount) }}
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
                <div class="order-note">
                    <label><i class="icon fa fa-info-circle"></i>{{ $t('pos_offline_sale_detail.text_note') }}</label>
                    <div class="order_hold_note">
                        {{ selectedOrder.order_data.pos_order_note }}
                    </div>
                </div>
            </div>
            <div class="fixed-btm">
                <button class="btn btn-md action-btn-green" type="button" :text="$t('pos_sales.menu_content.hold_sales.button_delete')" @click="syncOfflineOrder(selectedIndex, selectedOrder)">
                    <i class="fa fa-compress"></i> Sync
                </button>
            </div>
        </div>

        <pos-common-modal
            id="syncAllOrders"
            :showClose='true'
            :is-open="this.$root.posCommonModal.syncAllOrders"
            >
            <h4 slot="header">{{ $t('pos_sales.menu_content.offline_sales.sync_all_order') }}</h4>
            
            <div slot="body">
                <bagisto-pos-progress-bar
                    :isActive=isActive
                    :progressWidth=progressWidth
                    :progressData=progressData
                    :messageContent=messageContent
                ></bagisto-pos-progress-bar>
            </div>
        </pos-common-modal>

        
    </div>
</template>

<script>
import { addOrder } from '@/api/order'
import { APP as getApp } from '@/store/getters'

    export default {
        props: ['offlineCount', 'posOfflineOrders', 'selectedIndex', 'selectedOrder', 'localObject'],
        data() {
            return {
                user_id: 0,
                offline_status: false,
                syncOfflineCustomers: [],
                current_currency: window.pos_currency_code,
                currency_symbol: window.pos_currency_symbol,
                order_details: {},
                order_view_status: false,
                base_symbol: window.base_currency_symbol,
                error_offline_action: this.$t('pos_view.error_offline_action'),
                
                orderRequests: [],
                totalOrderIterations: 0,
                success_count: 0,
                isActive: 0,
                progressWidth: 0,
                progressData: {
                    noteInfo: 'Note: Please don\'t refresh the page/redirect till the sync process have been compeleted!',
                    textContent: '',
                    textContentType: '',
                    messageStatus: false,
                },
                messageContent: [],
                pos_offline: 0,
            };
        },
        computed: {
            isUserLogin () {
                this.checkUserLogin();
                return this.user_id;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        methods: {
            checkUserLogin() {
                this.pos_offline = this.$root.$root.offline;

                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            formatPrice(price) {
                return parseFloat(parseFloat(price).toFixed(2)).toLocaleString(this.getLocale)
            },
            syncOfflineOrder(index, orderDetail) {
                this.$root.toggleButtonDisable(true);

                var thisthis = this;
                if (thisthis.$root.offline) {

                    thisthis.offline_status = true;

                    thisthis.$toast.warning(thisthis.error_offline_action, {
                        position: 'top-right',
                        duration: 2000,
                    });
                    thisthis.$root.toggleButtonDisable(false);
                } else {
                    thisthis.offline_status = false;
                    thisthis.$root.showCommonModal('syncAllOrders');

                    setTimeout(() => {
                        thisthis.isActive = 1;

                        var count = 0;
                        var total_customers = Object.keys(thisthis.localObject.pos_offline_customers).length;

                        if ( total_customers > 0) {
                            thisthis.syncOfflineCustomers = thisthis.localObject.pos_offline_customers;
                            
                            $.each(thisthis.syncOfflineCustomers, (key, customer) => {
                                customer.customer_email = '';
                                this.syncOffliceCustomer(key, customer);
                                count++;
                            });
                        }
                        if (count == total_customers) {
                            this.order_view_status = false;
                            this.order_details = {};

                            if (orderDetail) {
                                // only current order sync
                                thisthis.totalOrderIterations = 1;
                                orderDetail.order_key = index;
                                thisthis.orderRequests.push({
                                    /* url: '/api/pos/auth/addOrder',
                                    method: 'post',
                                    async:   true, */
                                    data: orderDetail,
                                });
                                thisthis.NextOrderRequest();
                            }
                        }
                    });
                }
            },
            NextOrderRequest() {
                var thisthis = this;
                
                if (thisthis.orderRequests.length) {
                    thisthis.progressWidth = (100 - (thisthis.orderRequests.length / thisthis.totalOrderIterations) * 100);

                    let currentRequest = thisthis.orderRequests.shift();
                    let current_order_key = currentRequest.data.order_key;
                    //thisthis.$root.$http(currentRequest)
                    addOrder(currentRequest.data.order_data, currentRequest.data.pos_data)
                    .then(function(response) {
                        if (response.data.status) {
                            thisthis.success_count = thisthis.success_count + 1;
                            thisthis.progressData.messageStatus = true;
                            thisthis.messageContent.push({
                                class: 'success',
                                text: 'Success: '+ thisthis.success_count +' order synced successfully!',
                            });

                            thisthis.updateProductQty(currentRequest.data.order_data);

                            if ( (Object.keys(thisthis.localObject.pos_offline_orders).length == 1) ) {
                                thisthis.offline_count == 0;
                                thisthis.posOfflineOrders = [];
                                thisthis.localObject.pos_offline_orders = [];
                                thisthis.$router.push({ name: "pos_sales_offline" });
                            } else {
                                thisthis.localObject.pos_offline_orders.splice(current_order_key, 1);
                            }
                            
                            EventBus.$emit('setLocalForage', {'key': 'pos_offline_orders', 'data': JSON.stringify(thisthis.localObject.pos_offline_orders)});
                        }
                    })
                    .finally(() => thisthis.NextOrderRequest());
                } else {
                    thisthis.isActive = 0;
                    thisthis.$root.hideCommonModal('syncAllOrders');
                    thisthis.$root.toggleButtonDisable(false);
                    this.$toast.success('Success: Offline order(s) synced successfully!', {
                        position: 'top-right',
                        duration: 2000,
                    });
                }
            },
            updateProductQty(orderData) {
                var thisthis = this;
                $.each(orderData.items, function(key_index, ordered_product) {
                    if (ordered_product.type == 'simple') {
                        $.grep(thisthis.localObject.pos_products, function(obj, key){
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

                            $.grep(thisthis.localObject.pos_products, function(obj, key){
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

            syncOffliceCustomer(key, customerDetail) {
                var thisthis = this;
                if (customerDetail.email) {

                    this.$http.post('/api/pos/auth/addCustomer', customerDetail)
                    .then((response)  =>  {
                        if (response.data.status) {
                            thisthis.localObject.pos_offline_customers.splice(key, 1);

                            EventBus.$emit('setLocalForage', {'key': 'pos_offline_customers', 'data': JSON.stringify(thisthis.localObject.pos_offline_customers)});
                        } else {
                            if (!response.data.status && (response.data.key && response.data.key == 'already_exist')) {
                                thisthis.localObject.pos_offline_customers.splice(key, 1);

                                EventBus.$emit('setLocalForage', {'key': 'pos_offline_customers', 'data': JSON.stringify(thisthis.localObject.pos_offline_customers)});
                            }
                        }
                    })
                    .catch( e => { console.log(e) });
                }
            }
        }
    }
</script>