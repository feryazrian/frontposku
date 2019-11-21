<template>
  <div class="pos-cart-main mobile">
    <div class="cart-content"> 
        <div class="cart" v-if="getCartTotal">
            <div class="cart_customer" @click="changeCustomer">
                <span>{{ $t("pos_home.pos_cart.text_customer") }}</span>
                <span v-if="this.localObject.pos_cart_customer.name" class="customer-name">{{ this.localObject.pos_cart_customer.name }}</span>
                <span v-else class="customer-empty">{{ $t('pos_home.pos_cart.text_choose_customer') }} <i class="fa fa-pencil"></i></span>
            </div>
            <ul class="cart_details">
                <div v-if="cartEmpty" class="message-alert">
                    <span class="text-danger">{{ $t('pos_home.pos_cart.text_cart_empty') }}</span>
                </div>
                <div v-else>
                    <li v-for="(cart_detail, i) in pos_carts[pos_current_cart]" :key="i" :class="{'active': cart_detail.active}">
                        <div class="cart-product-content">
                            <div class="product-name" @click="makeActiveProduct(cart_detail)">
                                {{ cart_detail.name }}
                            </div>
                             <div class="product-attributes" v-if="cart_detail.type == 'configurable'">
                                <span v-for="(attributes, i) in cart_detail.additional.attributes" :key="i">
                                  <i>
                                  <b>{{ attributes.attribute_name }}</b>
                                  : {{ attributes.option_label }},
                                  </i>
                                </span>
                            </div>
                            <div class="product-price">{{ currency }} {{ parseFloat(cart_detail.price).toLocaleString(getLocale) }} {{ $t("pos_home.pos_cart.text_per_unit") }}</div>
                        </div>
                        <div class="cart-product-control">
                          <div>
                            <span class="qty-control">
                                <span class="qty-minus" @click="minusProductQty(cart_detail)">
                                    <i class="fa fa-minus"></i>
                                </span>
                                <span class="qty">{{ cart_detail.qty_ordered }}</span>
                                <span
                                    class="qty-plus"
                                    @click="plusProductQty(cart_detail)"
                                >
                                    <i class="fa fa-plus"></i>
                                </span>
                              </span>
                              <span class="drop-control">
                                  <i @click="deleteCartProduct(cart_detail)" class="fa fa-trash"></i>
                              </span>
                            </div>
                            <div>{{ currency }} {{ parseFloat(cart_detail.total).toLocaleString(getLocale) }}</div>
                        </div>
                    </li>
                </div>
            </ul>
        </div>

        <div class="cart-total-container">
            <div class="pos-table-responsive cart-totals">
              <table class="pos-table">
                  <tbody>
                  <tr>
                      <td class="text-left">{{ $t("pos_home.pos_cart.text_sub_total") }}</td>
                      <td class="text-right" id="subtotal">{{ currency }} {{ parseFloat(sub_total).toLocaleString(getLocale) }}</td>
                  </tr>

                  <tr>
                      <td class="text-left" id="discname">
                      {{ $t("pos_home.pos_cart.text_discount") }}
                      </td>
                      <td class="text-right" id="discount">
                      {{ currency }}  {{ parseFloat(cart_discount).toLocaleString(getLocale) }}
                      </td>
                  </tr>

                  <tr>
                      <td class="text-left" id="taxname">{{ $t("pos_home.pos_cart.text_tax_total") }}</td>
                      <td class="text-right" id="tax">{{ currency }} {{ parseFloat(tax_total).toLocaleString(getLocale) }}</td>
                  </tr>

                  <tr class="hide">
                      <td class="text-left">{{ $t("pos_home.pos_cart.text_home_delivery") }}</td>
                      <td class="text-right">
                      <input type="number" class="form-field" placeholder />
                      </td>
                  </tr>
                  <tr class="grand_total">
                      <td class="text-left">{{ $t("pos_home.pos_cart.text_grand_total") }}</td>
                      <td class="text-right">{{ currency }} {{ parseFloat(grand_total).toLocaleString(getLocale) }}</td>
                  </tr>
                  </tbody>
              </table>
            </div>
        </div>
    </div>
    <div class="fixed-btm two-btn">
      <button
          type="button"
          class="btn btn-lg action-btn-danger"
          @click="showHoldNoteModal('holdCart')"
          :disabled="cartEmpty"
        >
          <i class="fa fa-pause"></i>
          {{ $t('pos_home.pos_cart.button_hold') }}
        </button>
        <button
          type="button"
          class="btn btn-lg btn-pos-primary action-btn-green"
          @click="payForCart"
          :disabled="cartEmpty"
        >{{ $t('pos_home.pos_cart.button_pay_now') }}</button>
    </div>
    <pos-common-modal id="addDiscountToCart" :is-open="this.$root.posCommonModal.addDiscountToCart">
      <h4 slot="header">{{ $t('pos_home.pos_cart.apply_discount') }}</h4>

      <div slot="body">
        <discount-list
          :pos_current_cart="pos_current_cart"
          :pos_carts="pos_carts"
          :pos_discounts="pos_discounts"
          :localObject="localObject"
        ></discount-list>
      </div>
    </pos-common-modal>
    <pos-common-modal id="holdCart" :is-open="this.$root.posCommonModal.holdCart">
      <h4 slot="header">{{ $t('pos_home.pos_cart.hold_order_note') }}</h4>

      <div slot="body">
        <hold-note
          :pos_current_cart="pos_current_cart"
          :pos_carts="pos_carts"
          :localObject="localObject"
        ></hold-note>
      </div>
    </pos-common-modal>
  </div>
