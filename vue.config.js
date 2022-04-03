 let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:9527"
};

proxyObj['/'] = {
    target: 'http://localhost:9527',
    ws: false,
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        proxy: proxyObj,
    }
}