(function () {
    var FireLayer = YYC.Class(Layer, {
        Private: {
            ___hasFire: function () {
                return this.getChilds().length > 0;
            }
        },
        Public: {
            setCanvas: function () {
                this.P__canvas = document.getElementById("fireLayerCanvas");
                //width、height在html中设置！
                var css = {
                    "position": "absolute",
                    "top": bomberConfig.canvas.TOP,
                    "left": bomberConfig.canvas.LEFT,
                    "z-index": 2
                };

                $("#fireLayerCanvas").css(css);
            },
            draw: function () {
                this.P__iterator("draw", this.P__context);
            },
            clear: function () {
                this.P__iterator("clear", this.P__context);
            },
            change: function () {
                if (this.___hasFire()) {
                    this.setStateChange();
                }
            },
            run: function () {
                this.P__render();
            }
        }
    });

    window.FireLayer = FireLayer;
}());