</template>

<script>
import { APP as getApp } from '@/store/getters'

export default {
  props: [
    "localObject"
  ],
  data() {
    return {
      pos_offline: 0,
      pos_carts: this.localObject.pos_carts,
      pos_current_cart: this.localObject.pos_current_cart,
      customer_id: 0,
      current_opration: "qty",
      currency: "",
      sub_total: 0,
      cartCustomer: this.localObject.pos_cart_customer,
      cart_discount: 0,
      pos_discounts: [],
      discount_disabled: false,
      tax_total: 0,
      grand_total: 0,
      cartEmpty: true,
      text_cart_empty: this.$t("pos_home.pos_cart.error.error_cart_empty"),
      text_customer_empty: this.$t(
        "pos_home.pos_cart.error.error_customer_empty"
      )
    };
  },
  computed: {
    getCartTotal() {
      //this.pos_offline = this.$root.$root.offline;
      this.updateCartTotal();
      return true;
    }
    ,getLocale() { return this.$store.getters[ getApp.LOCALE ](window.pos_currency_code) }
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
  beforeDestroy() {
    EventBus.$off("removeOrderedCart");
    EventBus.$off("openDiscountModal");
  },
  created() {
    EventBus.$on("removeOrderedCart", removeStatus => {
      this.removeCart(removeStatus);
    });
    EventBus.$on("openDiscountModal", () => {
      this.openDiscountModal('addDiscountToCart');
    });
    EventBus.$on("onCartUpdate", () => {
      this.updateCartTotal();
    });
    EventBus.$on("hideNoteModal", modal_id => {
      this.$root.$set(this.$root.posCommonModal, modal_id, false);
    });
    EventBus.$on("resetCartDiscount", () => {
      this.cart_discount = 0;
      this.discount_disabled = false;
      this.localObject.pos_discount = {};
    });
  },
  mounted() {
    this.pos_offline = this.$root.$root.offline;
    this.currency = window.pos_currency_symbol;
  },
  methods: {
    removeCart(removeStatus) {
      this.cart_discount = 0;
      this.discount_disabled = false;
      this.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      var next_cart = this.pos_current_cart;

      if (Object.keys(this.pos_carts).length > 1) {
        this.pos_carts.splice(this.pos_current_cart, 1);
        next_cart = 0;
      } else {
        if (removeStatus) {
          this.pos_carts.splice(this.pos_current_cart, 1);
          next_cart = 0;
          if (this.pos_carts.length == 0) {
            this.pos_carts[0] = {};
            this.pos_current_cart = 0;
          }
        }
      }

      EventBus.$emit("cartActive", next_cart);

      EventBus.$emit("setLocalForage", {
        key: "pos_carts",
        data: JSON.stringify(this.pos_carts)
      });
    },
    changeCustomer() {
      this.$router.push({ name: "pos_customer" });
    },
    plusProductQty(cartProduct) {
      var obj
      if (cartProduct.type == "configurable") {
        obj = $.grep(this.localObject.pos_products, function(obj) {
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
          obj = $.grep(this.localObject.pos_products, function(obj) {
            return obj.id === cartProduct.id;
          })[0];
        }
      }

      var product_qty = JSON.parse(obj.quantity);

      var thisthis = this;
      thisthis.cart_discount = 0;
      thisthis.discount_disabled = false;

      thisthis.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        key,
        product
      ) {
        if (product.id == cartProduct.id) {
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
                  product
                );
            });
            remaining_quantity = remaining_quantity - totalOrderProductQty;
          }

          if (
            product.sku != "custom" &&
            parseInt(product.qty_ordered + 1) > parseInt(remaining_quantity)
          ) {
            thisthis.$toast.error(
              thisthis.$t("pos_home.pos_products.error.no_quantity"),
              {
                position: "top-right",
                duration: 2000
              }
            );

            return false;
          } else {
            product.qty_ordered = parseInt(product.qty_ordered) + 1;
            if (product.special_price != "NaN" && product.special_price) {
              product.total = parseFloat(
                product.qty_ordered * product.special_price
              ).toFixed(2);
            } else {
              product.total = parseFloat(
                product.qty_ordered * product.price
              ).toFixed(2);
            }
            product.f_total =
              window.pos_currency_symbol + parseFloat(product.total).toFixed(2);

            thisthis.pos_carts[thisthis.pos_current_cart][key] = product;

            EventBus.$emit("setLocalForage", {
              key: "pos_carts",
              data: JSON.stringify(thisthis.pos_carts)
            });
          }
        }
      });
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
    minusProductQty(cartProduct) {
      var thisthis = this;
      thisthis.cart_discount = 0;
      thisthis.discount_disabled = false;

      thisthis.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        key,
        product
      ) {
        if (product.id == cartProduct.id) {
          if (product.qty_ordered > 1) {
            product.qty_ordered -= 1;
            if (product.special_price != "NaN" && product.special_price) {
              product.total = parseFloat(
                product.qty_ordered * product.special_price
              ).toFixed(2);
            } else {
              product.total = parseFloat(
                product.qty_ordered * product.price
              ).toFixed(2);
            }
            product.f_total =
              window.pos_currency_symbol + parseFloat(product.total).toFixed(2);

            thisthis.pos_carts[thisthis.pos_current_cart][key] = product;

            EventBus.$emit("setLocalForage", {
              key: "pos_carts",
              data: JSON.stringify(thisthis.pos_carts)
            });
          } else {
            thisthis.deleteCartProduct(product);
          }
        }
      });
    },
    deleteCartProduct(cart_product) {
      var thisthis = this;
      var checkActive = false;
      var removeCartProduct = {};

      thisthis.cart_discount = 0;
      thisthis.discount_disabled = false;
      thisthis.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      var total_product = Object.keys(
        thisthis.pos_carts[thisthis.pos_current_cart]
      ).length;

      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        product_key,
        product_data
      ) {
        if (product_data.id == cart_product.id) {
          if (product_data.active == true && total_product > 0) {
            checkActive = true;
          }
          delete thisthis.pos_carts[thisthis.pos_current_cart][product_key];
        } else {
          removeCartProduct[product_key] = product_data;
        }
      });

      if (checkActive) {
        var product_count = Object.keys(removeCartProduct).length;
        if (product_count > 0) {
          var first_index = Object.keys(removeCartProduct)[0];
          removeCartProduct[first_index].active = true;
        }
      }

      thisthis.$set(
        thisthis.pos_carts,
        thisthis.pos_current_cart,
        removeCartProduct
      );

      EventBus.$emit("setLocalForage", {
        key: "pos_carts",
        data: JSON.stringify(thisthis.pos_carts)
      });
    },
    makeActiveProduct(cartProduct) {
      var thisthis = this;
      var cart_products = {};
      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        key,
        product
      ) {
        product.active = false;
        if (product.id == cartProduct.id) {
          product.active = true;
        }
        cart_products[key] = product;
      });

      this.$set(thisthis.pos_carts, thisthis.pos_current_cart, cart_products);

      EventBus.$emit("setLocalForage", {
        key: "pos_carts",
        data: JSON.stringify(thisthis.pos_carts)
      });
    },
    updateCartTotal() {
      var thisthis = this;
      var cart_sub_total = 0;
      var cart_tax_total = 0;
      var cart_grand_total = 0;

      thisthis.discount_disabled = false;
      thisthis.cartEmpty = true;

      $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
        key,
        product
      ) {
        thisthis.discount_disabled = true;
        thisthis.cartEmpty = false;
        cart_sub_total = cart_sub_total + parseFloat(product.total);

        if (
          product.tax_category_id != null &&
          product.tax_category_id &&
          product.tax_percent
        ) {
          cart_tax_total =
            cart_tax_total +
            (parseFloat(product.total) * product.tax_percent) / 100;
        }
      });

      thisthis.sub_total = parseFloat(cart_sub_total).toFixed(2);

      thisthis.tax_total = parseFloat(cart_tax_total).toFixed(2);

      if (
        thisthis.pos_carts[thisthis.pos_current_cart] &&
        Object.keys(thisthis.pos_carts[thisthis.pos_current_cart]).length > 0
      ) {
        if (thisthis.localObject.pos_discount.id) {
          if (
            parseFloat(thisthis.localObject.pos_discount.converted_fromprice) <=
              parseFloat(thisthis.sub_total) &&
            parseFloat(thisthis.localObject.pos_discount.converted_toprice) >=
              parseFloat(thisthis.sub_total)
          ) {
            if (thisthis.localObject.pos_discount.type == "percentage") {
              thisthis.cart_discount = parseFloat(
                (thisthis.sub_total *
                  thisthis.localObject.pos_discount.converted_value) /
                  100
              ).toFixed(2);
            } else {
              thisthis.cart_discount = parseFloat(
                thisthis.localObject.pos_discount.converted_value
              ).toFixed(2);
            }
          }
        }
      }

      if (thisthis.cart_discount == "NaN") {
        thisthis.cart_discount = 0;
      }

      cart_grand_total =
        parseFloat(thisthis.sub_total) +
        parseFloat(thisthis.tax_total) -
        thisthis.cart_discount;

      thisthis.grand_total = parseFloat(cart_grand_total).toFixed(2);
    },
    openDiscountModal(modalId) {
      var thisthis = this;
      if (thisthis.pos_offline) {
        if (Object.keys(thisthis.localObject.pos_discounts).length > 0) {
          let getFilterDiscounts = [];
          if (thisthis.sub_total) {
            $.each(thisthis.localObject.pos_discounts, (key, discount) => {
              if (
                parseFloat(discount.converted_fromprice) <=
                  parseFloat(thisthis.sub_total) &&
                parseFloat(discount.converted_toprice) >=
                  parseFloat(thisthis.sub_total)
              ) {
                getFilterDiscounts = getFilterDiscounts.concat(discount);
              }
            });
            thisthis.pos_discounts = getFilterDiscounts;
          } else {
            thisthis.pos_discounts = [];
          }
        } else {
          thisthis.pos_discounts = [];
        }
      } else {
        if (thisthis.localObject.pos_cashier.id) {
          thisthis.$http.get("/api/pos/auth/getDiscounts", {
              params: {
                user_id: thisthis.localObject.pos_cashier.id,
                filter_cart_total: thisthis.sub_total
              }
            })
            .then(response => {
              if (response.data.data && response.data.data.length > 0) {
                thisthis.pos_discounts = response.data.data;
              } else {
                thisthis.pos_discounts = [];
              }
            })
            .catch(e => { console.log(e) });
        }
      }
      EventBus.$emit("showCommonModal", modalId);
    },
    showHoldNoteModal(modalId) {
      if (Object.keys(this.pos_carts[this.pos_current_cart]).length > 0) {
        EventBus.$emit("showCommonModal", modalId);
      } else {
        this.$toast.error(this.text_cart_empty, {
          position: "top-right",
          duration: 2000
        });
      }
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
