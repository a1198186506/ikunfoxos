<template>
  <div class="DataPresentationPage-outside">
    <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false"
      style="width: 90%;left: 50%;transform: translateX(-50%);margin-top:20px;">
      <template #default="scope">
        <el-tag type="warning" effect="success" style="height: 20px;">标签:{{ scope.data.target }}</el-tag>
        <span style="margin-left: 20px;" v-if="scope.data.type != null">{{
          scope.data.type == 'text' ? scope.data.text : scope.data.link }}</span>
      </template>
    </el-tree>
    <p>&nbsp;</p>
  </div>
</template>

<script>
export default {
  name: 'DataPresentationPage'
}
</script>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';

const data = ref([])
onMounted(() => {
  const route = useRoute();
  let data_temp = JSON.parse(route.query.data);
  data.value = data_temp
  console.log(data_temp)
})
</script>
<style lang='scss' scoped>
.DataPresentationPage-outside {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>