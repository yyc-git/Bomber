describe("Layer.js", function () {
    var layer = null;

    //因为Layer为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance() {
        var T = YYC.Class(Layer, {
            Init: function () {
            },
            Public: {
                change: function () {
                },
                setCanvas: function () {
                },
                draw: function () {
                },
                run: function () {
                }
            }
        });

        return new T();
    };

    beforeEach(function () {
        layer = getInstance();
    });

    describe("Init", function () {
    });

    describe("addSprites", function () {
        it("调用父类appendChilds", function () {
            spyOn(layer, "appendChilds");
            var fakeElements = [];

            layer.addSprites(fakeElements);

            expect(layer.appendChilds).toHaveBeenCalledWith(fakeElements);
        });
    });

    describe("init", function () {
        function getFakeCanvas(layer) {
            layer.P__canvas = {
                getContext: function () {
                    return {};
                }
            }
        };

        it("获得context", function () {
            getFakeCanvas(layer);

            layer.init();

            expect(layer.P__context).toBeExist();
        });
    });

    describe("clear", function () {
        var sprite1 = null,
            sprite2 = null;

        beforeEach(function () {
            sprite1 = {
                clear: function () {
                }
            };
            sprite2 = {
                clear: function () {
                }
            };
            layer.appendChild(sprite1);
            layer.appendChild(sprite2);
        });

        describe("函数重载：参数为0个", function () {
            it("调用每个精灵类的clear，传入参数context", function () {
                spyOn(sprite1, "clear");
                spyOn(sprite2, "clear");
                layer.clear();

                expect(sprite1.clear).toHaveBeenCalledWith(layer.P__context);
                expect(sprite2.clear).toHaveBeenCalledWith(layer.P__context);
            });
        });

        describe("函数重载：参数为1个", function () {
            it("调用精灵类的clear，传入参数P__context", function () {
                spyOn(sprite1, "clear");
                layer.clear(sprite1);

                expect(sprite1.clear).toHaveBeenCalledWith(layer.P__context);
            });
        });
    });
});