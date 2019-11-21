<template>
  <div class="product-lowstock-panel">
    <div class="pos-product-container" v-if="isUserLogin">
      <div class="message-alert warning" v-if="pos_offline">{{ $t('pos_view.error_offline_mode') }}</div>

      <div class="pos-table-responsive mt-10">
        <table class="pos-table" :class="{ 'pos-table-mobile': isMobileOnly }">
          <thead v-if="!isMobileOnly">
            <tr>
              <th class="text-left">Order ID</th>
              <th class="text-left">Order Date</th>
              <th class="text-left">Order Total</th>
              <th class="text-left">Payment Mode</th>
            </tr>
          </thead>
          <tbody v-if="total_order != 0">
            <tr
              v-for="(order, index) in today_sale_history"
              v-bind:key="index"
              :class="{ 'border-top pt-1': isMobileOnly }"
            >
              <td class="text-left">
                <span :class="{ 'btn-outline-primary': isMobileOnly }">#{{ order.id }}</span>
              </td>
              <td class="text-left" :class="{'font-14': isMobileOnly}">
                <div>{{ order.created_at | moment('DD MMM YYYY') }}</div>
                <div>{{ order.created_at | moment('hh:mm:ss')}}</div>
              </td>
              <td class="text-left">
                <div
                  v-if="current_currency == order.order_currency_code"
                  :class="{'color-primary font-bold': isMobileOnly}"
                >{{ order.order_currency_symbol }} {{ formatPrice(order.grand_total) }}</div>
                <div
                  :class="{'color-primary font-bold': isMobileOnly}"
                  v-else
                >{{ order.base_currency_symbol }} {{ formatPrice(order.base_grand_total) }}</div>
                <div v-if="isMobileOnly" class="font-12 color-gray">{{ order.payment_mode }}</div>
              </td>
              <td class="text-left" v-if="!isMobileOnly">{{ order.payment_mode }}</td>

              <td class="text-left" v-if="isMobileOnly">
                <button type="button" class="btn btn-pos-primary" @click="showSaleDetails(order)">
                  <i class="fa fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot v-else>
            <tr>
              <td
                class="text-center"
                colspan="7"
              >{{ $t("pos_product.menu_content.request_list.no_record_found") }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- detail sale -->
      <pos-common-modal id="saleDetails" :is-open="this.$root.posCommonModal.saleDetails">
        <h4 slot="header">{{ $t('pos_cashier.sale_details.title') }}</h4>
        <div slot="body">
          <sale-details :saleDetails="orderDetails" />
          <!-- <sale-details /> -->
        </div>
      </pos-common-modal>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { getOrders } from "@/api/order";
import { APP as getApp } from "@/store/getters";

export default {
  props: ["localObject"],
  data() {
    return {
      user_id: 0,
      drawer_id: 0,
      selected_currency: "",
      total_order: 0,
      today_sale_history: [],
      current_currency: window.pos_currency_code,
      pos_offline: 0,
      orderRequests: [],
      orderDetails: {}
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
    this.getTotalSale();
  },
  methods: {
    checkUserLogin() {
      this.pos_offline = this.$root.$root.offline;
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
        this.drawer_id = this.localObject.pos_drawer.user_id;
      }
    },
    getTotalSale() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        if (Object.keys(this.localObject.pos_sale_history).length > 0) {
          this.total_order = Object.keys(
            this.localObject.pos_sale_history
          ).length;
          this.today_sale_history = this.localObject.pos_sale_history;
        } else {
          this.total_order = 0;
          this.today_sale_history = [];
        }
      } else {
        // this.$http.get("/api/pos/auth/getOrders", {
        //     params: {
        //       user_id: this.user_id,
        //       page: 1
        //     }
        //   })

        getOrders({ user_id: this.user_id, page: 1 })
          .then(response => {
            if (response.data.data && response.data.data.length > 0) {
              this.today_sale_history = response.data.data;
              this.total_order = response.data.data.length;

              EventBus.$emit("setLocalForage", {
                key: "pos_sale_history",
                data: JSON.stringify(this.today_sale_history)
              });

              let totalPages = response.data.meta.last_page;

              for (let page = 2; page <= totalPages; page++) {
                this.orderRequests.push({
                  url: "/api/pos/auth/getOrders",
                  method: "get",
                  async: true,
                  params: {
                    user_id: this.user_id,
                    page: page
                  }
                });
              }
            } else {
              this.today_sale_history = [];
              this.total_order = 0;
              EventBus.$emit("setLocalForage", {
                key: "pos_sale_history",
                data: JSON.stringify(this.today_sale_history)
              });
            }
          })
          .finally(() => this.NextOrderRequest());
      }
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    NextOrderRequest() {
      var thisthis = this;
      if (thisthis.orderRequests.length) {
        thisthis.$root
          .$http(thisthis.orderRequests.shift())
          .then(function(response) {
            if (response.data.data && response.data.data.length > 0) {
              thisthis.today_sale_history = thisthis.today_sale_history.concat(
                response.data.data
              );

              thisthis.total_order =
                thisthis.total_order + response.data.data.length;

              EventBus.$emit("setLocalForage", {
                key: "pos_sale_history",
                data: JSON.stringify(thisthis.today_sale_history)
              });
            }
          })
          .finally(() => thisthis.NextOrderRequest());
      }
    },
    showSaleDetails(order) {
      this.orderDetails = order;
      this.$root.hideCommonModal("saleDetails");

      console.log("showSaleDetails", this.orderDetails);

      setTimeout(function() {
        EventBus.$emit("showCommonModal", "saleDetails"); //run showCommonModal requestQuantity
      }, 500);
    }
  }
};
</script>