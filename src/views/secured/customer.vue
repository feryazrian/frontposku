<template>
    <div>
        <div class="pos-customer-main" v-if="isUserLogin" :class="{'mobile': isMobileOnly}">
            <div class="pos-customer-header" v-if="!isMobileOnly">
                <div class="title">{{ $t('pos_customer.top_menu.title') }}</div>
            </div>
            <div class="pos-product-container" v-bind:style="{'height': isMobileOnly ? '100%' : container_height}">
                <div class="pos-customer-list">
                    <div class='customer_search'>
                        <i class="fa fa-search"></i>
                        <input type="text" class="control_disabled customer_search_field" :placeholder="$t('pos_customer.menu_content.search_area.placeholder_search')" @keyup="action.searchCustomers" v-model="search_customer" />
                    </div>
                    <ul class="customer_list" v-if="customer_count && isMobileOnly">
                        <li v-for="customer in customerList" :key=customer.id :class="{'record': true, 'active': customer.email == active_customer }">
                            <div class="customer_avatar">
                                <img
                                    v-if="customer.image"
                                    :src="customer.img_path"
                                    :alt="customer.firstname + ' ' + customer.lastname"
                                    :title="customer.firstname + ' ' + customer.lastname"
                                />
                                <i v-else class="fa fa-user"></i>
                            </div>
                            <div class="customer_info">
                                <span class="name">{{ customer.name }}</span>
                                <span class="contact">{{customer.email }}<i v-show="customer.phone">, </i>{{ customer.phone }}</span>
                            </div>
                            <div class="customer_show" @click="showCustomerDetail(customer)">
                                <i class="fa fa-eye"></i>
                            </div>
                        </li>
                    </ul>
                    <ul class="customer_list" v-else-if="customer_count && !isMobileOnly" v-bind:style="{'height': customer_list_height}">
                        <li v-for="customer in customerList" :key=customer.id :class="{'record': true, 'active': customer.email == active_customer }" @click="selectCustomer(customer)">

                            <div class="customer_name">
                                {{ customer.name }}
                            </div>
                            <div class="customer_contact">
                                <i class="fa fa-envelope"></i>
                                {{ customer.email }}
                            </div>
                            <div class="customer_contact" v-if="customer.faddresses" >
                                <i class="fa fa-map-marker"></i>
                                {{ customer.faddresses }}
                            </div>
                        </li>
                    </ul>
                    <div v-else class="message-alert danger">
                        {{ $t('pos_customer.error.no_customer_record') }}
                    </div>
                </div>
                <div class="fixed-btm" v-if="isMobileOnly">
                    <button class="action-btn-green-outline" @click="addCustomer">
                        {{ $t('pos_customer.menu_content.add_customer') }}
                    </button>
                </div>
                <div class="pos-customer-view" v-if="!isMobileOnly">
                    <customerview
                        :detailShown=detailShown
                        :selected_customer_email="selected_customer_email"
                        :selectedCustomer="selected_customer"
                        :localObject="localObject"
                        @onChangeCustomer="updateCartCustomer"
                        @onRemoveCustomer="removeCustomer"
                    ></customerview>
                </div>
            </div>
        </div>
        
        <div class="pos-cart-container" v-bind:style="{'height': cart_container_height}" v-if="!isMobileOnly">
            <pos-cart
                :pos_carts='pos_carts'
                :pos_current_cart='pos_current_cart'
                :showMinusBtn='showMinusBtn'
                :cartCustomer='cartCustomer'
                :hold_count='holdCartCount'
                :localObject='localObject'
            ></pos-cart>
        </div>
        
        <pos-common-modal id="editCustomer" :is-open="this.$root.posCommonModal.editCustomer" @modalclosing="readonly = null">
            <h4 slot="header">{{ $t('pos_customer.menu_content.customer_detail') }}</h4>
            
            <div slot="body">
                <customer-form
                    :readonly='readonly'
                    :customer_email='active_customer'
                    :customer_data='selected_customer'
                    :customer_groups='customer_groups'
                    :localObject='localObject'
                    @onSelectCustomer="updateCartCustomer"
                ></customer-form>
            </div>
        </pos-common-modal>
    </div>
</template>

