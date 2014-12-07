describe("BombSprite.js", function () {
    var sprite = null;


    beforeEach(function () {
        sprite = spriteFactory.createBomb();

    });
    afterEach(function () {
        sprite = null;
    });

    describe("构造函数", function () {
        beforeEach(function () {
        });

        it("传入玩家人物精灵类", function () {
            var fakePlayerSprite = {};
            sprite = spriteFactory.createBomb(fakePlayerSprite);

            expect(sprite.playerSprite).toEqual(fakePlayerSprite);
        });
        it("调用父类构造函数", function () {
        });
    });


    describe("explode", function () {
        var fakePlayerSprite = null;
        var ob = testTool.extendDeep(window.subject);

        function fakeObserver() {
            window.subject = {
                publishAll: function () {
                }
            };
        };

        beforeEach(function () {
            fakePlayerSprite = {
                bombNum: 0
            };
            sprite = spriteFactory.createBomb(fakePlayerSprite);

            fakeObserver();
        });
        afterEach(function () {
            window.subject = ob;
        });

        it("方法存在", function () {
            expect(sprite.explode).toBeDefined();
        });
        it("playerSprite.bombNum减1", function () {
            var bombNum = fakePlayerSprite.bombNum;

            sprite.explode();

            expect(sprite.playerSprite.bombNum).toEqual(bombNum - 1);
        });
        it("标志已爆炸", function () {
            sprite.exploded = false;

            sprite.explode();

            expect(sprite.exploded).toBeTruthy();
        });

        describe("获得火焰范围，返回顺序为[[up]、[down]、[left]、[right]", function () {
        });

        describe("判断地图、地形", function () {
            var data = testTool.extendDeep(window.mapData),
                config = testTool.extendDeep(window.bomberConfig),
                ground = bomberConfig.map.type.GROUND,
                wall = bomberConfig.map.type.WALL;

            //假的地图方格尺寸
            function fakeWidthAndHeight(width, height) {
                window.bomberConfig.WIDTH = width;
                window.bomberConfig.HEIGHT = height;
            };
            function fakeMapData(data) {
                window.mapData = data;
            };
            function restore() {
                window.mapData = data;
                window.bomberConfig.WIDTH = config.WIDTH;
                window.bomberConfig.HEIGHT = config.HEIGHT;
            };

            beforeEach(function () {
                fakeWidthAndHeight(10, 10);
            });
            afterEach(function () {
                restore();
            });

            describe("修改地形数据：炸弹所在方格为可以通过", function () {

                var terrainData = testTool.extendDeep(window.terrainData);

                function fakeTerrainData() {
                    var pass = bomberConfig.map.terrain.pass,
                        stop = bomberConfig.map.terrain.stop;

                    window.terrainData = [
                        [pass, stop, pass, pass],
                        [pass, stop, pass, pass],
                        [pass, stop, pass, pass],
                        [pass, stop, pass, pass]
                    ];
                };

                function restore() {
                    window.terrainData = terrainData;
                };

                beforeEach(function () {
                    fakeTerrainData();
                    fakeWidthAndHeight(10, 10);
                });
                afterEach(function () {
                    restore();
                });

                it("炸弹所在方格对应的地形数据为可以通过", function () {
                    sprite.x = 10;
                    sprite.y = 10;

                    sprite.explode();

                    expect(window.terrainData[1][1]).toEqual(bomberConfig.map.terrain.pass);
                });
            });

            describe("默认火力范围为2。创建并返回FireSprite，设置其坐标。返回的顺序为center、up1、up2、down1、down2、left1、left2、right1、right2", function () {
                describe("如果炸弹四周不是边界且为空地", function () {

                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 20;
                    });


                    it("返回9个FireSprite，已设置其坐标", function () {
                        var fire = sprite.explode().fires;

                        expect(fire.length).toEqual(9);
                        expect([fire[0].x, fire[0].y]).toEqual([20, 20]);   //center
                        expect([fire[1].x, fire[1].y]).toEqual([20, 10]);   //up1
                        expect([fire[2].x, fire[2].y]).toEqual([20, 0]);   //up2
                        expect([fire[3].x, fire[3].y]).toEqual([20, 30]);    //down1
                        expect([fire[4].x, fire[4].y]).toEqual([20, 40]);    //down2
                        expect([fire[5].x, fire[5].y]).toEqual([10, 20]);    //left1
                        expect([fire[6].x, fire[6].y]).toEqual([0, 20]);    //left2
                        expect([fire[7].x, fire[7].y]).toEqual([30, 20]);    //right1
                        expect([fire[8].x, fire[8].y]).toEqual([40, 20]);    //right2
                    });
                });

                describe("如果炸弹上方第一格为边界", function () {

                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 0;
                    });


                    it("返回7个FireSprite，已设置其坐标", function () {
                        var fire = sprite.explode().fires;

                        expect(fire.length).toEqual(7);
                        expect([fire[0].x, fire[0].y]).toEqual([20, 0]);   //center
                        expect([fire[1].x, fire[1].y]).toEqual([20, 10]);    //down1
                        expect([fire[2].x, fire[2].y]).toEqual([20, 20]);    //down2
                        expect([fire[3].x, fire[3].y]).toEqual([10, 0]);    //left1
                        expect([fire[4].x, fire[4].y]).toEqual([0, 0]);    //left2
                        expect([fire[5].x, fire[5].y]).toEqual([30, 0]);    //right1
                        expect([fire[6].x, fire[6].y]).toEqual([40, 0]);    //right2
                    });
                });

                describe("如果炸弹上方第一格为墙", function () {

                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, ground, ground, ground],
                            [ground, ground, wall, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 20;
                    });


                    it("返回7个FireSprite（上方第一格为墙后，就不再判断上方第二格了），已设置其坐标", function () {
                        var fire = sprite.explode().fires;

                        expect(fire.length).toEqual(7);
                        expect([fire[0].x, fire[0].y]).toEqual([20, 20]);   //center
                        expect([fire[1].x, fire[1].y]).toEqual([20, 30]);    //down1
                        expect([fire[2].x, fire[2].y]).toEqual([20, 40]);    //down2
                        expect([fire[3].x, fire[3].y]).toEqual([10, 20]);    //left1
                        expect([fire[4].x, fire[4].y]).toEqual([0, 20]);    //left2
                        expect([fire[5].x, fire[5].y]).toEqual([30, 20]);    //right1
                        expect([fire[6].x, fire[6].y]).toEqual([40, 20]);    //right2

                    });
                });

                describe("如果炸弹上方第二格为墙", function () {

                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, wall, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 20;
                    });


                    it("返回8个FireSprite，已设置其坐标", function () {
                        var fire = sprite.explode().fires;

                        expect(fire.length).toEqual(8);
                        expect([fire[0].x, fire[0].y]).toEqual([20, 20]);   //center
                        expect([fire[1].x, fire[1].y]).toEqual([20, 10]);    //up1
                        expect([fire[2].x, fire[2].y]).toEqual([20, 30]);    //down1
                        expect([fire[3].x, fire[3].y]).toEqual([20, 40]);    //down2
                        expect([fire[4].x, fire[4].y]).toEqual([10, 20]);    //left1
                        expect([fire[5].x, fire[5].y]).toEqual([0, 20]);    //left2
                        expect([fire[6].x, fire[6].y]).toEqual([30, 20]);    //right1
                        expect([fire[7].x, fire[7].y]).toEqual([40, 20]);    //right2

                    });
                });
            });

            describe("默认火力范围为2。判断火焰范围内是否有墙。如果有，则炸掉墙（修改地图为空地、地形数据为通过）", function () {
                var terrainData = testTool.extendDeep(window.terrainData),
                    pass = bomberConfig.map.terrain.pass,
                    stop = bomberConfig.map.terrain.stop;


                beforeEach(function () {
                });
                afterEach(function () {
                    window.terrainData = terrainData;
                });

                describe("如果炸弹四周为空地", function () {
                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 20;
                    });


                    it("地图、地形数据不变，返回“mapChange:false”", function () {
                        spyOn(window.mapDataOperate, "setMapData");
                        spyOn(window.terrainDataOperate, "setTerrainData");

                        var result = sprite.explode();

                        expect(window.mapDataOperate.setMapData).not.toHaveBeenCalled();
                        //在__changeTerrainData中第一次调用
                        expect(window.terrainDataOperate.setTerrainData.calls.length).toEqual(1)

                        expect(result.mapChange).toBeFalsy();
                    });
                });

                describe("如果炸弹上方第一格、第二格为墙", function () {
                    beforeEach(function () {
                        fakeMapData([
                            [ground, ground, wall, ground, ground],
                            [ground, ground, wall, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground],
                            [ground, ground, ground, ground, ground]
                        ]);

                        sprite.x = 20;
                        sprite.y = 20;
                    });
                    afterEach(function () {
                    });

                    it("上方第二格不变，改变上方第一格地图为ground、地形为通过，修改mapLayer中对应的精灵的img对象（观察者模式 -> 发布），返回“mapChange:true”", function () {
                        spyOn(window.mapDataOperate, "setMapData");
                        spyOn(window.terrainDataOperate, "setTerrainData");
                        spyOn(window.subject, "publishAll");

                        var result = sprite.explode();

                        expect(window.mapDataOperate.setMapData.calls.length).toEqual(1);
                        expect(window.mapDataOperate.setMapData).toHaveBeenCalledWith(2, 1, ground);
                        //在__changeTerrainData中调用了一次
                        expect(window.terrainDataOperate.setTerrainData.calls.length).toEqual(2);
                        expect(window.terrainDataOperate.setTerrainData.calls[1].args).toEqual([2, 1, pass]);
                        expect(window.subject.publishAll).toHaveBeenCalledWith(null, 2, 1, window.imgLoader.get("ground"));
                        expect(result.mapChange).toBeTruthy();
                    });
                });
            });
        });

    });

    describe("collideFireWithCharacter", function () {
        var config = testTool.extendDeep(window.bomberConfig),
            data = testTool.extendDeep(window.mapData),
            ground = bomberConfig.map.type.GROUND,
            wall = bomberConfig.map.type.WALL;

        //假的地图方格尺寸
        function fakeWidthAndHeight(width, height) {
            window.bomberConfig.WIDTH = width;
            window.bomberConfig.HEIGHT = height;
        };
        function fakeMapData(data) {
            window.mapData = data;
        };
        function restore() {
            window.mapData = data;
            window.bomberConfig.WIDTH = config.WIDTH;
            window.bomberConfig.HEIGHT = config.HEIGHT;
        };

        beforeEach(function () {
            fakeWidthAndHeight(10, 10);
        });
        afterEach(function () {
            restore();
        });

        it("如果人物精灵处于有效火力范围内（默认火力范围为2。），则返回true", function () {
            var fakeSprite = null;
            fakeMapData([
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground]
            ]);
            sprite.x = 20;
            sprite.y = 20;
            sprite.bitmap = {
                width: 10,
                height: 10
            };
            fakeSprite = {
                x: 20,
                y: 12,
                bitmap: {
                    width: 10,
                    height: 10
                }
            };

            var result = sprite.collideFireWithCharacter(fakeSprite);

            expect(result).toBeTruthy();
        });
        it("否则，则返回false", function () {
            var fakeSprite = null;
            fakeMapData([
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, wall, ground],
                [ground, ground, ground, ground, ground],
                [ground, ground, ground, ground, ground]
            ]);
            sprite.x = 20;
            sprite.y = 20;
            sprite.bitmap = {
                width: 10,
                height: 10
            };
            fakeSprite = {
                x: 40,
                y: 20,
                bitmap: {
                    width: 10,
                    height: 10
                }
            };

            var result = sprite.collideFireWithCharacter(fakeSprite);

            expect(result).toBeFalsy();
        });
    });

    describe("getFireEffectiveRange", function () {
        var data = testTool.extendDeep(window.mapData),
            config = testTool.extendDeep(window.bomberConfig),
            ground = bomberConfig.map.type.GROUND,
            wall = bomberConfig.map.type.WALL;

        //假的地图方格尺寸
        function fakeWidthAndHeight(width, height) {
            window.bomberConfig.WIDTH = width;
            window.bomberConfig.HEIGHT = height;
        };
        function fakeMapData(data) {
            window.mapData = data;
        };
        function restore() {
            window.mapData = data;
            window.bomberConfig.WIDTH = config.WIDTH;
            window.bomberConfig.HEIGHT = config.HEIGHT;
        };

        beforeEach(function () {
            fakeWidthAndHeight(10, 10);
        });
        afterEach(function () {
            restore();
        });

        describe("如果炸弹下面第一格为墙，上面第二格为边界", function () {
            beforeEach(function () {
                fakeMapData([
                    [ground, ground, ground, ground, ground],
                    [ground, ground, ground, ground, ground],
                    [ground, ground, wall, ground, ground],
                    [ground, ground, ground, ground, ground],
                    [ground, ground, ground, ground, ground]
                ]);

                sprite.x = 20;
                sprite.y = 10;
            });

            it("有效范围计算规则：炸弹所在方格为有效范围（center）；"
                + "火焰范围有上下左右方向，对每个方向进行循环判断。"
                + "如判断up方向时，如果方格为墙，则该方格为有效范围，up方向后面的方格都不是有效范围；"
                + "如果该方格为边界，则该方格及up方向以后的方格都不是有效范围。", function () {
                var expected = {center: {x: 20, y: 10}, groundRange: [
                    {x: 20, y: 0},
                    {x: 10, y: 10},
                    {x: 0, y: 10},
                    {x: 30, y: 10},
                    {x: 40, y: 10}
                ], wallRange: [
                    {x: 20, y: 20}
                ]};
                expect(sprite.getFireEffectiveRange()).toEqual(expected);
            });
        });
    });

    describe("isInEffectiveRange炸弹爆炸时会引爆在火力范围内的炸弹", function () {
        it("如果炸弹位于参数传入的炸弹的有效范围内，则返回true；否则返回false", function () {
            var fakeBomb = {
                getFireEffectiveRange: function () {
                    return { center: { x: 20, y: 10 }, groundRange: [
                        { x: 20, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                        { x: 30, y: 10 },
                        { x: 40, y: 10 }
                    ], wallRange: [
                        { x: 20, y: 20 }
                    ] };
                }
            };
            sprite.x = 10;
            sprite.y = 10;

            expect(sprite.isInEffectiveRange(fakeBomb)).toBeTruthy();

            sprite.x = 40;
            sprite.y = 40;

            expect(sprite.isInEffectiveRange(fakeBomb)).toBeFalsy();
        });
    });
});