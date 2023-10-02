<template>
<div>
  <!-- v-on:keydown.tab.prevent="()=>{}" is preventing tabbing outisde of the modal -->
  <div v-if="open" class="modal" v-on:click.self="closeModal"
    role="dialog" :aria-labelledby="ariaLabelledBy"
    ref="modal"
  >
    <div class="modal-content">
      <slot/>
      <!-- <a class="modal-close" :href="closeLink ? closeLink : '#'"><img src="/img/close-round.svg" v-on:click="closeModal"/></a> -->
      <!-- when the close button comes after the slot if will be the lastFocusableElement -->
      <img v-if="closeIconPath" class="modal-close" :src="closeIconPath" v-on:click="closeModal"
        role="button"
        alt="close dialogue"
        tabindex="0"
        ref="closeButton"
        v-on:keyup.enter="closeModal"
      />
      <span v-if="!closeIconPath" class="modal-close" v-on:click="closeModal"
        tabindex="0"
        role="button"
        ref="closeButton"
        v-on:keyup.enter="closeModal"
      >x</span>
    </div>
  </div>
</div>
</template>

<script>

/*
ModalStrict is using v-if
*/

export default {
  name: 'ModalStrict',
  props: {
    closingCallback: {
      type: Function
    },
    firstFocusableReferenceString: {
      type: String
    },
    isOpen: {
      type: Boolean
    },
    closeIconPath: {
      type: String
    },
    ariaLabelledBy: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    findFocusableElements() {
      //only saves the first and last element

      // https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
      // https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js

      let modal = this.$refs['modal'];
      var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      var focusableElements = modal.querySelectorAll(focusableElementsString);

      // Convert NodeList to Array
      focusableElements = Array.prototype.slice.call(focusableElements);
      if(focusableElements.length) {
        this.firstFocusableElement = focusableElements[0];
        this.lastFocusableElement = focusableElements[focusableElements.length - 1];
      }
    },
    focusTrap(evt) {
        // console.log('focusin ', evt);
        let target = evt.target;
        let modal = target.closest('.modal');
        if(!modal || !modal.isEqualNode(this.$refs['modal'])) {
          // console.log('not inside ', this.currentElemWithFocus, this.lastFocusableElement, this.firstFocusableElement);
          if(this.currentElemWithFocus===this.lastFocusableElement) {
            // console.log('setting focus on first')
            this.firstFocusableElement.focus();
            return;
          }
          if(this.currentElemWithFocus===this.firstFocusableElement) {
            // console.log('setting focus on last')
            this.lastFocusableElement.focus();
            return;
          }
          //stopPropagation on capture and preventDefault on bubble?
          // evt.stopPropagation(); //not cancelable
        }
        this.currentElemWithFocus = target;
        // console.log('inside');
        // focusin bubbles!!
        // wenn element nicht dieses modal als parent hat, dann wird focus auf erstes Element dieses Modals gesetzt
        // eventuell die tabbing-direction herausfinden
    },
    openModal() {
      //called from outside of this component, weird but still better than keeping modal state outside of this component
      // console.log('openModal');

      this.open = true;

      this.$nextTick(()=> {
        this.firstFocusableElement = undefined;
        this.lastFocusableElement = undefined;
        this.findFocusableElements();
        // console.log('focusableElements ', this.firstFocusableElement, this.lastFocusableElement);
        if(this.firstFocusableElement) {
          this.firstFocusableElement.focus();
        }
      });

      // the focusin event bubbles but is not cancelable
      // focus does not bubble, so I would need to assign it to the document
      document.addEventListener('focusin', this.focusTrap);
    },
    closeModal() {
      // console.log('closeModal');
      this.open = false;
      document.removeEventListener('focusin', this.focusTrap);
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
.modal:focus {
  background-color: red;
}
.modal-content {
  flex: none;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  max-width: 700px;
  max-height: 600px;
  position: relative;
  background-color: white;
  box-sizing: border-box;
}
.modal-close {
  display: block;
  width: 20px;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}
.modal-close:focus {
  border: 1px solid blue;
}

</style>
