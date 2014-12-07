(function () {
    var WalkLeftState = YYC.Class(WalkState_X, {
        Protected: {
            P__setPlayerState: function () {
                this.P_context.setPlayerState(this.P_context.standLeftState);
            },
            P__computeTarget: function () {
                var currentCellPos = this.P_context.sprite.getCurrentCellPosition();

                return {
                    x: currentCellPos.x - 1,
                    y: currentCellPos.y
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
                if (target.x < 0) {
                    return true;
                }

                return false;
            },
            P__setDir: function () {
                var sprite = this.P_context.sprite;

                sprite.setAnim("walk_left");
                sprite.dirX = -1;
            },
            P__stop: function () {
                var sprite = this.P_context.sprite;

                sprite.dirX = 0;
            }
        },
        Public: {
            walkLeft: function () {
                this.P__checkMapAndSetDir();
            }
        }
    });

    window.WalkLeftState = WalkLeftState;
}());