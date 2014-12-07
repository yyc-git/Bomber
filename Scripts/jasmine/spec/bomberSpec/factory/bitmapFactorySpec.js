describe("bitmapFactory.js", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });

    describe("createBitmap", function () {
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

        it("方法存在", function () {
            expect(bitmapFactory.createBitmap).toBeDefined();
        });

        it("如果参数的width/height没有指定，则为data.img.width/height", function () {
            var bitmap = null,
                width = 0,
                height = 0;

            bitmap = bitmapFactory.createBitmap({ img: $("#test_img")[0] });

            expect(bitmap.width).toEqual($("#test_img")[0].width);
            expect(bitmap.height).toEqual($("#test_img")[0].height);
        });
    });
});