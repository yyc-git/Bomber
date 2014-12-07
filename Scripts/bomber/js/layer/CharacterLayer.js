(function () {
    var CharacterLayer = YYC.AClass(Layer, {
        Init: function (deltaTime) {
            this.___deltaTime = deltaTime;
        },
        Private: {
            ___deltaTime: 0,

            ___update: function (deltaTime) {
                this.P__iterator("update", deltaTime);
            },
            ___setDir: function () {
                this.P__iterator("setDir");
            },
            ___move: function () {
                this.P__iterator("move");
            },
            ___render: function () {
                //判断__state是否为change状态，如果是则调用canvas绘制精灵。
                if (this.P__isChange()) {
                    this.clear();
                    this.___update(this.___deltaTime);
                    this.draw();
                    this.setStateNormal();
                }
            }
        },
        Public: {
            draw: function () {
                this.P__iterator("draw", this.P__context);
            },
            change: function () {
                this.setStateChange();
            },
            Virtual: {
                run: function () {
                    this.___setDir();
                    this.___move();
                    this.___render();
                }
            }
        }
    });

    window.CharacterLayer = CharacterLayer;
}());