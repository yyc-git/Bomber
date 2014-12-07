(function () {
    var MapLayer = YYC.Class(Layer, {
        Init: function () {
        },
        Private: {
            ___canvasBuffer: null,
            ___contextBuffer: null,

            ___getCanvasBuffer: function () {
                //缓冲的canvas也要在html中创建并设置width、height！
                this.___canvasBuffer = document.getElementById("mapLayerCanvas_buffer");
            },
            ___getContextBuffer: function () {
                this.___contextBuffer = this.___canvasBuffer.getContext("2d");
            },
            ___drawBuffer: function () {
                this.P__iterator("draw", this.___contextBuffer);
            }
        },
        Public: {
            setCanvas: function () {
                this.P__canvas = document.getElementById("mapLayerCanvas");
                //width、height在html中设置！
                var css = {
                    "position": "absolute",
                    "top": bomberConfig.canvas.TOP,
                    "left": bomberConfig.canvas.LEFT,
                    "border": "1px solid blue",
                    "z-index": 0
                };

                $("#mapLayerCanvas").css(css);
                //缓冲canvas的css也要设置！
                $("#mapLayerCanvas_buffer").css(css);
            },
            init: function () {
                //*双缓冲

                //获得缓冲canvas
                this.___getCanvasBuffer();
                //获得缓冲context
                this.___getContextBuffer();

                this.base();
            },
            draw: function () {
                this.___drawBuffer();
                this.P__context.drawImage(this.___canvasBuffer, 0, 0);

            },
            clear: function () {
                this.___contextBuffer.clearRect(0, 0, bomberConfig.canvas.WIDTH, bomberConfig.canvas.HEIGHT);
                this.P__context.clearRect(0, 0, bomberConfig.canvas.WIDTH, bomberConfig.canvas.HEIGHT);
            },
            change: function () {
                this.setStateNormal();
            },
            changeSpriteImg: function (x, y, img) {
                var index = y * window.bomberConfig.map.COL + x;
                this.getChildAt(index).bitmap.img = img;
            },
            run: function () {
                if (this.P__isChange()) {
                    this.clear();
                    this.draw();
                }
            }
        }
    });

    window.MapLayer = MapLayer;
}());