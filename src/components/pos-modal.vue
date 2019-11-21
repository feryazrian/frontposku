<template>
    <div class="pos-modal-container" :id="id" v-if="isModalOpen" >
        <div class="modal-header">
            <slot name="header">
                Default header
            </slot>
            <i class="icon remove-icon" @click="closeModal"></i>
        </div>

        <div class="modal-body">
            <slot name="body">
                Default body
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id', 'show'],

        created () {
            this.closeModal();
        },

        computed: {
            isModalOpen () {
                this.addClassToBody();

                return this.show;
            }
        },
        methods: {
            closeModal (modal_id) {
                EventBus.$emit('closeModal', modal_id);
            },

            addClassToBody () {
                //var body = document.querySelector("body");
                document.querySelector("body");
                // if(this.show) {
                //     body.classList.add("pos-modal-open");
                // } else {
                //     body.classList.remove("pos-modal-open");
                // }
            }
        }
    }
</script>