<template>
  <div class="pos-discount-form" :class="{'pos-request': isMobileOnly}" v-if="isUserLogin">
    <form autocomplete="off" @submit.prevent="requestAction" method="POST">
      <div class="page-content">
        <div class="form-container">
          <input type="hidden" name="request_id" v-model="request_id" />
          <input type="hidden" name="product_id" v-model="product_id" />

          <div :class="isMobileOnly ? 'modal-left-mobile' : 'modal-left-content'">
            <div class="product-thumb">
              <img
                v-if="requested_product.base_image.small_image_url"
                :src="requested_product.base_image.small_image_url"
              />
              <label v-else class="product-placeholder"></label>
            </div>
          </div>
          <div :class="isMobileOnly? 'modal-right-mobile' : 'modal-right-content'">
            <div class="product-name">{{ requested_product.name }}</div>

            <div class="pos-discount-fields">
              <div
                class="control-group"
                :class="[this.errors.has('requested_quantity') ? 'has-error' : '']"
              >
                <label
                  for="requested_quantity"
                  class="required"
                  v-text="$t('pos_product.menu_content.low_stock.entry_required_qty')"
                ></label>
                <input
                  type="text"
                  class="control"
                  name="requested_quantity"
                  v-validate="'required|numeric|max:5'"
                  v-bind:style="{ 'width': width }"
                  v-model="requested_quantity"
                />
                <span
                  class="control-error"
                  v-if="this.errors.has('requested_quantity')"
                >{{ this.errors.first('requested_quantity') }}</span>
              </div>

              <div class="control-group" :class="[this.errors.has('price') ? 'has-error' : '']">
                <label
                  for="price"
                  class="required"
                  v-text="$t('pos_product.menu_content.low_stock.entry_required_price')"
                ></label>
                <input
                  type="text"
                  class="control"
                  name="price"
                  v-validate="'required|numeric|max:10'"
                  v-bind:style="{ 'width': width }"
                  v-model="price"
                />
                <span
                  class="control-error"
                  v-if="this.errors.has('price')"
                >{{ this.errors.first('price') }}</span>
              </div>

              <div class="control-group" :class="[this.errors.has('modal') ? 'has-error' : '']">
                <label
                  for="modal"
                  v-text="$t('pos_product.menu_content.low_stock.entry_required_modal')"
                ></label>
                <input
                  type="text"
                  class="control"
                  name="modal"
                  v-validate="'numeric|max:10'"
                  v-bind:style="{ 'width': width }"
                  v-model="modal"
                />
                <span
                  class="control-error"
                  v-if="this.errors.has('modal')"
                >{{ this.errors.first('modal') }}</span>
              </div>

              <div
                class="control-group hide"
                :class="[this.errors.has('supplier_id') ? 'has-error' : '']"
              >
                <label
                  for="type"
                  v-text="$t('pos_product.menu_content.low_stock.entry_request_to_supplier')"
                ></label>
                <select name="supplier_id" class="control" v-model="supplier_id">
                  <option
                    value
                    :selected="'selected'"
                  >{{ $t('pos_product.menu_content.low_stock.entry_select') }}</option>
                </select>
                <span
                  class="control-error"
                  v-if="this.errors.has('supplier_id')"
                >{{ this.errors.first('supplier_id') }}</span>
              </div>

              <!-- <div class="control-group" :class="[this.errors.has('comment') ? 'has-error' : '']">
                                <label for="comment" class="required" v-text="$t('pos_product.menu_content.low_stock.entry_comment')"></label>
                                <textarea class="control" name="comment" v-validate="'required|max:250'" v-model="comment"  v-bind:style="{ 'width': width }"> </textarea>
                                <span class="control-error" v-if="this.errors.has('comment')">{{ this.errors.first('comment') }}</span>
              </div>-->

              <div class="pos-action text-center">
                <button
                  class="btn btn-lg btn-pos-primary"
                  type="submit"
                  :text="$t('pos_product.menu_content.low_stock.button_add')"
                >{{ $t('pos_product.menu_content.low_stock.button_add') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { APP as getApp } from "@/store/getters";
import { updateStockQuantity } from "@/api/product";

export default {
  props: ["request_id", "request_data", "requested_product", "localObject"],
  data() {
    return {
      width: "90%",
      product_id: this.requested_product.id,
      options: {},
      requested_quantity: "",
      price: "",
      modal: "",
      supplier_id: "",
      // comment: '',
      user_id: 0,
      formAction: "",
      pos_offline: 0
    };
  },
  computed: {
    isUserLogin() {
      this.checkUserLogin();
      // this.pos_offline = this.$root.$root.offline;
      return this.user_id;
    },
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  mounted() {
    // this.checkUserLogin();
    // this.fillStockData();
  },
  methods: {
    checkUserLogin() {
      this.pos_offline = this.$root.$root.offline;
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
      }
    },
    requestAction() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        this.$toast.error(
          "Warning: You can not perform this action in offline mode!",
          {
            position: "top-right",
            duration: 2000
          }
        );
      } else {
        var thisthis = this;

        // thisthis.formAction = "api/pos/auth/updateStockQuantity";
        // if (!thisthis.request_id) {
        //     thisthis.formAction = '/api/pos/auth/addStockRequest';
        // } else {
        //     thisthis.formAction = '/api/pos/auth/editStockRequest';
        // }

        this.$root.toggleButtonDisable(true);
        this.$validator.validateAll().then(result => {
          if (result) {
            /*
            this.$http.post(thisthis.formAction, {
              // request_id: thisthis.request_id,
              product_id: thisthis.product_id,
              // supplier_id: thisthis.supplier_id,
              qty: thisthis.requested_quantity,
              outlet_id: this.localObject.pos_cashier.outlet_id,
              purchase_price: thisthis.modal,
              selling_price: thisthis.price
              // comment: thisthis.comment,
              // user_id: thisthis.user_id
            })
            */
           
              updateStockQuantity({
                product_id: thisthis.product_id,
                qty: thisthis.requested_quantity,
                outlet_id: this.localObject.pos_cashier.outlet_id,
                purchase_price: thisthis.modal,
                selling_price: thisthis.price
              })
              .then(response => {
                if (!response.data.status) {
                  console.log("responseData", response.data);
                  this.$toast.error(response.data.message, {
                    position: "top-right",
                    duration: 2000
                  });

                  this.$root.toggleButtonDisable(false);
                } else {
                  this.$toast.success(response.data.message, {
                    position: "top-right",
                    duration: 2000
                  });

                  this.$root.hideCommonModal("requestQuantity");
                  this.$root.toggleButtonDisable(false);

                  EventBus.$emit("getRequestedLowStockProducts");
                  // this.$router.push({name: response.data.route});
                  // this.$router.replace({name: this.$route.name});
                }
              })
              .catch(e => {
                this.$toast.error(e, {
                  position: "top-right",
                  duration: 2000
                });
                this.$root.toggleButtonDisable(false);
              });
          } else {
            this.$root.toggleButtonDisable(false);
          }
        });
      }
    }
    // fillStockData() {
    //     if (this.request_id) {
    //         console.log('fillStockData')
    //         this.product_id = this.requested_product.id;
    //         this.options = this.request_data.options;
    //         this.requested_quantity = this.request_data.requested_quantity;
    //         this.supplier_id = this.request_data.supplier_id;
    //         // this.comment = this.request_data.comment;
    //     }
    // }
  }
};
</script>

<style lang="scss" scoped>
.pos-request {
  .control-group {
    label {
      color: #6c757d;
      text-align: left;
    }
    .control {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #ced4da;

      &:hover {
        border-color: #ced4da !important;
      }

      &:focus {
        border-color: #28b318 !important;
      }
    }
  }
}
// .margin {
//   margin-left: 5%;
//   margin-right: 5%;
// }
</style>