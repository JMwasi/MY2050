<template>
  <transition name="conditional-animate-height"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"
    v-on:before-leave="beforeLeave"
  >
    <!--div class="conditional-animate-height" v-if="visible" v-bind:style="{'height': height}"-->
    <div class="conditional-animate-height" v-if="visible">
      <div ref="content">
        <slot/>
      </div>
    </div>
  </transition>

</template>
<script>

export default {
  name: 'AnimateHeightAuto',
  props: ['visible'],
  methods: {
    beforeEnter(el) {
      el.style.height = '0px';
    },
    enter(el) {
      var rect = this.$refs.content.getBoundingClientRect();
      el.style.height = rect.bottom - rect.top + 'px';
    },
    afterEnter(el) {
      el.style.height = 'auto';
    },
    beforeLeave(el) {
      var rect = this.$refs.content.getBoundingClientRect();
      this.height = rect.bottom - rect.top + 'px';
      el.style.height = rect.bottom - rect.top + 'px';
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .conditional-animate-height {
    /* _overflow: hidden; */
    transition: all 0.3s ease;
    /* _opacity: 1; */
  }
  .conditional-animate-height-v-leave {
    /* _transition: none; */
  }

  .conditional-animate-height-enter-active, .conditional-animate-height-leave-active {
    /* _transition: all 3s ease; */
    overflow: hidden;
  }
  .conditional-animate-height-leave-to {
    height: 0px !important;
    /* _transition: all 5s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
  }
  .conditional-animate-height-enter, .conditional-animate-height-leave-to {
    opacity: 0; /*opacity changes make it less performant when toggled in fast succession*/
  }
</style>
