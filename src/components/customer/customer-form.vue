<template>
    <div class="pos-discount-form" v-if="isUserLogin">
        <form autocomplete="off" @submit.prevent="customerAction" method="POST">
            <div class="page-content">
                <div class="form-container">
                    <input type="hidden" name="customer_email" v-model="customer_email">

                    <div class="pos-customer-fields">
                        <div class="control-group" :class="[this.errors.has('first_name') ? 'has-error' : '']">
                            <label for="first_name" class="required" v-text="$t('pos_customer.menu_content.entry_firstname')"></label>
                            <input type="text" class="control" name="first_name" v-model="first_name" v-validate="'required|alpha_spaces'" v-bind:style="{ 'width': width }" :readonly=readonly>
                            <span class="control-error" v-if="this.errors.has('first_name')">{{ this.errors.first('first_name') }}</span>
                        </div>

                        <div class="control-group" :class="[this.errors.has('last_name') ? 'has-error' : '']">
                            <label for="last_name" class="required" v-text="$t('pos_customer.menu_content.entry_lastname')"></label>
                            <input type="text" class="control" name="last_name" v-model="last_name" v-validate="'required|alpha_spaces'" v-bind:style="{ 'width': width }" :readonly=readonly>
                            <span class="control-error" v-if="this.errors.has('last_name')">{{ this.errors.first('last_name') }}</span>
                        </div>

                        <div class="control-group" :class="[this.errors.has('email') ? 'has-error' : '']">
                            <label for="email" :class="{'required': !phone}" v-text="$t('pos_customer.menu_content.entry_email')"></label>
                            <button v-show="email && !readonly" class="right-button" :disabled="otp_email_requested" @click="requestOtp('email')">Request OTP</button>
                            <input type="email" class="control" name="email" v-model="email" v-validate="{'required': !phone, 'email': true}" v-bind:style="{ 'width': width }" :readonly=readonly>
                            <span class="control-error" v-if="this.errors.has('email')">{{ this.errors.first('email') }}</span>
                        </div>
                        <div v-if="email && !readonly" class="control-group" :class="[this.errors.has('otp_mail') ? 'has-error' : '']" :style="'margin-top: -20px;'">
                            <input type="text" class="control" name="otp_mail" v-validate="'required|numeric'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="otp_mail" placeholder="Enter Your Email OTP Here">
                        </div>

                        <div class="control-group" :class="[this.errors.has('phone') ? 'has-error' : '']">
                            <label for="phone" :class="{'required' :  (phone || !email)}" v-text="$t('pos_customer.menu_content.entry_phone')"></label>
                            <button v-show="phone && !readonly" class="right-button" :disabled="otp_phone_requested" @click="requestOtp('phone')">Request OTP</button>
                            <input type="text" class="control" name="phone" v-model="phone" v-validate="{'required': (phone || !email), 'numeric': true}" v-bind:style="{ 'width': width }" :readonly=readonly>
                            <span class="control-error" v-if="this.errors.has('phone')">{{ this.errors.first('phone') }}</span>
                        </div>
                        <div v-if="phone && !readonly" class="control-group" :class="[this.errors.has('otp_phone') ? 'has-error' : '']" :style="'margin-top: -20px;'">
                            <input type="text" class="control" name="otp_phone" v-validate="'required|numeric'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="otp_phone" placeholder="Enter Your Phone OTP Here">
                        </div>
                        
                        <div class="control-group"  v-if="show_all_field">
                            <label for="gender" v-text="$t('pos_customer.menu_content.entry_gender')"></label>

                            <input v-if=readonly type=text :value=gender v-bind:style={width} class=control readonly />
                            <select v-else name="gender" class="control" v-model="gender" v-bind:style="{ 'width': width }">
                                <option value="Male" :selected="gender == 'Male' ? 'selected' : '' ">{{ $t('pos_customer.menu_content.entry_male') }}</option>
                                <option value="Female" :selected="gender == 'Female' ? 'selected' : ''">{{ $t('pos_customer.menu_content.entry_female') }}</option>
                            </select>
                        </div>

                        <div class="control-group" :class="[this.errors.has('date_of_birth') ? 'has-error' : '']" v-if="show_all_field">
                            <label for="date_of_birth" v-text="$t('pos_customer.menu_content.entry_dob')"></label>
                            <input v-if=readonly type="text" class="control" name="date_of_birth" :value=fdate_of_birth v-bind:style="{ 'width': width }" readonly>
                            <input v-else type="date" class="control" name="date_of_birth" v-model="date_of_birth" v-bind:style="{ 'width': width }" v-validate="'dateResolver:'" placeholder="yyyy-MM-dd">
                            <span class="control-error" v-if="this.errors.has('date_of_birth')">{{ this.errors.first('date_of_birth') }}</span>
                        </div>

                        <div class="control-group">
                            <label for="customer_group_id" v-text="$t('pos_customer.menu_content.entry_customer_group')"></label>

                            <input v-if=readonly type=text :value="searchSelectedItem(customer_groups, customer_group_id, 'id', 'name')" v-bind:style={width} class=control readonly />
                            <select v-else name="customer_group_id" class="control" v-model="customer_group_id" v-bind:style="{ 'width': width }" disabled>
                                <option :value="group.id" v-for="(group, index) in customer_groups" :key="index"> {{ group.name }} </option>
                            </select>
                        </div>

                        <div v-if="!readonly && !isMobileOnly" class="pos-action text-center">
                            <button class="btn btn-lg btn-pos-primary" type="submit" :text="$t('pos_customer.menu_content.button_save')"> {{ $t('pos_customer.menu_content.button_save') }} </button>
                        </div>
                        
                        <div v-if="isMobileOnly" class="pos-action text-center">
                            <button class="btn btn-lg btn-pos-primary" type="button" :text="$t('pos_customer.menu_content.button_select')" @click="selectCustomer"> {{ $t('pos_customer.menu_content.button_select') }} </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { API as getApi, APP as getApp } from '@/store/getters'
