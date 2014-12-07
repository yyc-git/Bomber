(function () {
    var WalkRightState = YYC.Class(WalkState_X, {
        Protected: {
            P__setPlayerState: function () {
                this.P_context.setPlayerState(this.P_context.standRightState);
            },
            P__computeTarget: function () {
                var currentCellPos = this.P_context.sprite.getCurrentCellPosition();

                return {
                    x: currentCellPos.x + 1,
                    y: currentCellPos.y
                };
            },
            P__computeTargetByMoving: function () {
                var currentCellPos = this.P_context.sprite.getCellPosition(this.P_context.sprite.x, this.P_context.sprite.y);


                return {
                    x: this.P_context.sprite.moving ? currentCellPos.x + 1 : currentCellPos.x,
                    y: currentCellPos.y
                };
            },
            P__checkBorder: function (target) {
                if (target.x >= window.mapData[0].length) {
                    return true;
                }

                return false;
            },
            P__setDir: function () {
                var sprite = this.P_context.sprite;

                sprite.setAnim("walk_right");
                sprite.dirX = 1;
            },
            P__stop: function () {
                var sprite = this.P_context.sprite;

                sprite.dirX = 0;
            }
        },
        Public: {
            walkRight: function () {
                this.P__checkMapAndSetDir();
            }
        }
    });

    window.WalkRightState = WalkRightState;
}());