
<template>
  <div class="pos-setting-main" :class="{'mobile': isMobileOnly}">
    <div class="pos-nav-container">
      <ul class="pos-nav-lists">
        <li
          v-for="(menu, index) in pos_setting_menus"
          :key="index"
          :class="{ 'pos-nav': true }"
          :label="'menu_count_' + index"
        >
          <router-link
            class="nav-link"
            :class="{'fs-14px': isMobileOnly}"
            :to="{ path: menu.route }"
            replace
          >{{ menu.name }}</router-link>
        </li>
      </ul>
    </div>

    <div class="pos-nav-content">
      <router-view :localObject="localObject"></router-view>
    </div>
  </div>
</template>

<script>
import { APP as getApp } from "./../../store/getters";
export default {
  props: ["localObject"],
  data() {
    return {
      pos_setting_menus: [
        {
          code: "discount",
          name: this.$t("pos_setting.top_menu.discount"),
          route: "/pos/setting/discount"
        },
        // {
        //     'code': 'taxes',
        //     'name': this.$t('pos_setting.top_menu.taxes'),
        //     'route': '/pos/setting/taxes'
        // },
        {
          code: "basic",
          name: this.$t("pos_setting.top_menu.basic_settings"),
          route: "/pos/setting/basic"
        },
        {
          code: "profile",
          name: this.$t("pos_setting.top_menu.profile_setting"),
          route: "/pos/setting/profile"
        }
      ]
    };
  },
  computed: {
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  }
};
</script>
