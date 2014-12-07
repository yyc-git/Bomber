describe("main.js", function () {
    var temp = {};

    function backUpShowMap() {
        testTool.extend(temp, main);
    };
    function restoreShowMap() {
        testTool.extend(main, temp);
    };

    beforeEach(function () {
        backUpShowMap();
    });
    afterEach(function () {
        restoreShowMap();
    });

    describe("init", function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        describe("init", function () {
            beforeEach(function () {
            });
            afterEach(function () {
            });

            it("预加载图片", function () {
                var urls = [];
                var temp = [];
                var i = 0, len = 0;
                spyOn(window.YYC.Control, "PreLoadImg");    //不能写成spyOn(window, "YYC.Control.PreLoadImg");

                main.init();

                expect(YYC.Control.PreLoadImg).toHaveBeenCalled();
            });
            it("显示进度条", function () {
            });
        });

        describe("onload", function () {
            it("隐藏加载进度条", function () {
            });
            it("调用game.init、game.start", function () {
            });
        });

    });
});
