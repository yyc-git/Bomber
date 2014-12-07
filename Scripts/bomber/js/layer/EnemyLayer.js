(function () {
    var EnemyLayer = YYC.Class(CharacterLayer, {
        Init: function (deltaTime) {
            this.base(deltaTime);
        },
        Private: {
            __getPath: function () {
                this.P__iterator("getPath");
            }
        },
        Public: {
            playerLayer: null,

            init: function (layers) {
                this.playerLayer = layers.playerLayer;
                //传入玩家人物精灵类
                this.P__iterator("setPlayerSprite", this.playerLayer.getChildAt(0));

                this.base();
            },
            setCanvas: function () {
                this.P__canvas = document.getElementById("enemyLayerCanvas");

                //width、height在html中设置！
                $("#enemyLayerCanvas").css({
                    "position": "absolute",
                    "top": bomberConfig.canvas.TOP,
                    "left": bomberConfig.canvas.LEFT,
                    "border": "1px solid black",
                    "z-index": 3
                });
            },
            collideWithPlayer: function () {
                try {
                    this.P__iterator("collideWithPlayer", this.playerLayer.getChildAt(0));
                    return false;
                }
                catch (e) {
                    return true;
                }
            },

            run: function () {
                if (this.collideWithPlayer()) {
                    window.gameState = window.bomberConfig.game.state.OVER;
                    return;
                }

                this.__getPath();
                this.base();
            }
        }
    });

    window.EnemyLayer = EnemyLayer;
}());