
<template>
  <div>
    <div class="pos-home-main" :class="{'mobile': isMobileOnly}" v-if="user_id">
      <div class="pos-categories" :class="{'pos-search': isMobileOnly, 'search': showSearch}">
        <pos-categories :localObject="localObject" @onCategoryChange="getOutletProducts"></pos-categories>
        <navtop-search v-if="isMobileOnly" :disableStatus="true" :class="{'show': showSearch}"></navtop-search>
        <span class="vl-light"></span>
        <div
          class="search-section"
          :class="{'active': showSearch}"
          v-if="isMobileOnly"
          @click="showSearch=!showSearch"
        >
          <span class="fa fa-search" v-if="!showSearch"></span>
          <span class="fa fa-times" v-else></span>
        </div>
      </div>
      <div class="pos-product-container" v-if="total_product">
        <pos-home-products
          :localObject="localObject"
          :pos_products="pos_products"
          :pos_product_count="total_product"
        ></pos-home-products>
      </div>
      <div class="pos-product-container" v-else>
        <div class="message-alert danger">{{ $t("pos_home.pos_products.error.no_product") }}</div>
      </div>
    </div>

    <div
      class="pos-cart-container"
      v-if="user_id && !isMobileOnly"
      v-bind:style="{'height': cart_container_height}"
    >
      <pos-cart
        :pos_carts="pos_carts"
        :pos_current_cart="pos_current_cart"
        :showMinusBtn="showMinusBtn"
        :cartCustomer="cartCustomer"
        :hold_count="holdCartCount"
        :localObject="localObject"
      ></pos-cart>
    </div>

    <pos-navbottom-mobile
      v-if="user_id && isMobileOnly"
      :pos_carts="pos_carts"
      :pos_current_cart="pos_current_cart"
      :showMinusBtn="showMinusBtn"
      :cartCustomer="cartCustomer"
      :localObject="localObject"
    ></pos-navbottom-mobile>

    <pos-common-modal
      v-if="isUserOpenStore"
      id="addDrawer"
      :showClose="true"
      :is-open="this.$root.posCommonModal.addDrawer"
    >
      <h4 slot="header">{{ $t('pos_cashier.menu_content.text_opening_amount') }}</h4>
      <div slot="body">
        <drawer-form :drawer_data="drawer_data" :localObject="localObject"></drawer-form>
      </div>
    </pos-common-modal>

    <pos-common-modal id="barcodeModal" :is-open="this.$root.posCommonModal.barcodeModal">
      <h4 slot="header">{{ $t('pos_home.navtop.entry_product_search') }}</h4>

      <div slot="body">
        <div class="control-group">
          <input
            type="text"
            class="control"
            name="search_barcode"
            id="search_barcode"
            v-model="barcode_text"
            :style="{'width' : isMobileOnly? '100%' : 'auto'}"
            :placeholder="$t('pos_home.navtop.search_barcode_placeholder')"
            v-validate="'alpha_spaces'"
            @keyup="barcodeSearch"
          />
        </div>
      </div>
    </pos-common-modal>
  </div>
</template>

