describe("LayerManager.js", function () {
    var manager = null;

    beforeEach(function () {
        manager = new LayerManager();
    });
    afterEach(function () {
        manager = null;
    });

    describe("addLayer", function () {
        it("调用父类的add", function () {
            var fakeLayer = {};
            spyOn(manager, "add");

            manager.addLayer("layer1", fakeLayer).addLayer("layer2", fakeLayer);

            expect(manager.add.calls.length).toEqual(2);
        });
    });

    describe("getLayer", function () {
        it("调用父类的getValue", function () {
            spyOn(manager, "getValue");

            manager.getLayer("layer");

            expect(manager.getValue).toHaveBeenCalledWith("layer");
        });
    });

    describe("统一调用层的操作", function () {
        var layer1 = null,
            layer2 = null;

        function buildFakeLayer() {
            return {
                addSprites: function () {
                },
                setCanvas: function () {
                },
                init: function () {
                },
                run: function () {
                },
                change: function () {
                }
            }
        };

        beforeEach(function () {
            layer1 = buildFakeLayer();
            layer2 = buildFakeLayer();
            manager.addLayer("layer1", layer1).addLayer("layer2", layer2);
        });

        describe("addSprites", function () {
            it("加入层内元素。参数为：层名称、元素集合", function () {
                var fakeEle1 = [1];

                spyOn(layer1, "addSprites");

                manager.addSprites("layer1", fakeEle1);

                expect(layer1.addSprites).toHaveBeenCalledWith(fakeEle1);
            });
        });

        describe("initLayer", function () {
            it("调用每个layer的setCanvas、init方法（传入layers）", function () {
                var fakeLayer1 = {},
                    fakeLayer2 = {};
                spyOn(layer1, "setCanvas");
                spyOn(layer1, "init");
                spyOn(layer2, "setCanvas");
                spyOn(layer2, "init");

                manager.initLayer();

                expect(layer1.setCanvas).toHaveBeenCalled();
                expect(layer1.init).toHaveBeenCalledWith(manager._childs);
                expect(layer2.setCanvas).toHaveBeenCalled();
                expect(layer2.init).toHaveBeenCalledWith(manager._childs);
            });
        });

        describe("run", function () {
            it("调用每个layer的run方法", function () {
                spyOn(layer1, "run");
                spyOn(layer2, "run");

                manager.run();

                expect(layer1.run).toHaveBeenCalled();
                expect(layer2.run).toHaveBeenCalled();
            });
        });

        describe("change", function () {
            it("调用每个layer的change方法", function () {
                spyOn(layer1, "change");
                spyOn(layer2, "change");

                manager.change();

                expect(layer1.change).toHaveBeenCalled();
                expect(layer2.change).toHaveBeenCalled();
            });
        });
    });


});
