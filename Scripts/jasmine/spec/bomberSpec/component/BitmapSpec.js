describe("Bitmap.js", function () {
    var bitmap = null;

    beforeEach(function () {
    });
    afterEach(function () {
    });

    describe("构造函数Init", function () {
        var dom = null;

        function insertDom() {
            dom = $("<img id='test_img'>");
            $("body").append(dom);
        };
        function removeDom() {
            dom.remove();
        };

        beforeEach(function () {
            insertDom();
        });
        afterEach(function () {
            removeDom();
        });

        it("获得预加载后的图片对象、宽度、高度", function () {
            bitmap = new Bitmap({
                    img: $("#test_img")[0],
                    width: 2,
                    height: 3
                }
            );

            expect(bitmap.img).not.toBeNull();
            expect(bitmap.width).toEqual(2);
            expect(bitmap.height).toEqual(3);
        });
    });
});

