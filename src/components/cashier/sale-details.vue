<template>
  <div class="saleDetails">
    <div class="pos-table-responsive">
      <table class="pos-table pos-table-mobile">
        <tbody v-if="saleDetails.total_item_count > 0">
          <tr v-for="(item, index) in saleDetails.items" v-bind:key="index" class="border-top">
            <td class="text-left">
              <span class="order-id btn-outline-primary text-ellipsis">#{{ item.id }}</span>
            </td>
            <td class="text-left font-bold">
              <span class="text-capitalize">{{ item.name }}</span>
            </td>
            <td class="text-left">
              <span>({{ item.qty_ordered }})</span>
            </td>
            <td class="text-right">
              <div
                class="color-primary font-bold text-ellipsis"
                v-if="current_currency == saleDetails.order_currency_code"
              >{{ saleDetails.order_currency_symbol }} {{ formatPrice(item.base_grant_total) }}</div>
              <div
                class="color-primary font-bold text-ellipsis"
                v-else
              >{{ saleDetails.base_currency_symbol }} {{ formatPrice(item.base_grant_total) }}</div>

              <!-- <div v-if="isMobileOnly" class="font-12 color-gray">{{ order.payment_mode }}</div> -->
            </td>
            <!-- <td class="text-left" v-if="!isMobileOnly">{{ order.payment_mode }}</td> -->
          </tr>
          <tr class="border-top">
            <td class="text-left font-bold" colspan="2">{{ $t('pos_cashier.sale_details.base_grant_total') }}</td>
            <td class="text-right" colspan="2">
              <div
                class="color-primary font-bold text-ellipsis"
                v-if="current_currency == saleDetails.order_currency_code"
              >{{ saleDetails.order_currency_symbol }} {{ formatPrice(saleDetails.base_grand_total) }}</div>
              <div
                class="color-primary font-bold text-ellipsis"
                v-else
              >{{ saleDetails.base_currency_symbol }} {{ formatPrice(saleDetails.base_grand_total) }}</div>
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
  </div>
</template>

<script>
export default {
  props: ["saleDetails"],
  data() {
    return {
      current_currency: window.pos_currency_code
    };
  },
  mounted() {
    console.log("saleDetails", this.saleDetails)
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-sales {
}
</style>