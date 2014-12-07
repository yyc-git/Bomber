describe("EnemyLayer.js", function () {
    var layer = null;

    beforeEach(function () {
        layer = new EnemyLayer(100);
    });

    describe("Init", function () {
        it("调用父类构造函数", function () {
        });
    });


    describe("init", function () {
        var fakeLayers = null;

        beforeEach(function () {
            fakeLayers = {
                playerLayer: {
                    getChildAt: function () {
                    }
                }
            };
            layer.setCanvas();
        });

        it("获得playerLayer", function () {
            layer.init(fakeLayers);

            expect(layer.playerLayer).toBeExist();
        });
        it("传入玩家人物精灵类", function () {
            spyOn(layer, "P__iterator");

            layer.init(fakeLayers);

            expect(layer.P__iterator).toHaveBeenCalledWith("setPlayerSprite", fakeLayers.playerLayer.getChildAt(0));
        });
        it("调用父类同名函数", function () {
        });
    });

    describe("setCanvas", function () {
        it("方法存在", function () {
            expect(layer.setCanvas).toBeDefined();
        });
        it("获得enemyLayerCanvas", function () {
            spyOn(document, "getElementById");

            layer.setCanvas();

            expect(document.getElementById).toHaveBeenCalledWith("enemyLayerCanvas");
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

    describe("collideWithPlayer", function () {
        var fakeLayers = null,
            sprite1 = null,
            sprite2 = null;

        beforeEach(function () {
            sprite1 = spriteFactory.createEnemy();
            sprite2 = spriteFactory.createEnemy();
            layer.appendChild(sprite1);
            layer.appendChild(sprite2);
            fakeLayers = {
                playerLayer: {
                    getChildAt: function () {
                    }
                }
            };
            layer.setCanvas();
            layer.init(fakeLayers);
        });

        it("调用每个精灵类的collideWithPlayer，如果都没有抛出异常，则返回false", function () {
            spyOn(sprite1, "collideWithPlayer");
            spyOn(sprite2, "collideWithPlayer");

            expect(layer.collideWithPlayer()).toBeFalsy();
        });
        it("调用每个精灵类的collideWithPlayer，只要有一次抛出异常，则返回true", function () {
            spyOn(sprite1, "collideWithPlayer");
            spyOn(sprite2, "collideWithPlayer").andCallFake(function () {
                throw new Error();
            });

            expect(layer.collideWithPlayer()).toBeTruthy();
        });
    });

    describe("run", function () {
        var sprite1 = null,
            sprite2 = null;
        var fakePlayerLayer = null;

        function setStateNormal() {
            layer.setStateNormal();
        };
        function setStateChange() {
            layer.setStateChange();
        };

        beforeEach(function () {
            layer.setCanvas();
            var fakeLayers = {
                playerLayer: {
                    getChildAt: function () {
                    }
                }
            };
            layer.init(fakeLayers);

            sprite1 = spriteFactory.createEnemy(),
                sprite2 = spriteFactory.createEnemy();

            sprite1.init();
            sprite2.init();
            layer.appendChild(sprite1);
            layer.appendChild(sprite2);
        });

        it("如果敌人精灵类与玩家精灵类相撞，则置游戏状态为OVER并返回", function () {
            var backUp = testTool.extendDeep(window.gameState);
            spyOn(layer, "collideWithPlayer").andReturn(true);
            spyOn(layer, "__getPath");

            layer.run();

            expect(window.gameState).toEqual(window.bomberConfig.game.state.OVER);
            expect(layer.__getPath).not.toHaveBeenCalled();

            window.gameState = backUp;
        });

        describe("否则", function () {
            beforeEach(function () {
                spyOn(layer, "collideWithPlayer").andReturn(false);
            });

            it("调用每个精灵类的getPath", function () {
                spyOn(sprite1, "getPath").andCallFake(function () {
                    this.path = [
                        { x: 1, y: 1 }
                    ];
                });
                spyOn(sprite2, "getPath").andCallFake(function () {
                    this.path = [
                        { x: 1, y: 1 }
                    ];
                });
                layer.run();

                expect(sprite1.getPath).toHaveBeenCalled();
                expect(sprite2.getPath).toHaveBeenCalled();
            });
            it("调用父类同名函数", function () {
            });
        });
    });
});