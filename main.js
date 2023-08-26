// main.js
// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

// 启动Node server
const start_normal_crawler_Server = async () => {
  try {
    console.log("开始启动通用爬虫服务");
    execSync("npm run normal_crawler_server");
    // res("成功启动通用爬虫服务");
    console.log("成功启动通用爬虫服务");
  } catch (error) {
    //  res(`启动通用爬虫服务失败：${error.message}`);
    console.log(`启动通用爬虫服务失败：${error.message}`);
  }
};

//读取通用爬虫配置文件
const normal_crawler_readTheConfiguration = async () => {
  try {
    // 同步读取 JSON 文件
    let data = await new Promise((res) => {
      fs.readFile(
        path.join(__dirname, "normal_crawler/config.json"),
        "utf8",
        (err, dataStr) => {
          res(dataStr);
        }
      );
    });

    // 解析 JSON 数据
    let jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error("无法读取文件:", err);
  }
};

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: path.join(__dirname, "other/logo.png"),
    //frame: false,
    // WEBPreferences: {
    //   // nodeIntegration: true,
    //   // contextIsolation: false,
    //   // eslint-disable-next-line no-undef
    //   //preload: path + "/preload.js",
    //   preload: path.join(__dirname, "/public/preload.js"),
    // },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true, // 隐藏菜单栏
    backgroundColor: "#3a3a3a",
  });

  //读取通用爬虫配置文件
  ipcMain.on("load_normal_crawler_config", async () => {
    console.log("加载");
    let result = await normal_crawler_readTheConfiguration();
    mainWindow.webContents.send("normal_crawler_readconfig", result);
  });

  //写入通用爬虫配置
  ipcMain.on("normal_crawler_config", async (event, jsoncontent, state) => {
    const options = { encoding: "utf8" };
    await new Promise((res) => {
      fs.writeFile(
        path.join(__dirname, "normal_crawler/config.json"),
        JSON.stringify(jsoncontent),
        options,
        (err) => {
          res(err);
        }
      );
    });
    console.log("写入成功");
    if (state == "catch") {
      start_normal_crawler_Server()
        .then(async () => {
          let data1 = await new Promise((res) => {
            fs.readFile(
              path.join(__dirname, "normal_crawler/output.json"),
              "utf8",
              (err, dataStr) => {
                res(dataStr);
              }
            );
          });
          let jsonData = JSON.parse(data1);
          mainWindow.webContents.send("catch_over", {
            type: "success",
            data: jsonData,
          });
        })
        .catch((error) => {
          mainWindow.webContents.send("catch_over", {
            type: "error",
            data: error,
          });
        });

      console.log(typeof jsoncontent);
    }
  });

  // 获取主显示器的尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  let loadingWindow = new BrowserWindow({
    frame: false,
    width: 600,
    height: 200,
    resizable: false,
    icon: path.join(__dirname, "other/logo.png"),
    modal: true, // 如果需要，可以将子窗口设置为模态窗口
  });

  // 计算窗口居中的位置
  const x1 = Math.floor((width - loadingWindow.getSize()[0]) / 2);
  const y1 = Math.floor((height - loadingWindow.getSize()[1]) / 2);

  // 设置窗口的位置
  loadingWindow.setPosition(x1, y1);

  // 加载子窗口的 HTML 文件
  loadingWindow.loadFile("./other/main.html");

  mainWindow.loadFile("./dist/index.html");
  setTimeout(() => {
    loadingWindow.close();
    loadingWindow = null;
    //mainWindow.loadURL("http://localhost:8080");
    mainWindow.show();
  }, 10000);

  // 加载 index.html

  //window;

  // 打开开发工具
  // mainWindow.webContents.openDevTools();
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。
