const { contextBridge, ipcRenderer } = require("electron");
console.log("进");
contextBridge.exposeInMainWorld("electronAPI", {
  setJsoncontent: (jsoncontent, state) =>
    ipcRenderer.send("normal_crawler_config", jsoncontent, state),

  load_normal_crawler_config: (state) =>
    ipcRenderer.send("load_normal_crawler_config", state),

  //窗口向渲染进程发送
  read_normal_crawler_config: (callback) =>
    ipcRenderer.on("normal_crawler_readconfig", callback),
  //抓取结束
  catch_over: (callback) => ipcRenderer.on("catch_over", callback),
});
