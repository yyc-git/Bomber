describe("PlayerLayer.js", function () {
    var layer = null;

    beforeEach(function () {
        layer = new PlayerLayer(100);
    });

    describe("Init", function () {
        it("调用父类构造函数", function () {
        });
    });


    describe("setCanvas", function () {
        it("方法存在", function () {
            expect(layer.setCanvas).toBeDefined();
        });
        it("获得playerLayerCanvas", function () {
            spyOn(document, "getElementById");

            layer.setCanvas();

            expect(document.getElementById).toHaveBeenCalledWith("playerLayerCanvas");
        });
        it("设置css", function () {
            layer.setCanvas();

            var canvas = $(layer.P__canvas);
            var expectedCss = {
                "position": "absolute",
                "top": bomberConfig.canvas.TOP.toString(),
                "left": bomberConfig.canvas.LEFT.toString(),
                "z-index": 3
            };

            expect(canvas.css("top")).toEqual(expectedCss.top);
            expect(canvas.css("left")).toEqual(expectedCss.left);
            expect(Number(canvas.css("z-index"))).toEqual(expectedCss["z-index"]);
        });
    });

    describe("init", function () {
        beforeEach(function () {
            layer.setCanvas();
        });

        it("获得bombLayer", function () {
            var fakeLayers = {
                bombLayer: {}
            };
            layer.init(fakeLayers);

            expect(layer.bombLayer).toBeExist();
        });
        it("调用父类同名函数", function () {
        });
    });

    describe("change", function () {
        function clearKeyState() {
            window.keyState = {};
            window.keyState[keyCodeMap.Left] = false;
            window.keyState[keyCodeMap.Right] = false;
            window.keyState[keyCodeMap.Up] = false;
            window.keyState[keyCodeMap.Down] = false;
            window.keyState[keyCodeMap.Space] = false;
        };
        function fakeKeyDown(keyCode) {
            keyState[keyCode] = true;
        };
        function fakeKeyUp(keyCode) {
            keyState[keyCode] = false;
        };
        function judgeKeyDown(keyCode) {
            layer = new PlayerLayer(100);
            fakeKeyDown(keyCode);

            layer.change();

            expect(layer.P__isChange()).toBeTruthy();
        };

        beforeEach(function () {
            layer.setStateNormal();
            clearKeyState();
            layer.appendChild(spriteFactory.createPlayer());
            layer.getChildAt(0).moving = false;
            layer.getChildAt(0).stand = false;
        });
        afterEach(function () {
        });


        it("如果触发了keydown，且按键为A/D/W/S，则调用父类同名函数", function () {
            judgeKeyDown(keyCodeMap.Left);
            judgeKeyDown(keyCodeMap.Right);
            judgeKeyDown(keyCodeMap.Up);
            judgeKeyDown(keyCodeMap.Down);

            clearKeyState();
        });
        it("如果layer中玩家精灵类正在移动，则调用layer.change", function () {
            layer.getChildAt(0).moving = true;

            layer.change();

            expect(layer.P__isChange()).toBeTruthy();
        });
        it("如果layer中玩家精灵类由移动转为站立（调用WalkState的stand方法），则置stand标志为false并调用layer.change(刷新动画)", function () {
            layer.getChildAt(0).stand = true;

            layer.change();

            expect(layer.getChildAt(0).stand).toBeFalsy();
            expect(layer.P__isChange()).toBeTruthy();
        });
    });

    describe("createAndAddBomb", function () {
        var fakeLayers = null,
            fakeBombLayer = null,
            sprite = null;

        var terrainData = testTool.extendDeep(window.terrainData),
            pass = bomberConfig.map.terrain.pass,
            stop = bomberConfig.map.terrain.stop;

        function fakeTerrainData(terrainData) {
            window.terrainData = terrainData;
        };
        function createFakeSprite() {
            var sprite = spriteFactory.createPlayer();
            sprite.x = bomberConfig.WIDTH;
            sprite.y = bomberConfig.HEIGHT;
            sprite.P__context.setPlayerState(sprite.P__context.standLeftState);

            return sprite;
        };


        beforeEach(function () {
            fakeTerrainData([
                [pass, pass, pass, pass],
                [pass, pass, pass, pass],
                [pass, pass, pass, pass],
                [pass, pass, pass, pass]
            ]);

            sprite = createFakeSprite();
            layer.appendChild(sprite);
            fakeBombLayer = {
                appendChild: function () {
                },
                explode: function () {
                },
                clear: function () {
                }
            };
            layer.setCanvas();
            fakeLayers = {
                bombLayer: fakeBombLayer
            };
            layer.init(fakeLayers);
        });
        afterEach(function () {
            window.terrainData = terrainData;
        });

        it("如果精灵类的createBomb返回null，则返回false", function () {
            spyOn(sprite, "createBomb").andReturn(null);

            expect(layer.createAndAddBomb()).toBeFalsy();
        });
        it("调用精灵类的createBomb", function () {
            spyOn(layer.getChildAt(0), "createBomb");

            layer.createAndAddBomb();

            expect(layer.getChildAt(0).createBomb).toHaveBeenCalled();
        });
        it("BombLayer加入创建的一个炸弹", function () {
            spyOn(fakeBombLayer, "appendChild");

            layer.createAndAddBomb();

            expect(fakeBombLayer.appendChild.calls.length).toEqual(1);
        });

        describe("3s后", function () {
            function judge(exploded, func) {
                jasmine.Clock.useMock();

                spyOn(findPath, "aCompute");

                spyOn(fakeBombLayer, "explode");
                var bomb = layer.createAndAddBomb();
                bomb.exploded = exploded;

                jasmine.Clock.tick(2999);

                expect(fakeBombLayer.explode).not.toHaveBeenCalled();

                jasmine.Clock.tick(1);

                func();
            }

            it("如果炸弹没有爆炸过（可能被在火力范围内的炸弹引爆了），则炸弹爆炸", function () {
                judge(false, function () {
                    expect(fakeBombLayer.explode).toHaveBeenCalledWith(bomb);
                });
            });
            it("如果炸弹已经爆炸了（被在火力范围内的炸弹引爆了），则炸弹不会再次爆炸", function () {
                judge(true, function () {
                    expect(fakeBombLayer.explode).not.toHaveBeenCalledWith(bomb);
                });
            });
        });


        it("返回创建的炸弹（方便上面测试）", function () {
            expect(layer.createAndAddBomb()).toBeExist();
        });
    });

    describe("run", function () {
        function clearKeyState() {
            window.keyState[keyCodeMap.Space] = false;
        };
        function fakeKeyDown(keyCode) {
            keyState[keyCode] = true;
        };
        function fakeKeyUp(keyCode) {
            keyState[keyCode] = false;
        };

        afterEach(function () {
            clearKeyState();
        });

        it("如果按下空格键，则调用createAndAddBomb，并置空格键状态为false"
            + "（要不然下次轮询时，因为还没有松开空格键，所以keyState[keyCodeMap.Space]还是为true，所以会重复创建炸弹！ ）", function () {
            fakeKeyDown(keyCodeMap.Space);
            spyOn(layer, "createAndAddBomb");

            layer.run();

            expect(layer.createAndAddBomb).toHaveBeenCalled();
            expect(keyState[keyCodeMap.Space]).toBeFalsy();
        });
        it("调用父类同名函数", function () {
        });
    });
});