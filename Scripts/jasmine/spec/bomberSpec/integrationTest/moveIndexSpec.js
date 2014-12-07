describe("测试PlayerSprite.moveIndex", function () {
    var sprite = null,
        playerLayer = null,
        bomberConfig = testTool.extendDeep(window.bomberConfig),
        terrainData = testTool.extendDeep(window.terrainData);

    function clearKeyState() {
        window.keyState = {};
        window.keyState[keyCodeMap.Left] = false;
        window.keyState[keyCodeMap.Right] = false;
        window.keyState[keyCodeMap.Up] = false;
        window.keyState[keyCodeMap.Down] = false;
        window.keyState[keyCodeMap.Space] = false;
    };
    function fakeKeyDown() {
        var i = 0,
            len = 0;

        for (i = 0, len = arguments.length; i < len; i++) {
            window.keyState[arguments[i]] = true;
        }
    };
    function fakeKeyUp(keyCode) {
        var i = 0,
            len = 0;

        for (i = 0, len = arguments.length; i < len; i++) {
            window.keyState[arguments[i]] = false;
        }
    };
    function fakeTerrainData() {
        var pass = window.bomberConfig.map.terrain.pass,
            stop = window.bomberConfig.map.terrain.stop;

        window.terrainData = [
            [pass, pass, pass, pass],
            [pass, pass, pass, pass],
            [pass, pass, pass, pass],
            [pass, pass, pass, pass]
        ];
    };
    //假的地图方格尺寸
    function fakeWidthAndHeight(width, height) {
        window.bomberConfig.WIDTH = width;
        window.bomberConfig.HEIGHT = height;
    };
    function restore() {
        window.terrainData = terrainData;
        window.bomberConfig.WIDTH = bomberConfig.WIDTH;
        window.bomberConfig.HEIGHT = bomberConfig.HEIGHT;
    };

    beforeEach(function () {
        //没有地形障碍。该测试不考虑地形碰撞
        fakeTerrainData();

        sprite = spriteFactory.createPlayer();

        //移动10次为1个移动步长
        fakeWidthAndHeight(10, 10);
        sprite.speedX = sprite.speedY = 1;

        //设置玩家人物初始位置为第一行、第二格
        sprite.x = 20, sprite.y = 0;

        sprite.init();
        sprite.completeOneMove = false;

        playerLayer = new PlayerLayer(100);
        playerLayer.setCanvas();
        var fakeLayerManager = {
            getLayer: function () {
                return {};
            }
        };
        playerLayer.init(fakeLayerManager);
        playerLayer.appendChild(sprite);
        playerLayer.setStateChange();
    });
    afterEach(function () {
        clearKeyState();
        restore();
    });

    describe("测试PlayerSprite.moveIndex（x方向）", function () {

        describe("先轮询2次，然后玩家人物向左走（按下A键）", function () {
            //轮询num次
            function run(num) {
                for (var i = 0; i < num; i++) {
                    playerLayer.setStateChange();
                    playerLayer.run();
                }
            };
            //移动num次
            //与“轮询num次”的区别为前置条件不同：
            //如果sprite.moving为true，则为移动move；否则为轮询run。
            function move(num) {
                for (var i = 0; i < num; i++) {
                    playerLayer.setStateChange();
                    playerLayer.run();
                }
            };

            beforeEach(function () {
                run(2);
                fakeKeyDown(keyCodeMap.Left);
            });

            it("moveIndex_x为0", function () {
                expect(sprite.moveIndex_x).toEqual(0);
            });
            it("移动一次后，moveIndex_x为1，moving为true", function () {
                move(1);

                expect([sprite.moveIndex_x, sprite.moving]).toEqual([1, true]);
            });

            describe("移动了10次（一个移动步长）", function () {
                beforeEach(function () {
                    move(10);
                });

                it("moving为false，moveIndex_x为0，方向为左走（下一次轮询时会判断方向）", function () {
                    expect(sprite.moving).toBeFalsy();
                    expect(sprite.moveIndex_x).toEqual(0);
                    expect(sprite.dirX).toEqual(-1);
                });


                describe("按下A键，玩家人物继续向左移动1次", function () {
                    beforeEach(function () {
                        fakeKeyDown(keyCodeMap.Left);
                        move(1);
                    });

                    it("moveIndex_x为0", function () {
                        expect(sprite.moveIndex_x).toEqual(1);
                    });
                });

                describe("按下A键，玩家人物继续向左移动10次", function () {
                    beforeEach(function () {
                        fakeKeyDown(keyCodeMap.Left);
                        move(10);
                    });

                    it("moving为false，moveIndex_x为0，方向为左走（下一次轮询时会判断方向）", function () {
                        expect(sprite.moveIndex_x).toEqual(0);
                        expect(sprite.moving).toBeFalsy();
                        expect(sprite.dirX).toEqual(-1);
                    });
                });
            });
        });
    });
});