<template>
  <div class="container" v-show="show">
    <div
      class="popup-wrapper"
      @click.stop="dismissable ? (show = false) : null"
    />
    <div class="popup" ref="popup">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap"
export default {
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    dismissable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    show: {
      handler(isShowing) {
        if (isShowing) {
          gsap.to(this.$refs.popup, {
            duration: 0.4,
            y: 0
          })
        } else {
          gsap.to(this.$refs.popup, {
            duration: 0.4,
            y: "100%"
          })
        }
      }
    }
  },
  mounted() {
    gsap.to(this.$refs.popup, {
      duration: 0.4,
      y: 0
    })
  }
}
</script>

<style lang="scss" scoped>
// Wrap popup in a div to prevent scrolling
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}

// The actual popup dialog
.popup {
  position: absolute;
  left: 50%;
  bottom: 0;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  z-index: 1000;
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 520px;
  max-height: 90%;
  overflow: hidden;
  transform: translate(-50%, 100%);
}
</style>