<script>
import { getCustomers } from '@/api/customer'
import { APP as getApp } from './../../store/getters'
import { mapGetters } from 'vuex'

    export default {
        props: ['localObject'],
        data() {
            const _ = this
            return {
                pos_offline: 0,
                pos_carts: [],
                pos_current_cart: 0,
                showMinusBtn: false,
                customers_list: [],
                customerList:[],
                customer_count: 0,
                holdCartCount: 0,
                search_customer: '',
                active_customer: '',
                selected_customer: {},
                selected_customer_email: '',
                cartCustomer: [],
                success_message: this.$t('pos_customer.menu_content.success_customer_cart'),
                
                success_customer_remove: this.$t('pos_customer.menu_content.success_customer_remove'),
                user_id: 0,
                cart_container_height: ($(window).height() - 60) + 'px',
                container_height: ($(window).height() - 105) + 'px',
                customer_list_height: ($(window).height() - 165) + 'px',
                detailShown:null
                ,action:{
                  searchCustomers({ currentTarget:q }) {
                    let n
                    if((n = (q = q.value).length) < 3) {
                      if(n < 1) {
                        _.customerList.splice(0)
                        for(let e of _.customers_list)
                          _.customerList.push(e)
                      }
                      return;
                    }
                    getCustomers(_.user_id, { q }).then(({ status, data:v }) => {
                      if(status != 200) return;
                      _.customerList.splice(0)
                      if((v = v.data))
                        if(v.length > 0) {
                          for(let e of v)
                            _.customerList.push(e)
                        }
                    })
                    //let v, x = new RegExp(q.value, 'i')
                    //for(let e of _.customers_list)
                    //  if((v = e.name) && v.search(x) > -1)
                    //    _.customerList.push(e)
                  }
                },
                //mobile
                readonly:null,
                customer_groups: [],
            };
        },
        computed: {
            ...mapGetters({
                 isMobileOnly:getApp.ISMOBILEONLY
                ,getCurrentCustomer:getApp.CUSTOMER.CURRENT_DEFAULT
            }),
            isUserLogin() {
                // this.pos_offline = this.$root.offline;

                this.checkUserLogin();
                this.countHoldTotal();

                return this.user_id;
            }
        },
        beforeDestroy() {
            EventBus.$off('getAllCustomers');
        },
        created() {
            EventBus.$on('getAllCustomers', () => {
                this.loadCustomers()
            });
            EventBus.$on('customerHoldCart', () => {
                this.countHoldTotal();
            });
            if (this.isMobileOnly) {
                this.getCustomerGroups()
            }
        },
        mounted() {
            this.$watch('customers_list', v => {
                let x = this.customerList
                x.splice(0)
                for(let e of v) x.push(e)
            })
            let v
            if((v = this.getCurrentCustomer)) {
                this.cartCustomer           = v;
                this.active_customer        = v.email;
                this.selected_customer_email= v.email;
                this.selected_customer      = v;
            }
            this.loadCarts();
            this.loadCustomers();
            this.loadCustomer();
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            countHoldTotal() {
                if (this.localObject.pos_holds) {
                    this.holdCartCount = Object.keys(this.localObject.pos_holds).length;
                }
            },
            loadCarts() {
                EventBus.$emit('getLocalForage', 'pos_current_cart');

                if (this.localObject.pos_carts.length > 0) {
                    if (this.localObject.pos_carts.length > 1) {
                        this.showMinusBtn = true;
                    }
                    this.pos_carts = this.localObject.pos_carts;
                    this.pos_current_cart = this.localObject.pos_current_cart;
                } else {
                    if (this.pos_carts.length == 0) {
                        this.pos_carts[0] = {};
                        this.pos_current_cart = 0;
                        
                        EventBus.$emit('setLocalForage', {'key': 'pos_carts', 'data': JSON.stringify(this.pos_carts)});
                        
                        EventBus.$emit('setLocalForage', {'key': 'pos_current_cart', 'data': this.pos_current_cart});
                    }
                }
            },
            loadCustomers() {
                var thisthis = this;

                if (this.$root.offline) {
                    if ( Object.keys(thisthis.localObject.pos_customers).length > 0 ) {

                        if ( Object.keys(thisthis.localObject.pos_offline_customers).length > 0 ) {
                            $.each(thisthis.localObject.pos_offline_customers, (key, offline_customer) => {
                                this.checkOfflineCustomer(thisthis.localObject.pos_customers, offline_customer);
                            });
                        }

                        if (thisthis.search_customer.length > 0) {
                            let getFilterCustomers = [];
                            thisthis.customer_count = 0;

                            $.each(thisthis.localObject.pos_customers, (key, customer) => {
                                if (customer.name.toLowerCase().indexOf(thisthis.search_customer) !== -1) {
                                    getFilterCustomers = getFilterCustomers.concat(customer);
                                    thisthis.customer_count += 1;    
                                }
                            });
                            thisthis.customers_list = getFilterCustomers;
                        } else {
                            thisthis.customers_list = thisthis.localObject.pos_customers;
                            thisthis.customer_count = Object.keys(thisthis.localObject.pos_customers).length;
                        }
                        
                    } else if ( Object.keys(thisthis.localObject.pos_offline_customers).length > 0 ) {
                        if (thisthis.search_customer.length > 0) {
                            let getFilterCustomers = [];
                            thisthis.customer_count = 0;

                            $.each(thisthis.localObject.pos_offline_customers, (key, customer) => {
                                if (customer.name.toLowerCase().indexOf(thisthis.search_customer) !== -1) {
                                    getFilterCustomers = getFilterCustomers.concat(customer);
                                    thisthis.customer_count += 1;    
                                }
                            });
                            thisthis.customers_list = getFilterCustomers;
                        } else {
                            thisthis.customers_list = thisthis.localObject.pos_offline_customers;
                            thisthis.customer_count = Object.keys(thisthis.localObject.pos_offline_customers).length;
                            EventBus.$emit('setLocalForage', {'key': 'pos_customers', 'data': JSON.stringify(thisthis.localObject.pos_offline_customers)});
                        }
                        
                    } else {
                        thisthis.customers_list = [];
                        thisthis.customer_count = 0;
                        thisthis.selected_customer_email = '';
                    }
                } else {
                    //this.$http.get('/api/pos/getCustomers', {
                    //    params: {
                    //        user_id: thisthis.user_id,
                    //        customer_name: thisthis.search_customer
                    //    }
                    //})
                    getCustomers(thisthis.user_id, { isOnlyMember:false })
                      .then(response => {
                        if (response.data.data && response.data.data.length > 0) {
                            thisthis.customer_count = response.data.meta.total;
                            thisthis.customers_list = response.data.data;
                            thisthis.localObject.pos_customers = thisthis.customers_list;
                            EventBus.$emit('setLocalForage', {'key': 'pos_customers', 'data': JSON.stringify(thisthis.customers_list)});
                        } else {
                            thisthis.customer_count = 0;
                            thisthis.localObject.pos_customers = thisthis.customers_list;
                        }
                      })
                      .catch(e => { console.log(e) })
                }
            },
            selectCustomer(customer) {
                EventBus.$emit('getLocalForage', 'pos_cart_customer');
                customer.currentActive = false;
                
                if (this.localObject.pos_cart_customer && this.localObject.pos_cart_customer.id) {
                    if (this.localObject.pos_cart_customer.id == customer.id) {
                        customer.currentActive = true;
                    }
                }
                this.active_customer = customer.email;
                this.selected_customer = customer;
                this.selected_customer_email = customer.email;
                this.detailShown = customer.show_all_field
            },
            loadCustomer() {
                EventBus.$emit('getLocalForage', 'pos_cart_customer');
                
                if (this.localObject.pos_cart_customer && this.localObject.pos_cart_customer.id) {
                    this.cartCustomer           = this.localObject.pos_cart_customer;
                    this.active_customer        = this.localObject.pos_cart_customer.email;
                    this.selected_customer_email= this.localObject.pos_cart_customer.email;
                    this.selected_customer      = this.localObject.pos_cart_customer;
                    this.selected_customer.currentActive = true;
                }
            },
            updateCartCustomer(updatedCustomer) {
                if (updatedCustomer.email) {
                    EventBus.$emit('setLocalForage', {'key': 'pos_cart_customer', 'data': JSON.stringify(updatedCustomer)}, () => {
                        EventBus.$emit('getLocalForage', 'pos_cart_customer')
                    })
                    this.cartCustomer           = updatedCustomer;
                    this.active_customer        = updatedCustomer.email;
                    this.selected_customer_email= updatedCustomer.email;
                    this.selected_customer      = updatedCustomer;

                    this.$toast.success(this.success_message, {
                        position: 'top-right',
                        duration: 2000,
                    });
                }
            },
            removeCustomer() {
                EventBus.$emit('deleteLocalForage', 'pos_cart_customer');
                this.cartCustomer           = [];
                this.active_customer        = '';
                this.selected_customer_email= '';
                this.selected_customer      = {};

                this.$toast.success(this.success_customer_remove, {
                    position: 'top-right',
                    duration: 2000,
                });
            },
            checkOfflineCustomer(arr, offline_record) {
                // const { length } = arr;
                // const id = length + 1;
                const found = arr.some(el => el.email === offline_record.email);
                if (!found) arr.push(offline_record);
                return arr;
            },
            // Mobile
            getCustomerGroups() {
                if (this.$root.offline) {
                    this.offline_status = true;

                    if ( Object.keys(this.localObject.pos_customer_groups).length > 0 ) {
                        this.customer_groups = this.localObject.pos_customer_groups;
                    } else {
                        this.customer_groups = [];
                    }
                } else {
                    this.offline_status = false;
                    this.$http.get('/api/pos/getGroups')
                    .then((response)  =>  {
                        if (response.data.data && response.data.data.length > 0) {
                            this.customer_groups = response.data.data;

                            EventBus.$emit('setLocalForage', {'key': 'pos_customer_groups', 'data': JSON.stringify(this.customer_groups)});
                        } else {
                            this.customer_groups = [];
                        }
                    })
                    .catch( e => {
                        console.log(e)
                    });
                }
                
            },
            showCustomerDetail(customer) {
                customer.currentActive = false;
                if (this.localObject.pos_cart_customer && this.localObject.pos_cart_customer.id) {
                    if (this.localObject.pos_cart_customer.id == customer.id) {
                        customer.currentActive = true;
                    }
                }
                this.active_customer = customer.email;
                this.selected_customer = customer;
                this.readonly = true
                EventBus.$emit('showCommonModal', 'editCustomer');
            },
            addCustomer() {
                this.$router.push({ name: "pos_add_customer", params: {'localObject': this.localObject} });
            }
        }
    }

</script>
