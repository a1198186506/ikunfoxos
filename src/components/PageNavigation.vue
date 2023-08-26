<template>
  <div class="PageNavigation-outside">
    <el-breadcrumb separator="/" style="margin-left: 30px;">
      <el-breadcrumb-item v-for="(item, index) in routerlist" :to="{ path: item.to }" :key="index"><text
          style="color: aliceblue;cursor: pointer;font-weight: bold;" @click="choose_item(index)">{{ item.title
          }}</text></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'PageNavigation'
}
</script>
<script setup>
import { useList } from "../store/store";

const listStore = useList()
const { routerlist } = listStore

const choose_item = (index) => {
  routerlist.splice(index + 1, routerlist.length - 1)

}
</script>
<style lang='scss' scoped>
.PageNavigation-outside {
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: start;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>