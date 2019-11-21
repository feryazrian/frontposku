<template>
  <div id="login-pos" :class="getIsMobileOnly ? 'user-login-mobile' : 'user-login'" class="pos-container" v-bind:style="{'height': height}">
    <div class="pos-login-content">
      <!-- top-background -->
      <div class="top-head-content">
        <!-- {{ configData.top_heading }} -->
      </div>

      <div :class="getIsMobileOnly ? '': 'login-form-content'">
        <form @submit.prevent="login" method="POST">
          <div class="pos-login-text mt-4 mb-3" v-if="!getIsMobileOnly">{{ configData.top_sub_heading }}</div>
          <div :class="{'custom-img' : getIsMobileOnly}">
            <span :class="{'pos-img-login' : getIsMobileOnly }"></span>
          </div>

          <div :class="getIsMobileOnly ? 'login-fields container' : 'pos-login-fields'">
            <div class="control-group" :class="[errors.has('username') ? 'has-error' : '']">
              <label
                for="username"
                class="required"
                v-if="!getIsMobileOnly"
              >{{ $t("pos_login.username") }}</label>
              <input
                type="text"
                class="form-control"
                name="username"
                v-model="username"
                v-validate="'required'"
                :placeholder="$t('pos_login.username')"
              />
              <span
                class="control-error"
                v-if="errors.has('username')"
              >{{ errors.first('username') }}</span>
            </div>

            <div class="control-group" :class="[errors.has('password') ? 'has-error' : '']">
              <label
                for="password"
                class="required"
                v-if="!getIsMobileOnly"
              >{{ $t("pos_login.password") }}</label>
              <input
                type="password"
                class="form-control"
                name="password"
                v-validate="'required|min:6'"
                v-model="password"
                :placeholder="$t('pos_login.password')"
              />
              <span
                class="control-error"
                v-if="errors.has('password')"
              >{{ errors.first('password') }}</span>
            </div>

            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                name="remember_password"
                value="1"
                id="input-remember-password"
                v-model="remember"
              />
              <label
                :class="getIsMobileOnly ? 'remember-pass' : 'form-check-label'"
                for="input-remember-password"
              >{{ $t("pos_login.remember_password") }}</label>
            </div>
            
            <div class="pos-action text-center mt-3">
              <button
                class="btn btn-pos-primary btn-lg"
                :class="{'btn-block': getIsMobileOnly}"
                type="submit"
              >{{ $t("pos_login.button_title") }}</button>
              <div class="pos-forgot-password-link text-center"></div>
            </div>
          </div>

          <div class="text-center" :class="{'footer-login': getIsMobileOnly}">
            {{ $t("pos_login.registerLink") }}&#160;
            <router-link :to="{ name:'pos_register' }">{{ $t("pos_register.mainTitle") }}</router-link>.
          </div>
        </form>
      </div>

      <div class="text-center footer-login" v-if="getIsMobileOnly">
        {{ $t("pos_login.registerLink") }}&#160;
        <router-link :to="{ name:'pos_register' }" class="text-primary">{{ $t("pos_register.mainTitle") }}</router-link>.
      </div>

      <!-- <div class="footer-note">
        <div class="bottom-head-content">{{ configData.footer_content }}</div>
        <div class="footer-note-link" v-html="$t('pos_login.footer_note', { url: 'https://bagisto.com/en/' })"></div>
      </div>-->
    </div>
  </div>
</template>

<script>

import { loginUser } from '@/api/auth'
import { config } from '@/api'
import { APP as getApp } from "./../../store/getters"

export default {
  data() {
    return {
      username: "",
      password: "",
      remember: 1,
      pos_carts: [],
      pos_current_cart: 0,
      has_error: false,
      configData: Object,
      height: $(window).height() + "px"
    }
  },
  mounted: function() {
    this.getPosConfig()
  },
  computed: {
    getIsMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  methods: {
    getPosConfig: function() {
      config()
        .then( res => this.configData = res.data.config )
        .catch(e => {
          console.error(e)
          this.has_error = true
        })
    },

    login: function() {
      this.toggleButtonDisable(true);
      this.$validator.validateAll().then(result => {
        if (result) {
          loginUser(this.username, this.password, this.remember)
            .then(response => {
              if (!response.data.status) {
                this.toggleButtonDisable(false)

                this.$toast.error(response.data.message, {
                  position: "top-right",
                  duration: 2000
                })
              } else {
                EventBus.$emit("clearLocalForage");
                this.pos_carts[0] = {};
                const authData = response.data.auth_data
                // store auth data to vuex
                this.$store.dispatch("login", authData)

                this.$root.$setItem("pos_carts", JSON.stringify(this.pos_carts))
                this.$root.$setItem("pos_current_cart", this.pos_current_cart)
                this.$root.$setItem("pos_cashier", JSON.stringify(response.data.user_data))
                this.$root.$setItem("pos_drawer", JSON.stringify(response.data.drawer_data))

                //push to home
                this.$router.push({ name: "pos_home" })
                
                // flash message
                this.$toast.success(response.data.message, { position: "top-right", duration: 2000 })
              }
            })
            .catch(e =>  {
              console.log("store data failed", e);               
              this.toggleButtonDisable(false)
            });
        } else {
          this.toggleButtonDisable(false)
        }
      });
    },
    toggleButtonDisable(value) {
      var buttons = document.getElementsByTagName("button")
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = value;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#login-pos {
  padding-top: 0rem;

  .footer-login {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 1rem 0.25rem;
    background-color: #e8e8e8;
  }
}

.login-fields {
  margin-top: 10%;
}

.remember-pass {
  margin-top: 2.5px;
  color: #33333370;
}
</style>