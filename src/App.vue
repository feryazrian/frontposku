<template>
  <div id="app">
    <div class="pos-container-wrapper">
            
      <div class="content-container">
          
        <router-view/>

      </div>

      </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('autoLogin')
  }
}
</script>

<style lang="scss">
</style>
