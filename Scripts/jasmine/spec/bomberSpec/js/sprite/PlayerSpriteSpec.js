describe("PlayerSprite.js", function () {
    var sprite = null;

    function clearKeyState() {
        window.keyState = {};
        window.keyState[keyCodeMap.Left] = false;
        window.keyState[keyCodeMap.Right] = false;
        window.keyState[keyCodeMap.Up] = false;
        window.keyState[keyCodeMap.Down] = false;
        window.keyState[keyCodeMap.Space] = false;
    };
    function fakeKeyDown(keyCode) {
        window.keyState[keyCode] = true;
    };
    function fakeKeyUp(keyCode) {
        window.keyState[keyCode] = false;
    };

    beforeEach(function () {
        sprite = spriteFactory.createPlayer();
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
        afterEach(function () {
            clearKeyState();
        });

        it("如果正在移动，则返回", function () {
        });

        describe("如果停止移动，则判断移动方向并调用对应的状态类方法", function () {
            beforeEach(function () {
                sprite.moving = false;
            });

            it("如果松开A、W、S、D键，则调用stand", function () {
                fakeKeyUp(keyCodeMap.Left);
                fakeKeyUp(keyCodeMap.Right);
                fakeKeyUp(keyCodeMap.Up);
                fakeKeyUp(keyCodeMap.Down);
                spyOn(sprite.P__context, "stand");

                sprite.setDir();

                expect(sprite.P__context.stand).toHaveBeenCalled();
            });

            describe("否则", function () {
                it("如果按下A键，则调用walkLeft", function () {
                    fakeKeyDown(keyCodeMap.Left);
                    spyOn(sprite.P__context, "walkLeft");

                    sprite.setDir();

                    expect(sprite.P__context.walkLeft).toHaveBeenCalled();
                });
                it("如果按下D键，则调用walkRight", function () {
                    fakeKeyDown(keyCodeMap.Right);
                    spyOn(sprite.P__context, "walkRight");

                    sprite.setDir();

                    expect(sprite.P__context.walkRight).toHaveBeenCalled();
                });
                it("如果按下W键，则调用walkUp", function () {
                    fakeKeyDown(keyCodeMap.Up);
                    spyOn(sprite.P__context, "walkUp");

                    sprite.setDir();

                    expect(sprite.P__context.walkUp).toHaveBeenCalled();
                });
                it("如果按下S键，则调用walkDown", function () {
                    fakeKeyDown(keyCodeMap.Down);
                    spyOn(sprite.P__context, "walkDown");

                    sprite.setDir();

                    expect(sprite.P__context.walkDown).toHaveBeenCalled();
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

    describe("createBomb", function () {
        var config = testTool.extendDeep(window.bomberConfig),
            data = testTool.extendDeep(window.mapData),
            terrainData = testTool.extendDeep(window.terrainData),
            ground = bomberConfig.map.type.GROUND,
            wall = bomberConfig.map.type.WALL,
            pass = bomberConfig.map.terrain.pass,
            stop = bomberConfig.map.terrain.stop,
            yes = stop,
            no = pass;

        //假的地图方格尺寸
        function fakeWidthAndHeight(width, height) {
            window.bomberConfig.WIDTH = width;
            window.bomberConfig.HEIGHT = height;
        };
        function fakeMapData(data) {
            window.mapData = data;
        };
        function fakeTerrainData(terrainData) {
            window.terrainData = terrainData;
        };
        function judge(one, two, three) {
            it("创建一个炸弹（BombSprite类实例）并返回，并设置其坐标等于玩家人物的坐标，炸弹数加1", function () {
                spyOn(spriteFactory, "createBomb").andCallThrough();

                var bomb = sprite.createBomb();

                expect(spriteFactory.createBomb).toHaveBeenCalledWith(sprite);
                expect(bomb).toBeInstanceOf(BombSprite);
                expect([bomb.x, bomb.y]).toEqual([one, 20]);
                expect(sprite.bombNum).toEqual(1);
            });

            describe("修改地形数据：炸弹所在方格为不能通过", function () {

                var terrainData = testTool.extendDeep(window.terrainData);

                function restore() {
                    window.terrainData = terrainData;
                };

                beforeEach(function () {
                    fakeTerrainData([
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass]
                    ]);
                });
                afterEach(function () {
                    restore();
                });

                it("炸弹所在方格对应的地形数据为不通过", function () {
                    sprite.createBomb();

                    expect(window.terrainData[2][two]).toEqual(bomberConfig.map.terrain.stop);
                });
            });

            it("同一个方格最多放置一个炸弹（该方格的地形为不能通过则表示有炸弹了）", function () {
                fakeTerrainData(three.terrainData);
                spyOn(spriteFactory, "createBomb").andCallThrough();

                sprite.createBomb();

                expect(spriteFactory.createBomb.calls.length).toEqual(three.callNum);
            });
        };

        beforeEach(function () {
            fakeWidthAndHeight(10, 10);
            fakeMapData([
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground]
            ]);
            fakeTerrainData([
                [pass, pass, pass, pass],
                [pass, pass, pass, pass],
                [pass, pass, pass, pass],
                [pass, pass, pass, pass]
            ]);
            sprite.bombNum = 0;
            sprite.moving = false;
        });
        afterEach(function () {
            window.bomberConfig.WIDTH = config.WIDTH;
            window.bomberConfig.HEIGHT = config.HEIGHT;
            window.mapData = data;
            window.terrainData = terrainData;
        });

        it("玩家只能放三个炸弹：如果炸弹数为3，则返回null", function () {
            sprite.P__context.setPlayerState(sprite.P__context.standLeftState);
            sprite.bombNum = 3;

            expect(sprite.createBomb()).toBeNull();
        });

        describe("如果玩家处于Stand状态，则放置的炸弹坐标等于玩家人物的坐标", function () {
            beforeEach(function () {
                sprite.P__context.setPlayerState(sprite.P__context.standLeftState);
                sprite.x = 20;
                sprite.y = 20;
            });

            judge(20, 2, {
                terrainData: [
                    [pass, pass, pass, pass],
                    [pass, pass, pass, pass],
                    [pass, pass, stop, pass],
                    [pass, pass, pass, pass]
                ], callNum: 0
            });
        });

        describe("如果玩家处于Walk状态（测试WalkRight状态），则放置的炸弹坐标为移动目的地方格的坐标", function () {
            beforeEach(function () {
                sprite.P__context.setPlayerState(sprite.P__context.walkRightState);
            });

            describe("如果玩家右边为ground", function () {
                beforeEach(function () {
                    //玩家位于第三行第四格（玩家从第三行第三格往右走）
                    sprite.x = 22;
                    sprite.y = 20;
                    sprite.moving = true;
                });

                judge(30, 3, {
                    terrainData: [
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass],
                        [pass, pass, pass, stop],
                        [pass, pass, pass, pass]
                    ], callNum: 0
                });
            });

            describe("如果玩家右边为墙", function () {
                beforeEach(function () {
                    //玩家位于第三行第三格（玩家从第三行第三格往右走。因为右边为墙，所以玩家停留在该格中。）
                    sprite.x = 20;
                    sprite.y = 20;
                    sprite.moving = false;
                });

                judge(20, 2, {
                    terrainData: [
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass],
                        [pass, pass, pass, pass]
                    ], callNum: 1
                });


            });
        });
    });
});