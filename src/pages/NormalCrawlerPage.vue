<template>
  <div class="NormalCrawlerPage-outside">
    <div class="mainback">
      <p style="color: white;">爬虫网址:</p>
      <InputText type="text" v-model="options_set.domain" placeholder="请输入内容：例:http://baidu.com" style="width: 300px;" />
      <p style="color: white;">是否设置浏览器页面可见:</p>
      <SelectButton v-model="options_value" :options="options" aria-labelledby="basic" />
      <p style="color: white;">当浏览器等待页面加载时最长等待时间(单位:秒):</p>
      <InputNumber v-model="timeout_timer" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="200" />
      <p style="color: white;">爬取标签选项: <el-button @click="add_root_dom" type="primary"
          style="height: 30px;position: absolute;right: 5px;">+
          根节点</el-button></p>


      <div class="block">
        <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false"
          style="border-radius: 5px;overflow: hidden;">
          <template #default="scope">
            <!-- <div>{{ scope.node.label }}</div> -->
            <el-tag type="warning" effect="dark" style="height: 20px;">
              {{
                scope.data.which_choose == 'index' ? `下标:${scope.data.index}` : (scope.data.which_choose == 'target' ?
                  `标签:${scope.data.target}`
                  :
                  (scope.data.which_choose == 'class' ? `类名:${scope.data.class}` : ''))
              }}
            </el-tag>

            <el-tag type="danger" effect="dark" style="height: 20px;margin-left: 5px;" v-if="scope.data.isclick">
              含点击事件
            </el-tag>

            <el-tag type="success" effect="dark" style="height: 20px;margin-left: 5px;" v-if="scope.data.type != null">
              {{
                scope.data.type == "text" ? '抓取文本' : (scope.data.type == "href" ? '抓取网址' : '')
              }}
            </el-tag>
            <el-button type="success" plain style="height: 10px;right:10px;position: absolute;transform: translateY(5%);"
              @click="operation_panel_show(scope.data)">操作</el-button>
          </template>

          <!-- <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => append(data)">
                Append
              </el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">
                Delete
              </el-button>
            </span> -->

        </el-tree>
      </div>

      <Button @click="crawling" label="爬取" severity="success" rounded
        style="width: 50%;height: 60px;font-size: 20px;left: 50%;transform: translateX(-50%);margin-top: 30px;margin-bottom: 30px;" />

    </div>

    <!-- 操作对话框-->
    <Dialog v-model:visible="operation_panel.show" maximizable modal header="操作面板" :style="{ width: '50vw' }">
      <el-collapse accordion v-loading="operation_panel.loading">

        <el-collapse-item>
          <template #title>
            修改此节点信息
          </template>
          <div>
            <el-input :type="operation_panel.input1.input1_type" placeholder="请输入内容"
              v-model="operation_panel.input1.input1_text" class="input-with-select">
              <template #prepend>
                <el-select v-model="operation_panel.input1.input1_title" placeholder="请选择" style="width:180px;">
                  <el-option label="标签" value="1"></el-option>
                  <el-option label="父元素下的第几个" value="2"></el-option>
                  <el-option label="类名" value="3"></el-option>
                </el-select>
              </template>
            </el-input>

            <p>子元素是否需要点击此元素之后才能抓取到?</p>
            <!-- <el-switch v-model="operation_panel.temp_data.isclick" active-text="是" inactive-text="否">

              </el-switch> -->

            <el-radio-group v-model="operation_panel.input1.input1_isclick">
              <el-radio label="1" border>无点击事件</el-radio>
              <el-radio label="2" border>点击事件(不生成新标签页)</el-radio>
              <el-radio label="3" border v-if="operation_panel.temp_data.children != null">点击事件(生成新标签页)</el-radio>
            </el-radio-group>

            <p>在这个节点是否有要抓取的目标？</p>
            <el-radio-group v-model="operation_panel.input1.input1_filetype">
              <el-radio label="1" border>无</el-radio>
              <el-radio label="2" border>标签内文本</el-radio>
              <el-radio label="3" border>标签href地址</el-radio>
            </el-radio-group>
            <el-button type="primary" style="width: 100%;margin-top: 20px;"
              @click="operation_panel.input1.submit">提交</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item title="添加子节点">
          <el-input :type="operation_panel.input2.input2_type" placeholder="请输入内容"
            v-model="operation_panel.input2.input2_text" class="input-with-select">
            <template #prepend>
              <el-select v-model="operation_panel.input2.input2_title" placeholder="请选择" style="width:180px;">
                <el-option label="标签" value="1"></el-option>
                <el-option label="父元素下的第几个" value="2"></el-option>
                <el-option label="类名" value="3"></el-option>
              </el-select>
            </template>
          </el-input>
          <el-button type="primary" style="width: 100%;margin-top: 20px;"
            @click="operation_panel.input2.submit">提交</el-button>
        </el-collapse-item>
        <el-collapse-item>
          <template #title>
            <text style="color: red;">删除此节点</text>
          </template>
          <div style="color: orange;">此选项将删除此个节点，若此节点为有子元素的父节点则其下子节点会随之一同被删除</div>
          <el-button type="danger" style="width: 100%;margin-top: 20px;"
            @click="operation_panel.input3.submit">删除</el-button>
        </el-collapse-item>
      </el-collapse>
    </Dialog>

    <div style="position: fixed;width: 100%;height: 100%;z-index: 200;" v-if="catch_loading">
      <div style="position: absolute;background-color: rgb(8, 8, 8);opacity: 0.8;width: 100%;height: 100%;">
      </div>
      <ProgressSpinner
        style="width: 100px; height: 100px;position: absolute;left: 50%;top: 30%;transform: translateX(-50%);"
        strokeWidth="2" fill="rgb(8, 8, 8)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      <p style="color: white;position: absolute;left: 50%;top: 50%;transform: translateX(-50%);">正在抓取....</p>
    </div>
    <Button style="width: 170px;height: 40px;text-align: center;position: absolute;right:5%;top: 10px;font-size: 14px;"
      @click="SaveTheCurrentNode">仅保存当前节点数据</Button>
  </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import deepClone from "../global/DeepClone";
