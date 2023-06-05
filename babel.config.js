const productionPlugins = []
if (process.env.NODE_ENV === "production" && process.env.VUE_APP_ENV == "prod") { // todo  if判断是否打包,打包环境下控制台去掉console.log,也可去掉if判断，整个项目不会出现console.log(不建议)
    productionPlugins.push("transform-remove-console");
}
module.exports = {
    presets: ['@vue/app'],
    // plugins: ['transform-remove-console']
    plugins: productionPlugins

}