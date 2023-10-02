<template>
<div>
  <div v-if="alwaysRendered">
    <transition name="modal-fade">

      <!-- using v-show instead of v-if, so for instance the scroll position is kept between toggles -->
      <div v-show="open" class="modal" v-on:click.self="closeModal">
        <div class="modal-content">
          <slot/>
          <!-- <a class="modal-close" :href="closeLink ? closeLink : '#'"><img src="/img/close-round.svg" v-on:click="closeModal"/></a> -->
          <img v-if="hasCloseButton" class="modal-close" src="/img/close-round.svg" v-on:click="closeModal"/>
        </div>
      </div>
    </transition>
  </div>
  <div v-if="!alwaysRendered">
    <transition name="modal-fade">
      <!-- using v-if here -->
      <div v-if="open" class="modal" v-on:click.self="closeModal">
        <div class="modal-content">
          <slot/>
          <!-- <a class="modal-close" :href="closeLink ? closeLink : '#'"><img src="/img/close-round.svg" v-on:click="closeModal"/></a> -->
          <img v-if="hasCloseButton" class="modal-close" src="/img/close-round.svg" v-on:click="closeModal"/>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>

export default {
  name: 'Modal',
  props: ['closingCallback', 'hasCloseButton', 'isOpen', 'alwaysRendered'],
  data() {
    return {
      open: false
    }
  },
  methods: {
    openModal() {
      //called from outside of this component, weird but still better than keeping modal state outside of this component
      console.log('openModal ');
      this.open = true;
    },
    closeModal() {
      // console.log('closeModal');
      this.open = false;
      if(this.closingCallback) {
        this.closingCallback();
      }
    }
  },
  created() {
    if(this.isOpen) {
      this.openModal();
    }
  },
  watch: {
    isOpen: function(newValue) {
      console.log('isOpen watch', newValue)
      if(newValue) {
        this.openModal();
      } else {
        this.closeModal();
      }
    }
  }
}
</script>

<style>
.modal {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  height: 100%; /*height 100% works for fixed elements with URL bar hiding/showing resizes on mobile*/
  min-height: -webkit-fill-available;
  background-color: rgba(0,0,0,0.35);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  flex: none;
  width: calc(100% - 10px);
  height: calc(100% - 10px); /*defined height is better, so the 'Levers' and 'Calculate' buttons can be on the same height*/
  max-width: 900px;
  position: relative;
  background-color: white;
  border: 1px solid grey;
  border-radius: 4px;
  box-sizing: border-box;
}
.modal-close {
  display: block;
  width: 20px;
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
}

</style>
