<template>
  <div>
    <div
      :class="!isMobileOnly ? 'cashier-close-panel pos-col-12' : 'container mt-2'"
      v-if="isUserLogin"
    >
      <!-- warning -->
      <div class="message-alert warning" v-if="pos_offline">{{ $t('pos_view.error_offline_mode') }}</div>

      <form
        autocomplete="off"
        @submit.prevent="closeDrawer"
        method="POST"
        :class="{ row : isMobileOnly }"
      >
        <div :class="isMobileOnly ? 'col-12 pr-0 pl-0 mb-2' : 'pos-col-4'">
          <div class="container-panel-header">
            <h3
              :class="{ 'color-primary': isMobileOnly }"
            >{{ $t('pos_cashier.menu_content.close_counter.text_drawer_amount') }}</h3>
          </div>

          <div class="cashier_content">
            <div class="detail_section" :class="{'pb-1': isMobileOnly}">
              <label
                :class="{'mb-0 color-gray': isMobileOnly}"
              >{{ $t('pos_cashier.menu_content.close_counter.text_open_amount') }}</label>
              <label
                :class="{'font-bold': isMobileOnly}"
              >{{ selected_currency }} {{ formatPrice(opening_amount) }}</label>
            </div>

            <!-- <div class="detail_section">
              <label>{{ $t('pos_cashier.menu_content.close_counter.text_total_cash') }}</label>
              <label class="cash_total">{{ selected_currency }}{{ today_cash_total }}</label>
            </div>-->

            <div class="detail_section" :class="{'pt-0 pb-1': isMobileOnly}">
              <label
                :class="{'mb-0 color-gray': isMobileOnly}"
              >{{ $t('pos_cashier.menu_content.close_counter.text_current_drawer_sale') }}</label>
              <label
                class="cash_total"
                :class="{'font-bold': isMobileOnly}"
              >{{ selected_currency }} {{ f_current_drawer_sale }}</label>
            </div>

            <div class="detail_section" :class="{'pt-1': isMobileOnly}">
              <label
                :class="{'mb-0 color-gray': isMobileOnly}"
              >{{ $t('pos_cashier.menu_content.close_counter.text_expected_amount') }}</label>
              <label
                class="main_total"
                :class="{'font-bold': isMobileOnly}"
              >{{ selected_currency }} {{ expected_amount }}</label>
            </div>
          </div>
        </div>

        <div :class="isMobileOnly ? 'col-12 pr-0 pl-0 mb-2' : 'pos-col-4'">
          <div class="container-panel-header">
            <h3
              :class="{ 'color-primary': isMobileOnly }"
            >{{ $t('pos_cashier.menu_content.close_counter.text_counted_amount') }}</h3>
          </div>

          <div class="cashier_content">
            <div class="detail_section control-group" :class="{'mb-0': isMobileOnly}">
              <label
                :class="{'mb-0 mt-0': isMobileOnly}"
              >{{ $t('pos_cashier.menu_content.close_counter.text_amount', { currency: selected_currency }) }}</label>
              <input
                type="text"
                class="control"
                :class="{'mt-0': isMobileOnly}"
                id="total_amount"
                name="total_amount"
                v-model="amount"
              />
            </div>

            <div
              class="detail_section control-group"
              :class="[this.errors.has('remark') ? 'has-error' : '']"
            >
              <label
                for="remark"
                class="required"
                :class="{'mb-0': isMobileOnly}"
              >{{ $t('pos_cashier.menu_content.close_counter.text_remark') }}</label>
              <textarea
                v-if="!isMobileOnly"
                class="control"
                v-validate="'required|max:250'"
                name="remark"
                id="remark"
                v-model="remark"
                :placeholder="$t('pos_cashier.menu_content.close_counter.text_remark_placeholder')"
              ></textarea>
              <input
                v-else
                type="text"
                name="remark"
                id="remark"
                class="control mt-0"
                v-model="remark"
                v-validate="'required|max:250'"
                :placeholder="$t('pos_cashier.menu_content.close_counter.text_remark_placeholder')"
              />
              <span
                class="control-error"
                v-if="this.errors.has('remark')"
              >{{ this.errors.first('remark') }}</span>
            </div>
          </div>
        </div>

        <div :class="isMobileOnly ? 'col-12 pr-0 pl-0' : 'pos-col-4'">
          <div class="container-panel-header">
            <h3
              :class="{ 'color-primary': isMobileOnly }"
            >{{ $t('pos_cashier.menu_content.close_counter.text_closing_details') }}</h3>
          </div>
          <div class="cashier_content">
            <div class="detail_section">
              <label>{{ $t('pos_cashier.menu_content.close_counter.text_difference') }}</label>
              <label></label>
            </div>

            <div class="detail_section" v-if="!isMobileOnly">
              <label
                class="main_total"
                v-if="difference_status"
              >{{ selected_currency }} {{ difference_amount }}</label>
              <label class="main_total not_applicable" v-else>N/A</label>
            </div>
          </div>

          <div :class="!isMobileOnly ? 'pos-action text-left' : 'mb-3'">
            <button
              class="btn btn-lg btn-pos-primary"
              :class="{'btn-block': isMobileOnly}"
              type="submit"
              :text="$t('pos_cashier.menu_content.close_counter.button_close_drawer')"
            >{{ $t('pos_cashier.menu_content.close_counter.button_close_drawer') }}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { getDrawerDetail, updateDrawer } from "@/api/drawer";
