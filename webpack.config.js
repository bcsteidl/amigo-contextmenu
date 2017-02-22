const webpack = require('webpack')
const path = require('path')

const caminho = (pontoFinal = "") => path.resolve(__dirname, pontoFinal)

const eProducao = process.env.NODE_PRD === 'TRUE' || process.env.NODE_PRD === 'true'

module.exports = {
    entry: caminho("contextmenu.js"),
    output: {
        path: caminho("dist"),
        filename: (eProducao ? "amigo-contextmenu-min.js" : "amigo-contextmenu.js")
    },
    devtool: (eProducao ? "" : "source-map"),
    module: {
        loaders: [{
            test: /\.css$/,
            include: [caminho("css")],
            loader: "style-loader!css-loader"
        }, {
            test: /\.png$/,
            include: [caminho("css/images")],
            loader: "url-loader?limit=200000"
        }, {
            test: /\.jpg$/,
            include: [caminho("css/images")],
            loader: "url-loader?limit=100000"
        }, {
            test: /\.gif$/,
            include: [caminho("css/images")],
            loader: "url-loader?limit=100000"
        }]
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".css"],
        alias: {
            "jquery-ui": caminho("node_modules/jquery-ui-dist/jquery-ui.js"),
            css: caminho("css"),
            src: caminho("src")
        }
    },
    plugins: eProducao ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ] : []
}
