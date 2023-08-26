<template>
  <div class="mainpageoutside"
    style="position: absolute;width:100%;height: 100%;left: 0;top: 0;overflow: hidden;background-color: black;">
    <iframe class="background" src="main2.html" style="border: medium none;"></iframe>
    <div class="mainback">
      <img style="pointer-events: none; " class="logoimg" src="logo.png" />
      <h2 style="color:rgb(192, 192, 192);">欢迎你使用这个小小的系统</h2>
      <Button style="width: 150px;height: 50px;margin-top:180px" label="进入系统->" @click="gotoSecondPage" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { useList } from "../store/store";
const listStore = useList()
const { routerlist } = listStore
const router = useRouter()
const gotoSecondPage = () => {
  router.push('/SecongPage')
  routerlist.push({ to: '/SecongPage', title: '选择页' })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/theme.scss';

.logoimg {
  width: 90px;
  height: 90px;
}

.mainback {
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  top: 6%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.background {
  position: absolute;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
