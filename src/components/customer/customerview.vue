
<template>
    <div class="customer-view-panel">
        <div class="customer_details" v-if="selected_customer_email">
            <div class="customer-profile-icon">
                <i class="fa fa-user-circle"></i>
            </div>
            <div class="customer-name">
                {{ selectedCustomer.name }}
            </div>
            <div class="customer-contact" v-if="selectedCustomer.phone">
                <i class="fa fa-mobile"></i>
                {{ selectedCustomer.phone }}
            </div>

            <div class="customer-contact" v-if="selectedCustomer.email">
                <i class="fa fa-envelope"></i>
                {{ selectedCustomer.email }}
            </div>

            <div class="customer-contact" v-if="selectedCustomer.faddresses">
                <i class="fa fa-map-marker"></i>
                {{ selectedCustomer.faddresses }}
            </div>

            <div class="pos-action text-center">
                <button class="btn btn-xlg btn-pos-primary" @click="selectCustomer(selectedCustomer)" type="button" :text="$t('pos_customer.menu_content.button_select_customer')" > {{ $t('pos_customer.menu_content.button_select_customer') }} </button>
            </div>

            <div :class="{'customer_modity_action': true, 'edit_remove': selectedCustomer.currentActive }">
                <div class="modify_customer" v-if="!offline_status && detailShown" @click="editCustomerModal(selectedCustomer)">
                    <i class="fa fa-pencil"></i>
                    {{ $t('pos_customer.menu_content.text_detail') }}
                </div>
                <div class="remove_customer" v-if="currentActiveCustomer" @click="onRemoveCustomer">
                    <i class="fa fa-trash"></i>
                    {{ $t('pos_customer.menu_content.text_remove') }}
                </div>
            </div>
        </div>
        <div class="customer_details" v-else >
            <div class="message-alert danger">
                {{ $t('pos_customer.error.no_customer_selected') }}
            </div>
        </div>

        <div class="add_customer">
            <div class="customer-add-icon" @click="showCustomerModal('addCustomer')">
                <i class="fa fa-plus"></i>
            </div>
            <div class="customer-add-text">
                {{ $t('pos_customer.menu_content.add_customer') }}
            </div>
        </div>

        <pos-common-modal id="addCustomer" :is-open="this.$root.posCommonModal.addCustomer" @modalclosing="readonly = null">
            <h4 slot="header" v-if="!customer_email">{{ $t('pos_customer.menu_content.add_customer') }}</h4>
            <h4 slot="header" v-else >{{ $t('pos_customer.menu_content.customer_detail') }}</h4>
            
            <div slot="body">
                <customer-form
                    :readonly=readonly
                    :customer_email='customer_email'
                    :customer_data='customer_data'
                    :customer_groups="customer_groups"
                    :localObject='localObject'
                ></customer-form>
            </div>
        </pos-common-modal>
    </div>
</template>

<script>
    
    export default {
        //props: ['selected_customer_email', 'selectedCustomer', 'localObject', 'detailShown'],
        props:{
             selected_customer_email:String
            ,selectedCustomer:Object
            ,localObject:Object
            ,detailShown:Boolean
        },
        data() {
            return {
                readonly:null,
                offline_status: false,
                customer_email: '',
                customer_data: {},
                customer_groups: [],
                success_already_message: this.$t('pos_customer.menu_content.success_customer_already_cart'),
            };
        },
        created() {
            this.getCustomerGroups();

            EventBus.$on('removeCartCustomer', () => {
                this.onRemoveCustomer();
            });
        },
        computed:{
            currentActiveCustomer() {
                let v = this.selectedCustomer
                return v && v.currentActive
            }
        },
        methods: {
            getCustomerGroups() {
                if (this.$root.offline) {
                    this.offline_status = true;

                    if ( Object.keys(this.localObject.pos_customer_groups).length > 0 ) {
                        this.customer_groups = this.localObject.pos_customer_groups;
                    } else {
                        this.customer_groups = [];
                    }
                } else {
                    this.offline_status = false;
                    this.$http.get('/api/pos/getGroups')
                    .then((response)  =>  {
                        if (response.data.data && response.data.data.length > 0) {
                            this.customer_groups = response.data.data;

                            EventBus.$emit('setLocalForage', {'key': 'pos_customer_groups', 'data': JSON.stringify(this.customer_groups)});
                        } else {
                            this.customer_groups = [];
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    });
                }
                
            },
            showCustomerModal(modalId) {
                this.customer_email = 0;
                this.customer_data = {};
                EventBus.$emit('showCommonModal', modalId);
            },
            editCustomerModal(customer) {
                this.customer_email = customer.email;
                this.customer_data = customer;
                this.readonly = true
                EventBus.$emit('showCommonModal', 'addCustomer');
            },
            selectCustomer(customer) {
                if (customer.email) {
                    customer.currentActive = true;

                    if (this.localObject.pos_cart_customer.email && this.localObject.pos_cart_customer.email == customer.email) {
                        this.$toast.warning(this.success_already_message, {
                            position: 'top-right',
                            duration: 2000,
                        });
                    } else {
                        this.$emit('onChangeCustomer', customer);
                    }
                }
            },
            onRemoveCustomer() {
                this.$emit('onRemoveCustomer');
            }
        }
    }
</script>
