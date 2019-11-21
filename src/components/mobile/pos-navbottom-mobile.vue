<template>
  <div class="pos-navbar-bottom">
    <div class="pos-nav-bottom-customer" :class="{'have-customer':this.localObject.pos_cart_customer.name}">
        <button @click="changeCustomer">
          <span v-if="this.localObject.pos_cart_customer.name"
            :title="this.localObject.pos_cart_customer.name">
              <i class="fa fa-user"></i>
              <strong>{{ nameInitial }}</strong>
            </span>
          <i v-else class="fa fa-user-plus"></i>
        </button>
    </div>
    <div class="pos-nav-bottom-product">
        <button @click="addCustomProduct">
            <i class="add-product"></i>
        </button>
    </div>
    <div class="pos-nav-bottom-cart">
        <button @click="showCartContent">
            <i class="fa fa-shopping-cart"></i>
        </button>
    </div>
    <div class="pos-nav-bottom-payment">
        <button @click="payForCart" :disabled="cartEmpty">
            <span>{{ $t('pos_home.navbottom.pay_now') }}</span>
            <p v-if="!cartEmpty">{{ currency }} {{ parseFloat(sub_total).toLocaleString(getLocale) }}</p>
        </button>
    </div>
  </div>
</template>

<script>
import { APP as getApp } from "@/store/getters";

export default {
  props: [
    "pos_carts",
    "pos_current_cart",
    "showMinusBtn",
    "cartCustomer",
    "localObject"
  ],
  data() {
    return {
      pos_offline: 0,
      customer_id: 0,
      current_opration: "qty",
      currency: "",
      sub_total: 0,
      cartEmpty: true,
      text_cart_empty: this.$t("pos_home.pos_cart.error.error_cart_empty"),
      text_customer_empty: this.$t(
        "pos_home.pos_cart.error.error_customer_empty"
      )
    };
  },
  computed: {
    nameInitial() {
      var name = this.localObject.pos_cart_customer.name;
      var initials = name.match(/\b\w/g) || [];
      return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    },
    getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) }
  },
  watch: {
    cartCustomer: function(updated_customer) {
      this.cartCustomer = updated_customer;
      this.localObject.pos_cart_customer = updated_customer;
      EventBus.$emit("setLocalForage", {
        key: "pos_cart_customer",
        data: JSON.stringify(updated_customer)
      });
    }
  },
  beforeDestroy () {
      EventBus.$off('onshowCartContent');
      EventBus.$off('onCartUpdate');
  },
  created() {
    EventBus.$on("onshowCartContent", () => {
      this.updateCartTotal();
    });
    EventBus.$on("onCartUpdate", () => {
      this.updateCartTotal();
    });
  },
  mounted() {
    this.currency = window.pos_currency_symbol;
    this.updateCartTotal();
  },
  methods: {
    updateCartTotal() {
      var thisthis = this;
      var cart_sub_total = 0;

      thisthis.cartEmpty = true;

      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        key,
        product
      ) {
        thisthis.cartEmpty = false;
        cart_sub_total = cart_sub_total + parseFloat(product.total);
      });
      
      thisthis.sub_total = parseFloat(cart_sub_total).toFixed(2);
    },
    checkOrderProduct(orderItems, product) {
      var orderProductQty = 0;
      $.each(orderItems, function(key, orderProduct) {
        if (parseInt(orderProduct.id) == parseInt(product.id)) {
          orderProductQty = orderProductQty + orderProduct.qty_ordered;
        }
      });
      return orderProductQty;
    },
    changeCustomer() {
      this.$router.push({ name: "pos_customer" });
    },
    addCustomProduct() {
      this.$router.push({ name: "pos_add_custom_product", params: {
        'pos_current_cart': this.pos_current_cart,
        'pos_carts': this.pos_carts,
        'localObject': this.localObject}
      });
    },
    showCartContent() {
      this.$router.push({ name: "pos_cart_details", params: {'localObject':this.localObject} });
    },
    payForCart() {
      var thisthis = this;
    
      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        product_key,
        cartProduct
      ) {
        var obj
        if (cartProduct.type == "configurable") {
          obj = $.grep(thisthis.localObject.pos_products, function(obj) {
            if (obj.type == "configurable") {
              let variation_qty = JSON.parse(obj.quantity);
              if (variation_qty[cartProduct.id]) {
                return obj;
              }
            }
          })[0];
        } else {
          if (cartProduct.sku == "custom") {
            cartProduct.quantity = JSON.stringify({
              [cartProduct.id]: cartProduct.qty_ordered
            });
            obj = cartProduct;
          } else {
            obj = $.grep(thisthis.localObject.pos_products, function(obj) {
              return obj.id === cartProduct.id;
            })[0];
          }
        }

        var product_qty = JSON.parse(obj.quantity);
        var remaining_quantity = product_qty[cartProduct.id];

        if (Object.keys(thisthis.localObject.pos_offline_orders).length > 0) {
          var totalOrderProductQty = 0;
          $.each(thisthis.localObject.pos_offline_orders, function(
            key,
            offlineOrder
          ) {
            totalOrderProductQty =
              totalOrderProductQty +
              thisthis.checkOrderProduct(
                offlineOrder.order_data.items,
                cartProduct
              );
          });
          remaining_quantity = remaining_quantity - totalOrderProductQty;
        }
        if (parseInt(cartProduct.qty_ordered) > parseInt(remaining_quantity)) {
          delete thisthis.pos_carts[thisthis.pos_current_cart][product_key];
        }
      });

      EventBus.$emit("setLocalForage", {
        key: "pos_carts",
        data: JSON.stringify(thisthis.pos_carts)
      });

      var cart_length = Object.keys(
        thisthis.pos_carts[thisthis.pos_current_cart]
      ).length;
      if (cart_length > 0) {
        if (thisthis.localObject.pos_cart_customer.email) {
          thisthis.$router.push({ name: "pos_payment" });
        } else {
          thisthis.$toast.error(thisthis.text_customer_empty, {
            position: "top-right",
            duration: 2000
          });
        }
      } else {
        thisthis.$toast.error(thisthis.text_cart_empty, {
          position: "top-right",
          duration: 2000
        });
      }
    }
  }
};
</script>
