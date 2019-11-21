<template>
  <div class="product-requested-panel">
    <div class="nav-product-list">
      <div class="pos-product-container" v-if="isUserLogin">
        <!-- pos offline -->
        <div
          class="message-alert warning"
          v-if="pos_offline"
        >{{ $t("pos_view.error_offline_mode") }}</div>

        <!-- add product -->
        <div :class="isMobileOnly ? 'fixed-btn btn-green-discount' : 'add_product'">
          <div class="add-product-icon" @click="showAddProduct('addProduct')">
            <span v-if="isMobileOnly">{{ $t('pos_product.menu_content.new_product.add_product') }}</span>
            <i v-if="!isMobileOnly" class="fa fa-plus"></i>
          </div>
          <div
            v-if="!isMobileOnly"
            class="add-product-text"
          >{{ $t('pos_product.menu_content.new_product.add_product') }}</div>
        </div>

        <!-- list product -->
        <div
          class="product-list"
          :class="[isMobileOnly ? 'background-light' : 'row-grid-5' ]"
          v-if="total_product != 0"
        >
          <div
            class="product-layout"
            v-for="(product) in pos_products"
            :key="product.id"
            @click="updateProductStock(product)"
          >
            <div class="product-thumb">
              <img
                v-if="product.base_image.small_image_url"
                :src="product.base_image.small_image_url"
              />
              <label v-else class="product-placeholder"></label>
            </div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-quantity">
              <span
                class="low-quantity"
              >{{ getRemainingQty(product) }} {{ $t("pos_product.menu_content.low_stock.text_left") }}</span>
            </div>
          </div>
        </div>
        <div v-else class="message-alert danger">{{ $t("pos_product.error.no_lowstock_product") }}</div>
      </div>
    </div>

    <!-- add product -->
    <pos-common-modal id="addProduct" :is-open="this.$root.posCommonModal.addProduct">
      <h4 slot="header">{{ $t('pos_product.menu_content.new_product.add_product') }}</h4>
      <div slot="body">
        <add-product :localObject="localObject"></add-product>
      </div>
    </pos-common-modal>

    <!-- update product -->
    <pos-common-modal id="requestQuantity" :is-open="this.$root.posCommonModal.requestQuantity">
      <h4 slot="header">{{ $t('pos_product.menu_content.low_stock.request_product') }}</h4>

      <div slot="body">
        <request-form
          :request_id="request_id"
          :request_data="request_data"
          :requested_product="requested_product"
          :localObject="localObject"
        ></request-form>
      </div>
    </pos-common-modal>
  </div>
</template>

<script>
import { getOutletProducts } from "@/api/product";
import { APP as getApp } from "@/store/getters";

export default {
  props: ["localObject"],
  data() {
    return {
      pos_products: [],
      total_products: 0,
      total_product: 0,
      page: 1,
      user_id: 0,
      totalPage: 0,
      pos_offline: 0,
      request_id: 0,
      request_data: {},
      requested_product: {}
    };
  },
  created() {
    this.loadProducts();
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
  methods: {
    showAddProduct() {
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
        this.$root.hideCommonModal("addProduct");
        EventBus.$emit("showCommonModal", "addProduct");
      }
    },

    checkUserLogin() {
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
      }
    },

    loadProducts() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        if (Object.keys(this.localObject.pos_products).length > 0) {
          this.total_product = Object.keys(
            this.localObject.pos_products
          ).length;
          this.pos_products = this.localObject.pos_products;
        } else {
          this.pos_products = [];
          this.total_product = 0;
        }
      } else {
        /*
        this.$http.get("/api/pos/auth/outletProducts", {
            params: {
              page: this.page,
              outlet_id: this.localObject.pos_cashier.outlet_id,
              inventory_source_id: this.localObject.pos_cashier
                .inventory_source_id,
              filter_status: true,
              filter_quantity: this.localObject.pos_cashier.low_stock
                ? this.localObject.pos_cashier.low_stock
                : 10,
              limit: 3
            }
          })
        */
        const params = {
          page: this.page,
          outlet_id: this.localObject.pos_cashier.outlet_id,
          inventory_source_id: this.localObject.pos_cashier.inventory_source_id,
          filter_status: true,
          // filter_quantity: this.localObject.pos_cashier.low_stock ? this.localObject.pos_cashier.low_stock : 10,
          limit: 10
        };

        getOutletProducts(params)
          .then(response => {
            if (response.data.data && response.data.data.length > 0) {
              this.total_product += response.data.data.length;
              this.totalPage = response.data.meta.last_page;
              this.total_products = response.data.meta.total;

              this.pos_products = this.pos_products.concat(response.data.data);
              // console.log(this.pos_products)

              if (this.totalPage > this.page) {
                this.page += 1;
                this.loadProducts();
              } else {
                // console.log('list-products', thisthis.pos_products);
                EventBus.$emit("setLocalForage", {
                  key: "pos_products",
                  data: JSON.stringify(this.pos_products)
                });
              }
            } else {
              this.total_product = 0;
              EventBus.$emit("setLocalForage", {
                key: "pos_products",
                data: JSON.stringify(this.pos_products)
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },

    getRemainingQty(product) {
      let product_qty = JSON.parse(product.quantity);
      let remaining_quantity = product_qty[product.id];
      return remaining_quantity;
    },

    updateProductStock(product) {
      // console.log("product", product)
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
        this.request_id = 0;
        this.request_data = {};
        this.requested_product = product;
        this.$root.hideCommonModal("requestQuantity");
        // this.$root.hideCommonModal("updateProduct");
        // this.getSingleRequestedProduct(product);
        setTimeout(function() {
          EventBus.$emit("showCommonModal", "requestQuantity"); //run showCommonModal requestQuantity
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// Button Add Discount
.fixed-btn {
  left: 20px;
  background: white;
  width: 90%;
  position: fixed;
  bottom: 20px;
}

.btn-green-discount {
  width: 89%;
  color: #28b318;
  font-size: inherit;
  border-radius: 3px;
  border: 1px solid #28b318;
  background-color: #ffffff;
  padding: 14px;
  text-align: center;
}

#addProduct {
  h4 {
    color: #28b318;
  }
}
</style>