/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


function returnfalse() {
    return false;
};

module.exports = function(option) {
    var ruleName = null,
        target = null,
        groups = {},
        mitems = {},
        actions = {},
        showGroups = [],
        itemTpl = "<div class='b-m-$[type]' unselectable=on><nobr unselectable=on><img src='$[icon]' align='absmiddle'/><span unselectable=on>$[text]</span></nobr></div>";
    var gTemplet = $("<div/>").addClass("b-m-mpanel").attr("unselectable", "on").css("display", "none");
    var iTemplet = $("<div/>").addClass("b-m-item").attr("unselectable", "on");
    var sTemplet = $("<div/>").addClass("b-m-split");

    //build group item, which has sub items
    var buildGroup = function(obj) {
        groups[obj.alias] = this;
        this.gidx = obj.alias;
        this.id = obj.alias;
        if (obj.disable) {
            this.disable = obj.disable;
            this.className = "b-m-idisable";
        }
        $(this).width(obj.width).click(returnfalse).mousedown(returnfalse).appendTo($("body"));
        obj = null;
        return this;
    };
    var buildItem = function(obj) {
        var T = this;
        T.title = obj.text;
        T.idx = obj.alias;
        T.gidx = obj.gidx;
        T.data = obj;
        T.innerHTML = itemTpl.replace(/\$\[([^\]]+)\]/g, function() {
            return obj[arguments[1]];
        });
        if (obj.disable) {
            T.disable = obj.disable;
            T.className = "b-m-idisable";
        }
        obj.items && (T.group = true);
        obj.action && (actions[obj.alias] = obj.action);
        mitems[obj.alias] = T;
        T = obj = null;
        return this;
    };
    //add new items
    var addItems = function(gidx, items) {
        var tmp = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type == "splitLine") {
                //split line
                tmp = sTemplet.clone()[0];
            } else {
                items[i].gidx = gidx;
                if (items[i].type == "group") {
                    //group
                    buildGroup.apply(gTemplet.clone()[0], [items[i]]);
                    arguments.callee(items[i].alias, items[i].items);
                    items[i].type = "arrow";
                    tmp = buildItem.apply(iTemplet.clone()[0], [items[i]]);
                } else {
                    //normal item
                    items[i].type = "ibody";
                    tmp = buildItem.apply(iTemplet.clone()[0], [items[i]]);
                    $(tmp).click(function(e) {
                        if (!this.disable) {
                            if ($.isFunction(actions[this.idx])) {
                                actions[this.idx].call(this, target);
                            }
                            hideMenuPane();
                        }
                        return false;
                    });

                } //end if
                $(tmp).bind("contextmenu", returnfalse).hover(overItem, outItem);
            }
            groups[gidx].appendChild(tmp);
            tmp = items[i] = items[i].items = null;
        } //end for
        gidx = items = null;
    };
    var overItem = function(e) {
        //menu item is disabled
        if (this.disable)
            return false;
        hideMenuPane.call(groups[this.gidx]);
        //has sub items
        if (this.group) {
            var pos = $(this).offset();
            var width = $(this).outerWidth();
            showMenuGroup.apply(groups[this.idx], [pos, width]);
        }
        this.className = "b-m-ifocus";
        return false;
    };
    //menu loses focus
    var outItem = function(e) {
        //disabled item
        if (this.disable)
            return false;
        if (!this.group) {
            //normal item
            this.className = "b-m-item";
        } //Endif
        return false;
    };
    //show menu group at specified position
    var showMenuGroup = function(pos, width) {
        var bwidth = $("body").width();
        var bheight = document.documentElement.clientHeight;
        var mwidth = $(this).outerWidth();
        var mheight = $(this).outerHeight();
        pos.left = (pos.left + width + mwidth > bwidth) ? (pos.left - mwidth < 0 ? 0 : pos.left - mwidth) : pos.left + width;
        pos.top = (pos.top + mheight > bheight) ? (pos.top - mheight + (width > 0 ? 25 : 0) < 0 ? 0 : pos.top - mheight + (width > 0 ? 25 : 0)) : pos.top;
        $(this).css(pos).show();
        showGroups.push(this.gidx);
    };
    //to hide menu
    var hideMenuPane = function() {
        var alias = null;
        for (var i = showGroups.length - 1; i >= 0; i--) {
            if (showGroups[i] == this.gidx)
                break;
            alias = showGroups.pop();
            groups[alias].style.display = "none";
            mitems[alias] && (mitems[alias].className = "b-m-item");
        } //Endfor
        //CollectGarbage();
    };

    function applyRule(rule) {
        if (ruleName && ruleName == rule.name)
            return false;
        for (var i in mitems)
            disable(i, !rule.disable);
        for (var i = 0; i < rule.items.length; i++)
            disable(rule.items[i], rule.disable);
        ruleName = rule.name;
    };

    function disable(alias, disabled) {
        var item = mitems[alias];
        item.className = (item.disable = item.lastChild.disabled = disabled) ? "b-m-idisable" : "b-m-item";
    };

    /* to show menu  */
    function showMenu(e, menutarget, option) {
        target = menutarget;
        showMenuGroup.call(groups[option.alias], {
            left: e.pageX,
            top: e.pageY
        }, 0);
        $(document).one('mousedown', hideMenuPane);
    }

    option = $.extend({
        alias: "cmroot",
        width: 150
    }, option);

    var $root = $("#" + option.alias);
    var root = null;
    if ($root.length == 0) {
        root = buildGroup.apply(gTemplet.clone()[0], [option]);
        root.applyrule = applyRule;
        root.showMenu = showMenu;
        addItems(option.alias, option.items);
    } else {
        root = $root[0];
    }
    var me = $(this).each(function() {
        return $(this).bind('contextmenu', function(e) {
            var bShowContext = (option.onContextMenu && $.isFunction(option.onContextMenu)) ? option.onContextMenu.call(this, e) : true;
            if (bShowContext) {
                if (option.onShow && $.isFunction(option.onShow)) {
                    option.onShow.call(this, root);
                }
                root.showMenu(e, this, option);
            }
            return false;
        });
    });
    //to apply rule
    if (option.rule) {
        applyRule(option.rule);
    }
    gTemplet = iTemplet = sTemplet = itemTpl = buildGroup = buildItem = null;
    addItems = overItem = outItem = null;
    //CollectGarbage();

    return me;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../node_modules/css-loader/index.js!./contextmenu.css", function() {
			var newContent = require("!!./../node_modules/css-loader/index.js!./contextmenu.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".b-m-mpanel {\r\n\tbackground: #F0F0F0 url(" + __webpack_require__(8) + ") left repeat-y;\r\n\tborder: 1px solid #718BB7;\r\n\tpadding: 2px 0;\r\n\tposition: absolute;\r\n\tz-index: 99997;\r\n\tleft:0px;\r\n\ttop:0px;\r\n}\r\n.b-m-split {\r\n\theight: 6px;\r\n\tbackground: url(" + __webpack_require__(7) + ") center repeat-x;\r\n\tfont-size: 0px;\r\n\tmargin: 0 2px;\r\n}\r\n.b-m-item, .b-m-idisable\r\n{\r\n    padding: 4px 2px;\r\n    margin: 0 2px 0 3px;\r\n    cursor: normal;\r\n    line-height:100%;\r\n}\r\n.b-m-idisable\r\n{\r\n    color:#808080;\r\n}\r\n.b-m-ibody, .b-m-arrow {\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n\t\r\n}\r\n.b-m-arrow {\r\n\tbackground: url(" + __webpack_require__(5) + ") right  no-repeat;\t\r\n}\r\n.b-m-idisable .b-m-arrow\r\n{\r\n    background:none;\r\n}\r\n.b-m-item img, .b-m-ifocus img, .b-m-idisable img {\r\n\tmargin-right: 8px;\r\n}\r\n.b-m-ifocus {\r\n\tbackground: url(" + __webpack_require__(6) + ") repeat-x bottom;\r\n\tborder: 1px solid #AACCF6;\r\n\tpadding: 3px 1px ;\r\n    margin: 0 2px 0 3px;\r\n    cursor: normal;\r\n    line-height:100%;\r\n}\r\n.b-m-idisable img {\r\n\tvisibility:hidden;\r\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,R0lGODlhBQAJAMQUAFSg6UGJ2TyE04rD/CluvlWUzo7D9ixwwDiC1j2I3UeLyTmE0zJ1v2eg1Tp6zmKq8ZXL/ypxv1Kg7Ct1yv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAFAAkAAAUcIEKNVCKQE7SMkzEE1AQ8DTNJRRQrBHuQDhIlBAA7"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,R0lGODlhAQAWAIAAAOvz/dno+yH5BAAAAAAALAAAAAABABYAAAIFhI+hy1oAOw=="

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,R0lGODlhAQACAIAAAP///9DPzyH5BAAAAAAALAAAAAABAAIAAAICDAoAOw=="

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,R0lGODlhGgABAJEAANDPz/////Dw8AAAACH5BAAAAAAALAAAAAAaAAEAAAIFlI+pB1EAOw=="

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// carga dos CSS do plugin
__webpack_require__(1)

(function($) {

    $.fn.contextmenu = __webpack_require__(0)

})(jQuery);


/***/ })
/******/ ]);
//# sourceMappingURL=amigo-contextmenu.js.map