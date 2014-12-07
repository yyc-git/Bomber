(function () {
    var WalkDownState = YYC.Class(WalkState_Y, {
        Protected: {
            P__setPlayerState: function () {
                this.P_context.setPlayerState(this.P_context.standDownState);
            },
            P__computeTarget: function () {
                var currentCellPos = this.P_context.sprite.getCurrentCellPosition();

                return {
                    x: currentCellPos.x,
                    y: currentCellPos.y + 1
                };
            },
            P__computeTargetByMoving: function () {
                var currentCellPos = this.P_context.sprite.getCellPosition(this.P_context.sprite.x, this.P_context.sprite.y);


                return {
                    x: currentCellPos.x,
                    y: this.P_context.sprite.moving ? currentCellPos.y + 1 : currentCellPos.y,
                };
            },
            P__checkBorder: function (target) {
                if (target.y >= window.mapData.length) {
                    return true;
                }

                return false;
            },
            P__setDir: function () {
                var sprite = this.P_context.sprite;

                sprite.setAnim("walk_down");
                sprite.dirY = 1;
            },
            P__stop: function () {
                var sprite = this.P_context.sprite;

                sprite.dirY = 0;
            }
        },
        Private: {
        },
        Public: {
            walkDown: function () {
                try {
                    this.P__checkMapAndSetDir();
                }
                catch (e) {
                    var t = this.P__checkMapAndSetDir();
                    var m = 1;

                }
                finally {
                }
            }
        }
    });

    window.WalkDownState = WalkDownState;
}());