describe("MapElementSprite.js", function () {
    var sprite = null,
        data = null,
        fakeBitmap = null;


    beforeEach(function () {
        data = {
            x: 1,
            y: 2
        };
        fakeBitmap = {
            img: {},
            width: 10,
            height: 11
        };
        sprite = spriteFactory.createMapElement(data, fakeBitmap);

    });
    afterEach(function () {
        sprite = null;
    });

    describe("构造函数", function () {
        beforeEach(function () {
        });

        it("调用父类构造函数", function () {
        });
    });
});