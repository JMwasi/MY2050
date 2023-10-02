<template>
  <div class="tab-nav" ref="tabnav">

    <div v-if="paginationNeeded" ref="arrow">
      <div class="tab-nav-arrow tn-left"
        :class="{'tn-active': holderPos!==0}" v-on:click="goBack"
      >
        <img src="./arrow-left.svg">
      </div>
      <div class="tab-nav-arrow tn-right"
        v-if="paginationNeeded"
        :class="{'tn-active': holderPos < holderWidth-containerWidth}" v-on:click="goForward"
      >
        <img src="./arrow-right.svg">
      </div>
    </div>

    <div class="tab-nav-cont" ref="container" :class="{'tn-paginated': paginationNeeded}">

      <div class="tab-nav-holder" ref="holder"
        :class="{'tn-inactive': noTransition}"
        :style="{transform: 'translateX(-'+holderPos+'px)'}"
      >
        <div class="tab-nav-holder-inner" role="tablist" aria-label="sector tabs">
          <span v-for="(tab,index) in tabs" ref="tab" :key="tab[titleProp]" class="tab-item"
            :id="singleTabIdBase+index"
            role="button" :aria-controls="ariaControlsAttribute"
            :class="{
              selected:tabIndex===index,
              'tn-left': tabIndex===index && isLeftDirection,
              'tn-right': tabIndex===index && !isLeftDirection,
            }"
            v-on:mousedown.prevent="()=>{}"
            v-on:click.prevent="selectTab(index)"
            v-on:keyup.enter="selectTab(index)"
            tabindex="0"
          >
            <div class="tab-item-title">
              <span>{{tab[titleProp]}}</span>
            </div>
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

/*
accessibility:
- Don't remove focus after click, it's probably better to prevent the button from receiving focus on click.
- select on focus is not a good ides, because then the user always ends on the first or last item if he wants to move somewhere else

- prevent focus on mousedown (because mouse-users don't need the focus-outlines
  v-on:mousedown.prevent="()=>{}"

remembering the last focussed element
  Well depending on what else your page is doing,
  it could be tricky, but for starters you could have a "blur" event handler attached to the <body>
  element that just stashes the event target.
--> easier:
      on click add a class to that element that hides the focussed outline
      on keypress.enter don't add that class



features:


lever buttons need to be smaller
- disabled transition on load
- only shows arrows when necessary
- pans back to old holderPos if no action after pagination click

todo:
initial positions are not ideal yet

limitations:
margins on tab-items can only be set in px

v-on:touchmove="touchhandler($event)"
*/

