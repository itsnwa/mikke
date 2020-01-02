module.exports = {
  pwa: {
    themeColor: "#000000",
    backgroundColor: "#000000",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "public/service-worker.js"
    }
  }
}
