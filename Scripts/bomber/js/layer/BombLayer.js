(function () {
    var BombLayer = YYC.Class(Layer, {
        Private: {
            ___hasBomb: function () {
                return this.getChilds().length > 0;
            },
            ___removeBomb: function (bomb) {
                //*注意顺序！

                this.clear(bomb);
                this.remove(bomb);
            },
            ___removeAllFire: function () {
                //*注意顺序！

                this.fireLayer.clear();
                this.fireLayer.removeAll();
            },
            ___removeEnemy: function (enemy) {
                //*注意顺序！

                this.enemyLayer.clear(enemy);
                this.enemyLayer.remove(enemy);
            },
            ___mapChange: function (mapChange) {
                if (mapChange) {
                    this.mapLayer.setStateChange();
                }
            },
            ___collideFireWithPlayer: function (bomb) {
                if (bomb.collideFireWithCharacter(this.playerLayer.getChildAt(0))) {
                    window.gameState = window.bomberConfig.game.state.OVER;
                }
            },
            ___collideFireWithEnemy: function (bomb) {
                var i = 0,
                    len = 0,
                    enemySprites = this.enemyLayer.getChilds();

                for (i = 0, len = enemySprites.length; i < len; i++) {
                    if (bomb.collideFireWithCharacter(enemySprites[i])) {
                        this.___removeEnemy(enemySprites[i]);
                    }
                }

                //如果敌人都被炸死了，则游戏胜利！
                if (this.enemyLayer.getChilds().length === 0) {
                    window.gameState = window.bomberConfig.game.state.WIN;
                }
            },
            ___handleCollid: function (bomb) {
                this.___collideFireWithPlayer(bomb)
                this.___collideFireWithEnemy(bomb);
            },
            ___explodeInEffectiveRange: function (bomb) {
                var eachBomb = null;

                this.resetCursor();
                while (this.hasNext()) {
                    eachBomb = this.next();
                    if (eachBomb.isInEffectiveRange.call(eachBomb, bomb)) {
                        this.explode(eachBomb);
                    }
                }
                this.resetCursor();
            }
        },
        Public: {
            fireLayer: null,
            mapLayer: null,
            playerLayer: null,
            enemyLayer: null,

            setCanvas: function () {
                this.P__canvas = document.getElementById("bombLayerCanvas");
                //width、height在html中设置！
                var css = {
                    "position": "absolute",
                    "top": bomberConfig.canvas.TOP,
                    "left": bomberConfig.canvas.LEFT,
                    "z-index": 1
                };

                $("#bombLayerCanvas").css(css);
            },
            init: function (layers) {
                this.fireLayer = layers.fireLayer;
                this.mapLayer = layers.mapLayer;
                this.playerLayer = layers.playerLayer;
                this.enemyLayer = layers.enemyLayer;

                this.base();
            },
            draw: function () {
                this.P__iterator("draw", this.P__context);
            },
            explode: function (bomb) {
                var self = this,
                    result = null;

                //处理碰撞
                this.___handleCollid(bomb);

                result = bomb.explode();
                this.fireLayer.addSprites(result.fires);
                this.___mapChange(result.mapChange);
                this.___removeBomb(bomb);


                //炸弹爆炸时会引爆在火力范围内的炸弹。
                this.___explodeInEffectiveRange(bomb);

                //定时清空fireLayer（火焰消失）
                setTimeout(function () {
                    self.___removeAllFire();
                }, 300);

            },
            change: function () {
                if (this.___hasBomb()) {
                    //this.base();
                    this.setStateChange();
                }
            },
            run: function () {
                this.P__render();
            }
        }
    });

    window.BombLayer = BombLayer;
}());