describe("WalkLeftState.js", function () {
    beforeEach(function () {
        context = new Context(spriteFactory.createPlayer());
        state = new WalkLeftState();
        state.setContext(context);
    });

    describe("walkLeft", function () {
        it("context.sprite的动画为walk_left", function () {
            spyOn(context.sprite, "setAnim");

            state.walkLeft();

            expect(context.sprite.setAnim).toHaveBeenCalledWith("walk_left");
        });
        it("context.sprite的行走方向为左", function () {
            state.walkLeft();

            expect(context.sprite.dirX).toEqual(-1);
        });

        describe("测试移动", function () {
            var data = testTool.extendDeep(window.terrainData),
                config = testTool.extendDeep(window.bomberConfig);

            //假的动作图片尺寸
            function fakeImgWidthAndHeight(width, height) {
                window.bomberConfig.player.IMGWIDTH = width;
                window.bomberConfig.player.IMGHEIGHT = height;
            };
            //假的地图方格尺寸
            function fakeWidthAndHeight(width, height) {
                window.bomberConfig.WIDTH = width;
                window.bomberConfig.HEIGHT = height;
            };
            function restore() {
                window.terrainData = data;
                window.bomberConfig.WIDTH = config.WIDTH;
                window.bomberConfig.HEIGHT = config.HEIGHT;
                window.bomberConfig.player.IMGWIDTH = config.player.IMGWIDTH;
                window.bomberConfig.player.IMGHEIGHT = config.player.IMGHEIGHT;
            };
            function fakeTerrainData() {
                var pass = bomberConfig.map.terrain.pass,
                    stop = bomberConfig.map.terrain.stop;

                window.terrainData = [
                    [pass, pass, pass, pass],
                    [pass, stop, pass, pass],
                    [pass, pass, pass, pass],
                    [pass, pass, pass, pass]
                ];
            };

            beforeEach(function () {
                fakeTerrainData();
                fakeWidthAndHeight(30, 30);
                fakeImgWidthAndHeight(30, 30);

            });
            afterEach(function () {
                restore();
            });

            describe("如果不可通过地图", function () {
                function outBorder() {
                    spyOn(state.P_context.sprite, "getCellPosition").andCallFake(function () {
                        return    {
                            x: 0,
                            y: 0
                        }
                    });
                }

                beforeEach(function () {
                    outBorder();
                });

                it("sprite.moving为false，sprite.dirX为0", function () {
                    var sprite = context.sprite;
                    sprite.moving = true;
                    sprite.dirX = 1;

                    state.walkLeft();

                    expect([sprite.moving, sprite.dirX]).toEqual([false, 0]);
                });
            });

            describe("如果可以通过地图", function () {
                function canWalk() {
                    spyOn(state.P_context.sprite, "getCellPosition").andCallFake(function () {
                        return    {
                            x: 3,
                            y: 0
                        }
                    });
                }

                beforeEach(function () {
                    canWalk();
                });

                it("context.sprite的行走方向为左", function () {
                    state.walkLeft();

                    expect(context.sprite.dirX).toEqual(-1);
                });
                it("context.sprite.moving为true", function () {
                    context.sprite.moving = false;

                    state.walkLeft();

                    expect(context.sprite.moving).toBeTruthy();
                });
            });
        });
    });

    describe("walkRight", function () {
        it("状态过渡到WalkRightState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkRight();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkRightState);
        });
        it("调用context.walkRight", function () {
            spyOn(state.P_context, "walkRight");

            state.walkRight();

            expect(state.P_context.walkRight).toHaveBeenCalled();
        });
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkRight();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
    });

    describe("walkUp", function () {
        it("状态过渡到WalkUpState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkUp();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkUpState);
        });
        it("调用context.walkUp", function () {
            spyOn(state.P_context, "walkUp");

            state.walkUp();

            expect(state.P_context.walkUp).toHaveBeenCalled();
        });
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkUp();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
    });

    describe("walkDown", function () {
        it("状态过渡到WalkDownState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkDown();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkDownState);
        });
        it("调用context.walkDown", function () {
            spyOn(state.P_context, "walkDown");

            state.walkDown();

            expect(state.P_context.walkDown).toHaveBeenCalled();
        });
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkDown();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
    });

    describe("stand", function () {
        it("状态过渡到StandLeftState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.stand();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.standLeftState);
        });
        it("调用context.stand", function () {
            spyOn(state.P_context, "stand");

            state.stand();

            expect(state.P_context.stand).toHaveBeenCalled();
        });
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.stand();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
        it("sprite.stand标志为true", function () {
            state.P_context.sprite.stand = false;

            state.stand();

            expect(state.P_context.sprite.stand).toBeTruthy();
        });
    });

    describe("move", function () {
        var sprite = null;

        beforeEach(function () {
            sprite = state.P_context.sprite;
            sprite.x = sprite.y = 0;
            sprite.dirX = sprite.dirY = 0;
        });

        it("如果正在移动，则调用Index加1", function () {
            sprite.moving = true;
            sprite.stepX = 5;
            sprite.moveIndex_x = 0;

            state.move();

            expect(state.P_context.sprite.moveIndex_x).toEqual(1);
        });

        describe("判断moveIndex", function () {

            describe("如果sprite正在运动", function () {
                beforeEach(function () {
                    sprite.moving = true;
                });

                describe("如果一次移动步长中，移动次数已达到指定次数（moveIndex_x大于等于stepX）", function () {
                    beforeEach(function () {
                        sprite.stepX = 5;
                        sprite.moveIndex_x = 5;
                    });

                    it("则moveIndex_x重置为0", function () {
                        state.move();

                        expect(sprite.moveIndex_x).toEqual(0);
                    });
                    it("移动标志为false", function () {
                        sprite.moving = true;

                        state.move();

                        expect(sprite.moving).toBeFalsy();
                    });
                });
                it("否则，移动标志为true", function () {
                    sprite.stepX = 5;
                    sprite.moveIndex_x = 3;
                    sprite.moving = true;

                    state.move();

                    expect(sprite.moving).toBeTruthy();
                });
            });
        });

        describe("计算坐标", function () {
            beforeEach(function () {
                sprite.speedX = sprite.speedY = 1;
                sprite.stepX = 5;
                sprite.moveIndex_x = 3;
            });

            it("改变x值", function () {
                sprite.x = 10;
                sprite.dirX = 1;
                sprite.moving = true;

                state.move();

                expect(sprite.x).toEqual(11);
            });
        });
    });
});