export default {
  name: 'TabNavigation',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    titleProp: {
      type: String,
      required: true
    },
    tabIndex: {
      type: Number,
      default: 0
    },
    ariaControlsAttribute: {
      type: String
    },
    singleTabIdBase: {
      type: String
    },
    callback: {
      type: Function
    }
  },
  data() {
    return {
      paginationNeeded: undefined,
      noTransition: true,
      holderPos: undefined,
      containerWidth: undefined,
      holderWidth: undefined,
      isLeftDirection: undefined
    }
  },
  methods: {
    selectTab(index) {
      clearTimeout(this.panTimerId);

      if(index < this.tabIndex) {
        this.isLeftDirection = true;
      } else {
        this.isLeftDirection = false;
      }

      // check wether item is fully visible, if not make it fully visible
      let item = this.tabItems[index];

      console.log('selectTab ', item, this.holderPos, this.containerWidth);

      //item was clicked, so no need to check weather it is inside the visible portion
      if(item.left < this.holderPos) {
        if(index === 0) {
          this.holderPos = 0;
        } else {
          this.holderPos = item.left
        }
      }

      if(item.right > this.holderPos + this.containerWidth) {
        this.holderPos = item.right - this.containerWidth;
      }

      this.activeHolderPos = this.holderPos;
      if(this.callback) {
        this.callback(index);
      }
    },
    autoPanBack() {
      clearTimeout(this.panTimerId);
      this.panTimerId = setTimeout(() => {
        this.holderPos = this.activeHolderPos;
      }, 4000);
    },
    updateActiveHolderPos() {
      //check if active item is still visible
      let itemLeft = this.tabItems[this.tabIndex].left;
      let itemRight = this.tabItems[this.tabIndex].right;
      let holderLeft = this.holderPos;
      let holderRight = this.holderPos + this.containerWidth;
      if(
          (itemLeft > holderLeft && itemLeft < holderRight) ||
          (itemRight > holderLeft && itemRight < holderRight)
        ) {
            // console.log('updateActiveHolderPos found ', this.tabItems[this.tabIndex].left, this.tabItems[this.tabIndex].right, this.holderPos, this.containerWidth);
            this.activeHolderPos = this.holderPos;
      }
      // console.log('updateActiveHolderPos ', this.activeHolderPos);
    },
    goBack() {
      this.autoPanBack();

      let newStartingItem;

      //find first item, that starts on the left side of current portion
      for(let i=this.tabItems.length-1; i >= 0; i--) {
        if(this.tabItems[i].left < this.holderPos) {
          newStartingItem = this.tabItems[i];
          break;
        }
      }

      if(!newStartingItem) {
        return;
      }

      if(newStartingItem.right >= this.containerWidth) {
        this.holderPos = newStartingItem.right-this.containerWidth;
      } else {
        this.holderPos = 0;
      }

      this.updateActiveHolderPos();
    },
    goForward() {
      this.autoPanBack();
      // find the next element which rightPosition is bigger than holderPos,
      // make this elements leftPos the new holderPos if the remaining space is bigger than containerWidth
      // if remaining space is smaller
      let newStartingItem;

      // Array.find() not supported by Internet Explorer
      this.tabItems.some((item) => {
         if(item.right > this.holderPos + this.containerWidth) {
           newStartingItem = item;
           return true;
         }
      });

      if(!newStartingItem) {
        return;
      }

      if(newStartingItem.remainingSpace >= this.containerWidth) {
        this.holderPos = newStartingItem.left;
      } else {
        this.holderPos = this.holderWidth - this.containerWidth;
      }
    //  console.log('goForward ', newStartingItem, this.holderPos);
      this.updateActiveHolderPos();
    },
    getPositions() {
      this.tabItems = [];

      if(this.$refs.container) {
        this.containerWidth = this.$refs.container.getBoundingClientRect().width;
      }

      //if pagination is needed but the pagination-arrows are not rendered yet
      if(!this.$refs.arrow && this.paginationNeeded) {
        this.containerWidth -= this.paginationWidth;
      }

      let itemLeft = 0;
      this.$refs.tab.forEach((tab, ind) => {
        let itemWidth = tab.getBoundingClientRect().width;
        let itemMarginLeft = parseInt(window.getComputedStyle(tab).getPropertyValue('margin-left'));
        let itemMarginRight = parseInt(window.getComputedStyle(tab).getPropertyValue('margin-right'));
        // console.log('itemMarginLeft itemMarginRight ', itemMarginLeft, itemMarginRight);
        itemWidth += itemMarginLeft + itemMarginRight;
        // console.log('itemWidth ', itemWidth);
        this.tabItems.push({
          left: itemLeft,
          width: itemWidth,
          right: itemLeft + itemWidth,
          title: this.tabs[ind][this.titleProp],
          remainingSpace: this.holderWidth - itemLeft
        });
        itemLeft += itemWidth;
      });
      // console.log(' getPositions ', this.tabItems, this.containerWidth, this.holderWidth);
    },
    findPosOfActiveTab() {

      //go find in which portion the activeTab starts
      //if it ends in the next portion add the difference in px

      // check if activeTab is fully inside one portion
      let numPortions = Math.ceil(this.holderWidth / this.containerWidth);
      let leftOfActive = this.tabItems[this.tabIndex].left;
      let rightOfActive = this.tabItems[this.tabIndex].right;


      //let lastPortionShare = (this.holderWidth % this.containerWidth)/this.containerWidth;

      for(let i=1; i<=numPortions; i++) {
        if(leftOfActive < this.containerWidth*i) {
          if(i<numPortions) {
            this.holderPos = this.containerWidth*(i-1);
            //before last Portion, overlap possible
            if(rightOfActive > this.containerWidth*i) {
              //if active Element overlaps its portion, add the overlap to the holderPos
              this.holderPos += rightOfActive - this.containerWidth*i;
            }
          }
          if(i === numPortions) {
            //last Portion, no overlap possible
            //the last portion can be smaller than the containerWidth, so this assignment is safe:
            this.holderPos = this.holderWidth - this.containerWidth;
          }

          break;
        }
      }

      this.activeHolderPos = this.holderPos;

    },
    checkPagination() {
      this.paginationNeeded = false;
      if(this.$refs.holder) {
        this.holderWidth = this.$refs.holder.getBoundingClientRect().width;
      }
      if(this.$refs.tabnav && this.$refs.tabnav.getBoundingClientRect().width - this.lastItemMargin < this.holderWidth) {
        this.paginationNeeded = true; //vue doesn't trigger redraw yet, since there is still code in the qeue, I hope!
      }
    },
    showTabs() {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.noTransition = false;
        });
      });
    },
    redraw() {
      //only redraw when resizing is complete, not on every single resize event
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.checkPagination();
        if(this.paginationNeeded) {
          this.getPositions();
          this.findPosOfActiveTab();
        } else {
          this.holderPos = 0; // reset to beginning if no pagination needed
          this.getPositions();
        }
      }, 100);
    }
  },
  created() {
    this.activeHolderPos = undefined; //needed for automatically panning back after inactivity after scrolling
    this.panTimerId = undefined;

    this.paginationWidth = 40; //hardcoded, well
    this.lastItemMargin = 2;

    this.timerId = undefined;
    window.addEventListener('resize', this.redraw);
  },
  mounted() {
    this.checkPagination();
    this.getPositions();
    this.findPosOfActiveTab();
    this.showTabs();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.redraw);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tab-nav {
  width: 100%;
  height: 100%; /*height needs to be set by containing element (outer container that holds this component)*/
  position: relative;
  top: 3px;
}
.tab-nav-arrow {
  height: 100%;
  width: 20px;
  position: absolute;
  top: 2px;
  z-index: 10;
}
.tab-nav-arrow.tn-left {
  right: 100%;
}
.tab-nav-arrow.tn-right {
  left: 100%;
}
.tab-nav-arrow img {
  position: absolute;
  height: 16px;
  display: block;
  top: 40%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.tab-nav-arrow.tn-right img {
  right: 0px;
}
.tab-nav-arrow.tn-left img {
  left: 0px;
}
.tab-nav-arrow.tn-active img {
  opacity: 1;
  cursor: pointer;
}

.tab-nav-cont {
  /*can't use flex with flex-grow, because on page-load .tab-nav-cont doesn't take up full width,
  only after 150ms it would. Use as normal block-div works,
  but then the arrows need to use position absolute */
  /* flex-grow: 10; */
  height: 100%;
  margin: 0px;
  position: relative;

}
.tab-nav-cont.tn-paginated {
  overflow: hidden;
}
.tn-mask {
  flex: none;
  width: 10px;
  align-self: stretch;
  z-index: 2;
  pointer-events: none;
}
.tn-mask-left {
  background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
}
.tn-mask-right {
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

.tab-nav-holder {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  /*
    combination of position absolute and display flex (or inline-flex) doesn't work for IE.
    The width will always be the parent width, not content-dependent (which is necessary).
    Workaround: Use a second holder-element (.tab-nav-holder-inner) that has display flex
  */
  /* display: inline-flex;
  align-items: center; */
  transition: transform 1s cubic-bezier(0.35, 0, 0.25, 1);
}
.tab-nav-holder.tn-inactive {
  transition-duration: 0s;
}
.tab-nav-holder-inner {
  height: 100%;
   /*
    flex or block makes the width parent dependent if not set,
    inline-block or inline-block makes it content dependent, as far as I know.
    But it doesn't make a difference here
   */
  display: inline-flex;
  align-items: center;
}


/*custom*/
.tab-nav-holder {
  box-sizing: border-box;
}
.tab-item {
  margin: 0px 12px;
  height: 100%;
  box-sizing: border-box;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 18px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  position: relative;
}
.tab-item:first-child {
  margin-left: 0px;
}
.tab-item:last-child {
  margin-right: 0px;
}
.tab-item-title {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  margin: 0px 3px;   /*use padding if underline needs to be broader than text */
  padding-bottom: 8px;
  box-sizing: border-box;
}
.tab-item-title:first-child {
  margin-left: 0px;
}
.tab-item-title:last-child {
  margin-right: 0px;
}
.tab-item-warning {
  position: absolute;
  height: 100%;
  top: 0px;
  right: -6px;
  color: #ff0000;
}
.tab-item.selected {
  color: rgba(255,255,255,1);
}
.tab-item-title::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 10px;
  background-color: #99cc00;
  transform: scaleX(0);
}
.tab-nav-cont:not(.tn-paginated) .tab-item.selected:first-child .tab-item-title::after {
  border-bottom-left-radius: 0px;
}
.tab-item.tn-left .tab-item-title::after {
  transform-origin: left;
}
.tab-item.tn-right .tab-item-title::after {
  transform-origin: left;
}
.tab-item.selected .tab-item-title::after {
  transform: scaleX(1);
  transition: transform 0.3s ease;
}
</style>
