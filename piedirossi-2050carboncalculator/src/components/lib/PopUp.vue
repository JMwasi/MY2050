<template>
  <div
    class="popup"
  >
    <div v-if="open" class="popup-content">
      <slot/>
      <!-- <a class="modal-close" :href="closeLink ? closeLink : '#'"><img src="/img/close-round.svg" v-on:click="closePopup"/></a> -->
      <img v-if="hasCloseButton" class="popup-close" src="/img/close-round.svg" v-on:click="closePopup"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PopUp',
  props: ['closingCallback', 'hasCloseButton', 'isOpen', 'exceptionId'],
  data() {
    return {
      open: false
    }
  },
  methods: {
    clickListener(evt) {
      // console.log('clickListener ', evt.target.closest('.popup'));
      if(evt.target.closest('.popup') || evt.target.id === this.exceptionId) {
        return;
      }
      this.closePopup()
    },
    togglePopup(evt) {
      // console.log('togglePopup ', this.open);
      if(this.open) {
        this.closePopup();
      } else {
        this.openPopup(evt);
      }
    },
    openPopup(evt) {
      //called from outside of this component, weird but still better than keeping modal state outside of this component
      // console.log('openPopup');
      this.open = true;
      if(evt) {
        evt.stopPropagation();
      }
      window.addEventListener('click', this.clickListener);
    },
    closePopup() {
      console.log('closePopup');
      this.open = false;
      window.removeEventListener('click', this.clickListener);
      if(this.closingCallback) {
        this.closingCallback();
      }
    },
  },
  created() {
    if(this.isOpen) {
      this.openPopup();
    }
  },
  beforeDestroy() {
    window.removeEventListener('click', this.clickListener);
  },
  watch: {
    isOpen: function(newValue) {
      console.log('isOpen watch', newValue)
      if(newValue) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    }
  }
}
</script>

<style>
.popup {
  position: absolute;
  z-index: 2000;
}
.popup:focus {
  outline: none;
}
.popup-content {
  position: relative;
}
.popup-close {
  display: block;
  width: 20px;
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
}

</style>
