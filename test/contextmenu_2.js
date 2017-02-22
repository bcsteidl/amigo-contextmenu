'use strict'

// require("../css/contextmenu.css")

const $ = require('jquery')

$.fn.contextmenu = require('..')

const opcoes = {
    onShow: function(menu) {
        var itens = ["1-0", "2-0", "3-0", "4-0"];
        itens.splice(itens.indexOf("2-0"), 1);
        itens.splice(itens.indexOf("4-0"), 1);
        menu.applyrule({
            enable: true,
            items: itens
        });
    },
    width: 150,
    items: [{
        text: "Criar",
        icon: "../css/images/contextmenu/m_arrow.gif",
        alias: "1-0",
        action: function() {
            console.log("Criado")
        }
    }, {
        text: "Listar",
        icon: "../css/images/contextmenu/m_arrow.gif",
        alias: "2-0",
        action: function() {
            console.log("Listado")
        }
    }, {
        type: "splitLine"
    }, {
        text: "Editar",
        icon: "../css/images/contextmenu/m_arrow.gif",
        alias: "3-0",
        action: function() {
            console.log("Editado")
        }
    }, {
        text: "Apagar",
        icon: "../css/images/contextmenu/m_arrow.gif",
        alias: "4-0",
        action: function() {
            console.log("Apagado")
        }
    }]
}

$('h3').contextmenu(opcoes)
