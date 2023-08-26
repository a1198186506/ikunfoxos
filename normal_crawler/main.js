const puppeteer = require("puppeteer");
const config_data = require("./config.json");
const fs = require("fs");

/* 一些初始化配置 */
const Browser_isnot_display = config_data.Browser_isnot_display;
const timeout_timer = config_data.timeout_timer;
const domain = config_data.domain;

let result_data = []; //最终数据集

let tag = config_data.tag;

/* 报错日志 */
let error_log = [];
/* 构建无头浏览器 */
let browser;
let page;
let crawler_create = async () => {
  browser = await puppeteer.launch({
    headless: Browser_isnot_display,
  });
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(domain, {
    waitUntil: "networkidle0",
    args: ["--disable-features=site-per-process"],
  });
  await page.setViewport({
    width: 500,
    height: 1200,
  });
  await page.content();
};

/* 爬虫主程序 */
async function crawler_main() {
  for (let i = 0; i <= tag.length - 1; i++) {
    result_data.push(await dom_tree_list(tag[i], i));
  }
  console.log("主程序完毕");
}

//dom递归函数
let nowselect_element; //目前的元素
async function dom_tree_list(obj, parentElement_index) {
  let jsonobj; //最终抓取的json数据
  let index = obj.index;
  let oldpage = page;
  try {
    //父元素
    if (obj.dom_type == "parent_node") {
      //递归返回数据
      jsonobj = [];

      await page.waitForSelector(obj.class, {
        visible: true,
        timeout: timeout_timer,
      });
      let parentElements = await page.$$(obj.class);

      for (const Element of parentElements) {
        nowselect_element = Element;
        console.log(
          "程序主流程",
          parentElements.length
          //await nowselect_element.evaluate((el) => el.tagName)
        );
        jsonobj.push(await jsondata_produce(obj));
        try {
          jsonobj[jsonobj.length - 1].target = await nowselect_element.evaluate(
            (el) => el.tagName
          );
        } catch (err) {
          error_log.push({ message: err.message, stack: err.stack });
          jsonobj[jsonobj.length - 1].target = "null";
        }

        if (obj.children != null) {
          //是否子元素是点击后才能获取到的
          if (obj.isclick) {
            const targetPromise = new Promise((resolve) =>
              browser.once("targetcreated", resolve)
            );
            await nowselect_element.click();
            oldpage = page;
            const target = await targetPromise;
            const newPage = await target.page();
            page = newPage;
            console.log("新的标签页");
            const navigationPromise = newPage.waitForNavigation({
              waitUntil: "networkidle0",
            });
            const timeoutPromise = page.waitForTimeout(5000); // 最多等待5秒钟
            await Promise.race([navigationPromise, timeoutPromise]);
            console.log("ok");
          }

          jsonobj[jsonobj.length - 1].children = [];

          //let list1=[]
          await Promise.all(
            obj.children.map(async (item) => {
              jsonobj[jsonobj.length - 1].children = await dom_tree_list(
                item,
                parentElement_index
              );
            })
          );

          //回退页面
          if (obj.isclick) {
            console.log("close");
            await page.close();

            page = oldpage;
          }
        } else {
          jsonobj[jsonobj.length - 1].children = null;
        }
      }
    } else {
      //子元素
      jsonobj = [];
      let Elements;
      switch (obj.which_choose) {
        case "index":
          Elements = [];
          Elements.push(await nowselect_element.$(`:nth-child(${index})`));

          console.log("子流程:" + "index");
          break;
        case "target":
          try {
            await page.waitForSelector(`${obj.target}`, {
              visible: true,
              timeout: timeout_timer,
            });
            Elements = await nowselect_element.$$(`${obj.target}`);
          } catch (err) {
            error_log.push({ message: err.message, stack: err.stack });
            Elements = [];
          }

          console.log("子流程:" + obj.target);
          console.log("子流程:" + "target");
          break;
        case "class":
          {
            try {
              Elements = await nowselect_element.$$(obj.class);
            } catch (err) {
              console.log(obj.class);
              error_log.push({ message: err.message, stack: err.stack });
              Elements = [];
            }
            console.log("子流程:" + "class");
          }
          break;
        default:
          break;
      }

      for (const Element of Elements) {
        nowselect_element = Element;
        jsonobj.push(await jsondata_produce(obj));
        console.log(nowselect_element);
        try {
          jsonobj[jsonobj.length - 1].target = await nowselect_element.evaluate(
            (el) => el.tagName
          );
        } catch (err) {
          error_log.push({ message: err.message, stack: err.stack });
          jsonobj[jsonobj.length - 1].target = "null";
        }
        console.log("执行");

        // console.log(
        //   "tag:" + (await nowselect_element.evaluate((el) => el.tagName))
        // );

        if (obj.children != null) {
          jsonobj[jsonobj.length - 1].children = [];
          await Promise.all(
            obj.children.map(async (item) => {
              jsonobj[jsonobj.length - 1].children = await dom_tree_list(
                item,
                parentElement_index
              );
            })
          );

          // if (obj.isclick) {
          //   console.log("5", obj.class);
          //   if (newTarget != null) {
          //     console.log("返回1");
          //     const newPage = await newTarget.page();
          //     await newPage.close();
          //     page = oldpage;
          //     await page.bringToFront();
          //   } else {
          //     console.log("返回2");
          //     await page.goBack();
          //     await page.waitForNavigation({ waitUntil: "networkidle2" });
          //   }
          // }
        } else {
          jsonobj[jsonobj.length - 1].children = null;
        }
        if (obj.isclick) {
          console.log("子元素点击");
          await nowselect_element.click();
          // 等待新页面打开
          const navigationPromise = page.waitForNavigation({
            waitUntil: "networkidle0",
          });
          const timeoutPromise = page.waitForTimeout(5000); // 最多等待5秒钟
          await Promise.race([navigationPromise, timeoutPromise]);
        }
      }
    }
    return jsonobj;
  } catch (err) {
    error_log.push({ message: err.message, stack: err.stack });
    console.log("报错:" + err.message);
    console.log("报错定位:" + err.stack);
    return jsonobj;
  }
}