<script>
import { getDrawerDetail } from "@/api/drawer";
import { getOutletProducts } from "@/api/product";
import { getCustomers } from "@/api/customer";
import { APP as getApp } from "@/store/getters";
import { APP as setApp } from "@/store/actions";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["localObject"],
  data() {
    return {
      user_id: 0,
      pos_products: [],
      pos_cashier: this.localObject.pos_cashier,
      total_product: 0,
      page: 1,
      limit: 2,
      totalPage: 0,
      showSearch: false,
      filter_name: "",
      outlet_id: 0,
      category_id: null,
      pos_carts: [],
      pos_current_cart: 0,
      current_hold_cart: {},
      holdCartCount: 0,
      success_hold_cart: this.$t("pos_home.pos_cart.success_hold_cart"),
      error_plus_cart: this.$t("pos_home.pos_cart.error.error_plus_cart", {
        cart_count: 3
      }),
      showMinusBtn: false,
      cartCustomer: [],
      drawer_modal_status: 0,
      drawer_data: {},
      cart_container_height: $(window).height() - 60 + "px",
      barcode_text: "",
      search_opt: window.search_option,
      no_barcode_product: this.$t(
        "pos_home.pos_products.error.no_barcode_product"
      ),
      no_barcode_provided: this.$t(
        "pos_home.pos_products.error.no_barcode_provided"
      ),
      success_add_to_cart: this.$t("pos_home.pos_products.success_add_to_cart")
    };
  },
  computed: {
    ...mapGetters({
      isMobileOnly: getApp.ISMOBILEONLY,
      getCurrentCustomer: getApp.CUSTOMER.CURRENT_DEFAULT
    }),
    isUserOpenStore() {
      this.checkPosUserLogin();
      this.countHoldTotal();
      // console.log('drawerModal', {modalStatus: this.drawer_modal_status, localObject: this.localObject})
      return this.drawer_modal_status;
    }
  },
  beforeDestroy() {
    EventBus.$off("cartAddProduct");
    EventBus.$off("barcodeFilter");
    EventBus.$off("addNewCart");
  },
  created() {
    EventBus.$on("searchPosProduct", keyword => {
      this.page = 1;
      this.total_product = 0;
      this.pos_products = [];
      this.filter_name = keyword;
      this.loadProducts();
    });

    EventBus.$on("barcodeFilter", object => {
      if (object.search_keyword.length > 0) {
        this.barcode_text = object.search_keyword;
        this.barcodeSearch(object.event);
      } else {
        this.barcode_text = "";
        $("#nav-search").val("");
        $("#nav-search").focus();
      }
    });

    EventBus.$on("cartAddProduct", product => {
      this.addProductToCart(product);
    });

    EventBus.$on("resetDrawerStatus", updatedDrawer => {
      this.drawer_modal_status = 0;
      this.localObject.pos_drawer = updatedDrawer;
    });

    EventBus.$on("addNewCart", () => {
      this.addNewCart();
    });

    EventBus.$on("cartActive", cartIndex => {
      this.pos_current_cart = cartIndex;
      this.localObject.pos_current_cart = cartIndex;
      EventBus.$emit("setLocalForage", {
        key: "pos_current_cart",
        data: this.pos_current_cart
      });
    });

    EventBus.$on("changeMinusBtn", status => {
      this.showMinusBtn = status;
    });

    EventBus.$on("applyHoldCart", hold_order => {
      this.holdCurrentCart(hold_order);
    });

    EventBus.$on("loadCartContent", () => {
      this.loadCarts();
    });
  },
  mounted() {
    this.getOutletProducts();
    this.loadCarts();
    (() => {
      if (!this.getCurrentCustomer)
        getCustomers(this.localObject.pos_cashier.id, {
          isOnlyMember: false
        }).then(({ data: v, status }) => {
          if (status != 200) return;
          for (let e of v.data)
            if (e.isActive) {
              this.$setItem("pos_cart_customer", JSON.stringify(e)).then(() => {
                this.setDefaultCustomer(e).then(() => {
                  EventBus.$emit("getLocalForage", "pos_cart_customer");
                });
              });
              break;
            }
        });
    })();
  },
  methods: {
    ...mapActions({
      setDefaultCustomer: setApp.CUSTOMER.CURRENT_DEFAULT
    }),
    checkPosUserLogin() {
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
        //this.$http.post("api/pos/auth/getDrawerDetails", {"user_id": this.user_id})
        getDrawerDetail(this.user_id)
          .then(response => {
            if (!response.data.drawer_data.status) {
              EventBus.$emit("showCommonModal", "addDrawer");
              this.drawer_modal_status = true;
              this.drawer_data = {};
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    countHoldTotal() {
      if (this.localObject.pos_holds) {
        this.holdCartCount = Object.keys(this.localObject.pos_holds).length;
      }
    },
    getOutletProducts(categoryId = null) {
      this.page = 1;
      this.total_product = 0;

      EventBus.$emit("getLocalForage", "pos_cashier");
      if (this.localObject.pos_cashier.outlet_id) {
        this.pos_products = [];
        this.outlet_id = this.localObject.pos_cashier.outlet_id;
        this.category_id = categoryId;
        this.loadProducts();
      }
    },
    loadProducts() {
      var thisthis = this;
      if (thisthis.$root.offline) {
        if (Object.keys(thisthis.localObject.pos_products).length > 0) {
          thisthis.total_product = Object.keys(
            thisthis.localObject.pos_products
          ).length;
          thisthis.pos_products = thisthis.localObject.pos_products;

          let getFilterProducts = [];
          thisthis.total_product = 0;

          if (thisthis.category_id) {
            let categoryFilterArray = [];

            if (
              Object.keys(thisthis.localObject.pos_product_categories).length >
              0
            ) {
              $.each(
                thisthis.localObject.pos_product_categories,
                (key, product_category) => {
                  if (
                    parseInt(product_category.category_id) ===
                    parseInt(thisthis.category_id)
                  ) {
                    $.each(this.localObject.pos_products, (key, product) => {
                      if (product.id === product_category.product_id) {
                        var foundStatus = categoryFilterArray.includes(
                          product.id
                        );

                        if (thisthis.filter_name.length > 0) {
                          if (
                            product.name
                              .toLowerCase()
                              .indexOf(thisthis.filter_name.toLowerCase()) !==
                              -1 ||
                            product.sku.toLowerCase() ==
                              thisthis.filter_name.toLowerCase()
                          ) {
                            getFilterProducts = getFilterProducts.concat(
                              product
                            );
                            thisthis.total_product += 1;
                          }
                        } else {
                          if (!foundStatus) {
                            categoryFilterArray.push(product.id);
                            getFilterProducts = getFilterProducts.concat(
                              product
                            );
                            thisthis.total_product += 1;
                          }
                        }
                      }
                    });
                  }
                }
              );
              thisthis.pos_products = getFilterProducts;
            }
          } else {
            if (thisthis.filter_name.length > 0) {
              $.each(thisthis.localObject.pos_products, (key, product) => {
                if (
                  product.name
                    .toLowerCase()
                    .indexOf(thisthis.filter_name.toLowerCase()) !== -1 ||
                  product.sku.toLowerCase() ==
                    thisthis.filter_name.toLowerCase()
                ) {
                  getFilterProducts = getFilterProducts.concat(product);
                  thisthis.total_product += 1;
                }
              });
              thisthis.pos_products = getFilterProducts;
            } else {
              thisthis.pos_products = thisthis.localObject.pos_products;
              thisthis.total_product = Object.keys(
                thisthis.localObject.pos_products
              ).length;
            }
          }
        } else {
          thisthis.pos_products = [];
          thisthis.total_product = 0;
        }
      } else {
        if (Object.keys(thisthis.localObject.pos_products).length > 0) {
          let getFilterProducts = [];
          thisthis.total_product = 0;

          if (thisthis.category_id) {
            let categoryFilterArray = [];

            if (
              Object.keys(thisthis.localObject.pos_product_categories).length >
              0
            ) {
              $.each(
                thisthis.localObject.pos_product_categories,
                (key, product_category) => {
                  if (
                    parseInt(product_category.category_id) ===
                    parseInt(thisthis.category_id)
                  ) {
                    $.each(
                      thisthis.localObject.pos_products,
                      (key, product) => {
                        if (product.id === product_category.product_id) {
                          var foundStatus = categoryFilterArray.includes(
                            product.id
                          );

                          if (thisthis.filter_name.length > 0) {
                            if (
                              product.name
                                .toLowerCase()
                                .indexOf(thisthis.filter_name.toLowerCase()) !==
                                -1 ||
                              product.sku.toLowerCase() ==
                                thisthis.filter_name.toLowerCase()
                            ) {
                              getFilterProducts = getFilterProducts.concat(
                                product
                              );
                              thisthis.total_product += 1;
                            }
                          } else {
                            if (!foundStatus) {
                              categoryFilterArray.push(product.id);
                              getFilterProducts = getFilterProducts.concat(
                                product
                              );
                              thisthis.total_product += 1;
                            }
                          }
                        }
                      }
                    );
                  }
                }
              );
              thisthis.pos_products = getFilterProducts;
            }
          } else {
            if (thisthis.filter_name.length > 0) {
              $.each(thisthis.localObject.pos_products, (key, product) => {
                if (
                  product.name
                    .toLowerCase()
                    .indexOf(thisthis.filter_name.toLowerCase()) !== -1 ||
                  product.sku.toLowerCase() ==
                    thisthis.filter_name.toLowerCase()
                ) {
                  getFilterProducts = getFilterProducts.concat(product);
                  thisthis.total_product += 1;
                }
              });
              thisthis.pos_products = getFilterProducts;
            } else {
              thisthis.pos_products = thisthis.localObject.pos_products;
              thisthis.total_product = Object.keys(
                thisthis.localObject.pos_products
              ).length;
            }
          }
        } else {
          if (this.localObject.pos_cashier.id) {
            //thisthis.$http.get('/api/pos/auth/outletProducts', {
            //    params: {
            //        page: thisthis.page,
            //        inventory_source_id: thisthis.localObject.pos_cashier.inventory_source_id,
            //        category_id: thisthis.category_id,
            //        outlet_id: thisthis.outlet_id,
            //        filter_name: thisthis.filter_name,
            //        filter_barcode: thisthis.barcode_text,
            //    }
            //})
            getOutletProducts({
              page: thisthis.page,
              inventory_source_id: thisthis.localObject.pos_cashier.inventory_source_id,
              cateogory_id: thisthis.category_id,
              outlet_id: thisthis.outlet_id,
              filter_name: thisthis.filter_name,
              filter_barcode: thisthis.barcode_text
            })
              .then(response => {
                // console.log("outletProducts", response);
                if (response.data.data && response.data.data.length > 0) {
                  thisthis.total_product += response.data.data.length;
                  thisthis.totalPage = response.data.meta.last_page;
                  thisthis.total_products = response.data.meta.total;

                  thisthis.pos_products = thisthis.pos_products.concat(
                    response.data.data
                  );

                  if (thisthis.totalPage > thisthis.page) {
                    thisthis.page += 1;
                    thisthis.loadProducts();
                  } else {
                    // console.log('list-products', thisthis.pos_products);
                    EventBus.$emit("setLocalForage", {
                      key: "pos_products",
                      data: JSON.stringify(thisthis.pos_products)
                    });
                    thisthis.localObject.pos_products = thisthis.pos_products;
                  }
                } else {
                  thisthis.total_product = 0;
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        }
      }
    },
    loadCarts() {
      var thisthis = this;

      EventBus.$emit("getLocalForage", "pos_current_cart");

      if (thisthis.localObject.pos_carts.length > 0) {
        if (thisthis.localObject.pos_carts.length > 1) {
          thisthis.showMinusBtn = true;
        }
        thisthis.pos_carts = thisthis.localObject.pos_carts;

        if (
          Object.keys(thisthis.pos_carts).length <=
          thisthis.localObject.pos_current_cart
        ) {
          thisthis.localObject.pos_current_cart = 0;
        }
        thisthis.pos_current_cart = thisthis.localObject.pos_current_cart;
      } else {
        if (thisthis.pos_carts.length == 0) {
          thisthis.pos_carts[0] = {};
          thisthis.pos_current_cart = 0;

          EventBus.$emit("setLocalForage", {
            key: "pos_carts",
            data: JSON.stringify(thisthis.pos_carts)
          });

          EventBus.$emit("setLocalForage", {
            key: "pos_current_cart",
            data: thisthis.pos_current_cart
          });
        }
      }

      if (
        thisthis.localObject.pos_cart_customer &&
        thisthis.localObject.pos_cart_customer.email
      ) {
        thisthis.cartCustomer = thisthis.localObject.pos_cart_customer;
      }
    },
    addProductToCart(product) {
      var thisthis = this;

      EventBus.$emit("resetCartDiscount");
      thisthis.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      if (
        thisthis.pos_current_cart != "null" &&
        thisthis.pos_carts[thisthis.pos_current_cart]
      ) {
        var procuct_exist = false;
        var cart_product_count = Object.keys(
          thisthis.pos_carts[thisthis.pos_current_cart]
        ).length;

        if (product.type == "configurable") {
          let product_qty = JSON.parse(product.pos_qty);
          let remaining_quantity = product_qty[product.id];

          if (Object.keys(thisthis.localObject.pos_offline_orders).length > 0) {
            let totalOrderProductQty = 0;
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

          if (parseInt(remaining_quantity) > 0) {
            if (cart_product_count != null && cart_product_count) {
              $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
                key,
                cart_product
              ) {
                cart_product.active = false;

                if (product.id == cart_product.id) {
                  procuct_exist = true;

                  if (
                    parseInt(cart_product.qty_ordered + 1) >
                    parseInt(remaining_quantity)
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
                    cart_product.active = true;
                    cart_product.qty_ordered = cart_product.qty_ordered + 1;
                    cart_product.weight = product.weight;
                    cart_product.total_weight =
                      cart_product.qty_ordered * product.weight;

                    cart_product.total = parseFloat(
                      cart_product.qty_ordered * product.price
                    ).toFixed(2);
                    cart_product.base_total = parseFloat(
                      cart_product.qty_ordered * product.base_price
                    ).toFixed(2);
                    cart_product.tax_amount = parseFloat(
                      cart_product.qty_ordered * product.tax_amount
                    ).toFixed(2);
                    cart_product.base_tax_amount = parseFloat(
                      cart_product.qty_ordered * product.base_tax_amount
                    ).toFixed(2);
                    cart_product.f_total =
                      window.pos_currency_symbol +
                      parseFloat(
                        cart_product.qty_ordered * product.price
                      ).toFixed(2);

                    thisthis.$toast.success(thisthis.success_add_to_cart, {
                      position: "top-right",
                      duration: 2000
                    });
                  }
                }
              });
            }

            if (!procuct_exist) {
              const cart_product = {};
              cart_product.active = true;
              cart_product.id = product.id;
              cart_product.sku = product.sku;
              cart_product.type = product.type;
              cart_product.weight = product.weight;
              cart_product.total_weight = product.total_weight;
              cart_product.name = product.name;
              cart_product.tax_category_id = product.tax_category_id;
              cart_product.tax_percent = product.tax_percent;
              cart_product.tax_amount = product.tax_amount;
              cart_product.base_tax_amount = product.base_tax_amount;
              cart_product.qty_ordered = product.quantity;
              cart_product.price = parseFloat(product.price).toFixed(2);
              cart_product.f_price = product.formated_price;
              cart_product.total = parseFloat(
                product.quantity * product.price
              ).toFixed(2);
              cart_product.base_price = parseFloat(product.base_price).toFixed(
                2
              );
              cart_product.base_total = parseFloat(
                product.quantity * product.base_price
              ).toFixed(2);
              cart_product.tax_amount = product.tax_amount;
              cart_product.base_tax_amount = product.base_tax_amount;

              cart_product.f_total =
                window.pos_currency_symbol +
                parseFloat(product.quantity * product.price).toFixed(2);
              cart_product.additional = product.additional;

              if (cart_product_count == 0) {
                thisthis.$set(
                  thisthis.pos_carts[thisthis.pos_current_cart],
                  cart_product_count,
                  cart_product
                );
              } else {
                let new_index =
                  parseInt(
                    Object.keys(thisthis.pos_carts[thisthis.pos_current_cart])[
                      cart_product_count - 1
                    ]
                  ) + parseInt(1);

                thisthis.$set(
                  thisthis.pos_carts[thisthis.pos_current_cart],
                  new_index,
                  cart_product
                );
              }
              this.$toast.success(thisthis.success_add_to_cart, {
                position: "top-right",
                duration: 2000
              });
            }
            EventBus.$emit("hideCommonModal", "productVariationModal");

            EventBus.$emit("onshowCartContent");
            EventBus.$emit("setLocalForage", {
              key: "pos_carts",
              data: JSON.stringify(thisthis.pos_carts)
            });
          } else {
            this.$toast.error(
              this.$t("pos_home.pos_products.error.no_quantity"),
              {
                position: "top-right",
                duration: 2000
              }
            );
          }

          if (this.search_opt == 0) {
            this.barcode_text = "";
            $("#nav-search").val("");
            $("#nav-search").focus();
          }
        } else {
          let product_qty = JSON.parse(product.quantity);
          let remaining_quantity = product_qty[product.id];

          if (Object.keys(thisthis.localObject.pos_offline_orders).length > 0) {
            let totalOrderProductQty = 0;
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

          if (parseInt(remaining_quantity) > 0) {
            if (cart_product_count != null && cart_product_count) {
              $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(
                key,
                cart_product
              ) {
                cart_product.tax_amount = 0;
                cart_product.base_tax_amount = 0;
                cart_product.active = false;

                if (product.id == cart_product.id) {
                  procuct_exist = true;

                  if (
                    parseInt(cart_product.qty_ordered + 1) >
                    parseInt(remaining_quantity)
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
                    cart_product.active = true;
                    cart_product.qty_ordered = cart_product.qty_ordered + 1;
                    cart_product.weight = product.weight;
                    cart_product.total_weight =
                      cart_product.qty_ordered * product.weight;

                    if (product.special_price) {
                      cart_product.base_total = parseFloat(
                        cart_product.qty_ordered * product.special_price
                      ).toFixed(2);

                      cart_product.total = parseFloat(
                        cart_product.qty_ordered *
                          product.converted_special_price
                      ).toFixed(2);

                      if (product.tax_category_id) {
                        cart_product.tax_amount = parseFloat(
                          (cart_product.qty_ordered *
                            product.converted_special_price *
                            product.tax_percent) /
                            100
                        ).toFixed(2);

                        cart_product.base_tax_amount = parseFloat(
                          (cart_product.qty_ordered *
                            product.special_price *
                            product.tax_percent) /
                            100
                        ).toFixed(2);
                      }

                      cart_product.f_total =
                        window.pos_currency_symbol +
                        parseFloat(
                          cart_product.qty_ordered *
                            product.converted_special_price
                        ).toFixed(2);
                    } else {
                      cart_product.base_total = parseFloat(
                        cart_product.qty_ordered * product.price
                      ).toFixed(2);

                      cart_product.total = parseFloat(
                        cart_product.qty_ordered * product.converted_price
                      ).toFixed(2);

                      if (product.tax_category_id) {
                        cart_product.tax_amount = parseFloat(
                          (cart_product.qty_ordered *
                            product.converted_price *
                            product.tax_percent) /
                            100
                        ).toFixed(2);

                        cart_product.base_tax_amount = parseFloat(
                          (cart_product.qty_ordered *
                            product.price *
                            product.tax_percent) /
                            100
                        ).toFixed(2);
                      }

                      cart_product.f_total =
                        window.pos_currency_symbol +
                        parseFloat(
                          cart_product.qty_ordered * product.converted_price
                        ).toFixed(2);
                    }
                    thisthis.$toast.success(thisthis.success_add_to_cart, {
                      position: "top-right",
                      duration: 2000
                    });
                  }
                }
              });
            }

            if (!procuct_exist) {
              const cart_product = {};
              cart_product.active = true;
              cart_product.id = product.id;
              cart_product.sku = product.sku;
              cart_product.type = product.type;

              cart_product.weight = product.weight;
              cart_product.total_weight = 1 * product.weight;

              cart_product.name = product.name;
              cart_product.tax_category_id = product.tax_category_id;
              cart_product.tax_percent = product.tax_percent;
              cart_product.tax_amount = 0;
              cart_product.base_tax_amount = 0;
              cart_product.qty_ordered = 1;

              if (product.special_price && product.special_price != "NaN") {
                cart_product.base_price = parseFloat(
                  product.special_price
                ).toFixed(2);
                cart_product.price = parseFloat(
                  product.converted_special_price
                ).toFixed(2);
                cart_product.f_price = product.formated_special_price;

                cart_product.base_total = parseFloat(
                  1 * product.special_price
                ).toFixed(2);

                cart_product.total = parseFloat(
                  1 * product.converted_special_price
                ).toFixed(2);

                if (product.tax_category_id) {
                  cart_product.tax_amount = parseFloat(
                    (1 *
                      product.converted_special_price *
                      product.tax_percent) /
                      100
                  ).toFixed(2);

                  cart_product.base_tax_amount = parseFloat(
                    (1 * product.special_price * product.tax_percent) / 100
                  ).toFixed(2);
                }

                cart_product.f_total =
                  window.pos_currency_symbol +
                  parseFloat(1 * product.converted_special_price).toFixed(2);
              } else {
                cart_product.base_price = parseFloat(product.price).toFixed(2);
                cart_product.price = parseFloat(
                  product.converted_price
                ).toFixed(2);
                cart_product.f_price = product.formated_price;

                cart_product.base_total = parseFloat(1 * product.price).toFixed(
                  2
                );
                cart_product.total = parseFloat(
                  1 * product.converted_price
                ).toFixed(2);

                if (product.tax_category_id) {
                  cart_product.tax_amount = parseFloat(
                    (1 * product.converted_price * product.tax_percent) / 100
                  ).toFixed(2);

                  cart_product.base_tax_amount = parseFloat(
                    (1 * product.price * product.tax_percent) / 100
                  ).toFixed(2);
                }

                cart_product.f_total =
                  window.pos_currency_symbol +
                  parseFloat(1 * product.converted_price).toFixed(2);
              }

              let index = Object.keys(
                thisthis.pos_carts[thisthis.pos_current_cart]
              ).length;

              if (index == 0) {
                thisthis.$set(
                  thisthis.pos_carts[thisthis.pos_current_cart],
                  index,
                  cart_product
                );
              } else {
                let new_index =
                  parseInt(
                    Object.keys(thisthis.pos_carts[thisthis.pos_current_cart])[
                      index - 1
                    ]
                  ) + parseInt(1);

                thisthis.$set(
                  thisthis.pos_carts[thisthis.pos_current_cart],
                  new_index,
                  cart_product
                );
              }

              this.$toast.success(thisthis.success_add_to_cart, {
                position: "top-right",
                duration: 2000
              });
            }
            EventBus.$emit("onshowCartContent");
            EventBus.$emit("setLocalForage", {
              key: "pos_carts",
              data: JSON.stringify(thisthis.pos_carts)
            });
          } else {
            this.$toast.error(
              this.$t("pos_home.pos_products.error.no_quantity"),
              {
                position: "top-right",
                duration: 2000
              }
            );
          }

          if (this.search_opt == 0) {
            this.barcode_text = "";
            $("#nav-search").val("");
            $("#nav-search").focus();
          }
        }
      }
    },
    addNewCart() {
      var self = this;

      self.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      if (self.pos_carts.length > 0 && self.pos_carts.length < 3) {
        var totalProducts = Object.keys(self.pos_carts[self.pos_current_cart]);

        if (totalProducts.length > 0) {
          var maxCartKey = 0;
          var promiseReturn = new Promise(resolve => {
            $(self.pos_carts).each(key => {
              if (key > maxCartKey) {
                maxCartKey = key;
              }
            });
            resolve(1);
          });

          promiseReturn.then(() => {
            if (maxCartKey != null) {
              self.pos_current_cart = maxCartKey + 1;
              self.pos_carts[self.pos_current_cart] = {};

              this.$set(self.pos_carts, self.pos_current_cart, {});

              // show cart remove button
              if (self.pos_carts.length > 1) {
                self.showMinusBtn = true;
              }

              self.localObject.pos_current_cart = self.pos_current_cart;

              EventBus.$emit("setLocalForage", {
                key: "pos_carts",
                data: JSON.stringify(self.pos_carts)
              });

              EventBus.$emit("setLocalForage", {
                key: "pos_current_cart",
                data: self.pos_current_cart
              });
            }
          });
        }
      } else {
        this.$toast.warning(this.error_plus_cart, {
          position: "top-right",
          duration: 2000
        });
      }
    },
    holdCurrentCart(hold_order) {
      EventBus.$emit("resetCartDiscount");
      this.localObject.pos_discount = {};
      EventBus.$emit("deleteLocalForage", "pos_discount");

      let length_holds = Object.keys(this.localObject.pos_holds).length;

      this.current_hold_cart = this.pos_carts[this.pos_current_cart];

      if (
        this.current_hold_cart &&
        !this.current_hold_cart.hold_status &&
        Object.keys(this.current_hold_cart).length > 0
      ) {
        this.current_hold_cart.hold_status = true;
        this.current_hold_cart.hold_data = hold_order;

        this.localObject.pos_holds[length_holds] = this.current_hold_cart;
        this.pos_carts.splice(this.pos_current_cart, 1);

        let length_carts = Object.keys(this.pos_carts).length;

        if (length_carts == 0) {
          this.pos_carts[0] = {};
          this.pos_current_cart = 0;
        } else {
          this.pos_current_cart = 0;
        }

        this.countHoldTotal();

        this.holdCartCount = Object.keys(this.localObject.pos_holds).length;

        EventBus.$emit("customerHoldCart");

        EventBus.$emit("setLocalForage", {
          key: "pos_carts",
          data: JSON.stringify(this.pos_carts)
        });

        EventBus.$emit("setLocalForage", {
          key: "pos_current_cart",
          data: this.pos_current_cart
        });

        EventBus.$emit("setLocalForage", {
          key: "pos_holds",
          data: JSON.stringify(this.localObject.pos_holds)
        });

        this.$root.toggleButtonDisable(false);

        this.$toast.success(this.success_hold_cart, {
          position: "top-right",
          duration: 2000
        });

        EventBus.$emit("hideNoteModal", "holdCart");

        if (this.isMobileOnly) {
          this.$router.push({ name: "pos_home" });
        }
      }
    },
    barcodeSearch(event) {
      var thisthis = this;
      let found_status = false;
      if (event.keyCode == 13) {
        if (
          thisthis.barcode_text.length > 0 &&
          Object.keys(thisthis.localObject.pos_products).length > 0
        ) {
          $.each(thisthis.localObject.pos_products, (key, product) => {
            if (
              product.product_barcode &&
              product.product_barcode === thisthis.barcode_text
            ) {
              found_status = true;

              EventBus.$emit("hideCommonModal", "barcodeModal");

              if (product.type == "configurable") {
                EventBus.$emit("showVariantModal", product);
              } else {
                thisthis.addProductToCart(product);
              }
            }
          });

          if (!found_status) {
            thisthis.barcode_text = "";
            $("#nav-search").val("");
            $("#nav-search").focus();
            thisthis.$toast.error(thisthis.no_barcode_product, {
              position: "top-right",
              duration: 2000
            });
          }
        } else {
          thisthis.$toast.error(thisthis.no_barcode_provided, {
            position: "top-right",
            duration: 2000
          });
        }
      }
    },
    checkOrderProduct(orderItems, product) {
      var orderProductQty = 0;
      $.each(orderItems, function(key, orderProduct) {
        if (parseInt(orderProduct.id) == parseInt(product.id)) {
          orderProductQty = orderProductQty + orderProduct.qty_ordered;
        }
      });
      return orderProductQty;
    }
  }
};
</script>
