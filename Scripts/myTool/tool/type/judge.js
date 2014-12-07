/************************************ 判断 ***************************************/

YYC.Pattern.namespace("Tool").judge = {
    //判断浏览器类型
    browser: {
        ie: !!(document.all && navigator.userAgent.indexOf('Opera') === -1),

        ie7: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 7",
        ie8: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 8",
        ie9: navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 9",
        ff: navigator.userAgent.indexOf("Firefox") >= 0 && true,
        opera: navigator.userAgent.indexOf("Opera") >= 0 && true,
        chrome: navigator.userAgent.indexOf("Chrome") >= 0 && true
    },
    //判断是否为jQuery对象
    isjQuery: function (ob) {
        if (!jQuery) {
            throw new Error("jQuery未定义！");
        }

        return ob instanceof jQuery;
    },
    /*判断是否为function（是否为类）*/
    isFunction: function (func) {
        return Object.prototype.toString.call(func) === "[object Function]";
    },
    isArray: function (val) {
        return Object.prototype.toString.call(val) === "[object Array]";
    },
    /*判断是否为string型*/
    isString: function (str) {
        return Object.prototype.toString.call(str) === "[object String]";
    },
    /* 
     * 检测对象是否是空对象(不包含任何可读属性)。 //如你上面的那个对象就是不含任何可读属性
     * 方法只既检测对象本身的属性，不检测从原型继承的属性。
     */
    isOwnEmptyObject: function (obj) {
        var name = "";

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    },
    /* 
     * 检测对象是否是空对象(不包含任何可读属性)。
     * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
     */

    isEmptyObject: function (obj) {
        var name = "";

        for (name in obj) {
            return false;
        }
        return true;
    },
    isOdd: function (num) {
        return num % 2 !== 0;
    },
    //判断是否不是对象
    isNotObject: function (obj) {
        var result = false;

        switch (Object.prototype.toString.call(obj)) {
            case "[object String]":
            case "[object Number]":
            case "[object Boolean]":
                result = true;
                break;
            default:
                result = false;
                break;
        }
        return result;
    },
    //判断是否为对象字面量（{}）
    isObject: function (obj) {
        var result = false;

        if (Object.prototype.toString.call(obj) === "[object Object]") {
            result = true;
        }
        else {
            result = false;
        }

        return result;
    },
    isHTMLImg: function (img) {
        return Object.prototype.toString.call(img) === "[object HTMLImageElement]";
    },
    isNumber: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Number]";
    },
    isBool: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Boolean]";
    },
    /*
     任何对象，如果其语义在ECMAScript规范中被定义过，那么它被称为原生对象；
     环境所提供的，而在ECMAScript规范中没有被描述的对象，我们称之为宿主对象。

     该方法用于特性检测，判断对象是否可用。用法如下：

     MyEngine addEvent():
     if (YYC.Tool.judge.isHostMethod(dom, "addEventListener")) {    //判断dom是否具有addEventListener方法
     dom.addEventListener(sEventType, fnHandler, false);
     }
     */
    //检查宿主对象是否可调用
    isHostMethod: (function () {
        function isHostMethod(object, property) {
            var type = typeof object[property];

            return type === "function" ||
                (type === "object" && !!object[property]) ||
                type === "unknown";
        };

        return isHostMethod;
    }())
};