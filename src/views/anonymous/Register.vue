<template>
<div class="user-register" :style={height} :class={mobile:isMobile}>
  <div class="pos-register-content">
    <div class="top-head-content" v-if=!isMobile></div>
    <div class="register-form-content">
      <div v-if=!isMobile class="pos-register-text">{{ $t('pos_register.mainTitle') }}</div>
      <div v-if="registrationStep === 0" class=backLogin>{{ $t('pos_register.subtitles')[0] }}&#160;<span @click=action.toLogin class=activeLink>{{ $t('pos_register.subtitles')[1] }}</span>.
      </div>
      <form :key=registrationStep v-if="registrationStep === 0" class=pos-register-fields @submit.prevent=action.createOTP>
        <div class="control-group" :class="[errors.has($t('pos_register.identifier')) ? 'has-error' : '']">
          <label :for="$t('pos_register.identifier')" class="required">{{ $t("pos_register.identifier") }}</label>
          <input :disabled=frozen type="text" class="control" :name="$t('pos_register.identifier')" v-validate="'required|orEmailPhone'" v-model="requestedBy"
           :placeholder="isMobile? $t('pos_register.identifier') : ''"
          />
          <span class="control-error" v-if="errors.has($t('pos_register.identifier'))">{{ errors.first($t('pos_register.identifier')) }}</span>
        </div>
        <div class="pos-action text-center">
          <button class="btn btn-pos-primary btn-lg" :disabled=frozen>{{ $t("pos_register.buttonCreateOTP") }}</button>
        </div>
      </form>
      <form :key=registrationStep v-else-if="registrationStep === 1" class=pos-register-fields @submit.prevent=action.verifyOTP>
        <p>{{ $t(`pos_register.${ usernameType }VerificationSubtitle1`) }}.<br />{{ $t(`pos_register.${ usernameType }VerificationSubtitle2`) }} (2&#160;{{ $t('pos_register.minute') }}).</p>
        <div class="control-group" :class="[errors.has('Registration Code') ? 'has-error' : '']">
          <label for="Registration Code">{{ $t("pos_register.registrationCode") }}</label>
          <input :disabled=frozen type="text" ref=registrationCodeInput class="control" name="Registration Code" v-validate="'required|numeric'" v-model=registrationCode
           :placeholder="$t('pos_register.verificationCode')"
          />
          <span class="control-error" v-if="errors.has('Registration Code')">{{ errors.first('Registration Code') }}</span>
        </div>
        <div class="pos-action text-center">
          <button class="btn btn-pos-primary btn-lg" :disabled=frozen>{{ $t("pos_register.buttonVerifyOTP") }}</button>
        </div>
      </form>
      <template v-else-if="registrationStep === 2">
      <form v-if=isMobile :key=registrationStep @submit.prevent="action.register" method=POST class=mobile>
        <div v-for="e of mobile.inputs" :key=e.name :class="[ errors.has(e.name)? 'has-error' : '' ]" class=control-group>
          <input :disabled=frozen :type=e.type v-validate=e.validator :placeholder="$t(e.placeholder)" :name=e.name v-model="inputs[e.model]" :readonly=action.checkReadOnly(e.model)>
          <span class="control-error" v-if="errors.has(e.name)">{{ errors.first(e.name) }}</span>
        </div>
        <p class="fs-14px text-center" style="margin:20px 0">
          <span class=inlineFlex>
            <input v-validate="'required'" name=Agreement type=checkbox style="width:auto;margin-right:10px" /><span>{{ $t('pos_register.agreement') }}</span>
          </span>
          <br />
          <span>{{ $t('pos_register.term') }}</span>&#160;{{ $t('general.and') }}&#160;<span>{{ $t('pos_register.privacy') }}</span>
        </p>
        <div><button :disabled="frozen || errors.count() > 0" class="btn btn-pos-primary btn-lg">{{ $t("pos_register.button_title") }}</button></div>
      </form>
      <form v-else :key=registrationStep @submit.prevent="action.register" method="POST">
        <button class="pos-outlet-text accordion">Outlet</button>
        <div class="accordion-content">
          <div class="pos-register-fields">
            <div class="control-group" :class="[errors.has('Name') ? 'has-error' : '']">
              <label class="required" for="Name">{{ $t("pos_register.name") }}</label>
              <input :disabled=frozen type="text" class="control" name="Name" v-validate="'required'" v-model="inputs.outletName">
              <span class="control-error" v-if="errors.has('Name')">{{ errors.first('Name') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Address') ? 'has-error' : '']">
              <label class="required" for="Address">{{ $t("pos_register.address") }}</label>
              <input :disabled=frozen type="text" class="control" name="Address" v-validate="'required'" v-model="inputs.address">
              <span class="control-error" v-if="errors.has('Address')">{{ errors.first('Address') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('State') ? 'has-error' : '']">
              <label class="required" for="State">{{ $t("pos_register.state") }}</label>
              <input :disabled=frozen type="text" class="control" name="State" v-validate="'required'" v-model="inputs.state">
              <span class="control-error" v-if="errors.has('State')">{{ errors.first('State') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('City') ? 'has-error' : '']">
              <label class="required" for="City">{{ $t("pos_register.city") }}</label>
              <input :disabled=frozen type="text" class="control" name="City" v-validate="'required'" v-model="inputs.city">
              <span class="control-error" v-if="errors.has('City')">{{ errors.first('City') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Post Code') ? 'has-error' : '']">
              <label class="required" for="Post Code">{{ $t("pos_register.postcode") }}</label>
              <input :disabled=frozen type="text" class="control" name="Post Code" v-validate="'required|numeric|max:5'" v-model="inputs.postCode">
              <span class="control-error" v-if="errors.has('Post Code')">{{ errors.first('Post Code') }}</span>
            </div>
          </div>
        </div>
        <button class="pos-outlet-text accordion">New User</button>
        <div class="accordion-content">
          <div class="pos-register-fields">
            <div class="control-group" :class="[errors.has('First Name') ? 'has-error' : '']">
              <label class="required" for="First Name">{{ $t("pos_register.first_name") }}</label>
              <input :disabled=frozen type="text" class="control" name="First Name" v-validate="'required'" v-model="inputs.firstName">
              <span class="control-error" v-if="errors.has('First Name')">{{ errors.first('First Name') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Last Name') ? 'has-error' : '']">
              <label class="required" for="Last Name">{{ $t("pos_register.last_name") }}</label>
              <input :disabled=frozen type="text" class="control" name="Last Name" v-validate="'required'" v-model="inputs.lastName">
              <span class="control-error" v-if="errors.has('Last Name')">{{ errors.first('Last Name') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Email') ? 'has-error' : '']">
              <label for="Email" :class="{ required:emailRequired }">{{ $t("pos_register.email") }}</label>
              <input :disabled=frozen type="text" class="control" name="Email" v-validate="(emailRequired? 'required' : '') + '|email'" v-model="inputs.email" :readonly="usernameType === 'email'">
              <span class="control-error" v-if="errors.has('Email')">{{ errors.first('Email') }}</span>
            </div><div class="control-group" :class="[errors.has('Phone') ? 'has-error' : '']">
              <label for="Phone" :class="{ required:phoneRequired }">{{ $t("pos_register.phone") }}</label>
              <input :disabled=frozen type="text" class="control" name="Phone" v-validate="(phoneRequired? 'required' : '') + '|numeric'" v-model="inputs.phone" :readonly="usernameType === 'phone'">
              <span class="control-error" v-if="errors.has('Phone')">{{ errors.first('Phone') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Password') ? 'has-error' : '']">
              <label for="Password" class="required">{{ $t("pos_register.password") }}</label>
              <input :disabled=frozen type="password" class="control" name="Password" v-validate="'required|min:8'" v-model="inputs.password">
              <span class="control-error" v-if="errors.has('Password')">{{ errors.first('Password') }}</span>
            </div>
            <div class="control-group" :class="[errors.has('Confirm Password') ? 'has-error' : '']">
              <label for="Confirm Password" class="required">{{ $t("pos_register.confirm_password") }}</label>
              <input :disabled=frozen type="password" class="control" name="Confirm Password" v-validate="'required|pwdVerifier:' + inputs.password" v-model="inputs.confirmPassword">
              <span class="control-error" v-if="errors.has('Confirm Password')">{{ errors.first('Confirm Password') }}</span>
            </div>
          </div>
        </div>
        <p class="fs-14px text-center" style="margin:20px 0">
          <span class=inlineFlex>
            <input v-validate="'required'" name=Agreement type=checkbox style="width:auto;margin-right:10px" /><span>{{ $t('pos_register.agreement') }}</span>
          </span>
          <br />
          <span>{{ $t('pos_register.term') }}</span>&#160;{{ $t('general.and') }}&#160;<span>{{ $t('pos_register.privacy') }}</span>
        </p>
        <div class="pos-action text-center">
          <button class="btn btn-pos-primary btn-lg" :disabled="frozen || errors.count() > 0">{{ $t("pos_register.button_title") }}</button>
        </div>
      </form>
      </template>
    </div>
  </div>
  <mobile-header v-if=isMobile @back=action.toLogin header="Register">
    <template #icon={icon}>
    </template>
  </mobile-header>
</div>
</template>

<script>
import { APP as getApp } from './../../store/getters'
import { mapGetters } from 'vuex'
import { register, createOTP, verifyOTP } from '@/api/auth'

export default {
   name:'PosRegister'
  ,data() {
    const $ = this
    return {
       registrationCode:null
      ,registrationStep:0
      ,usernameType:null
      ,requestedBy:null
      ,phoneToken:null
      ,trxID:null
      ,frozen:null
      ,states:{
         email:{ readonly:null }
        ,phone:{ readonly:null }
      }
      ,inputs:{
         outletName:null
        ,address:null
        ,state:null
        ,city:null
        ,postCode:null
        ,firstName:null
        ,lastName:null
        ,email:null
        ,phone:null
        ,password:null
        ,confirmPassword:null
      }
      ,mobile:{
        inputs:[
           { type:'text', name:'Outlet Name', model:'outletName'
            ,validator:'required', placeholder:'pos_register.name'
          }
          ,{ type:'text', name:'Address', model:'address'
            ,validator:'required', placeholder:'pos_register.address'
          }
          ,{ type:'text', name:'State', model:'state'
            ,validator:'required', placeholder:'pos_register.state'
          }
          ,{ type:'text', name:'City', model:'city'
            ,validator:'required', placeholder:'pos_register.city'
          }
          ,{ type:'text', name:'Post Code', model:'postCode'
            ,validator:'required|numeric|max:5', placeholder:'pos_register.postcode'
          }
          ,{ type:'text', name:'First Name', model:'firstName'
            ,validator:'required', placeholder:'pos_register.first_name'
          }
          ,{ type:'text', name:'Last Name', model:'lastName'
            ,validator:'required', placeholder:'pos_register.last_name'
          }
          ,{ type:'text', name:'Email', model:'email'
            ,validator:'required|email', placeholder:'pos_register.email'
          }
          ,{ type:'text', name:'Phone', model:'phone'
            ,validator:'required|numeric', placeholder:'pos_register.phone'
          }
          ,{ type:'password', name:'Password', model:'password'
            ,validator:'required|min:8', placeholder:'pos_register.password'
          }
          ,{ type:'password', name:'Confirm Password', model:'confirmPassword'
            , validator:'', placeholder:'pos_register.confirm_password'
          }
        ]
      }
      ,action:{
         register() {
          if($.frozen) return;
          $.$validator.validateAll().then(result => {
            if(!result) return;
            $.frozen = true
            result = $.inputs
            register(result.password, result.firstName, result.lastName, result.email, result.phone, $.usernameType, {
              name:result.outletName, city:result.city, state:result.state, address:result.address, postCode:result.postCode
            }).then(response => {
                $.frozen = null
                if((response = response.data).status) {
                  $.$toast.success(response.message, {
                     position:'top-right'
                    ,duration:5000
                  })
                  $.registrationStep = 0
                  $.$router.replace({ name:'pos_login' })
                } else
                  $.$toast.error(response.message, {
                     position:'top-right'
                    ,duration:7500
                  })
              }).catch(e => {
                $.frozen = null
                console.log(e)
                $.$toast.error('Registration was failed', {
                   position:'top-right'
                  ,duration:7500
                })
              })
          })
        }
        ,createOTP() {
          if($.frozen) return;
          $.$validator.validate().then(result => {
            if(!result) return;
            $.frozen = true
            if($.requestedBy.includes('@')) {
              $.usernameType = 'email'
            } else {
              $.usernameType = 'phone'
              let v = $.requestedBy
              if('IDR' === window.pos_currency_code)
                $.requestedBy = 0 + v.substring(v.indexOf('8'))
            }
            let position = $.isMobile? 'top' : 'top-right'
            createOTP($.requestedBy, $.usernameType, 'register')
              .then(response => {
                $.frozen = null
                let v
                if((v = (response = response.data).status)) {
                  $.registrationStep = 1
                  if((v = response.trxid))
                    $.trxID = v
                  if((v = response.token))
                    $.phoneToken = v
                  $.$toast.success(response.message, { position, duration:5000 })
                }
                else
                  $.$toast.error(response.message, { position, duration:5000 })
              })
              .catch(e => {
                $.frozen = null
                console.log(e)
                $.$toast.error('Request was failed', { position, duration:7500 })
              })
          })
        }
        ,verifyOTP() {
          if($.frozen) return;
          $.$validator.validateAll().then(result => {
            if(!result) return;
            $.frozen = true
            if('email' === $.usernameType) {
              result = verifyOTP($.requestedBy, $.usernameType, 'register', $.registrationCode)
            } else
            if('phone' === $.usernameType) {
              result = verifyOTP($.requestedBy, $.usernameType, 'register', $.phoneToken + $.registrationCode, $.trxID)
            } else {
              console.log('Unknown username type')
              return;
            }
            let position = $.isMobile? 'top' : 'top-right'
            result.then(response => {
                $.frozen = null
                if((response = response.data).status) {
                  $.$toast.success(response.message, { position, duration:5000 })
                  switch($.usernameType) {
                    case 'email': $.inputs.email = $.requestedBy
                      break;
                    case 'phone': $.inputs.phone = $.requestedBy
                      break;
                  }
                  if($.isMobile) {
                    $.states[ $.usernameType ].readonly = true
                    Promise.resolve($.registrationStep = 2)
                      .then(() => {
                        $.$validator.validate('Agreement')
                      })
                  } else
                    Promise.resolve($.registrationStep = 2)
                      .then(() => {
                        $.action.initAccordion()
                        $.$validator.validate('Agreement')
                      })
                } else {
                  $.$toast.error(response.message, { position, duration:7500 })
                  $.$refs.registrationCodeInput.setSelectionRange(0, $.registrationCode.length)
                }
              })
              .catch(e => {
                $.frozen = null
                console.log(e)
                $.$toast.error('Verifying registration code was failed', { position, duration:7500 })
              })
          })
        }
        ,initAccordion() {
          let accordions = document.getElementsByClassName("accordion");
          for(let i = 0; i < accordions.length; i++) {
            let content = accordions[i].nextElementSibling;
            content.style.maxHeight = content.scrollHeight + "px";
            accordions[i].onclick = function() {
              this.classList.toggle('is-open');
              let content = this.nextElementSibling
              content.style.maxHeight = content.style.maxHeight? null : content.scrollHeight + "px"
            }
          }
        }
        ,toLogin() {
          if(window.history.length > 1)
            $.$router.back()
          else
            $.$router.replace({ name:'pos_login' })
        }
        ,checkReadOnly:(v) => (v = $.states[v]) && v.readonly
      }
    }
  }
  ,computed:{
    ...mapGetters({ isMobile:getApp.ISMOBILEONLY })
    ,height:() => $(window).height() + 'px'
    ,phoneRequired() { return this.usernameType === 'phone' }
    ,emailRequired() { return this.usernameType === 'email' }
  }
  ,mounted() {
    this.$watch('inputs.password', () => {
      const R = 'required'
      let x = this.mobile.inputs, e
      for(let n = x.length; --n > -1; )
        if('confirmPassword' === (e = x[n]).model) {
          e.validator = R + '|pwdVerifier:' + this.inputs.password
          break;
        }
    })
  }
}
</script>