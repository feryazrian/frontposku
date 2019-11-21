<template>
    <div>
        <div class="pos-modal-overlay"></div>
        <div class="pos-modal-container" :id="id" v-if="isCommonModalOpen">
            <div class="modal-header">
                <slot name="header">
                    Default header
                </slot>
                <i v-if="!showClose" class="icon remove-icon"  @click="closeCommonModal" @mouseup="$emit('modalclosing')"></i>
            </div>

            <div class="modal-body">
                <slot name="body">
                    Default body
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id', 'isOpen', 'showClose'],
        created () {
            this.closeCommonModal();
        },
        computed: {
            isCommonModalOpen () {
                this.addModalClassToBody();
                return this.isOpen;
            }
        },
        methods: {
            closeCommonModal () {
                this.$root.$set(this.$root.posCommonModal, this.id, false);
                this.addModalClassToBody();
            },
            addModalClassToBody () {
                if(this.id == 'addDrawer') console.log("isOpen", this.isOpen)

                var body = document.querySelector("body");
                if(this.isOpen) {
                    // console.log("isOpen true")
                    body.classList.add("pos-modal-open");
                    $("body").find(".pos-navbar-top").addClass('pos-overlay');
                    $("body").find(".pos-navbar-left").addClass('pos-overlay');
                } else {
                    // console.log("isOpen false")
                    body.classList.remove("pos-modal-open");
                    $("body").find(".pos-navbar-top").removeClass('pos-overlay');
                    $("body").find(".pos-navbar-left").removeClass('pos-overlay');
                }
            }
        }
    }
</script>