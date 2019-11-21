<template>
  <div>
    <div class="product-setting-panel">
      <div
        class="pos-setting-list row-grid-2"
        v-bind:style="{ 'width': isMobileOnly? '100%' : containerWidth }"
      >
        <div
          class="message-alert warning"
          v-if="pos_offline"
        >{{ $t('pos_view.error_offline_mode') }}</div>
        <div class="pos-setting" :class="isMobileOnly? 'page' : 'row-layout'">
          <h3
            :class="{ 'color-primary': isMobileOnly }"
          >{{ $t('pos_product.menu_content.setting.entry_product_setting') }}</h3>
          <hr />

          <div class="pos-product-setting-form" v-if="isUserLogin">
            <form autocomplete="off" @submit.prevent="saveUserLowStock" method="POST">
              <div class="page-content">
                <div class="form-container">
                  <input type="hidden" name="user_id" v-model="user_id" />

                  <div class="pos-setting-fields">
                    <div
                      class="control-group"
                      :class="[this.errors.has('low_stock') ? 'has-error' : '']"
                    >
                      <label
                        for="low_stock"
                        class="required"
                        v-text="$t('pos_product.menu_content.setting.entry_low_stock')"
                      ></label>
                      <input
                        type="text"
                        :class="isMobileOnly ? 'form-control' : 'control'"
                        name="low_stock"
                        v-validate="'required|numeric|max:5'"
                        v-bind:style="{ 'width' : isMobileOnly? '100%' : width }"
                        v-model="low_stock"
                      />
                      <span
                        class="control-error"
                        v-if="this.errors.has('low_stock')"
                      >{{ this.errors.first('low_stock') }}</span>
                    </div>

                    <div class="pos-action text-left">
                      <button
                        class="btn btn-lg btn-pos-primary"
                        :class="{'btn-block': isMobileOnly}"
                        type="submit"
                        :text="$t('pos_product.menu_content.setting.button_done')"
                      >{{ $t('pos_product.menu_content.setting.button_done') }}</button>
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
</template>

<script>
import { APP as getApp } from "@/store/getters";
import { updateUser } from "@/api/user";

export default {
  props: ["localObject"],
  data() {
    return {
      containerWidth: "50%",
      width: "90%",
      user_details: {},
      user_id: 0,
      low_stock: 10,
      pos_offline: 0
    };
  },
  computed: {
    isUserLogin() {
      this.checkUserLogin();
      return this.user_id;
    },
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  mounted() {
    this.fillSettingData();
  },
  methods: {
    checkUserLogin() {
      this.pos_offline = this.$root.$root.offline;
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
        this.user_details = this.localObject.pos_cashier;
      }
    },
    saveUserLowStock() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        window.flashMessages = [
          {
            type: "alert-error",
            message: "Warning: You can not perform this action in offline mode!"
          }
        ];
        this.$root.addFlashMessages();
      } else {
        var thisthis = this;
        this.$root.toggleButtonDisable(true);
        this.$validator.validateAll().then(result => {
          if (result) {
            /*
            this.$http.post("/api/pos/auth/updateUser", {
                user_id: thisthis.user_id,
                low_stock: thisthis.low_stock
              })
            */
            const params = {
              user_id: thisthis.user_id,
              low_stock: thisthis.low_stock
            };
            updateUser(params)
              .then(response => {
                if (!response.data.status) {
                  window.flashMessages = [
                    { type: "alert-error", message: response.data.message }
                  ];
                  this.$root.addFlashMessages();
                  this.$root.toggleButtonDisable(false);
                } else {
                  window.flashMessages = [
                    { type: "alert-success", message: response.data.message }
                  ];
                  this.$root.addFlashMessages();
                  this.$root.toggleButtonDisable(false);

                  this.localObject.pos_cashier.low_stock = thisthis.low_stock;

                  EventBus.$emit("setLocalForage", {
                    key: "pos_cashier",
                    data: JSON.stringify(this.localObject.pos_cashier)
                  });
                }
              })
              .catch(function() {});
          } else {
            this.$root.toggleButtonDisable(false);
          }
        });
      }
    },
    fillSettingData() {
      this.pos_offline = this.$root.$root.offline;
      if (this.user_id && this.user_details.low_stock && !this.pos_offline) {
        this.low_stock = this.user_details.low_stock;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 25px;
}
hr {
  color: #28b318;
}

.product-setting-panel {
  .pos-setting {
    h3 {
      text-align: center;
    }

    hr {
      border-color: #28b318;
    }
  }
}
</style>