//最终json数据生成 一定要放在nowselect_element获取到最新元素之后
async function jsondata_produce(obj) {
  let temp_json = {
    type: null, //文件类型
    link: null, //链接
    text: null, //纯文本
    children: null,
  };

  if (obj.type != null) {
    if (obj.type == "text") {
      try {
        temp_json.text = await nowselect_element.evaluate((el) => el.innerText);
        temp_json.type = "text";

        if ((await nowselect_element.evaluate((el) => el.tagName)) == "A") {
          // console.log(
          //   "链接:" + (await nowselect_element.evaluate((el) => el.href))
          // );
          temp_json.link = await nowselect_element.evaluate((el) => el.href);
        }
      } catch (err) {
        temp_json.type = null;
      }
    } else if (obj.type == "href") {
      temp_json.link = await nowselect_element.evaluate((el) => el.href);
      temp_json.type = "href";
    }
  }

  if (obj.children != null) {
    temp_json.children = [];
    obj.children.map(() => {
      temp_json.children.push({
        type: null, //文件类型
        link: null, //链接
        text: null, //纯文本
        children: null,
      });
    });
  }

  return temp_json;
}

/* 把最终数据写入文件 */
function set_into_file(str, filepath) {
  const options = { encoding: "utf8" };
  fs.writeFileSync(filepath, str, options);
  console.log("写入成功");
}

/* 主函数执行入口 */
async function main_go() {
  await crawler_create();
  await crawler_main();
  //console.log(result_data);
  let jsonContent = JSON.stringify(result_data[0]);
  set_into_file(jsonContent, "./normal_crawler/output.json");
  await new Promise((resolve) => setTimeout(resolve, 500));
  await browser.close();
  console.log("执行完毕");
}

main_go();
