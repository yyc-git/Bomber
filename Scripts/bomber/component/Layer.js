(function () {
    var Layer = YYC.AClass(Collection, {
        Init: function () {
        },
        Private: {
            __state: bomberConfig.layer.state.CHANGE,   //默认为change

            __getContext: function () {
                this.P__context = this.P__canvas.getContext("2d");
            }
        },
        Protected: {
            //*共用的变量（可读、写）

            P__canvas: null,
            P__context: null,

            //*共用的方法（可读）

            P__isChange: function () {
                return this.__state === bomberConfig.layer.state.CHANGE;
            },
            P__isNormal: function () {
                return this.__state === bomberConfig.layer.state.NORMAL;
            },
            P__iterator: function (handler) {
                var args = Array.prototype.slice.call(arguments, 1),
                    nextElement = null;

                while (this.hasNext()) {
                    nextElement = this.next();
                    nextElement[handler].apply(nextElement, args);  //要指向nextElement
                }
                this.resetCursor();
            },
            P__render: function () {
                if (this.P__isChange()) {
                    this.clear();
                    this.draw();
                    this.setStateNormal();
                }
            }
        },
        Public: {
            remove: function (sprite) {
                this.base(function (e, obj) {
                    if (e.x === obj.x && e.y === obj.y) {
                        return true;
                    }
                    return false;
                }, sprite);
            },
            addSprites: function (elements) {
                this.appendChilds(elements);
            },
            setStateNormal: function () {
                this.__state = bomberConfig.layer.state.NORMAL;
            },
            setStateChange: function () {
                this.__state = bomberConfig.layer.state.CHANGE;
            },
            Virtual: {
                init: function () {
                    this.__getContext();
                },
                clear: function (sprite) {
                    if (arguments.length === 0) {
                        this.P__iterator("clear", this.P__context);
                    }
                    else if (arguments.length === 1) {
                        sprite.clear(this.P__context);
                    }
                }
            }
        },
        Abstract: {
            setCanvas: function () {
            },
            change: function () {
            },
            //统一绘制
            draw: function () {
            },
            //游戏主线程调用的函数
            run: function () {
            }
        }
    });

    window.Layer = Layer;
}());