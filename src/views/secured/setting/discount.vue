<template>
  <div>
    <div class="discount-panel">
      <div class="message-alert warning" v-if="pos_offline">{{ $t('pos_view.error_offline_mode') }}</div>

      <div
        :class="getIsMobileOnly ? 'fixed-btn btn-green-discount' : 'pos-setting-add'"
        v-if="!pos_offline"
      >
        <div class="setting-add-icon" @click="showDiscountModal('addDiscount')">
          <span v-if="getIsMobileOnly">{{ $t('pos_setting.menu_content.discount.add_discount') }}</span>
          <i v-if="!getIsMobileOnly" class="fa fa-plus"></i>
        </div>
        <div class="setting-add-text" v-if="!getIsMobileOnly">
          <span>{{ $t('pos_setting.menu_content.discount.add_discount') }}</span>
        </div>
      </div>
      <div class="pos-setting-list row-grid-5" v-if="pos_total_discount">
        <div class="pos-setting row-layout" v-for="(discount, index) in pos_discounts" :key="index">
          <div class="setting-list-name">
            <div class="name">{{ discount.offername }}</div>
            <div :class="getIsMobileOnly ? 'btn-group' : 'setting-list-action'" v-if="!pos_offline">
              <span
                :class="getIsMobileOnly ? 'button2' : 'discount-edit'"
                :disabled="pos_offline != 0"
                @click="editDiscountModal(discount)"
              >
                <i v-if="getIsMobileOnly">{{ discount.converted_value }}%</i>
                <i :class="getIsMobileOnly ? 'edit-discount-icon' : 'fa fa-pencil'"></i>
              </span>
              <span
                :class="getIsMobileOnly ? 'button5' : 'discount-remove'"
                :disabled="pos_offline != 0"
                @click="removeDiscount(discount.id)"
              >
                <i class="fa fa-trash"></i>
              </span>
            </div>
          </div>

          <div class="setting-list-rate" v-if="!getIsMobileOnly">
            <span v-if="discount.type == 'percentage'">{{ discount.converted_value }}%</span>
            <span v-else>{{ discount.fvalue }}</span>
          </div>
          <div
            class="setting-list-range"
          >{{ $t('pos_setting.menu_content.discount.text_range') }} {{ discount.ffromprice }} {{ $t('pos_setting.menu_content.discount.text_to') }} {{ discount.ftoprice }}</div>
        </div>
      </div>
      <div v-else class="message-alert danger">{{ $t("pos_setting.error.no_discount") }}</div>

      <pos-common-modal id="addDiscount" :is-open="this.$root.posCommonModal.addDiscount">
        <h4
          slot="header"
          v-if="!discount_id"
        >{{ $t('pos_setting.menu_content.discount.add_discount') }}</h4>
        <h4 slot="header" v-else>{{ $t('pos_setting.menu_content.discount.edit_discount') }}</h4>

        <div slot="body">
          <discount-form
            :discount_id="discount_id"
            :discount_data="discount_data"
            :localObject="localObject"
          ></discount-form>
        </div>
      </pos-common-modal>
    </div>
  </div>
</template>

<script>
import { APP as getApp } from "./../../../store/getters";
export default {
  props: ["localObject"],
  data() {
    return {
      discount_id: 0,
      discount_data: {},
      pos_discounts: [],
      pos_total_discount: 0,
      pos_offline: 0
    };
  },
  computed: {
    getIsMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  created() {
    this.getDiscounts();

    EventBus.$on("getUserDiscounts", () => {
      this.getDiscounts();
    });
  },
  methods: {
    showDiscountModal(modalId) {
      this.discount_id = 0;
      this.discount_data = {};
      EventBus.$emit("showCommonModal", modalId);
    },
    editDiscountModal(discount) {
      this.discount_id = discount.id;
      this.discount_data = discount;
      EventBus.$emit("showCommonModal", "addDiscount");
    },
    removeDiscount(discount_id) {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        this.$toast.error(this.$t("pos_view.error_offline_action"), {
          position: "top-right",
          duration: 2000
        });
      } else {
        if (this.localObject.pos_cashier.id) {
          this.$http
            .post("/api/pos/auth/deleteDiscount", {
              user_id: this.localObject.pos_cashier.id,
              discount_id: discount_id
            })
            .then(response => {
              if (!response.data.status) {
                this.$toast.warning(response.data.message, {
                  position: "top-right",
                  duration: 2000
                });
              } else {
                this.$toast.success(response.data.message, {
                  position: "top-right",
                  duration: 2000
                });
                this.getDiscounts();
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    },
    getDiscounts() {
      this.pos_offline = this.$root.$root.offline;

      if (this.localObject.pos_cashier.id) {
        if (this.pos_offline) {
          if (Object.keys(this.localObject.pos_discounts).length > 0) {
            this.pos_total_discount = Object.keys(
              this.localObject.pos_discounts
            ).length;
            this.pos_discounts = this.localObject.pos_discounts;
          } else {
            this.pos_total_discount = 0;
            this.pos_discounts = [];
          }
        } else {
          this.$http
            .get("/api/pos/auth/getDiscounts", {
              params: {
                user_id: this.localObject.pos_cashier.id
              }
            })
            .then(response => {
              if (response.data.data && response.data.data.length > 0) {
                this.pos_total_discount = response.data.data.length;
                this.pos_discounts = response.data.data;

                EventBus.$emit("setLocalForage", {
                  key: "pos_discounts",
                  data: JSON.stringify(this.pos_discounts)
                });
              } else {
                this.pos_discounts = [];
                this.pos_total_discount = 0;
                EventBus.$emit("setLocalForage", {
                  key: "pos_discounts",
                  data: JSON.stringify(this.pos_discounts)
                });
              }
            });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-group .button5 {
  background-color: #b31818;
  color: white;
  padding: 5px 2px;
  text-align: center;
  border-radius: 0 5px 5px 0;
  width: 8%;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
}

.btn-group .button2 {
  background-color: #4caf50;
  color: white;
  padding: 5px 5px;
  text-align: center;
  border-radius: 5px 0 0 5px;
  //   width: 21%;
  position: absolute;
  right: 28px;
  top: 5px;
  cursor: pointer;
}

// Loyalty Discount
.setting-list-name {
  display: grid;
  grid-template-columns: auto 100px;

  span {
    font-weight: bold;
    align-self: center;
    text-align: left;
    color: #28b318;
    text-transform: uppercase;
  }

  .btn-group {
    height: 30px;
    border-radius: 0;
    border: none;
  }
}

.btn-green-discount {
  width: 100%;
  color: #28b318;
  font-size: inherit;
  border-radius: 3px;
  border: 1px solid #28b318;
  background-color: #ffffff;
  padding: 14px;
  text-align: center;
}
.fixed-btn {
  left: 20px;
  background: white;
  width: 90%;
  position: fixed;
  bottom: 20px;
}
</style>