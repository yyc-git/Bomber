(function () {
    var StandState = YYC.AClass(PlayerState, {
        Private: {
        },
        Protected: {
        },
        Public: {
            walkLeft: function () {
                this.P_context.sprite.resetCurrentFrame(0);
                this.P_context.setPlayerState(this.P_context.walkLeftState);
                this.P_context.walkLeft();
            },
            walkRight: function () {
                this.P_context.sprite.resetCurrentFrame(0);
                this.P_context.setPlayerState(this.P_context.walkRightState);
                this.P_context.walkRight();
            },
            walkUp: function () {
                this.P_context.sprite.resetCurrentFrame(0);
                this.P_context.setPlayerState(this.P_context.walkUpState);
                this.P_context.walkUp();
            },
            walkDown: function () {
                this.P_context.sprite.resetCurrentFrame(0);
                this.P_context.setPlayerState(this.P_context.walkDownState);
                this.P_context.walkDown();
            },
            move: function () {
            },
            createBomb: function () {
                var sprite = this.P_context.sprite;
                bomb = null,
                    targetCellPos = this.P_context.sprite.getCurrentCellPosition();

                if (this.P_bombExist(targetCellPos)) {
                    return null;
                }

                bomb = spriteFactory.createBomb(sprite);
                bomb.x = sprite.x;
                bomb.y = sprite.y;

                sprite.bombNum += 1;

                this.P_changeTerrainData(targetCellPos);

                return bomb;
            }
        },
        Abstract: {
        }
    });

    window.StandState = StandState;
}());