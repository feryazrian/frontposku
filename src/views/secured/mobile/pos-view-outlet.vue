<template>
    <div class="pos-view-outlet mobile">
        <div class="message-alert warning" v-if="pos_offline">
            Warning: Currently you are in offline mode!
        </div>
        <form autocomplete="off" v-if="isUserLogin">
            <input type="hidden" name="user_id" v-model="user_id">
            <div class="control-group">
                <label for="outletname">{{ $t("pos_view_outlet.label_outlet_name") }}</label>
                <input type="text" class="control" name="outletname" v-model="outletname" disabled>
            </div>
            <div class="control-group">
                <label for="outletaddress">{{ $t("pos_view_outlet.label_outlet_address") }}</label>
                <input type="text" class="control" name="outletaddress" v-model="outletaddress" disabled>
            </div>
            <div class="control-group">
                <label for="outletstate">{{ $t("pos_view_outlet.label_outlet_state") }}</label>
                <input type="text" class="control" name="outletstate" v-model="outletstate" disabled>
            </div>
            <div class="control-group">
                <label for="outletcountry">{{ $t("pos_view_outlet.label_outlet_country") }}</label>
                <input type="text" class="control" name="outletcountry" v-model="outletcountry" disabled>
            </div>
            <div class="control-group">
                <label for="outletpostcode">{{ $t("pos_view_outlet.label_outlet_postcode") }}</label>
                <input type="text" class="control" name="outletpostcode" v-model="outletpostcode" disabled>
            </div>
        </form>
    </div>
</template>

<script>
/*eslint-disable*/

    export default {
        props: ['localObject'],
        data() {
            return {
                user_details: {},
                outletname: '',
                outletaddress: '',
                outletstate: '',
                outletcountry: '',
                outletpostcode: '',
                user_id: 0,
                pos_offline: 0,
            };
        },
        computed: {
            isUserLogin () {
                this.checkUserLogin();
                //this.pos_offline = this.$root.$root.offline;
                return this.user_id;
            },
        },
        mounted() {
            this.fillOutletData();
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                    this.user_details = this.localObject.pos_cashier;
                }
                this.pos_offline = this.$root.$root.offline;
            },
            fillOutletData() {
                if (this.user_id) {
                    this.outletname = this.user_details.outlet_name;
                    this.outletaddress = this.user_details.outlet_address.address1;
                    this.outletstate = this.user_details.outlet_address.state;
                    this.outletcountry = this.user_details.outlet_address.country;
                    this.outletpostcode = this.user_details.outlet_address.postcode;
                }
            }
        }
    }
</script>