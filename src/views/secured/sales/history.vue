<template>
    <div class="sale-history-panel" v-if="isUserLogin">
        <div class="order-search-main"  v-bind:style="{'height': isMobileOnly ? '100%' : container_height}">
        
            <div class="pos-order-list">
                <div class='order_search' v-if="!isMobileOnly">
                    <i class="fa fa-search"></i>
                    <input type="text" class="order_search_field" :placeholder="$t('pos_sales.menu_content.sales_history.placeholder_search')" @keyup="loadOrders" v-model="search_order_id" />
                </div>
                <ul class="order_list" v-if="order_count && isMobileOnly" v-bind:style="{'height': mobile_list_height}">
                    <li v-for="(order, index) in orders_list" :key="index" :class="{'record': true, 'active': index == active_order }" @click="selectOrder(index, order)">
                        <div class="order_id">
                            #{{ order.id }}
                        </div>
                        <div class="order_details">
                            <p class="detail">{{ orderDetails(order.items) }}</p>
                            <span class="email">{{ $t('pos_sales.menu_content.sales_history.text_cust') }} : {{ order.customer_email}}</span>
                        </div>
                        <div class="order_total" v-if="current_currency == order.order_currency_code" >
                            <p class="price">{{ current_currency_symbol }} {{ formatPrice(order.grand_total) }}</p>
                            <span class="date">{{ order.created_at | moment('DD MMM YYYY') }}</span>
                        </div>
                        <div class="order_total" v-else>
                            <p class="price">{{ base_symbol }} {{ formatPrice(order.base_grand_total) }}</p>
                            <span class="date">{{ order.created_at | moment('DD MMM YYYY') }}</span>
                        </div>
                    </li>
                </ul>
                <ul class="order_list" v-else-if="order_count && !isMobileOnly" v-bind:style="{'height': order_list_height}">
                    <li v-for="(order, index) in orders_list" :key="index" :class="{'record': true, 'active': index == active_order }" @click="selectOrder(index, order)">
                        <div class="order_id">
                            #{{ order.id }}
                        </div>
                        <div class="order_date">
                            {{ order.created_at }}
                        </div>
                        <div class="order_total" v-if="current_currency == order.order_currency_code" >
                            {{ current_currency_symbol }} {{ formatPrice(order.grand_total) }}
                        </div>
                        <div class="order_total" v-else>
                            {{ base_symbol }} {{ formatPrice(order.base_grand_total) }}
                        </div>
                    </li>
                </ul>
                <div v-else class="message-alert danger">
                    {{ $t('pos_sales.error.no_order_record') }}
                </div>
                <pos-pagination v-if="order_count > 10"
                    :current-page="currentPage"
                    :page-count="pageCount"
                    @nextPage="pageChangeHandle('next')"
                    @previousPage="pageChangeHandle('previous')"
                    @loadPage="pageChangeHandle"
                />
            </div>
        </div>
        <div class="pos-order-view" v-if="!isMobileOnly">
            
            <div class="pos-order-info">
                <div class="order-info" v-if="selected_order_id">
                    <div class="order_row" v-if="selected_order.id">
                        <label class="row_title">{{ $t('pos_sales.menu_content.sales_history.text_order_id') }}</label>
                        <div class="row_value order_id"> #{{ selected_order.id }} </div>
                        <div class="row_value order_id" v-if="selected_order.ref_id"> #{{ selected_order.ref_id }} </div>
                    </div>
                    
                    <div class="order_row" v-if="selected_order.created_at">
                        <label class="row_title">{{ $t('pos_sales.menu_content.sales_history.text_order_date') }}</label>
                        <div class="row_value">
                            <i class="fa fa-calendar"></i>
                            {{ selected_order.created_at }}
                        </div>
                    </div>

                    <div class="order_row" v-if="selected_order.customer_first_name">
                        <label class="row_title">{{ $t('pos_sales.menu_content.sales_history.text_customer_info') }}</label>
                        <div class="row_value">
                            <span class="cust_name">{{ selected_order.customer_first_name }} {{ selected_order.customer_last_name }}</span>
                            <span class="cust_email" v-if="selected_order.customer_email">
                                <i class="fa fa-envelope"></i>
                                {{ selected_order.customer_email }}
                            </span>
                        </div>
                    </div>
                    <div class="order_row" v-if="selected_order.pos_order_note">
                        <label class="row_title">{{ $t('pos_sales.menu_content.sales_history.text_order_note') }}</label>
                        <div class="row_value">{{ selected_order.pos_order_note }} </div>
                    </div>

                    <div class="pos-action text-left" v-bind:style="{ 'padding-right': '0px' }">
                        <button type="button" class="btn btn-lg btn-pos-primary" @click="printInvoice(selected_order)">
                            <i class="fa fa-print"></i> {{ $t('pos_sales.menu_content.sales_history.button_print_invoice') }}
                        </button>
                    </div>
                </div>
                <div class="message-alert danger" v-else>
                    {{ $t('pos_sales.error.no_order_record') }}
                </div>
            </div>
        
            <div class="pos-order-totals">
                <div class="order-info" v-if="selected_order_id">
                    <div class="order_row" v-if="selected_order.items">
                        <label class="row_title">{{ $t('pos_sales.menu_content.sales_history.text_order_summary') }}</label>
                        <div class="row_value">
                            <div v-for="(item, index) in selected_order.items" :key="index">
                                <div class="product_info">
                                    
                                    <span class="product_name">{{ item.name }}
                                        <span class="product-attributes" v-if="item.type == 'configurable'" >
                                            <span v-for="attributes in item.additional.attributes" :key="attributes.id">
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
                        <div class="order_row" v-bind:style="{ 'border-bottom': 'none', 'margin': '0px', 'padding-bottom': '0px' }">
                            <div class="total_row_value">
                                <div class="total_text">
                                    <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                                </div>
                                <div class="total_value order_id">
                                    {{ current_currency_symbol }} {{ formatPrice(selected_order.grand_total) }} 
                                </div>
                            </div>
                        </div>

                        <div class="order_row">
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
                        <div class="order_row" v-bind:style="{ 'border-bottom': 'none' }">
                            <div class="total_row_value">
                                <div class="total_text">
                                    <b>{{ $t('pos_sales.menu_content.sales_history.text_grand_total') }}</b>
                                </div>
                                <div class="total_value row_value order_id">
                                    {{ base_symbol }} {{ formatPrice(selected_order.base_grand_total) }} 
                                </div>
                            </div>
                        </div>

                        <div class="order_row">
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
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
import { getOrders } from '@/api/order'
import { /* API as getApi,  */APP as getApp } from './../../../store/getters'
import { mapGetters } from 'vuex'

    export default {
        props: ['localObject'],
        data() {
            return {
                pos_offline: 0,
                user_id: 0,
                search_order_id: '',
                order_count: 0,
                orders_list: [],
                active_order: null,
                selected_order: [],
                selected_order_id: 0,
                current_currency: window.pos_currency_code,
                current_currency_symbol: window.pos_currency_symbol,
                base_symbol: window.base_currency_symbol,
                container_height: ($(window).height() - 104) + 'px',
                order_list_height: ($(window).height() - 250) + 'px',
                mobile_list_height: '100%',
                currentPage: 0,
                pageCount: 0
            };
        },
        computed: {
            // ...mapGetters({ getOrders:getApi.SALES.HISTORY }),
            isUserLogin () {
                this.checkUserLogin();
                return this.user_id;
            },
            getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] },
        },
        mounted() {
            this.loadOrders();
        },
        methods: {
            checkUserLogin() {
                this.pos_offline = this.$root.$root.offline;
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            loadOrders(page) {
                console.log(page)
                var thisthis = this;
                if (thisthis.$root.offline) {
                    if (Object.keys(thisthis.localObject.pos_orders).length > 0) {
                        
                        let getFilterOrders = [];
                        thisthis.order_count = 0;

                        if (thisthis.search_order_id.length > 0) {
                            $.each(thisthis.localObject.pos_orders, (key, order) => {
                                if (order.id.toString().indexOf(thisthis.search_order_id) !== -1) {
                                    getFilterOrders = getFilterOrders.concat(order);
                                    thisthis.order_count += 1;    
                                }
                            });
                            thisthis.orders_list = getFilterOrders;
                            thisthis.active_order = null;
                        } else {
                            thisthis.orders_list = thisthis.localObject.pos_orders;

                            if (!thisthis.isMobileOnly) {
                                thisthis.selectOrder(0, thisthis.orders_list[0]);
                            }
                            
                            thisthis.order_count = Object.keys(thisthis.localObject.pos_orders).length;
                        }
                    } else {
                        thisthis.order_count = 0;
                        thisthis.orders_list = [];
                    }
                } else {
                    // if (Object.keys(thisthis.localObject.pos_orders).length > 0) {
                        
                    //     let getFilterOrders = [];
                    //     thisthis.order_count = 0;

                    //     if (thisthis.search_order_id.length > 0) {
                    //         $.each(thisthis.localObject.pos_orders, (key, order) => {
                    //             if (order.id.toString().indexOf(thisthis.search_order_id) !== -1) {
                    //                 getFilterOrders = getFilterOrders.concat(order);
                    //                 thisthis.order_count += 1;    
                    //             }
                    //         });
                    //         thisthis.orders_list = getFilterOrders;
                    //         thisthis.active_order = null;
                    //     } else {
                    //         thisthis.orders_list = thisthis.localObject.pos_orders;

                    //         thisthis.selectOrder(0, thisthis.orders_list[0]);

                    //         thisthis.order_count = Object.keys(thisthis.localObject.pos_orders).length;
                    //     }
                    // } else {
                        //this.getOrders(thisthis.user_id, thisthis.search_order_id)
                        var params = {user_id: thisthis.user_id, filter_order_id: thisthis.search_order_id}
                        if (page) {
                            params.page = page
                        }
                        getOrders(params)
                        //thisthis.$http.get('/api/pos/auth/getOrders', {
                        //    params: {
                        //        user_id: thisthis.user_id,
                        //        filter_order_id: thisthis.search_order_id
                        //    }
                        //})
                        .then((response)  =>  {
                            if (thisthis.search_order_id) {
                                thisthis.active_order = null;
                            }
                            if (response.data.data && response.data.data.length > 0) {
                                thisthis.currentPage = response.data.meta.current_page
                                thisthis.pageCount = response.data.meta.last_page
                                thisthis.order_count = response.data.meta.total;
                                thisthis.orders_list = response.data.data;
                                if (thisthis.order_count > 10) {
                                    thisthis.mobile_list_height = 'calc(100% - 54px)'
                                }
                                if (!thisthis.isMobileOnly) {
                                    thisthis.selectOrder(0, thisthis.orders_list[0]);
                                }

                                thisthis.localObject.pos_orders = thisthis.orders_list;
                                
                                EventBus.$emit('setLocalForage', {'key': 'pos_orders', 'data': JSON.stringify(thisthis.orders_list)});
                            } else {
                                thisthis.order_count = 0;
                                thisthis.localObject.pos_orders = thisthis.orders_list;

                                EventBus.$emit('setLocalForage', {'key': 'pos_orders', 'data': JSON.stringify(thisthis.orders_list)});
                            }
                        })
                        .catch( e => { console.log(e) });
                    // }
                }
            },
            formatPrice(price) {
                return parseFloat(parseFloat(price).toFixed(2)).toLocaleString(this.getLocale)
            },
            orderDetails(items){
                var detail = ''
                $.each(items, (key, item) => {
                    if (item) {
                        detail += item.name + '(' + item.qty_ordered + ')'
                    }
                    if (key !== items.length - 1) {
                        detail += ', '
                    }
                    if (detail.length > 22) {
                        detail = detail.substring(0,20) + ".."
                        return false; 
                    }
                });
                return detail
            },
            selectOrder(active_index, order) {
                if (this.isMobileOnly) {
                    this.$router.push({ name: "pos_sale_order_summary", params: {
                        'selected_order': order,
                        'localObject': this.localObject}
                    });
                } else {
                    EventBus.$emit('getLocalForage', 'pos_orders');
                    this.active_order = active_index;
                    this.selected_order = order;
                    this.selected_order_id = order.id;
                }
            },
            printInvoice(order_data) {
                EventBus.$emit('printPosOrder', order_data);
            },
            pageChangeHandle(value) {
                switch (value) {
                    case 'next':
                        this.currentPage += 1
                        break
                    case 'previous':
                        this.currentPage -= 1
                        break
                    default:
                        this.currentPage = value
                }
                this.loadOrders(this.currentPage)
            }
        }
    }
</script>