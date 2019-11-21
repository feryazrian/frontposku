<template>
  <div class=mobileHeader>
    <div @click="$emit('back')">
      <slot name=icon :icon=imgSrc>
        <img :src=imgSrc alt=Back />
      </slot>
    </div>
    <div>
      <h2>{{ header }}</h2>
    </div>
    <div><slot /></div>
  </div>
</template>

<script>
export default {
   data() {
    return { }
  }
  ,props:{
     header:String
    ,imgSrc:{
       type:String
      ,default:window.app_base_url + '/assets/left-arrow-2@3x.png'
    }
  }
}
</script>