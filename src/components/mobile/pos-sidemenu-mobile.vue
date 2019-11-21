<template>
    <div v-if="isUserLogin" class="sidenav" :class="{'show': showHamburgerMenu}">
        <div id="wave" class="sidenav-item outlet">
        <div class="outlet-qr-container">
            
        </div>
        <div class="vl-dark"></div>
        <div class="outlet-info-container">
            <p>{{ outlet.name }}</p>
            <router-link :to="{ path: 'view-outlet' }"><i class="fa fa-eye"></i> {{ $t("pos_home.navleft.view_outlet") }}</router-link>
        </div>
        </div>
        <ul class="sidenav-item">
        <li v-for='menu in pos_menus' :key="menu.id">
            <router-link class="nav-link" :to="{ path: menu.route }">
                <span class="icon"><i :class="menu.iconClass"></i></span> {{ menu.name }}
            </router-link>
        </li>
        <li>
            <router-link class="nav-link" :to="{ path: 'help' }">
                <span class="icon fa fa-question-circle"></span> {{ $t("pos_home.navleft.help") }}
            </router-link>
        </li>
        <li>
            <a class="nav-link" @click="userLogout(user_id)">
                <span class="icon fa fa-sign-out"></span> {{ $t("pos_home.navleft.logout") }}
            </a>
        </li>
        </ul>
    </div>
</template>

<script>
import { navMenus } from '@/api'

export default {
  props: ["localObject"],
  data() {
    return {
      showHamburgerMenu: false,
      user_id: 0,
      outlet: {},
      pos_menus: []
    };
  },
  computed: {
    isUserLogin() {
      this.checkPosUserLogin();
      return this.user_id;
    }
  },
  beforeDestroy () {
      EventBus.$off('showSideMenu');
  },
  created() {
    this.checkPosUserLogin();
    EventBus.$on('showSideMenu', (value) => {
        this.showHamburgerMenu = value
    });
  },
  mounted() {
    this.getPosNavMenus();
  },
  methods: {
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
    checkPosUserLogin() {
      if (this.$route.name == "pos_home") {
        this.disable_status = true;
      } else {
        this.disable_status = false;
      }
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
        this.outlet = {
          id : this.localObject.pos_cashier.outlet_id,
          name : this.localObject.pos_cashier.outlet_name || 'Outlet'
        }
      }
    },
    userLogout(user_id) {
      this.$store.dispatch('logout', user_id)
      // this.$http.post("/api/pos/auth/destroy", { user_id: user_id })
      // logout(user_id)
      //   .then(response => {
      //     if (response.data.route) {
      //       this.$store.dispatch("logout", user_id);
      //       this.$router.push({ name: response.data.route });
      //     }
      //   })
      //   .catch(e => {
      //       console.log(e)
      //     });
    },
  }
};
</script>
