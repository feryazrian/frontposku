
<template>
  <div class="pos-product-main" :class="{mobile: isMobileOnly}">
    <div class="pos-nav-container">
      <ul class="pos-nav-lists">
        <li
          v-for="(menu, index) in pos_product_menus"
          :key="index"
          :class="{ 'pos-nav': true }"
          :label="'menu_count_' + index"
        >
          <router-link class="nav-link" :to="{ path: menu.route }" replace>{{ menu.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="pos-nav-content" v-bind:style="{'height': container_height}">
      <router-view :localObject="localObject"></router-view>
    </div>
  </div>
</template>

<script>
import { APP as getApp } from "@/store/getters";
export default {
  props: ["localObject"],
  data() {
    return {
      pos_product_menus: [
        {
          code: "low_stock",
          name: this.$t("pos_product.top_menu.low_stock"),
          route: "/pos/product/lowstock"
        },
        {
          code: "requested_list",
          name: this.$t("pos_product.top_menu.request_list"),
          route: "/pos/product/requested"
        },
        {
          code: "product_setting",
          name: this.$t("pos_product.top_menu.setting"),
          route: "/pos/product/setting"
        }
      ],
      container_height: $(window).height() - 104 + "px"
    };
  },
  computed: {
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  }
};
</script>
