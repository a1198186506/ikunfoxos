module.exports = {
  packagerConfig: {
    asar: true,
    icon: "build/logo",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: "http://192.168.31.160:8080/logo.png",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        icon: "http://192.168.31.160:8080/logo.png",
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        icon: "http://192.168.31.160:8080/logo.png",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
