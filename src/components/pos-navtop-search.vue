
<template>

    <div class="pos-navbar-top-search" v-if="isDisableStatus" >
        <div class="search-content">
            <i class="fa fa-search"></i>
            <input type="text" class="search-field" id="nav-search" :placeholder="placeholder" :disabled="!disableStatus" v-model="search_product" @keyup="searchPosProduct" />
            <i class="fa fa-barcode" v-if="hide_barcode == 0" @click="showBarcodeSearch('barcodeModal')"></i>
        </div>
    </div>    
    
</template>

<script>

    export default {
        props: ['disableStatus'],
        data() {
            return {
                search_product: '',
                search_option: window.search_option,
                placeholder: '',
                hide_barcode: window.hide_barcode,
            };
        },
        computed: {
            isDisableStatus () {
                /* if (!this.disableStatus) {
                    this.search_product = '';
                } */
                return true;
            }
        },
        created() {

            if (this.search_option == 1) {
                this.placeholder = this.$t('pos_home.navtop.search_placeholder');
            } else {
                this.placeholder = this.$t('pos_home.navtop.search_barcode_placeholder');
            }
        },
        watch: {
            disableStatus: function(value) {
                if (!value) {
                    this.search_product = '';
                }
            }
        },
        methods: {
            searchPosProduct(event) {
                if (this.search_option == 1) {
                    if ((event.keyCode > 48 && event.keyCode < 90) || event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 46) {
                        EventBus.$emit('searchPosProduct', this.search_product);
                    }
                } else {
                    EventBus.$emit('barcodeFilter', {'search_keyword': this.search_product, 'event': event});
                }
            },
            showBarcodeSearch(modalId) {
                EventBus.$emit('showCommonModal', modalId);
                setTimeout(function(){
                    $('#search_barcode').val('');
                    $('#search_barcode').focus();
                },50);
            },
        },
    }

</script>