import ProgressSpinner from 'primevue/progressspinner';



//const ipc = electron.ipcRenderer;
export default {
  name: 'NormalCrawlerPage',
}
</script>
<script setup>

import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import { useRouter } from "vue-router";
import { useList, useNormalcrawler_config } from "../store/store";
const NormalcrawlerStore = useNormalcrawler_config()
const { Normalcrawler_config } = NormalcrawlerStore
const listStore = useList()
const { routerlist } = listStore
const { proxy } = getCurrentInstance()
const options = ref(['开', '关']);
const options_value = ref('关');
let timeout_timer = ref(6)
let catch_loading = ref(false)

const router = useRouter()

let data = ref([
  {

    "index": 0,
    "dom_type": "parent_node",
    "class": ".d2.ico2",
    "which_choose": "class",
    "isclick": false,
    "type": null,
    "children": [
      {
        "index": 2,
        "dom_type": "son_node",
        "which_choose": "target",
        "target": "li",
        "class": null,
        "isclick": false,
        "type": null,
        "children": [
          {
            "index": 3,
            "dom_type": "son_node",
            "which_choose": "index",
            "target": "a",
            "class": null,
            "isclick": true,
            "type": "text",
            "children": [
              {
                "index": 3,
                "dom_type": "parent_node",
                "which_choose": "class",
                "target": "a",
                "class": ".title",
                "isclick": false,
                "type": null,
                "children": [
                  {

                    "index": 1,
                    "dom_type": "son_node",
                    "which_choose": "index",
                    "target": "h2",
                    "class": "title",
                    "isclick": false,
                    "type": "text",
                    "children": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])
//每个元素只有一个独特id
let element_id = 0
onMounted(() => {

  function log1(data1) {
    data1.map(item => {
      item.id = element_id
      element_id++
      if (item.children != null)
        log1(item.children)
    })
  }

  //监听配置读取
  // window.electronAPI.read_normal_crawler_config((_event, value) => {
  //   console.log(value)
  //   data.value = value.tag
  //   log1(data.value)
  // })
  // normal_crawler_readconfig

  let data_temp = Normalcrawler_config.value;
  data.value = data_temp.tag
  options_set.value.domain = data_temp.domain
  //options_set.value.Browser_isnot_display=data_temp.Browser_isnot_display
  if (data_temp.Browser_isnot_display) {
    options_value.value = '关'
  } else {
    options_value.value = '开'
  }

  timeout_timer.value = data_temp.timeout_timer / 1000
  log1(data.value)


  //console.log(data.value)
})

//操作面板
let operation_panel = ref({
  show: false,
  loading: false,
  data: null,
  temp_data: null,
  input1: {
    input1_type: 'text',
    input1_text: '',
    input1_title: '1',
    input1_filetype: '1',
    input1_isclick: '1',
    submit: () => {
      let check_error = ''
      Object.keys(operation_panel.value.input1).map(key => {
        if (operation_panel.value.input1[key] == '') {
          check_error = "不能有项目为空"
        }
      })

      data.value.map(item => {
        if (item.id == operation_panel.value.temp_data.id && operation_panel.value.input1.input1_title != '3') {
          check_error = "根节点只允许用类名抓取"
        }
      })

      if (check_error != "") {
        proxy.$notify.error({
          title: '错误',
          message: check_error,
          duration: 1700
        });
        return
      }
      else {
        operation_panel.value.loading = true
        if (operation_panel.value.input1.input1_isclick != "1") {
          operation_panel.value.data.isclick = true
        } else {
          operation_panel.value.data.isclick = false
        }
        //如果是可以点击的话则切换节点的状态

        if (operation_panel.value.temp_data.isclick && operation_panel.value.input1.input1_isclick == "3") {
          operation_panel.value.data.dom_type = "parent_node"
        } else {
          let ischeckerror = false
          data.value.map(item => {
            if (item.id == operation_panel.value.temp_data.id) {
              ischeckerror = true
            }
          })
          if (!ischeckerror) {
            operation_panel.value.data.dom_type = "son_node"
          }
        }
        switch (operation_panel.value.input1.input1_title) {
          case '1':
            operation_panel.value.data.which_choose = "target";
            operation_panel.value.data.target = operation_panel.value.input1.input1_text;
            break;
          case '2': {
            operation_panel.value.data.which_choose = "index";
            operation_panel.value.data.index = Number(operation_panel.value.input1.input1_text);
          }
            break;
          case '3':
            operation_panel.value.data.which_choose = "class";
            operation_panel.value.data.class = operation_panel.value.input1.input1_text;
            break;
          default:
            break;
        }


        switch (operation_panel.value.input1.input1_filetype) {
          case "1":
            operation_panel.value.data.type = null;
            break;
          case "2":
            operation_panel.value.data.type = "text";
            break;
          case "3":
            operation_panel.value.data.type = "href";
            break;
          default:
            break;
        }
        operation_panel.value.show = false
      }
    },
    datainit: (data) => {
      switch (data.which_choose) {
        case 'target':
          operation_panel.value.input1.input1_title = "1";
          operation_panel.value.input1.input1_text = data.target;
          break;
        case 'index':
          operation_panel.value.input1.input1_title = "2";
          operation_panel.value.input1.input1_text = data.index;
          break;
        case 'class':
          operation_panel.value.input1.input1_title = "3";
          operation_panel.value.input1.input1_text = data.class;
          break;
        default:
          break;
      }
      if (data.type == null) {
        operation_panel.value.input1.input1_filetype = '1'
      } else {
        switch (data.type) {
          case 'text':
            operation_panel.value.input1.input1_filetype = '2'
            break;
          case 'href':
            operation_panel.value.input1.input1_filetype = '3'
            break;

          default:
            break;
        }
      }

      if (data.isclick) {
        if (data.dom_type == "parent_node") {
          operation_panel.value.input1.input1_isclick = "3"
        } else {
          operation_panel.value.input1.input1_isclick = "2"
        }
      } else {
        operation_panel.value.input1.input1_isclick = "1"
      }



    }
  },
  input2: {
    input2_type: 'text',
    input2_text: '',
    input2_title: '1',
    submit: () => {
      let check_error = ''
      Object.keys(operation_panel.value.input2).map(key => {
        if (operation_panel.value.input2[key] == '') {
          check_error = "不能有项目为空"
        }
      })

      if (check_error != "") {
        proxy.$notify.error({
          title: '错误',
          message: check_error,
          duration: 1700
        });
        return
      }
      else {
        operation_panel.value.loading = true
        //深拷贝一份当前节点数据
        let element_dom = deepClone(operation_panel.value.data)

        element_dom.children = null
        element_id++;
        element_dom.id = element_id
        element_dom.dom_type = "son_node"

        switch (operation_panel.value.input2.input2_title) {
          case '1':
            element_dom.which_choose = "target";
            element_dom.target = operation_panel.value.input2.input2_text;
            break;
          case '2': {
            element_dom.which_choose = "index";
            element_dom.index = Number(operation_panel.value.input2.input2_text);
          }
            break;
          case '3':
            element_dom.which_choose = "class";
            element_dom.class = operation_panel.value.input2.input2_text;
            break;
          default:
            break;
        }

        if (operation_panel.value.data.children == null) {
          operation_panel.value.data.children = []
        }
        operation_panel.value.data.children.push(element_dom)
        operation_panel.value.show = false
      }
    },
  },
  input3: {
    submit: () => {
      if (data.value[0].id == operation_panel.value.data.id) {
        proxy.$notify.error({
          title: '错误',
          message: '不能全删完',
          duration: 1700
        });
        return;
      }
      operation_panel.value.loading = true
      let element_dom_tree = Delete_dom(deepClone(data.value))
      data.value = element_dom_tree
      operation_panel.value.show = false
    }
  }
})


//删除此节点
const Delete_dom = (dom) => {
  let result = null
  result = dom.filter((item) => {
    // console.log(item.id, operation_panel.value.data.id)
    if (item.id !== operation_panel.value.data.id) {
      if (item.children != null) {
        let res = Delete_dom(item.children)
        if (res.length == 0) {
          item.children = null
        } else {
          item.children = res
        }
      }
      return true
    }
    else {
      console.log('删除')
      return false
    }
  }
  );
  console.log(result)
  //Delete_dom(dom.children)

  return result;
}

//加根节点操作
const add_root_dom = () => {
  let element_dom = {
    "index": 0,
    "dom_type": "parent_node",
    "class": ".root",
    "which_choose": "class",
    "isclick": false,
    "type": null,
    "children": null
  }
  element_id++;
  element_dom.id = element_id
  data.value.push(element_dom)
}

//监控inputtext1所填的是否下标从而动态调整输入框类型
watch(() => operation_panel.value.input1.input1_title, (newValue, oldValue) => {
  if (newValue == "2") {
    operation_panel.value.input1.input1_type = "number"
  } else {
    operation_panel.value.input1.input1_type = "text"
  }
}, { deep: true })

//监控inputtext2所填的是否下标从而动态调整输入框类型
watch(() => operation_panel.value.input2.input2_title, (newValue, oldValue) => {
  if (newValue == "2") {
    operation_panel.value.input2.input2_type = "number"
  } else {
    operation_panel.value.input2.input2_type = "text"
  }
}, { deep: true })

//确保每一次操作面板打开加载动画都处于关闭状态
watch(() => operation_panel.value.show, (newValue, oldValue) => {
  if (newValue == true) {
    operation_panel.value.loading = false
  }
}, { deep: true })

//操作面板打开
let operation_panel_show = (data) => {
  operation_panel.value.show = true
  operation_panel.value.data = data
  operation_panel.value.temp_data = deepClone(data)
  operation_panel.value.input1.datainit(data)
}

//爬取点击
const crawling = async () => {
  let check_error = ""
  if (options_value.value == "开") {
    options_set.value.Browser_isnot_display = false
  } else {
    options_set.value.Browser_isnot_display = true
  }
  options_set.value.tag = data.value
  options_set.value.timeout_timer = timeout_timer.value * 1000
  Object.keys(options_set.value).map(key => {
    if (options_set.value[key] == null || options_set.value[key] == '') {
      if (key != "Browser_isnot_display") {
        check_error = `不能有空项`
      }
    }

  })
  if (check_error != "") {
    proxy.$notify.error({
      title: '错误',
      message: check_error,
      duration: 1700
    });
    return;
  }

  catch_loading.value = true
  window.electronAPI.setJsoncontent(deepClone(options_set.value), 'catch')
  let result = await new Promise(res => {
    window.electronAPI.catch_over((_event, data) => {
      res(data)

    })
  })


  if (result.type == "success") {
    console.log(routerlist)
    window.electronAPI.load_normal_crawler_config("ok");

    let result1 = await new Promise(res => {
      window.electronAPI.read_normal_crawler_config((_event, value) => {
        res(value)
      })
    })

    Normalcrawler_config.value = result1

    router.push({ path: '/DataPresentationPage', query: { data: JSON.stringify(result.data) } })
    routerlist.push({ to: '/DataPresentationPage', title: '爬虫数据展示' })
  } else {

    proxy.$notify.error({
      title: '爬取过程中出现错误,请重试',
      message: check_error,
      duration: 1700
    });
    catch_loading.value = false
  }

}

/* 仅保存当前节点数据 */
const SaveTheCurrentNode = async () => {
  let check_error = ""
  if (options_value.value == "开") {
    options_set.value.Browser_isnot_display = false
  } else {
    options_set.value.Browser_isnot_display = true
  }
  options_set.value.tag = data.value
  options_set.value.timeout_timer = timeout_timer.value * 1000
  Object.keys(options_set.value).map(key => {
    if (options_set.value[key] == null || options_set.value[key] == '') {
      if (key != "Browser_isnot_display") {
        check_error = `不能有空项`
      }
    }

  })
  if (check_error != "") {
    proxy.$notify.error({
      title: '错误',
      message: check_error,
      duration: 1700
    });
    return;
  }


  window.electronAPI.setJsoncontent(deepClone(options_set.value), 'save')
  proxy.$notify.success({
    title: '成功',
    message: '保存完成',
    duration: 1700
  });
  catch_loading.value = false
}

const options_set = ref({
  domain: "",
  Browser_isnot_display: false,
  timeout_timer: 6,
  tag: null
})
</script>
<style lang='scss' scoped>
.NormalCrawlerPage-outside {
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  justify-content: center;
  overflow-y: auto;

  .mainback {
    position: relative;
    width: 90%;
    height: auto;
    margin-top: 10px;

  }
}
</style>