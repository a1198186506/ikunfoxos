<template>
  <div class="SecongPageout-side">
    <iframe src="heidong.html"
      style="position: absolute;width:100%;height: 100%;border: medium none;overflow: hidden;"></iframe>
    <Panel header="🫥alist爬虫" v-if="items[0].displayFieldset"
      style="margin-top: 20px;position: absolute;left: 50%;transform: translateX(-50%);width: 90%;">
      <p>
        这个爬虫仅仅只针对alist部署的资源网站，如何辨别的话可以试着在网站页面上按下f12,然后在console面板中寻找一下是否有相关的输出字眼即可<text
          style="color: gold;">一般来说都会有版本号的输出</text>
      </p>
      <Button>我已了解,进入爬虫</Button>
    </Panel>

    <Panel header="😱通用型爬虫" v-if="items[1].displayFieldset"
      style="margin-top: 20px;position: absolute;width: 90%;left: 50%;transform: translateX(-50%);">
      <p>
        目前正在进行不断地迭代，基础功能都比较完备了，之所以说是通用因为是在集成了普通的单页面抓取数据的同时还进行了一定程度上的自定义元素点击，可以实现横跨几个页面进行数据抓取
      </p>
      <Button @click="items[1].click">我已了解,进入爬虫</Button>
    </Panel>
    <div class="dock-window">
      <Dock :model="items" style="background-color: grey;">
        <template #item="{ item }">
          <a style="cursor: pointer;" v-tooltip.top="item.label" href="#" class="p-dock-link"
            @click="onDockItemClick($event, item)">
            <img :alt="item.label" :src="item.icon"
              style="width: 100%;background-color: rgb(78, 78, 78);border-radius: 5px;" />
          </a>
        </template>
      </Dock>
    </div>

    <div style="position: absolute;width: 100%;height: 100%;z-index: 200;" v-if="config_loading">
      <div style="position: absolute;background-color: rgb(8, 8, 8);opacity: 0.8;width: 100%;height: 100%;">
      </div>
      <ProgressSpinner
        style="width: 100px; height: 100px;position: absolute;left: 50%;top: 30%;transform: translateX(-50%);"
        strokeWidth="2" fill="rgb(8, 8, 8)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      <p style="color: white;position: absolute;left: 50%;top: 50%;transform: translateX(-50%);">正在载入配置....</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecondPage'
}
</script>
<script setup>
import { ref } from 'vue'
import Dock from 'primevue/dock';
import ProgressSpinner from 'primevue/progressspinner';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import { useRouter } from "vue-router";

import { useList, useNormalcrawler_config } from "../store/store";
const NormalcrawlerStore = useNormalcrawler_config()
const listStore = useList()
const { Normalcrawler_config } = NormalcrawlerStore

const { routerlist } = listStore

const router = useRouter()

const config_loading = ref(false)


// beforeRouteLeave (to, from, next) {// 导航离开该组件的对应路由时调用// 可以访问组件实例
//   window.electronAPI.load_normal_crawler_config("ok");
// }
const items = ref([
  {
    label: 'alist爬虫',
    icon: "https://alist.nn.ci/logo.svg",
    displayFieldset: false,
    command: () => {
      let index = 0;
      items.value[index].displayFieldset = true;
      items.value.map((item, index1) => {
        if (index1 != index) {
          item.displayFieldset = false
        }
      })
    }
  },
  {
    label: '通用爬虫',
    icon: "logo.png",
    displayFieldset: false,
    command: () => {
      let index = 1;
      items.value[index].displayFieldset = true;
      items.value.map((item, index1) => {
        if (index1 != index) {
          item.displayFieldset = false
        }
      })
    },
    click: async () => {
      config_loading.value = true
      window.electronAPI.load_normal_crawler_config("ok");

      let result = await new Promise(res => {
        window.electronAPI.read_normal_crawler_config((_event, value) => {
          //console.log(_event)
          res(value)
        })
      })

      Normalcrawler_config.value = result
      router.push('/NormalCrawlerPage')
      routerlist.push({ to: '/NormalCrawlerPage', title: '通用爬虫' })

    }
  },
])

const onDockItemClick = (event, item) => {
  if (item.command) {
    items.value.map((item1) => {
      if (item.label == item1.label) {
        item1.command();
      }
    })

  }

  event.preventDefault();
};
</script>
<style lang='scss' scoped>
@import '../assets/theme.scss';

.SecongPageout-side {
  position: absolute;
  width: 100%;
  height: 100%;
}

.p-dock-link:hover {
  box-shadow: 0 0 10px gold;
}

.p-dock-link {
  transition: all 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>