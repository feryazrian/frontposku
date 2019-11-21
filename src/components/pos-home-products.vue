<template>
    <div class="product-list" :class="[ isMobileOnly ? 'background-light' : 'product-grid-5' ]" v-if="pos_product_count">
        <div v-for="(product, i) in pos_products" :key="i" v-show="qtyCheck(product)">
            <div class="product-layout" @click="updateCart(product)">
                <div class="product-thumb">
                    <img v-if="product.base_image.small_image_url" :src="product.base_image.small_image_url"  />
                    <label v-else class="product-placeholder"></label>
                    <span class="product-discount" v-if="product.formated_special_price" :title="$t('pos_home.pos_products.product_discount_tooltip')">
                        <i class="fa fa-star"></i>
                    </span>
                    <span class="product-variations" v-if="product.type == 'configurable'" :title="$t('pos_home.pos_products.product_variation_tooltip')">
                        <i class="fa fa-plus"></i>
                    </span>
                </div>
                <div class="product-name">
                    {{ product.name }}
                </div>
                <div class="product-price">
                    <span :class="{'price': true, 'price-cross': product.formated_special_price}">
                        {{ product.formated_price }}
                    </span>
                    <span v-if="product.formated_special_price" class="special-price">
                        {{ product.formated_special_price }}
                    </span>
                </div>
            </div>
        </div>

        <pos-common-modal id="productVariationModal" :is-open="this.$root.posCommonModal.productVariationModal">
            <h4 slot="header">{{ $t('pos_home.pos_products.product_variation') }}</h4>
            
            <div slot="body" v-if="product_details.id">
                <product-options
                    :product="product_details"
                    :product_variations="product_details.variants"
                ></product-options>
            </div>
        </pos-common-modal>
        
    </div>
    <div v-else class="message-alert danger">
        {{ $t("pos_home.pos_products.error.no_product") }}
    </div>
</template>

<script>
import { APP as getApp } from "@/store/getters";

    export default {
        props: ['pos_products', 'pos_product_count', 'localObject'],
        data() {
            return {
                product_details: Object,
                posModalId: '',
                showModel: false,
                idModal: ''
            }
        },
        created () {
            this.closeModal();

            EventBus.$on('showVariantModal', (product) => {
                this.product_details = product;
                EventBus.$emit('showCommonModal', 'productVariationModal');
            });
        },
        computed: {
            isModalOpen () {
                this.addClassToBody();
                return this.showModel;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
        methods: {
            closeModal () {
                this.showModel = false,
                this.idModal = '';
            },

            addClassToBody () {
                var body = document.querySelector("body");
                if(this.showModel) {
                    body.classList.add("pos-modal");
                } else {
                    body.classList.remove("pos-modal");
                }
            },
            updateCart(product) {
                if ( product.type == 'configurable' ) {
                    this.product_details = product;
                    EventBus.$emit('showCommonModal', 'productVariationModal');
                } else {
                    EventBus.$emit('cartAddProduct', product);
                }
            },
            qtyCheck(product) {
                var thisthis = this;
                let qty = JSON.parse(product.quantity);

                if (product.type == 'simple') {
                    let remaining_quantity = qty[product.id];

                    if (Object.keys(thisthis.localObject.pos_offline_orders).length > 0) {
                        var totalOrderProductQty = 0;
                        $.each(thisthis.localObject.pos_offline_orders, function(key, offlineOrder) {
                            totalOrderProductQty = totalOrderProductQty + thisthis.checkOrderProduct(offlineOrder.order_data.items, product);
                        });
                        remaining_quantity = remaining_quantity - totalOrderProductQty;
                    }

                    if (parseInt(remaining_quantity) > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    let flag_qty = 0;
                    $.each(qty, (key, product_qty) => {
                        if (product_qty > 0) {
                            flag_qty = 1;
                            
                            return false;
                        }
                    })

                    if (flag_qty) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            checkOrderProduct(orderItems, product) {
                var orderProductQty = 0;
                $.each(orderItems, function(key, orderProduct) {
                    if ( parseInt(orderProduct.id) == parseInt(product.id) ) {
                        orderProductQty = orderProductQty + orderProduct.qty_ordered;
                    }
                });
                return orderProductQty;
            }
        }
    }
</script>
