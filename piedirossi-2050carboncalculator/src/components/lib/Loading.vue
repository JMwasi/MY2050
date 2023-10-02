<template>
  <div id="loading-screen" v-if="open">
    <div class="loading-screen-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="30px" height="40px" viewBox="-3 -3 30 36" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <rect x="0" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML"
            values="5;21;5"
            begin="0s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML"
            values="13; 5; 13"
            begin="0s" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="10" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML"
            values="5;21;5"
            begin="0.15s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML"
            values="13; 5; 13"
            begin="0.15s" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="20" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML"
            values="5;21;5"
            begin="0.3s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML"
            values="13; 5; 13"
            begin="0.3s" dur="1s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
    <div class="loading-screen-text">
      calculating
    </div>
  </div>
</template>

<script>

/*
this and other icons:
https://codepen.io/aurer/pen/jEGbA
*/

export default {
  name: 'Loading',
  props: ['open']
}
</script>

<style>
#loading-screen {
  position: fixed;
  bottom: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  padding: 2px 12px;
  background-color: #00639c;
  /* border-radius: 4px; */
  background-color: rgba(0,99,156, 0.8);
  color: white;
  animation: delay 0.2s steps(1,jump-end) 1;
}

.loading-screen-icon {
  display: flex;
  align-items: center;
}

.loading-screen-icon svg path,
.loading-screen-icon svg rect{
  fill: #ffffff;
}

.loading-screen-text {
  font-size: 20px;
  margin-left: 10px;
  font-weight: bold;
}

@keyframes delay {
  0%   {opacity: 0;}
  100%  {opacity: 1;}
}
</style>
