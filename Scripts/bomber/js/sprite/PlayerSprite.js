(function () {
    var PlayerSprite = YYC.Class(MoveSprite, {
        Init: function (data, bitmap) {
            this.base(data, bitmap);
            this.P__context = new Context(this);
        },
        Private: {
            __allKeyUp: function () {
                return window.keyState[keyCodeMap.Left] === false && window.keyState[keyCodeMap.Right] === false
                    && window.keyState[keyCodeMap.Up] === false && window.keyState[keyCodeMap.Down] === false;
            },
            __judgeAndSetDir: function () {
                if (window.keyState[keyCodeMap.Left] === true) {
                    this.P__context.walkLeft();
                }
                else if (window.keyState[keyCodeMap.Right] === true) {
                    this.P__context.walkRight();
                }
                else if (window.keyState[keyCodeMap.Up] === true) {
                    this.P__context.walkUp();
                }
                else if (window.keyState[keyCodeMap.Down] === true) {
                    this.P__context.walkDown();
                }
            },
            __changeTerrainData: function () {
                var stop = bomberConfig.map.terrain.stop,
                    position = this.getCurrentCellPosition();

                terrainDataOperate.setTerrainData(position.x, position.y, stop);
            }
        },
        Public: {
            //已放置的炸弹数（未爆炸）
            bombNum: 0,

            move: function () {
                this.P__context.move();
            },
            setDir: function () {
                if (this.moving) {
                    return;
                }
                if (this.__allKeyUp()) {
                    this.P__context.stand();
                }
                else {
                    this.__judgeAndSetDir();
                }
            },
            createBomb: function () {
                if (this.bombNum === 3) {
                    return null;
                }

                return this.P__context.createBomb();
            }
        }
    });

    window.PlayerSprite = PlayerSprite;
}());