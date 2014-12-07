(function () {
    var WalkState_X = YYC.AClass(WalkState, {
        Protected: {
        },
        Private: {
            __judgeCompleteOneMoveByIndex: function () {
                var sprite = this.P_context.sprite;

                if (sprite.moveIndex_x >= sprite.stepX) {
                    sprite.moveIndex_x = 0;
                    sprite.moving = false;
                }
                else {
                    sprite.moving = true;
                }
            },
            __computeCoordinate: function () {
                var sprite = this.P_context.sprite;

                sprite.x = sprite.x + sprite.speedX * sprite.dirX;
            }
        },
        Public: {
            move: function () {
                if (!this.P_context.sprite.moving) {
                    return;
                }

                this.P_context.sprite.moveIndex_x += 1;
                this.__judgeCompleteOneMoveByIndex();
                this.__computeCoordinate();
            }
        },
        Abstract: {
        }
    });

    window.WalkState_X = WalkState_X;
}());