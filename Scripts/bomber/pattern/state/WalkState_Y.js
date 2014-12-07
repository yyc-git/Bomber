(function () {
    var WalkState_Y = YYC.AClass(WalkState, {
        Protected: {
        },
        Private: {
            __judgeCompleteOneMoveByIndex: function () {
                var sprite = this.P_context.sprite;

                if (sprite.moveIndex_y >= sprite.stepY) {
                    sprite.moveIndex_y = 0;
                    sprite.moving = false;
                }
                else {
                    sprite.moving = true;
                }
            },
            __computeCoordinate: function () {
                var sprite = this.P_context.sprite;

                sprite.y = sprite.y + sprite.speedY * sprite.dirY;
            }
        },
        Public: {
            move: function () {
                if (!this.P_context.sprite.moving) {
                    return;
                }

                this.P_context.sprite.moveIndex_y += 1;
                this.__judgeCompleteOneMoveByIndex();
                this.__computeCoordinate();
            }
        },
        Abstract: {
        }
    });

    window.WalkState_Y = WalkState_Y;
}());