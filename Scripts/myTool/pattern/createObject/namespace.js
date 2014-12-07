/************************************ 命名空间 ***************************************/

/*
 采用测试驱动开发该方法
 01-24

 例子：

 YYC.Pattern.namespace("Button");
 */

if (typeof YYC === "undefined" || !YYC) {
    window.YYC = {};
}

if (typeof YYC.Pattern === "undefined" || !YYC.Pattern) {
    window.YYC.Pattern = {};
}

YYC.Pattern.namespace = function (str) {
    var parent = window.YYC,
        parts = str.split('.'),
        i = 0,
        len = 0;

    if (str.length == 0) {
        throw new Error("命名空间不能为空");
    }
    if (parts[0] === "YYC") {
        parts = parts.slice(1);
    }

    for (i = 0, len = parts.length; i < len; i++) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];  //递归增加命名空间
    }

    return parent;
};


/**
 *生成命名空间,并执行相应操作
 **/
YYC.register = function (str, func) {
    var parent = window.YYC,
        parts = str.split('.'),
        i = 0,
        len = 0;

    if (str.length == 0) {
        throw new Error("命名空间不能为空");
    }
    if (parts[0] === "YYC") {
        parts = parts.slice(1);
    }

    for (i = 0, len = parts.length; i < len; i++) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];  //递归增加命名空间
    }

    if (func) {
        func.call(parent, this);
    }

    return parent;
};