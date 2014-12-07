describe("EnemySprite.js", function () {
    var sprite = null;
    var data = null;

    beforeEach(function () {
        sprite = spriteFactory.createEnemy();
    });
    afterEach(function () {
        sprite = null;
    });

    describe("构造函数", function () {
        it("创建 状态模式 -> 上下文类对象，传入当前精灵类实例", function () {
            expect(sprite.P__context.sprite).toEqual(sprite);
        });
    });


    describe("setDir", function () {
        function fakeContext() {
            return {
                walkRight: function () {
                },
                walkLeft: function () {
                },
                walkUp: function () {
                },
                walkDown: function () {
                },
                stand: function () {
                }
            };
        };

        beforeEach(function () {
            sprite.P__context = fakeContext();
        });


        it("如果正在移动或者找不到路径，则返回", function () {
        });

        describe("否则", function () {
            beforeEach(function () {
                sprite.moving = false;
            });

            it("路径数组path去掉第一个元素（获得本次移动的目标点坐标）", function () {
                sprite.path = [
                    { x: 1, y: 1 }
                ];

                sprite.setDir();

                expect(sprite.path).toEqual([]);
            });

            describe("判断移动方向并调用对应的状态类方法", function () {
                function fakeTarget(target) {
                    sprite.path = [target];
                };
                function fakeCurrent(current) {
                    sprite.x = current.x * bomberConfig.WIDTH;
                    sprite.y = current.y * bomberConfig.HEIGHT;
                };

                it("如果目标点坐标target的x大于当前坐标current的x，则调用walkRight", function () {
                    fakeTarget({ x: 3, y: 1 });
                    fakeCurrent({ x: 2, y: 1 });
                    spyOn(sprite.P__context, "walkRight");

                    sprite.setDir();

                    expect(sprite.P__context.walkRight).toHaveBeenCalled();
                });
                it("如果目标点坐标target的x小于当前坐标current的x，则调用walkLeft", function () {
                    fakeTarget({ x: 1, y: 1 });
                    fakeCurrent({x: 2, y: 1});
                    spyOn(sprite.P__context, "walkLeft");

                    sprite.setDir();

                    expect(sprite.P__context.walkLeft).toHaveBeenCalled();
                });
                it("如果目标点坐标target的y大于当前坐标current的y，则调用walkDown", function () {
                    fakeTarget({ x: 3, y: 2 });
                    fakeCurrent({ x: 3, y: 1 });
                    spyOn(sprite.P__context, "walkDown");

                    sprite.setDir();

                    expect(sprite.P__context.walkDown).toHaveBeenCalled();
                });
                it("如果目标点坐标target的y小于当前坐标current的y，则调用walkUp", function () {
                    fakeTarget({ x: 3, y: 2 });
                    fakeCurrent({ x: 3, y: 3 });
                    spyOn(sprite.P__context, "walkUp");

                    sprite.setDir();

                    expect(sprite.P__context.walkUp).toHaveBeenCalled();
                });
                it("如果目标点坐标target等于当前坐标current，则调用stand", function () {
                    fakeTarget({ x: 3, y: 3 });
                    fakeCurrent({ x: 3, y: 3 });
                    spyOn(sprite.P__context, "stand");

                    sprite.setDir();    //调用stand

                    fakeTarget({ x: 2, y: 4 });
                    fakeCurrent({ x: 3, y: 3 });

                    sprite.setDir();    //不调用stand，调用walkLeft

                    expect(sprite.P__context.stand.calls.length).toEqual(1);
                });
            });
        });
    });

    describe("getPath", function () {
        var bomberConfig = testTool.extendDeep(window.bomberConfig);

        //假的地图方格尺寸
        function fakeWidthAndHeight(width, height) {
            window.bomberConfig.WIDTH = width;
            window.bomberConfig.HEIGHT = height;
        };
        function restore() {
            window.bomberConfig.WIDTH = bomberConfig.WIDTH;
            window.bomberConfig.HEIGHT = bomberConfig.HEIGHT;
        };

        beforeEach(function () {
            fakeWidthAndHeight(30, 30);
        });
        afterEach(function () {
            restore();
        });

        it("如果正在移动，则返回", function () {
            sprite.moving = true;
            sprite.path = [];

            sprite.getPath();

            expect(sprite.path).toEqual([]);
        });

        describe("如果停止移动", function () {
            beforeEach(function () {
                sprite.moving = false;
            });

            describe("如果敌人已经到达终点或者还没有开始第一次寻路，则寻找路径", function () {
                function fakePlayerSprite() {
                    return {
                        x: 35,
                        y: 59
                    };
                };

                beforeEach(function () {
                    sprite.path = [];
                    sprite.playerSprite = fakePlayerSprite();
                    spyOn(window.findPath, "aCompute").andReturn({ path: [
                        { x: 1, y: 1 },
                        { x: 2, y: 1 }
                    ], time: 1 });
                });

                it("如果敌人当前坐标不是方格尺寸的整数倍，则抛出异常", function () {
                    sprite.x = 10;
                    sprite.y = 45;

                    expect(function () {
                        sprite.getPath();
                    }).toThrow();
                });
                it("计算敌人当前坐标", function () {
                    sprite.x = 30;
                    sprite.y = 60;

                    sprite.getPath();

                    expect(window.findPath.aCompute.calls[0].args[1]).toEqual({ x: 1, y: 2 });
                });
                it("计算玩家精灵的坐标（玩家精灵的当前坐标向下取整）", function () {
                    sprite.getPath();

                    expect(window.findPath.aCompute.calls[0].args[2]).toEqual({ x: 1, y: 1 });
                });
            });
        });
    });

    describe("move", function () {
        it("调用context.move", function () {
            spyOn(sprite.P__context, "move");

            sprite.move();

            expect(sprite.P__context.move).toHaveBeenCalled();
        });
    });

    describe("collideWithPlayer", function () {
        function fakePlayerSprite() {
            return {
                x: 1,
                y: 1,
                bitmap: {
                    width: 1,
                    height: 1
                }
            }
        };

        beforeEach(function () {
        });

        it("如果碰撞，则抛出异常", function () {
            spyOn(YYC.Tool.collision, "col_Between_Rects").andReturn(true);

            expect(function () {
                sprite.collideWithPlayer(fakePlayerSprite());
            }).toThrow();
        });
        it("如果没有碰撞，则不抛出异常", function () {
            spyOn(YYC.Tool.collision, "col_Between_Rects").andReturn(false);

            expect(function () {
                sprite.collideWithPlayer(fakePlayerSprite());
            }).not.toThrow();
        });
    });

    describe("setPlayerSprite", function () {
        it("获得玩家精灵", function () {
            var fakeSprite = {
                x: 1
            };

            sprite.setPlayerSprite(fakeSprite);

            expect(sprite.playerSprite).toEqual(fakeSprite);
        });
    });
});