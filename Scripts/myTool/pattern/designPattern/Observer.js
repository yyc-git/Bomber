(function () {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, thisObj) {
            var scope = thisObj || window;
            for (var i = 0, j = this.length; i < j; ++i) {
                fn.call(scope, this[i], i, this);
            }
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fn, thisObj) {
            var scope = thisObj || window;
            var a = [];
            for (var i = 0, j = this.length; i < j; ++i) {
                if (!fn.call(scope, this[i], i, this)) {
                    continue;
                }
                a.push(this[i]);
            }
            return a;
        };
    }

    Subject = function () {
        this._events = [];
    }

    Subject.prototype = (function () {

        return {
            //订阅方法
            subscribe: function (context, fn) {
                if (arguments.length == 2) {
                    this._events.push({ context: arguments[0], fn: arguments[1] });
                }
                else {
                    this._events.push(arguments[0]);
                }
            },
            //发布指定方法
            publish: function (context, fn, args) {
                var args = Array.prototype.slice.call(arguments, 2);    //获得函数参数
                var _context = null;
                var _fn = null;

                this._events.filter(function (el) {
                    if (el.context) {
                        _context = el.context;
                        _fn = el.fn;
                    }
                    else {
                        _context = context;
                        _fn = el;
                    }

                    if (_fn === fn) {
                        return _fn;
                    }
                }).forEach(function (el) {  //指定方法可能有多个
                        el.apply(_context, args);       //执行每个指定的方法
                    });
            },
            unSubscribe: function (fn) {
                var _fn = null;
                this._events = this._events.filter(function (el) {
                    if (el.fn) {
                        _fn = el.fn;
                    }
                    else {
                        _fn = el;
                    }

                    if (_fn !== fn) {
                        return el;
                    }
                });
            },
            //全部发布
            publishAll: function (context, args) {
                var args = Array.prototype.slice.call(arguments, 1);    //获得函数参数
                var _context = null;
                var _fn = null;

                this._events.forEach(function (el) {
                    if (el.context) {
                        _context = el.context;
                        _fn = el.fn;
                    }
                    else {
                        _context = context;
                        _fn = el;
                    }

                    _fn.apply(_context, args);       //执行每个指定的方法
                });
            },
            dispose: function () {
                this._events = [];
            }
        }
    })();

    YYC.Pattern.Subject = Subject;
})();