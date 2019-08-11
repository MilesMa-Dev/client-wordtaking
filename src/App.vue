<script>

import store from "@/utils/store";

export default {
  onLaunch() {
  },

  created () {

  }
}
</script>

<style>
page {
  height: 100%;
  background-color: #EFEFEF;
}
.container {
  height: 100%;
}
/* this rule will be removed */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

.flex-row-start-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

.flex-row-start-end{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
}

.flex-row-around-center {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.flex-row-around-start {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}

.flex-row-center-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-start-center {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.flex-row-center-start {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.flex-row-betwteen-start{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.flex-row-betwteen-center{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.flex-column-center-center{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
}

.flex-column-start-start{
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start; 
}

.flex-column-start-center{
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center; 
}
</style>
