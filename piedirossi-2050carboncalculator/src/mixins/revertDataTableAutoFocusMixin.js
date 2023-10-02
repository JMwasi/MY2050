// this is just a workaround for reverting the auto-focus of highcharts data-table after chart.update() or chart.redraw()
// when the focus was on a lever button the focus gets set back to that element again

export default {
  methods: {

    restoreActiveElement() {
     //   might be easier than the other approach
     //   use on:
     //   chart: {
     //     events: {
     //       redraw: () => {
     //         this.restoreActiveElement();
     //       }
     //     }
     // console.log('restoreActiveElement');

      // console.log('restoreActiveElement', this);
      setTimeout(() => {
        console.log('restoreActiveElement', this.appState.activeEle)
        if(this.appState.activeEle) {
          this.appState.activeEle.focus();
        }
      },400);
    },
    // buttonBlurring(evt) {
    //   console.log('buttonBlurring ', evt.target, evt.relatedTarget);
    //   evt.relatedTarget.addEventListener('focus',this.tableFocussing);
    //
    //   // wait for removing, because there are two charts and it needs to be made sure, that the second tableFocussing is caught
    //   setTimeout(() => {
    //     // console.log('removeEventListener blur');
    //     evt.target.removeEventListener('blur', this.buttonBlurring);
    //     this.appState.activeEle = undefined;
    //     this.appState.activeEleHasBlurListener = undefined;
    //   },1000);
    // },
    // tableFocussing(evt) {
    //   // console.log('tableFocussing ', evt.target, evt.relatedTarget);
    //   let relTarget = evt.relatedTarget;
    //   relTarget.focus();
    //   evt.target.removeEventListener('focus',this.tableFocussing);
    //   this.appState.activeEle = undefined;
    //   this.appState.activeEleHasBlurListener = undefined;
    // },
    // registerActiveElement() {
    //   this.appState.activeEle = document.activeElement;
    //   // console.log('updateChart ', this.appState.activeEle, this.appState.activeEleHasBlurListener);
    //
    //   // group lever and single-lever have the same css class
    //   let isLever = this.appState.activeEle && this.appState.activeEle.classList.contains('single-lever-step-button');
    //
    //   // console.log('registerActiveElement', this.appState.activeEle);
    //   if(!isLever) {
    //     this.appState.activeEle = undefined;
    //     this.appState.activeEleHasBlurListener = undefined;
    //   }
    //
    //   if(this.appState.activeEle && !this.appState.activeEleHasBlurListener) {
    //     // console.log('asd');
    //     this.appState.activeEle.addEventListener('blur', this.buttonBlurring);
    //     this.appState.activeEleHasBlurListener = true;
    //   }
    // },
    registerActiveElementPassive() {
      this.appState.activeEle = document.activeElement;
      // console.log('updateChart ', this.appState.activeEle, this.appState.activeEleHasBlurListener);

      // group lever and single-lever have the same css class
      let leverHasFocus = document.activeElement && document.activeElement.classList.contains('single-lever-step-button');
      if(leverHasFocus) {
        this.appState.activeEle = document.activeElement;
      } else {
        this.appState.activeEle = undefined;
      }
    }
  }
}
