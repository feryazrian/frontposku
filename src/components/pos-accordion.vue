<template>
    <article class="accordion_container" :class="{'is_open': isOpen}">
        <h1 class="accordion_header" @click="openArticleContent">
            <i class="icon fa" :class="isOpen ?'fa-chevron-down' : 'fa-chevron-right'"></i> {{ article.title }}       
        </h1>
        <div class="accordion_body">
            <p class="accordion_content">
                {{ article.content }}
            </p>
        </div>
    </article>
</template>

<script>
export default {
    props: ['article'],
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        openArticleContent() {
            this.isOpen = !this.isOpen
        }
    }
}
</script>