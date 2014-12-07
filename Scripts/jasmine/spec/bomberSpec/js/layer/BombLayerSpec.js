describe("BombLayer.js", function () {
    var layer = null;

    beforeEach(function () {
        layer = new BombLayer();

        layer.setCanvas();
    });

    describe("setCanvas", function () {
        it("方法存在", function () {
            expect(layer.setCanvas).toBeDefined();
        });
        it("获得bombLayerCanvas", function () {
            spyOn(document, "getElementById");

            layer.setCanvas();

            expect(document.getElementById).toHaveBeenCalledWith("bombLayerCanvas");
        });
        it("设置Canvas的css", function () {
            layer.setCanvas();

            var canvas = $(layer.P__canvas);
            var expectedCss = {
                "position": "absolute",
                "top": bomberConfig.canvas.TOP.toString(),
                "left": bomberConfig.canvas.LEFT.toString(),
                "z-index": 1
            };

            expect(canvas.css("top")).toEqual(expectedCss.top);
            expect(canvas.css("left")).toEqual(expectedCss.left);
            expect(Number(canvas.css("z-index"))).toEqual(expectedCss["z-index"]);
        });
    });

    describe("init", function () {
        it("获得mapLayer、fireLayer、playerLayer、enemyLayer", function () {
            var fakeLayers = {
                playerLayer: {
                },
                mapLayer: {},
                fireLayer: {},
                enemyLayer: {}
            };
            layer.init(fakeLayers);

            expect(layer.mapLayer).toBeExist();
            expect(layer.fireLayer).toBeExist();
            expect(layer.playerLayer).toBeExist();
            expect(layer.enemyLayer).toBeExist();
        });
        it("调用父类同名函数", function () {
        });
    });

    describe("change", function () {
        it("如果层内有元素，则调用setStateChange", function () {
            var fakeBomb = {};
            layer.appendChild(fakeBomb);
            spyOn(layer, "setStateChange");

            layer.change();

            expect(layer.setStateChange).toHaveBeenCalled();
        });
    });

    describe("层初始化后调用的API测试", function () {
        beforeEach(function () {
            var fakeLayers = {
                playerLayer: {
                },
                mapLayer: {},
                fireLayer: {},
                enemyLayer: {}
            };
            layer.init(fakeLayers);
        });

        describe("draw", function () {
            beforeEach(function () {
                sprite1 = spriteFactory.createBomb();
                sprite2 = spriteFactory.createBomb();

                layer.appendChild(sprite1).appendChild(sprite2);
            });

            it("调用每个精灵类的draw，传入参数context", function () {
                spyOn(sprite1, "draw");
                spyOn(sprite2, "draw");
                layer.draw();

                expect(sprite1.draw).toHaveBeenCalledWith(layer.P__context);
                expect(sprite2.draw).toHaveBeenCalledWith(layer.P__context);
            });
        });

        describe("explode", function () {
            var fakeBomb = null,
                fakeEnemy1 = null,
                fakeEnemy2 = null,
                fakeFireLayer = null,
                fakeLayers = null,
                fakeMapLayer = null,
                fakeEnemyLayer = null;

            function buildFakeLayer() {
                fakeEnemy1 = { clear: function () {
                }, index: 1 };
                fakeEnemy2 = { clear: function () {
                }, index: 2 };
                fakeFireLayer = {
                    _childs: [],
                    addSprites: function () {
                        this._childs.push(1);
                    },
                    getChilds: function () {
                        return this._childs;
                    },
                    removeAll: function () {
                        this._childs = [];
                    },
                    clear: function () {
                    }
                };
                fakeMapLayer = {
                    setStateChange: function () {
                    }
                };
                fakePlayerLayer = {
                    getChildAt: function () {
                    }
                };
                fakeEnemyLayer = {
                    remove: function () {
                    },
                    clear: function () {
                    },
                    getChilds: function () {
                        return [fakeEnemy1, fakeEnemy2];
                    }
                };
                fakeLayers = {
                    playerLayer: fakePlayerLayer,
                    mapLayer: fakeMapLayer,
                    fireLayer: fakeFireLayer,
                    enemyLayer: fakeEnemyLayer
                };
            };

            beforeEach(function () {
                fakeBomb = {
                    x: 0,
                    y: 0,
                    explode: function () {
                        return {
                            fires: [],
                            mapChange: false
                        }
                    },
                    collideFireWithCharacter: function () {
                    },
                    clear: function () {
                    },
                    isInEffectiveRange: function () {
                    }
                };
                buildFakeLayer();
                layer.setCanvas();
                layer.init(fakeLayers);
            });

            it("如果火焰与玩家人物碰撞，则置游戏状态为OVER", function () {
                var backUp = testTool.extendDeep(window.gameState);

                window.gameState = window.bomberConfig.game.state.NORMAL;
                spyOn(fakeBomb, "collideFireWithCharacter").andCallFake(function () {
                    return true
                });

                layer.explode(fakeBomb);

                expect(window.gameState).toEqual(window.bomberConfig.game.state.OVER);

                window.gameState = backUp;
            });

            describe("与每个敌人判断。如果火焰与敌人碰撞，则该敌人被炸死（从层内移除）", function () {
                beforeEach(function () {
                    spyOn(layer.enemyLayer, "remove");
                    spyOn(layer.enemyLayer, "clear");
                });

                it("碰撞到第二个敌人", function () {
                    spyOn(fakeBomb, "collideFireWithCharacter").andCallFake(function (sprite) {
                        if (sprite === fakeEnemy2) {
                            return true;
                        }
                        return false;
                    });

                    layer.explode(fakeBomb);

                    //调用了3次（1次：判断与玩家人物碰撞；2次：判断与每个敌人碰撞）
                    expect(fakeBomb.collideFireWithCharacter.calls.length).toEqual(3);
                    expect(layer.enemyLayer.remove.calls.length).toEqual(1);
                    expect(layer.enemyLayer.clear).toHaveBeenCalledWith(fakeEnemy2);
                });
                it("碰撞到第一个和第二个敌人", function () {
                    spyOn(fakeBomb, "collideFireWithCharacter").andCallFake(function (sprite) {
                        if (sprite === fakeEnemy1 || sprite === fakeEnemy2) {
                            return true;
                        }
                        return false;
                    });

                    layer.explode(fakeBomb);

                    //调用了3次（1次：判断与玩家人物碰撞；2次：判断与每个敌人碰撞）
                    expect(fakeBomb.collideFireWithCharacter.calls.length).toEqual(3);
                    expect(layer.enemyLayer.remove.calls.length).toEqual(2);
                    expect(layer.enemyLayer.clear).toHaveBeenCalledWith(fakeEnemy1);
                    expect(layer.enemyLayer.clear).toHaveBeenCalledWith(fakeEnemy2);
                });
            });

            it("调用bomb.explode", function () {
                spyOn(fakeBomb, "explode").andCallThrough();

                layer.explode(fakeBomb);

                expect(fakeBomb.explode).toHaveBeenCalled();
            });
            it("将bomb.explode返回的fireSprite数组加入到fireLayer中", function () {
                spyOn(fakeFireLayer, "addSprites");

                layer.explode(fakeBomb);

                expect(fakeFireLayer.addSprites).toHaveBeenCalledWith(fakeBomb.explode().fires);
            });
            it("如果炸掉了墙，则要更改mapLayer状态为CHANGE，使mapLayer在下次轮询时重绘地图", function () {
                fakeBomb.explode = function () {
                    return {
                        fires: [],
                        mapChange: true
                    };
                };
                spyOn(layer.mapLayer, "setStateChange");

                layer.explode(fakeBomb);

                expect(layer.mapLayer.setStateChange).toHaveBeenCalled();
            });
            it("画布上清除炸弹", function () {
                spyOn(layer, "clear");

                layer.explode(fakeBomb);

                expect(layer.clear).toHaveBeenCalledWith(fakeBomb);
            });
            it("层移除bomb", function () {
                layer.appendChild(fakeBomb);

                layer.explode(fakeBomb);

                expect(layer.getChilds().length).toEqual(0);
            });
            it("炸弹爆炸时会引爆在火力范围内的所有炸弹。", function () {
                var fakeBomb2 = {
                        x: 1,
                        y: 1,
                        isInEffectiveRange: function () {
                            return true;
                        },
                        explode: function () {
                            return {
                                fires: [],
                                mapChange: false
                            }
                        },
                        collideFireWithCharacter: function () {
                        },
                        clear: function () {
                        }
                    },
                    fakeBomb3 = {
                        x: 2,
                        y: 2,
                        isInEffectiveRange: function () {
                            return true;
                        },
                        explode: function () {
                            return {
                                fires: [],
                                mapChange: false
                            }
                        },
                        collideFireWithCharacter: function () {
                        },
                        clear: function () {
                        }
                    };
                fakeBomb.x = 0;
                fakeBomb.y = 0;
                layer.appendChild(fakeBomb);
                layer.appendChild(fakeBomb2);
                layer.appendChild(fakeBomb3);
                spyOn(layer, "explode").andCallThrough();

                layer.explode(fakeBomb);

                expect(layer.explode.calls.length).toEqual(3);
            });
            it("0.3s后，清空fireLayer层画布，清空fireLayer（火焰消失）", function () {
                jasmine.Clock.useMock();
                spyOn(fakeFireLayer, "clear");
                layer.explode(fakeBomb);
                jasmine.Clock.tick(299);
                expect(layer.fireLayer.getChilds().length).not.toEqual(0);

                jasmine.Clock.tick(1);
                expect(fakeFireLayer.clear).toHaveBeenCalled();
                expect(layer.fireLayer.getChilds().length).toEqual(0);
            });
        });

        describe("run", function () {
            function setStateNormal() {
                layer.setStateNormal();
            };
            function setStateChange() {
                layer.setStateChange();
            };

            it("如果P__state为normal，则返回", function () {
                setStateNormal();
                spyOn(layer, "clear");

                layer.run();

                expect(layer.clear).not.toHaveBeenCalled();
            });

            describe("如果P__state为change", function () {
                beforeEach(function () {
                    setStateChange();
                });

                it("调用clear", function () {
                    spyOn(layer, "clear");

                    layer.run();

                    expect(layer.clear).toHaveBeenCalled();
                });
                it("调用draw", function () {
                    spyOn(layer, "draw");

                    layer.run();

                    expect(layer.draw).toHaveBeenCalled();
                });
                it("恢复状态state为normal", function () {
                    layer.setStateChange();

                    layer.run();

                    expect(layer.P__isNormal()).toBeTruthy();
                });
            });
        });
    });
});