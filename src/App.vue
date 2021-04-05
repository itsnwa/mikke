<template>
  <div id="app">
    <ScoreBoard />
  </div>
</template>

<script>
import ScoreBoard from "@/components/ScoreBoard.vue"

export default {
  components: { ScoreBoard }
}
</script>

<style lang="scss">
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow-x: auto;
  touch-action: pan-x;
}
</style>