import { mapGetters } from 'vuex'

    export default {
        props: ['customer_email', 'customer_data', 'customer_groups', 'localObject', 'readonly'],
        data() {
            return {
                width: '90%',
                user_id: 0,
                otp_email_requested: false,
                otp_phone_requested: false,
                first_name: '',
                last_name: '',
                email: '',
                otp_mail: '',
                phone: '',
                otp_phone: '',
                trxid: '',
                gender: 'Male',
                date_of_birth: '',
                fdate_of_birth:null,
                customer_group_id: 2,
                formAction: '',
                offline_customers_records: [],
                offline_record: {},
                // mobile
                show_all_field: true,
                success_already_message: this.$t('pos_customer.menu_content.success_customer_already_cart'),
            };
        },
        computed: {
            ...mapGetters({
                createCustomer:getApi.CUSTOMER.CREATE
                ,createOTP:getApi.AUTH.OTP.CREATE
            }),
            isUserLogin () {
                this.checkUserLogin();

                return this.user_id;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        mounted() {
            this.fillCustomerData();
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            requestOtp(type) {
                var $ = this
                if (type === 'email'){
                    $.otp_email_requested = true;
                }
                else if (type === 'phone'){
                    $.otp_phone_requested = true;
                }
                $.$validator.validate(type).then(result => {
                    if(!result) {
                        if (type === 'email'){
                            $.otp_email_requested = false;
                        }
                        else if (type === 'phone'){
                            $.otp_phone_requested = false;
                        }
                        return
                    }
                    var data
                    if (type === 'email'){
                        data = $.email
                    }
                    else if (type === 'phone'){
                        data = $.phone
                    }
                    $.createOTP(data, type, 'add_customer')
                    .then(response => {
                        if (!response.data.status) {
                            window.flashMessages = [{'type': 'alert-error', 'message': response.data.message}];
                            $.$root.addFlashMessages();
                            if (type === 'email'){
                                $.otp_email_requested = false;
                            }
                            else if (type === 'phone'){
                                $.otp_phone_requested = false;
                            }
                        } else {
                            if (type === 'phone'){
                                $.trxid = response.data.trxid;
                            }
                            window.flashMessages = [{'type': 'alert-success', 'message': response.data.message}];
                            $.$root.addFlashMessages();
                        }
                    })
                    .catch(e => {
                        console.log(e)
                        window.flashMessages = [{'type': 'alert-success', 'message': 'Request was failed'}];
                        $.$root.addFlashMessages();
                        if (type === 'email'){
                            $.otp_email_requested = false;
                        }
                        else if (type === 'phone'){
                            $.otp_phone_requested = false;
                        }
                    })
                })
                if (type === 'email'){
                    $.otp_mail = '';
                }
                else if (type === 'phone'){
                    $.otp_phone = '';
                }
            },
            customerAction () {
                var thisthis = this;
                //if (!thisthis.customer_email) {
                //    thisthis.formAction = '/api/pos/auth/addCustomer';
                //} else {
                //    thisthis.formAction = '/api/pos/auth/editCustomer';
                //}
                this.$root.toggleButtonDisable(true);
                
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (this.$root.offline) {
                            this.offline_record = {
                                id: 0,
                                channel_id: window.default_channel.id,
                                user_id: thisthis.user_id,
                                first_name: thisthis.first_name,
                                last_name: thisthis.last_name,
                                name: thisthis.first_name + ' ' + thisthis.last_name,
                                email: thisthis.email,
                                phone: thisthis.phone,
                                gender: thisthis.gender,
                                date_of_birth: thisthis.date_of_birth,
                                fdate_of_birth: thisthis.fdate_of_birth,
                                customer_group_id: thisthis.customer_group_id,
                                status: 1,
                                is_verified: 1,
                                subscribed_to_news_letter: 0,
                                token: '',
                                addresses: {}
                            };

                            this.offline_customers_records = [];
                            this.offline_customers_records = this.checkOfflineCustomer(this.localObject.pos_offline_customers, this.offline_record);
                            
                            EventBus.$emit('setLocalForage', {'key': 'pos_offline_customers', 'data': JSON.stringify(this.offline_customers_records)});

                            window.flashMessages = [{'type': 'alert-success', 'message': 'Success: Customer added into offline mode successfully!'}];
                            this.$root.addFlashMessages();
                            
                            this.$root.hideCommonModal('addCustomer');
                            this.$root.toggleButtonDisable(false);
                            
                            EventBus.$emit('getAllCustomers');
                            EventBus.$emit('removeCartCustomer');

                            this.$router.push({name: 'pos_customer'});
                        } else {
                            //this.$http.post(thisthis.formAction, {
                            //        customer_email: thisthis.customer_email,
                            //        user_id: thisthis.user_id,
                            //        first_name: thisthis.first_name,
                            //        last_name: thisthis.last_name,
                            //        email: thisthis.email,
                            //        phone: thisthis.phone,
                            //        gender: thisthis.gender,
                            //        date_of_birth: thisthis.date_of_birth,
                            //        customer_group_id: thisthis.customer_group_id,
                            //})
                            this.createCustomer(
                                thisthis.first_name
                                ,thisthis.last_name
                                ,{email: thisthis.email, otpEmail: thisthis.otp_mail}
                                ,{phone: thisthis.phone, otpPhone: thisthis.otp_phone, trxid:thisthis.trxid}
                                ,thisthis.customer_group_id
                                ,thisthis.gender
                                ,thisthis.date_of_birth
                            )
                            .then((response)  =>  {
                                if (!response.data.status) {
                                    window.flashMessages = [{'type': 'alert-error', 'message': response.data.message}];
                                    this.$root.addFlashMessages();
                                    this.$root.toggleButtonDisable(false);
                                } else {
                                    window.flashMessages = [{'type': 'alert-success', 'message': response.data.message}];
                                    this.$root.addFlashMessages();
                                    this.$root.hideCommonModal('addCustomer');
                                    this.$root.toggleButtonDisable(false);
                                    
                                    EventBus.$emit('getAllCustomers');
                                    // EventBus.$emit('removeCartCustomer');

                                    this.$router.push({name: response.data.route});
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            });
                        }
                    } else {
                        this.$root.toggleButtonDisable(false);
                    }
                });
            },
            fillCustomerData() {
                if (this.customer_email) {
                    this.first_name = this.customer_data.first_name;
                    this.last_name = this.customer_data.last_name;
                    this.email = this.customer_data.email;
                    this.phone = this.customer_data.phone;
                    this.gender = this.customer_data.gender;
                    this.date_of_birth = this.customer_data.date_of_birth;
                    this.fdate_of_birth = this.customer_data.fdate_of_birth;
                    this.customer_group_id = this.customer_data.customer_group_id;
                    this.show_all_field = this.customer_data.show_all_field
                }
            },
            checkOfflineCustomer(arr, offline_record) {
                // const { length } = arr;
                // const id = length + 1;
                const found = arr.some(el => el.email === offline_record.email);
                if (!found) arr.push(offline_record);
                return arr;
            }
            ,searchSelectedItem(list, _ID, name, attr) {
                for(let e of list)
                    if(e[ name ] === _ID)
                        return e[attr]
            },
            //Mobile
            selectCustomer() {
                if (this.customer_data.email) {
                    this.customer_data.currentActive = true;

                    if (this.localObject.pos_cart_customer.email && this.localObject.pos_cart_customer.email == this.customer_data.email) {
                        this.$toast.warning(this.success_already_message, {
                            position: 'top-right',
                            duration: 2000,
                        });
                    } else {
                        this.$emit('onSelectCustomer', this.customer_data);
                        this.localObject.pos_cart_customer = this.customer_data
                        EventBus.$emit('hideCommonModal', 'editCustomer');
                    }
                }
            }
        }
    }
</script>