import { getOrders } from "@/api/order";

import { APP as getApp } from "@/store/getters";

export default {
  props: ["localObject"],
  data() {
    return {
      user_id: 0,
      drawer_id: 0,
      opening_amount: 0,
      today_cash_total: 0,
      expected_amount: 0,
      amount: 0,
      selected_currency: window.pos_currency_symbol,
      current_symbol: "",
      order_currency_code: "",
      current_drawer_sale: 0,
      f_current_drawer_sale: 0,
      remark: "",
      difference_status: false,
      difference_amount: 0,
      pos_offline: 0,
      error_offline_action: this.$t("pos_view.error_offline_action"),
      response_status: false
    };
  },
  computed: {
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    },
    isUserLogin() {
      this.checkUserLogin();
      this.pos_offline = this.$root.$root.offline;
      return this.user_id;
    }
  },
  mounted() {
    this.getDrawerDetails();
    this.getTotalSale();
  },
  methods: {
    checkUserLogin() {
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
      }
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    getDrawerDetails() {
      this.pos_offline = this.$root.$root.offline;
      if (!this.pos_offline) {
        // this.$http.post("/api/pos/auth/getDrawerDetails", { user_id: this.user_id })
        getDrawerDetail(this.user_id)
          .then(response => {
            if (response.data.status && response.data.drawer_data.id) {
              this.localObject.pos_drawer = response.data.drawer_data;
              this.current_symbol = this.localObject.pos_drawer.base_symbol;
              this.opening_amount = this.localObject.pos_drawer.opening_amount;

              this.getCurrentDrawer();

              EventBus.$emit("setLocalForage", {
                key: "pos_drawer",
                data: JSON.stringify(response.data.drawer_data)
              });
            }
          })
          .catch(function(error) {});
      }
    },
    getCurrentDrawer() {
      /* this.$http.get("/api/pos/auth/getOrders", {
          params: {
            user_id: this.user_id,
            filter_date: true,
            filter_drawer_id: this.localObject.pos_drawer.id,
            filter_amount: "cash"
          }
        }) */

      const params = {
        user_id: this.user_id,
        filter_date: true,
        filter_drawer_id: this.localObject.pos_drawer.id,
        filter_amount: "cash"
      }
      getOrders(params)
        .then(response => {
          if (response.data.data && response.data.data.length == 1) {
            if (response.data.data[0].id) {
              this.selected_currency =
                response.data.data[0].base_currency_symbol;

              this.f_current_drawer_sale = this.formatPrice(
                response.data.data[0].base_total_amount
              );
              this.current_drawer_sale =
                response.data.data[0].base_total_amount;

              this.expected_amount = this.amount = this.formatPrice(
                parseFloat(this.localObject.pos_drawer.opening_amount) +
                  parseFloat(response.data.data[0].base_total_amount)
              );

              if (
                parseFloat(this.localObject.pos_drawer.opening_amount) >
                parseFloat(this.current_drawer_sale)
              ) {
                this.difference_status = true;
                this.difference_amount = this.formatPrice(
                  parseFloat(this.localObject.pos_drawer.opening_amount) -
                    parseFloat(this.current_drawer_sale)
                );
              }
            }
          } else {
            this.current_drawer_sale = 0;
            this.f_current_drawer_sale = 0;
            this.expected_amount = this.amount = this.formatPrice(
              parseFloat(this.localObject.pos_drawer.opening_amount)
            );
            this.difference_status = true;
            this.difference_amount = this.formatPrice(
              parseFloat(this.localObject.pos_drawer.opening_amount)
            );
            this.selected_currency = window.base_currency_symbol;
          }
        })
        .catch(function(error) {});
    },
    getTotalSale() {
      this.pos_offline = this.$root.$root.offline;
      if (!this.pos_offline) {
        /*this.$http.get("/api/pos/auth/getOrders", {
            params: {
              user_id: this.user_id,
              filter_date: true,
              filter_amount: "cash"
            }
          }) */

        const params = {
          user_id: this.user_id,
          filter_date: true,
          filter_amount: "cash"
        }
        getOrders(params)
          .then(response => {
            if (response.data.data && response.data.data.length == 1) {
              if (response.data.data[0].id) {
                this.selected_currency =
                  response.data.data[0].base_currency_symbol;

                this.today_cash_total = this.formatPrice(
                  response.data.data[0].base_total_amount
                );
              }
            } else {
              this.selected_currency = window.base_currency_symbol;
              this.today_cash_total = 0;
            }
          })
          .catch(e => {
            console.error(e);
          });
      }
    },
    closeDrawer() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        this.$toast.warning(this.error_offline_action, {
          position: "top-right",
          duration: 2000
        });
      } else {        
        this.$validator.validateAll().then(result => {
          // console.log("current_drawer", this.f_current_drawer_sale)
          if (result) {
            this.$root.toggleButtonDisable(true);

            const params = {
              user_id: this.user_id,
              closing_amount: this.amount,
              remark: this.remark,
              update_status: true,
              current_drawer: this.f_current_drawer_sale
            };

            /* this.$http.post("/api/pos/auth/updateDrawer", {
                user_id: this.user_id,
                // amount: this.amount,
                closing_amount: this.amount,
                // currency: window.pos_currency_code,
                remark: this.remark,
                // update_status: this.current_drawer_sale ? true : false,
                update_status: true,
                // status: 0
                current_drawer: this.f_current_drawer_sale
              }) */

            updateDrawer(params)
              .then(response => {
                // console.log("close", response)
                if (!response.data.status) {
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
                  this.$root.toggleButtonDisable(false);

                  this.opening_amount = this.amount;
                  this.remark = "";
                  this.current_drawer_sale = 0;
                  this.f_current_drawer_sale = 0;
                  this.difference_amount = 0;
                  this.difference_status = false;
                  this.response_status = true;

                  // this.$router.push({ name: "pos_cashier_closecounter" });
                  EventBus.$emit("deleteLocalForage", "pos_drawer");
                  this.$router.push({ name: response.data.route });
                }
              })
              .finally(() => {
                if (this.response_status) {
                  setTimeout(() => {
                    // this.errors.remove("remark");
                  });
                }
              })
              .catch(e => {                
                this.$toast.error('something wrong', {
                    position: "top-right",
                    duration: 2000
                  })
                  
                this.$root.toggleButtonDisable(false);
                console.error(e);
              });
          } else {
            this.$root.toggleButtonDisable(false);
          }
        });
      }
    }
  }
};
</script>