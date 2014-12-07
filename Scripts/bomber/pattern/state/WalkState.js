(function () {
    var WalkState = YYC.AClass(PlayerState, {
        Protected: {
            //*子类可复用的代码

            P__checkMapAndSetDir: function () {
                var sprite = this.P_context.sprite;

                this.P__setDir();

                if (!this.__checkPassMap()) {
                    sprite.moving = false;
                    this.P__stop();
                }
                else {
                    sprite.moving = true;
                }
            },
            Abstract: {
                P__setPlayerState: function () {
                },
                //计算并返回目的地方格坐标
                P__computeTarget: function () {
                },
                //计算并返回移动时目的地方格坐标
                P__computeTargetByMoving: function () {
                },
                //检测是否超出地图边界。
                //超出返回true，否则返回false
                P__checkBorder: function (target) {
                },
                //设置方向
                P__setDir: function () {
                },
                //停止
                P__stop: function () {
                }
            }
        },
        Private: {
            //检测是否可通过该地图。可以通过返回true，不能通过返回false
            __checkPassMap: function () {
                //计算目的地地形数组下标
                var target = this.P__computeTarget();

                if (this.P__checkBorder(target)) {
                    return false;
                }

                return !this.__checkCollideWithBarrier(target);
            },
            //地形障碍物碰撞检测
            __checkCollideWithBarrier: function (target) {
                var stop = bomberConfig.map.terrain.stop;

                //碰撞
                if (window.terrainData[target.y][target.x] === stop) {
                    return true;
                }

                return false;
            }
        },
        Public: {
            stand: function () {
                this.P__setPlayerState();
                this.P_context.stand();
                //重置当前帧
                this.P_context.sprite.resetCurrentFrame(0);

                this.P_context.sprite.stand = true;
            },
            createBomb: function () {
                var sprite = this.P_context.sprite,
                    targetCellPos = this.P__computeTargetByMoving(),
                    bomb = null;

                if (this.P_bombExist(targetCellPos)) {
                    return null;
                }

                bomb = spriteFactory.createBomb(sprite);
                bomb.x = targetCellPos.x * window.bomberConfig.WIDTH;
                bomb.y = targetCellPos.y * window.bomberConfig.HEIGHT

                sprite.bombNum += 1;

                this.P_changeTerrainData(targetCellPos);

                return bomb;
            },
            Virtual: {
                walkLeft: function () {
                    this.P_context.setPlayerState(this.P_context.walkLeftState);
                    this.P_context.walkLeft();
                    this.P_context.sprite.resetCurrentFrame(0);
                },
                walkRight: function () {
                    this.P_context.setPlayerState(this.P_context.walkRightState);
                    this.P_context.walkRight();
                    this.P_context.sprite.resetCurrentFrame(0);
                },
                walkUp: function () {
                    this.P_context.setPlayerState(this.P_context.walkUpState);
                    this.P_context.walkUp();
                    this.P_context.sprite.resetCurrentFrame(0);
                },
                walkDown: function () {
                    this.P_context.setPlayerState(this.P_context.walkDownState);
                    this.P_context.walkDown();
                    this.P_context.sprite.resetCurrentFrame(0);
                }
            }
        },
        Abstract: {
        }
    });

    window.WalkState = WalkState;
}());