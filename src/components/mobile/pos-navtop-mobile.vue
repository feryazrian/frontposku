<template>
  <div class="pos-navbar-top" v-if="isUserLogin" :class="{'balanced': header === 'pos_home'}">
    <div class="pos-navbar-top-heading" v-if="header === 'pos_home'">
      <router-link to="/pos/home" :title="$t('pos_home.navtop.heading')" class="logo-pos">&nbsp;</router-link>
    </div>
    <div class="pos-navbar-top-title" v-else>
      {{ $t([header]+ ".header") }}
    </div>

    <div ref="hamburgerButton" class="sidenav-toggle" v-show="header === 'pos_home'"><i class="fa fa-bars"></i></div>
    <div ref="backButton" class="back-toggle" v-show="header !== 'pos_home'">
      <a @click="$router.go(-1)" class="fa fa-long-arrow-left">&nbsp;</a>
    </div>

    <div ref="othermenu" class="other-menu" :class="{'open' : showOtherMenu}" v-show="header === 'pos_home'">
        <i class="fa fa-ellipsis-v"></i>
        <ul class="dropdown-menu">
            <li class="item nav-wifi online_label" @click="offlineManage(true)" >
                <i class="icon fa fa-wifi"></i> {{ $t("pos_home.navtop.offline_mode") }}
            </li>
            <li class="item nav-reload" @click="reloadPosData">
                <i class="icon fa fa-sync"></i> {{ $t("pos_home.navtop.refresh") }}
            </li>
        </ul>
    </div>
    <div class="other-menu" :class="{'open' : showOtherMenu}" v-show="header === 'pos_cart_details'">
      <span><i class="icon icon-discount" @click="addDiscount"></i></span>
      <span><i class="icon icon-delete" @click="removeCart"></i></span>
    </div>
  </div>
</template>

<script>
import { navMenus } from '@/api'

import { API as getApi } from "@/store/getters";
import { mapGetters } from "vuex";

export default {
  props: ["localObject"],
  data() {
    return {
      //showHamburgerMenu: false,
      showOtherMenu: false,
      pos_user: {},
      user_id: 0,
      pos_menus: [],
      header: ''
    };
  },
  computed: {
    ...mapGetters({ logout: getApi.AUTH.LOGOUT }),

    isUserLogin() {
      this.checkPosUserLogin();
      return this.user_id;
    }
  },
  beforeDestroy () {
      window.removeEventListener('click', this.toggleSidebar);
  },
  created() {
    this.checkPosUserLogin();
    window.addEventListener('click', this.toggleSidebar);
  },
  mounted() {
    this.getPosNavMenus();    
  },
  methods: {
    toggleSidebar(e) {
      if (this.$refs.hamburgerButton.contains(e.target)) {
        this.showSideMenu(true)
      }
      else if (!this.$refs.hamburgerButton.contains(e.target)) {
        this.showSideMenu(false)
      }
      if(this.$refs.othermenu.contains(e.target)) {
          this.showOtherMenu = !this.showOtherMenu
      }
      else if (!this.$refs.othermenu.contains(e.target)) {
        this.showOtherMenu = false
      }
    },
    showSideMenu(value) {
      EventBus.$emit("showSideMenu", value);
    },
    getPosNavMenus() {
        if (Object.keys(this.localObject.pos_leftmenus).length != 0) {
            this.pos_menus = this.localObject.pos_leftmenus;
        } else {
            // this.$http.get('/api/pos/navmenus')
            navMenus()
            .then((response)  =>  {
                if (response.data.pos_menus) {
                    this.pos_menus = response.data.pos_menus;

                    EventBus.$emit('setLocalForage', {'key': 'pos_leftmenus', 'data': JSON.stringify(response.data.pos_menus)});
                }
            })
            .catch(e => {
              console.log(e)
            });
        }
    },
    showCustomModal(modalId) {
      EventBus.$emit("showCommonModal", modalId);
    },
    checkPosUserLogin() {
      this.header = this.$route.name
      /* if (this.$route.name == "pos_home") {
        this.disable_status = true;
      } else {
        this.disable_status = false;
      } */
      if (this.localObject.pos_cashier.id) {
        this.pos_user = this.localObject.pos_cashier;
        this.user_id = this.localObject.pos_cashier.id;
      }
    },
    reloadPosData() {
      this.localObject.pos_carts[0] = {};
      this.localObject.pos_current_cart = 0;

      this.$root.$setItem(
        "pos_carts",
        JSON.stringify(this.localObject.pos_carts)
      );
      this.$root.$setItem(
        "pos_current_cart",
        this.localObject.pos_current_cart
      );

      this.localObject.pos_products = [];
      this.$root.$setItem(
        "pos_products",
        JSON.stringify(this.localObject.pos_products)
      );

      this.localObject.pos_categories = {};
      this.$root.$setItem(
        "pos_categories",
        JSON.stringify(this.localObject.pos_categories)
      );

      this.localObject.pos_product_categories = {};
      this.$root.$setItem(
        "pos_product_categories",
        JSON.stringify(this.localObject.pos_product_categories)
      );

      this.localObject.pos_orders = [];
      this.$root.$setItem(
        "pos_sale_history",
        JSON.stringify(this.localObject.pos_orders)
      );

      this.localObject.pos_customers = [];
      this.$root.$setItem(
        "pos_customers",
        JSON.stringify(this.localObject.pos_customers)
      );

      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    offlineManage(onLineStatus) {
      EventBus.$emit("checkWifi", onLineStatus);
    },
    addDiscount() {
      EventBus.$emit("openDiscountModal");
    },
    removeCart() {
      EventBus.$emit("removeOrderedCart", true);
    }
  }
};
</script>
