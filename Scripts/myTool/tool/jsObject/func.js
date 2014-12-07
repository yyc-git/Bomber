/************************************ 函数 ***************************************/

YYC.Pattern.namespace("Tool").func = {
    argumentNames: function (fn) {
        var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    },
    //获得函数名
    getFunctionName: function (fn) {
        var name = "";

        if (!fn) {
            return null;
        }

        name = fn.toString().match(/^.*function\s*([^\(]*)/);
        return name === null ? name : name[1];
    },
    bind: function (object, fun) {
        return function () {
            return fun.apply(object, arguments);
        };
    },
    /*
     注意BindWithArguments与bind的区别！它们传的参数不一样！

     示例：

     var func = bind(this, A);
     func("a");  //将func的参数"a"传入A

     var func = bindWithArguments(this, A, "b");
     func(); //将"b"传入A
     */

    bindWithArguments: function (object, fun, args) {
        var _args = null;
        var self = this;

        _args = Array.prototype.slice.call(arguments, 2);

        return function () {
            return fun.apply(object, _args);
        }
    }
};