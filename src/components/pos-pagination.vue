<template>
  <div class="pagination">
    <button
      :disabled="isPreviousButtonDisabled"
      @click="previousPage"
    >
      <i class="fa fa-chevron-left"></i>
    </button>
    <span v-for="paginationTrigger in paginationTriggers"
        :key="paginationTrigger"
        class="pagination-trigger"
        :class="{ 'active': paginationTrigger === currentPage }"
        @click="loadPage(paginationTrigger)">
        {{ paginationTrigger }}
    </span>
    <button
      :disabled="isNextButtonDisabled"
      @click="nextPage"
    >
      <i class="fa fa-chevron-right"></i>
    </button>
  </div>
</template>


<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        pageCount: {
            type: Number,
            required: true
        },
        visiblePagesCount: {
            type: Number,
            default: 5
        }
    },
    computed: {
        isPreviousButtonDisabled() {
            return this.currentPage === 1
        },
        isNextButtonDisabled() {
            return this.currentPage === this.pageCount
        },
        paginationTriggers() {
            const currentPage = this.currentPage
            const pageCount = this.pageCount
            const visiblePagesCount = this.visiblePagesCount
            const visiblePagesThreshold = (visiblePagesCount - 1) / 2
            const pagintationTriggersArray = Array(this.visiblePagesCount - 1).fill(0)

            if (currentPage <= visiblePagesThreshold + 1) {
                pagintationTriggersArray[0] = 1
                const pagintationTriggers = pagintationTriggersArray.map(
                    (paginationTrigger, index) => {
                    return pagintationTriggersArray[0] + index
                    }
                )
                pagintationTriggers.push(pageCount)
                return pagintationTriggers
            }
            if (currentPage >= pageCount - visiblePagesThreshold + 1) {
                const pagintationTriggers = pagintationTriggersArray.map(
                    (paginationTrigger, index) => {
                    return pageCount - index
                    }
                )
                pagintationTriggers.reverse().unshift(1)
                return pagintationTriggers
            }
            pagintationTriggersArray[0] = currentPage - visiblePagesThreshold + 1
            const pagintationTriggers = pagintationTriggersArray.map(
                (paginationTrigger, index) => {
                    return pagintationTriggersArray[0] + index
                }
            )
            pagintationTriggers.unshift(1);
            pagintationTriggers[pagintationTriggers.length - 1] = pageCount
            return pagintationTriggers
        }
    },
    methods: {
        nextPage() {
            this.$emit('nextPage')
        },
        previousPage() {
            this.$emit('previousPage')
        },
        loadPage(value) {
            this.$emit("loadPage", value)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables";
    .pagination {
        text-align: center;
        font-weight: bold;
        padding: 10px 0;
        button {
            height: 30px;
            width: 30px;
            background-color: transparent;
            border: none;
        }
        .pagination-trigger{
            text-align: center;
            display: inline-block;
            height: 30px;
            width: 24px;
            cursor: pointer;
            &.active {
                color: $button-primary;
            }
        }
    }
</style>