<template>
<pos-common-modal :is-open=this.licenceModal.shown :showClose=true>
  <div slot=header>
    <h4>{{ $t('pos_activation.licenceModal.title') }}</h4>
    <div class=activationCloseClickable @click=action.close></div>
  </div>
  <div slot=body>
    <div class=control-group :class="[errors.has('Your Licence') ? 'has-error' : '']">
      <label for="Post Code">{{ $t("pos_activation.licenceModal.placeholderLicence") }} </label>
      <input type=text class=control name="Your Licence" v-validate="'required'" v-model=licenceModal.input />
      <span class="control-error" v-if="errors.has('Your Licence')">{{ errors.first('Your Licence') }}</span>
    </div>
    <div class=text-center>
      <button class="btn btn-pos-primary btn-lg" @click=action.activation>{{ $t('pos_activation.licenceModal.submitText') }}</button>
    </div>
  </div>
</pos-common-modal>
</template>

<script>
import { activation, logout } from '@/api/auth'

export default {
  data() {
    const $ = this
    return {
       licenceModal:{
         shown:true
        ,input:null
      }
      ,action:{
         activation() {
          $.$validator.validateAll().then(result => {
            if(!result) return;
            activation($.licenceModal.input)
              .then(response => {
                if((response = response.data).status) {
                  $.$toast[ 'success' ](response.message, {
                     position:'top-right'
                    ,duration:3000
                  })
                  //$.$root.$forceUpdate()
                  $.$router.replace({ name:'pos_home' })
                } else {
                  $.$toast[ 'error' ](response.message, {
                     position:'top-right'
                    ,duration:7500
                  })
                }
              })
          })
        }
        ,close() {
          $.$getItem('pos_cashier', (e, v) => {
            if(v && (v = JSON.parse(v)))
              logout(v.id)
                .then(response => {
                  if(response.data.route)
                    $.$router.push({ name: response.data.route });
                })
                .catch(e => console.log(e))
            else
              $.$toast[ 'error' ]('Something went wrong while recognizing the user.', {
                 position:'top-right'
                ,duration:7500
              })
          })
        }
      }
    }
  }
}
</script>