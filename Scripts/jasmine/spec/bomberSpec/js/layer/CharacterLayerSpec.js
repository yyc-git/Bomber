describe("CharacterLayer.js", function () {
    var layer = null;

    //因为MoveSprite为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance(data) {
        var T = YYC.Class(CharacterLayer, {
            Init: function (data) {
                this.base(data);
            },
            Public: {
                setCanvas: function () {
                    this.P__canvas = document.getElementById("playerLayerCanvas");
                }
            }
        });

        return new T(data);
    };

    beforeEach(function () {
        layer = getInstance(100);
    });

    describe("Init", function () {
        it("获得deltaTime", function () {
            layer.Init(1);

            expect(layer.___deltaTime).toEqual(1);
        });
    });

    describe("change", function () {
        it("调用setStateChange", function () {
            spyOn(layer, "setStateChange");

            layer.change();

            expect(layer.setStateChange).toHaveBeenCalled();
        });
    });

    describe("层初始化后调用的API测试", function () {
        var sprite1 = null,
            sprite2 = null;

        beforeEach(function () {
            layer.setCanvas();
            layer.init();

            sprite1 = spriteFactory.createPlayer(),
                sprite2 = spriteFactory.createPlayer();

            sprite1.init();
            sprite2.init();
            layer.appendChild(sprite1);
            layer.appendChild(sprite2);
        });

        describe("draw", function () {
            it("调用每个精灵类的draw", function () {
                spyOn(sprite1, "draw");
                spyOn(sprite2, "draw");
                layer.draw();

                expect(sprite1.draw).toHaveBeenCalledWith(layer.P__context);
                expect(sprite2.draw).toHaveBeenCalledWith(layer.P__context);
            });
        });


        describe("run", function () {
            function setStateNormal() {
                layer.setStateNormal();
            };
            function setStateChange() {
                layer.setStateChange();
            };

            beforeEach(function () {
                setStateNormal();
            });

            it("调用每个精灵类的setDir", function () {
                spyOn(sprite1, "setDir");
                spyOn(sprite2, "setDir");

                layer.run();

                expect(sprite1.setDir).toHaveBeenCalled();
                expect(sprite2.setDir).toHaveBeenCalled();
            });
            it("调用每个精灵类的move", function () {
                spyOn(sprite1, "move");
                spyOn(sprite2, "move");

                layer.run();

                expect(sprite1.move).toHaveBeenCalled();
                expect(sprite2.move).toHaveBeenCalled();
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
                it("调用每个精灵类的update", function () {
                    spyOn(sprite1, "update");
                    spyOn(sprite2, "update");

                    layer.run();

                    expect(sprite1.update).toHaveBeenCalledWith(layer.___deltaTime);
                    expect(sprite2.update).toHaveBeenCalledWith(layer.___deltaTime);
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