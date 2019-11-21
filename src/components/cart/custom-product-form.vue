<template>
  <div :class="getIsMobileOnly ? 'margin' : 'pos-discount-form'" v-if="isUserLogin">
    <form autocomplete="off" @submit.prevent="customAction" method="POST">
      <div class="page-content">
        <div class="form-container">
          <div class="pos-discount-fields">
            <div class="control-group" :class="[this.errors.has('name') ? 'has-error' : '']">
              <label
                for="name"
                class="required"
                v-if="!getIsMobileOnly"
                v-text="$t('pos_home.navtop.entry_product_name')"
              ></label>
              <input
                type="text"
                :class="getIsMobileOnly ? 'form-input-line':'control'"
                name="name"
                v-validate="'required'"
                v-bind:style="{ 'width': width }"
                v-model="name"
                :placeholder="$t('pos_home.navtop.entry_product_name')"
              />
              <span
                class="control-error"
                v-if="this.errors.has('name')"
              >{{ this.errors.first('name') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('price') ? 'has-error' : '']">
              <label
                for="price"
                class="required"
                v-if="!getIsMobileOnly"
                v-text="$t('pos_home.navtop.entry_price')"
              ></label>
              <input
                type="text"
                :class="getIsMobileOnly ? 'form-input-line top' : 'control'"
                name="price"
                v-validate="'required|decimal:2'"
                v-bind:style="{ 'width': width }"
                v-model="price"
                :placeholder="$t('pos_home.navtop.entry_price')"
              />
              <span
                class="control-error"
                v-if="this.errors.has('price')"
              >{{ this.errors.first('price') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('quantity') ? 'has-error' : '']">
              <label
                for="quantity"
                class="required"
                v-if="!getIsMobileOnly"
                v-text="$t('pos_home.navtop.entry_quantity')"
              ></label>
              <input
                type="number"
                :class="getIsMobileOnly ? 'form-input-line top' : 'control'"
                name="quantity"
                v-validate="'required|numeric'"
                v-bind:style="{ 'width': width }"
                v-model="quantity"
                :placeholder="$t('pos_home.navtop.entry_quantity')"
              />
              <span
                class="control-error"
                v-if="this.errors.has('quantity')"
              >{{ this.errors.first('quantity') }}</span>
            </div>

            <!-- <div class="control-group" :class="[this.errors.has('image') ? 'has-error' : '']">
                            <label for="image" class="required croppa" v-text="$t('pos_home.navtop.entry_product_image')"></label>
                            <croppa class="control-croppa" v-model="myCroppa"></croppa>
            </div>-->

            <div class="pos-action text-left">
              <button
                class="btn btn-lg btn-pos-primary"
                :class="{'action-btn-cart': getIsMobileOnly}"
                type="submit"
                :text="$t('pos_home.navtop.button_cart')"
              >{{ $t('pos_home.navtop.button_cart') }}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import Vue from "vue";
// import Croppa from "vue-croppa";
// Vue.use(Croppa);
// // If your build tool supports css module
// import "vue-croppa/dist/vue-croppa.css";

import { APP as getApp } from "@/store/getters";
export default {
  props: ["pos_current_cart", "pos_carts", "localObject"],
  data() {
    return {
      width: "90%",
      name: "",
      price: "",
      quantity: "",
      user_id: 0,
      success_custom_product: this.$t("pos_home.navtop.success_add_to_cart")
    };
  },
  computed: {
    isUserLogin() {
      this.checkUserLogin();

      return this.user_id;
    },
    getIsMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  methods: {
    checkUserLogin() {
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
      }
    },
    customAction() {
      var thisthis = this;
      var cart_products = {};
      this.$root.toggleButtonDisable(true);

      this.$validator.validateAll().then(result => {
        if (result) {
          if (parseInt(this.quantity) > 0 && parseFloat(this.price) > 0) {
            if (thisthis.pos_carts[thisthis.pos_current_cart]) {
              $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
                key,
                product
              ) {
                product.active = false;
                cart_products[key] = product;
              });
              this.$set(
                thisthis.pos_carts,
                thisthis.pos_current_cart,
                cart_products
              );

              var custom_product = {
                active: true,
                id: new Date().getTime(),
                sku: "custom",
                type: "simple",
                weight: 0,
                total_weight: 0,
                name: thisthis.name,
                tax_category_id: 0,
                tax_percent: 0,
                tax_amount: 0,
                base_tax_amount: 0,
                qty_ordered: thisthis.quantity,
                price: parseFloat(thisthis.price).toFixed(2),
                base_price: parseFloat(thisthis.price).toFixed(2),

                f_price:
                  window.pos_currency_symbol +
                  parseFloat(thisthis.price).toFixed(2),

                special_price: "NaN",
                base_special_price: "NaN",

                base_total: parseFloat(
                  thisthis.price * thisthis.quantity
                ).toFixed(2),

                total: parseFloat(thisthis.price * thisthis.quantity).toFixed(
                  2
                ),

                f_total:
                  window.pos_currency_symbol +
                  parseFloat(thisthis.price * thisthis.quantity).toFixed(2)
              };

              let index = Object.keys(
                thisthis.pos_carts[thisthis.pos_current_cart]
              ).length;

              this.$set(
                thisthis.pos_carts[thisthis.pos_current_cart],
                index,
                custom_product
              );

              EventBus.$emit("setLocalForage", {
                key: "pos_carts",
                data: JSON.stringify(thisthis.pos_carts)
              });

              this.$toast.success(this.success_custom_product, {
                position: "top-right",
                duration: 2000
              });
              if (this.getIsMobileOnly) {
                this.$router.push({ name: "pos_home" });
              } else {
                this.$root.hideCommonModal("addCustomProduct");
                this.$root.toggleButtonDisable(false);
              }
            } else {
              this.$toast.error("Warning: Choose cart first!", {
                position: "top-right",
                duration: 2000
              });
              if (this.getIsMobileOnly) {
                this.$router.push({ name: "pos_home" });
              } else {
                this.$root.hideCommonModal("addCustomProduct");
                this.$root.toggleButtonDisable(false);
              }
            }
          } else {
            this.$toast.error(
              "Warning: Please provide the correct quantity and price for the custom product!",
              {
                position: "top-right",
                duration: 2000
              }
            );

            this.$root.toggleButtonDisable(false);
          }
        } else {
          this.$root.toggleButtonDisable(false);
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.margin {
  margin-left: 10%;
  margin-right: 5%;
  margin-top: 10%;
  .top {
    margin-top: 3%;
  }
}

.action-btn-cart {
  width: 80%;
  position: fixed;
  bottom: 20px;
}
</style>