<template>
    <div class="pos-discount-form" v-if="isUserLogin">

        <form autocomplete="off" @submit.prevent="customAction" method="POST">
            <div class="page-content">
                <div class="form-container">

                    <div class="pos-discount-fields">
                        <div class="control-group" :class="[this.errors.has('name') ? 'has-error' : '']">
                            <label for="name" class="required" v-text="$t('pos_home.navtop.entry_product_name')"></label>
                            <input type="text" class="control" name="name" v-validate="'required'" v-bind:style="{ 'width': width }" v-model="name">
                            <span class="control-error" v-if="this.errors.has('name')">{{ this.errors.first('name') }}</span>
                        </div>

                        <div class="control-group" :class="[this.errors.has('price') ? 'has-error' : '']">
                            <label for="price" class="required" v-text="$t('pos_home.navtop.entry_price')"></label>
                            <input type="text" class="control" name="price" v-validate="'required|nullable|decimal:2'" v-bind:style="{ 'width': width }" v-model="price">
                            <span class="control-error" v-if="this.errors.has('price')">{{ this.errors.first('price') }}</span>
                        </div>

                        <div class="control-group" :class="[this.errors.has('quantity') ? 'has-error' : '']">
                            <label for="quantity" class="required" v-text="$t('pos_home.navtop.entry_quantity')"></label>
                            <input type="number" class="control" name="quantity" v-validate="'required|nullable|numeric'" v-bind:style="{ 'width': width }" v-model="quantity">
                            <span class="control-error" v-if="this.errors.has('quantity')">{{ this.errors.first('quantity') }}</span>
                        </div>

                        <div class="pos-action text-center">
                            <button class="btn btn-lg btn-pos-dark" type="submit" :text="$t('pos_home.navtop.button_cart')"> {{ $t('pos_home.navtop.button_cart') }} </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['pos_current_cart', 'pos_carts', 'localObject'],
        data() {
            return {
                width: '90%',
                name: '',
                price: '',
                quantity: 1,
                user_id: 0,
                success_custom_product: this.$t('pos_home.navtop.success_add_to_cart'),
            };
        },
        computed: {
            isUserLogin () {
                this.checkUserLogin();

                return this.user_id;
            }
        },
        methods: {
            checkUserLogin() {
                if (this.localObject.pos_cashier.id) {
                    this.user_id = this.localObject.pos_cashier.id;
                }
            },
            customAction () {
                var thisthis = this;
                var cart_products = {};
                this.$root.toggleButtonDisable(true);
                
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if ( (parseInt(this.quantity) < 1) || (parseFloat(this.price) < 0) ) {
                            this.$toast.error('Warning: Please provide the correct quantity and price for the custom product!', {
                                position: 'top-right',
                                duration: 2000,
                            });
                            
                            this.$root.toggleButtonDisable(false);
                        } else {
                            
                            if (thisthis.pos_carts[thisthis.pos_current_cart]) {
                                $.each(thisthis.pos_carts[thisthis.pos_current_cart], function(key, product) {
                                    product.active = false;
                                    cart_products[key] = product;
                                });
                                this.$set(thisthis.pos_carts, thisthis.pos_current_cart, cart_products);

                                var custom_product = {
                                    id: 0,
                                    active: true,
                                    type: 'simple',
                                    sku: 'custom',
                                    name: thisthis.name,
                                    quantity: thisthis.quantity,
                                    price: parseFloat(thisthis.price).toFixed(2),
                                    f_price: window.pos_currency_symbol + parseFloat(thisthis.price).toFixed(2),
                                    special_price: 'NaN',
                                    total: parseFloat(thisthis.price * thisthis.quantity).toFixed(2),
                                    ftotal: window.pos_currency_symbol + parseFloat(thisthis.price * thisthis.quantity).toFixed(2),
                                }
                                let index = Object.keys(thisthis.pos_carts[thisthis.pos_current_cart]).length;

                                this.$set(thisthis.pos_carts[thisthis.pos_current_cart], index, custom_product);

                                EventBus.$emit('setLocalForage', {'key': 'pos_carts', 'data': JSON.stringify(thisthis.pos_carts)});

                                this.$toast.success(this.success_custom_product, {
                                    position: 'top-right',
                                    duration: 2000,
                                });

                                this.$root.hideCommonModal('addCustomProduct');
                                this.$root.toggleButtonDisable(false);
                            } else {
                                this.$toast.error('Warning: Choose cart first!', {
                                    position: 'top-right',
                                    duration: 2000,
                                });
                                this.$root.hideCommonModal('addCustomProduct');
                                this.$root.toggleButtonDisable(false);
                            }
                        }
                    } else {
                        this.$root.toggleButtonDisable(false);
                    }
                });
            }
        }
    }
</script>