describe("game.js", function () {
    var game = null;

    beforeEach(function () {
        game = new Game();
    });

    describe("构造函数", function () {
        it("创建全局观察者实例", function () {
            window.subject = null;

            game = new Game();

            expect(window.subject).toBeExist();
        });
    });

    describe("init", function () {
        describe("创建层管理类", function () {
            it("装入层", function () {
                game.init();

                expect(game.layerManager.getLayer("mapLayer")).toBeInstanceOf(MapLayer);
                expect(game.layerManager.getLayer("playerLayer")).toBeInstanceOf(PlayerLayer);
                expect(game.layerManager.getLayer("enemyLayer")).toBeInstanceOf(EnemyLayer);
                expect(game.layerManager.getLayer("bombLayer")).toBeInstanceOf(BombLayer);
                expect(game.layerManager.getLayer("fireLayer")).toBeInstanceOf(FireLayer);
            });
            it("layerFactory.createPlayer、layerFactory.createEnemy传入参数sleep", function () {
                game.sleep = 10;
                spyOn(window.layerFactory, "createPlayer").andCallThrough();
                spyOn(window.layerFactory, "createEnemy").andCallThrough();

                game.init();

                expect(layerFactory.createPlayer).toHaveBeenCalledWith(game.sleep);
                expect(layerFactory.createEnemy).toHaveBeenCalledWith(game.sleep);
            });
        });


        it("创建层的元素（精灵）， 并加入到层中", function () {
            game.init();

            expect(game.layerManager.getLayer("mapLayer").getChilds().length).toEqual(400);
            expect(game.layerManager.getLayer("playerLayer").getChilds().length).toEqual(1);
            expect(game.layerManager.getLayer("playerLayer").getChilds()[0]).toBeInstanceOf(PlayerSprite);
            expect(game.layerManager.getLayer("enemyLayer").getChilds().length).toEqual(2);
            expect(game.layerManager.getLayer("enemyLayer").getChilds()[0]).toBeInstanceOf(EnemySprite);
        });

        describe("初始化层", function () {
            beforeEach(function () {
                game._createLayerManager();
            });

            it("调用layermanager.initLayer", function () {
                spyOn(game.layerManager, "initLayer");

                game._initLayer();

                expect(game.layerManager.initLayer).toHaveBeenCalled();
            });
        });

        describe("绑定事件", function () {
            it("绑定键盘事件", function () {
                spyOn(keyEventManager, "addKeyDown");
                spyOn(keyEventManager, "addKeyUp");

                game.init();

                expect(keyEventManager.addKeyDown).toHaveBeenCalled();
                expect(keyEventManager.addKeyUp).toHaveBeenCalled();
            });
        });

        describe("订阅", function () {
            it("订阅mapLayer的changeSpriteImg", function () {
                spyOn(window.subject, "subscribe");

                game.init();

                expect(window.subject.subscribe).toHaveBeenCalledWith(game.layerManager.getLayer("mapLayer"), game.layerManager.getLayer("mapLayer").changeSpriteImg);
            });
        });

    });

    describe("start", function () {
        it("每Math.floor(1000 / bomberConfig.FPS)间隔循环调用run", function () {
            spyOn(game, "run");
            jasmine.Clock.useMock();

            game.init();
            game.start();

            jasmine.Clock.tick(Math.floor(1000 / bomberConfig.FPS) * 2);

            expect(game.run.calls.length).toEqual(2);
        });
        it("获得mainLoop", function () {
            spyOn(window, "setInterval").andCallFake(function () {
                return function () {
                };
            });
            game.mainLoop = null;

            game.start();

            expect(game.mainLoop).toBeExist();
        });
    });

    describe("run", function () {
        var backUp = null;

        beforeEach(function () {
            backUp = testTool.extendDeep(window.gameState);
            window.gameState = window.bomberConfig.game.state.NORMAL;
            game.init();
        });
        afterEach(function () {
            window.gameState = backUp;
        });

        it("如果状态为OVER，则结束游戏并返回", function () {
            window.gameState = window.bomberConfig.game.state.OVER;
            spyOn(game, "gameOver");
            spyOn(game.layerManager, "run");

            game.run();

            expect(game.gameOver).toHaveBeenCalled();
            expect(game.layerManager.run).not.toHaveBeenCalled();
        });
        it("调用layerManager的run方法", function () {
            spyOn(game.layerManager, "run");

            game.run();

            expect(game.layerManager.run).toHaveBeenCalled();
        });
        it("调用layerManager的change方法", function () {
            spyOn(game.layerManager, "change");

            game.run();

            expect(game.layerManager.change).toHaveBeenCalled();
        });
    });

    describe("结束游戏", function () {
        function judge(func) {
            spyOn(YYC.Tool.asyn, "clearAllTimer");
            spyOn(window, "alert");

            func.call(game, null);

            expect(window.alert).toHaveBeenCalled();
            expect(YYC.Tool.asyn.clearAllTimer).toHaveBeenCalledWith(game.mainLoop);
        };

        describe("gameOver", function () {
            it("停止主循环，清空所有定时器，并调用alert", function () {
                judge(game.gameOver);
            });
        });

        describe("gameWin", function () {
            it("停止主循环，清空所有定时器，并调用alert", function () {
                judge(game.gameWin);
            });
        });
    });
});
