<template>
    <ul class="modal-categories">
        <pos-category-item v-if="isMobileOnly"
            :item="{id: null, name:'All', children: []}">
        </pos-category-item>
        <pos-category-item
            v-for="(item, index) in items"
            :key="index"
            :item="item"
            :parent="index">
        </pos-category-item>
    </ul>
</template>


<script>
import { APP as getApp } from "@/store/getters";

    export default {
        props: {
            categories: {
                type: [Array, String, Object],
                required: false,
                default: () => ([])
            }
        },
        data() {
            return {
                items_count: 0,
            };
        },
        computed: {
            items () {
                return this.categories;
            },
            isMobileOnly() { return this.$store.getters[ getApp.ISMOBILEONLY ] }
        },
    }
</script>