<template>
    <div>
        <div class="profile-panel">

            <div class="message-alert warning" v-if="pos_offline">
                Warning: Currently you are in offline mode!
            </div>
            <div class="pos-setting-list" :class="{'row-grid-2': !isMobileOnly}" v-bind:style="{ 'width': isMobileOnly? '100%' : containerWidth }">
                <div class="pos-setting row-layout">
                    <div class="pos-setting-content">
                        <h3 v-if="!isMobileOnly">{{ $t('pos_setting.menu_content.profile.entry_user_profile') }}</h3>
                        <hr v-if="!isMobileOnly">
                        
                        <div class="pos-profile-form" v-if="isUserLogin">

                            <form autocomplete="off" @submit.prevent="saveUser" method="POST">
                                <div class="page-content">
                                    <div class="form-container">
                                        <input type="hidden" name="user_id" v-model="user_id">

                                        <div class="pos-profile-fields">
                                            <div class="control-group" :class="[this.errors.has('firstname') ? 'has-error' : '']">
                                                <label for="firstname" class="required" v-text="$t('pos_setting.menu_content.profile.entry_firstname')"></label>
                                                <input type="text" class="control" name="firstname" v-validate="'required|alpha_spaces'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="firstname">
                                                <span class="control-error" v-if="this.errors.has('firstname')">{{ this.errors.first('firstname') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('lastname') ? 'has-error' : '']">
                                                <label for="lastname" class="required" v-text="$t('pos_setting.menu_content.profile.entry_lastname')"></label>
                                                <input type="text" class="control" name="lastname" v-validate="'required|alpha_spaces'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="lastname">
                                                <span class="control-error" v-if="this.errors.has('lastname')">{{ this.errors.first('lastname') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('username') ? 'has-error' : '']">
                                                <label for="username" class="required" v-text="$t('pos_setting.menu_content.profile.entry_username')"></label>
                                                <input type="text" class="control" name="username" v-validate="'required|alpha_spaces'" :disabled="'disabled'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="username">
                                                <span class="control-error" v-if="this.errors.has('username')">{{ this.errors.first('username') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('email') ? 'has-error' : '']">
                                                <label for="email" class="required" v-text="$t('pos_setting.menu_content.profile.entry_email')"></label>
                                                <button v-show="emailDifferent" class="right-button" :disabled="otp_email_requested" @click="requestOtp('email')">Request OTP</button>
                                                <input type="email" class="control" name="email" v-validate="'required|email'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="email">
                                                <span class="control-error" v-if="this.errors.has('email')">{{ this.errors.first('email') }}</span>
                                            </div>
                                            <div v-if="otp_email_requested" class="control-group" :class="[this.errors.has('otp_mail') ? 'has-error' : '']" :style="'margin-top: -20px;'">
                                                <input type="text" class="control" name="otp_mail" v-validate="{ required: this.otp_email_requested, numeric: true }" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="otp_mail" placeholder="Enter Your Email OTP Here">
                                            </div>
                                            <div class="control-group" :class="[this.errors.has('phone') ? 'has-error' : '']">
                                                <label for="phone" v-text="$t('pos_setting.menu_content.profile.entry_phone')"></label>
                                                <button v-show="phoneDifferent" class="right-button" :disabled="otp_phone_requested" @click="requestOtp('phone')">Request OTP</button>
                                                <input type="text" class="control" name="phone" v-validate="'numeric'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="phone">
                                                <span class="control-error" v-if="this.errors.has('phone')">{{ this.errors.first('phone') }}</span>
                                            </div>
                                            <div v-if="otp_phone_requested" class="control-group" :class="[this.errors.has('otp_phone') ? 'has-error' : '']" :style="'margin-top: -20px;'">
                                                <input type="text" class="control" name="otp_phone" v-validate="{ required: this.otp_phone_requested, numeric: true }" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="otp_phone" placeholder="Enter Your Phone OTP Here">
                                            </div>
                                            <div class="control-group" :class="[this.errors.has('previous_password') ? 'has-error' : '']">
                                                <label for="previous_password" v-text="$t('pos_setting.menu_content.profile.entry_pre_password')"></label>
                                                <input type="password" class="control" name="previous_password" autocomplete="off" v-validate="'min:6'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="previous_password">
                                                <span class="control-error" v-if="this.errors.has('previous_password')">{{ this.errors.first('previous_password') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('password') ? 'has-error' : '']">
                                                <label for="password" v-text="$t('pos_setting.menu_content.profile.entry_new_password')"></label>
                                                <input type="password" class="control" name="password" autocomplete="off" v-validate="'min:6'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="password">
                                                <span class="control-error" v-if="this.errors.has('password')">{{ this.errors.first('password') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('password_confirmation') ? 'has-error' : '']">
                                                <label for="password_confirmation" v-text="$t('pos_setting.menu_content.profile.entry_confirm_password')"></label>
                                                <input type="password" class="control" name="password_confirmation" autocomplete="off" v-validate="'confirmed:password|min:6'" v-bind:style="{ 'width': isMobileOnly? '100%' : width }" v-model="password_confirmation">
                                                <span class="control-error" v-if="this.errors.has('password_confirmation')">{{ this.errors.first('password_confirmation') }}</span>
                                            </div>

                                            <div class="control-group" :class="[this.errors.has('image') ? 'has-error' : '']">
                                                <label for="image" class="croppa" v-text="$t('pos_setting.menu_content.profile.entry_avatar')"></label>
                                                <croppa class="control-croppa" v-model="avatar" style="height: 200px;">
                                                    <img slot="initial" :src="img_path" />
                                                </croppa>
                                            </div>

                                            <div class="text-left" :class="{'pos-action': !isMobileOnly}">
                                                <button class="btn btn-lg btn-pos-primary" :class="{'action-btn-green': isMobileOnly}" type="submit" :text="$t('pos_setting.menu_content.profile.button_done')" > {{ $t('pos_setting.menu_content.profile.button_done') }} </button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
import Vue from 'vue';
import { API as getApi, APP as getApp } from './../../../store/getters'
import { mapGetters } from 'vuex'

import Croppa from 'vue-croppa'

Vue.use(Croppa)

import 'vue-croppa/dist/vue-croppa.css'

    export default {
        props: ['localObject'],
        data() {
            return {
                containerWidth: '50%',
                width: '90%',
                otp_email_requested: false,
                otp_phone_requested: false,
                user_details: {},
                firstname: '',
                lastname: '',
                username: '',
                email: '',
                otp_mail: '',
                phone: '',
                otp_phone: '',
                trxid: '',
                previous_password: '',
                password: '',
                password_confirmation: '',
                img_path:'',
                avatar: {},
                user_id: 0,
                pos_offline: 0,
            };
        },
        computed: {
            ...mapGetters({
                updateUser:getApi.USER.UPDATE
                ,createOTP:getApi.AUTH.OTP.CREATE
            }),
            isUserLogin () {
                this.checkUserLogin();
                //this.pos_offline = this.$root.$root.offline;
                return this.user_id;
            },
            emailDifferent() {
                return !(this.errors.has('email')) && this.email !== this.user_details.email;
            },
            phoneDifferent() {
                return !(this.errors.has('phone')) && this.phone !== this.user_details.phone;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        mounted() {
            this.fillProfileData();
        },
        watch: {
            email: function () {
                this.otp_email_requested = false;
            },
            phone: function () {
                this.otp_phone_requested = false;
            }
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                    this.user_details = this.localObject.pos_cashier;
                }
                this.pos_offline = this.$root.$root.offline;
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
                    $.createOTP(data, type, 'update_profile')
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

            saveUser () {
                this.pos_offline = this.$root.$root.offline;
                if (this.pos_offline) {
                    window.flashMessages = [{'type': 'alert-error', 'message': "Warning: You can not perform this action in offline mode!"}];
                    this.$root.addFlashMessages();
                } else {
                    var $ = this;
                    $.$root.toggleButtonDisable(true);
                    $.$validator.validateAll().then(result => {
                        if (result) {
                            var fd = new FormData()
                            fd.append('user_id', $.user_id)
                            fd.append('firstname', $.firstname)
                            fd.append('lastname', $.lastname)
                            fd.append('action', 'update_profile')
                            if ($.previous_password) {
                                fd.append('previous_password', $.previous_password)
                                fd.append('password', $.password)
                                fd.append('password_confirmation', $.password_confirmation)
                            }
                            if ($.otp_mail) {
                                fd.append('email', $.email)
                                fd.append('otpEmail', $.otp_mail)
                            }
                            if ($.otp_phone) {
                                fd.append('phone', $.phone)
                                fd.append('otpPhone', $.otp_phone)
                                fd.append('trxid', $.trxid)
                            }
                            if ($.avatar.getChosenFile()) {                                
                                fd.append('avatar', $.avatar.getChosenFile())
                            }
                            /* $.updateUser(
                                $.user_id,
                                $.firstname,
                                $.lastname,
                                $.email,
                                $.otp,
                                $.phone,
                                $.previous_password,
                                $.password,
                                $.password_confirmation,
                                'update_profile') */
                            $.updateUser(fd)
                            .then(response  =>  {
                                if (!response.data.status) {
                                    window.flashMessages = [{'type': 'alert-error', 'message': response.data.message}];
                                    $.$root.addFlashMessages();
                                    $.$root.toggleButtonDisable(false);
                                } else {
                                    window.flashMessages = [{'type': 'alert-success', 'message': response.data.message}];
                                    $.$root.addFlashMessages();
                                    $.$root.toggleButtonDisable(false);
                                    for(var pair of fd.entries()) {
                                        $.localObject.pos_cashier[pair[0]] = pair[1]
                                    }
                                    if(response.data.path){
                                        $.localObject.pos_cashier.img_path = response.data.path
                                    }
                                    $.user_details = $.localObject.pos_cashier;
                                    EventBus.$emit('setLocalForage', {'key': 'pos_cashier', 'data': JSON.stringify(this.localObject.pos_cashier)});
                                }
                            })
                            .catch(e => {
                                console.log(e)
                                window.flashMessages = [{'type': 'alert-success', 'message': 'Request was failed'}];
                                $.$root.addFlashMessages();
                                $.$root.toggleButtonDisable(false);
                            })
                            
                        } else {
                            $.$root.toggleButtonDisable(false);
                        }
                    });
                }
            },
            fillProfileData() {
                if (this.user_id) {
                    this.firstname = this.user_details.firstname;
                    this.lastname = this.user_details.lastname;
                    this.username = this.user_details.username;
                    this.email = this.user_details.email;
                    this.phone = this.user_details.phone;
                    this.img_path = this.user_details.img_path;
                }
            }
        }
    }
</script>