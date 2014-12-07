(function () {
    var WalkUpState = YYC.Class(WalkState_Y, {
        Protected: {
            P__setPlayerState: function () {
                this.P_context.setPlayerState(this.P_context.standUpState);
            },
            P__computeTarget: function () {
                var currentCellPos = this.P_context.sprite.getCurrentCellPosition();

                return {
                    x: currentCellPos.x,
                    y: currentCellPos.y - 1
                };
            },
            P__computeTargetByMoving: function () {
                var currentCellPos = this.P_context.sprite.getCellPosition(this.P_context.sprite.x, this.P_context.sprite.y);


                return {
                    x: currentCellPos.x,
                    y: currentCellPos.y
                };
            },
            P__checkBorder: function (target) {
                if (target.y < 0) {
                    return true;
                }

                return false;
            },
            P__setDir: function () {
                var sprite = this.P_context.sprite;

                sprite.setAnim("walk_up");
                sprite.dirY = -1;
            },
            P__stop: function () {
                var sprite = this.P_context.sprite;

                sprite.dirY = 0;
            }
        },
        Public: {
            walkUp: function () {
                this.P__checkMapAndSetDir();
            }
        }
    });

    window.WalkUpState = WalkUpState;
}());