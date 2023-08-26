<template>
  <div class="App">
    <router-view name="PageNavigation"></router-view>
    <div class="App-mainback">
      <router-view name="MainPage"></router-view>
      <router-view name="SecondPage"></router-view>
      <router-view name="NormalCrawlerPage"></router-view>
      <router-view name="DataPresentationPage"></router-view>
    </div>

  </div>
</template>

<script>


export default {
  name: 'App',
}
</script>

<style lang="scss">
@import './assets/theme.scss';

.App {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: black;
  user-select: none;
}

.App-mainback {
  position: relative;
  width: 100%;
  flex: 1;
  background-color: black;
}


// #app {
//   background-color: #2c3e50;
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
