export default {
  methods: {
    focusPrevious(evt) {
      let index = this.appState.focusGroup1.indexOf(evt.target);
      if(index < 1) {
        index = this.appState.focusGroup1.length-1;
      } else {
        index--;
      }
      this.appState.focusGroup1[index].focus();
    },
    focusNext(evt) {
      let index = this.appState.focusGroup1.indexOf(evt.target);
      if(index < this.appState.focusGroup1.length-1) {
        index++;
      } else {
        index = 0;
      }
      this.appState.focusGroup1[index].focus();
    }
  }
}
