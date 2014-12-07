describe("Animation.js", function () {
    var animation = null;
    var img = null,
        frames = null,
        data = null;

    beforeEach(function () {
        data = getFrames("player", "walk_down");
    });
    afterEach(function () {
    });

    describe("构造函数", function () {
        it("获得_frames（数组副本）", function () {
            animation = new Animation(data);

            expect(animation._frames).not.toBeSameArray(frames);
        });
        it("获得frameCount", function () {
            animation = new Animation(data);

            expect(animation._frameCount).toEqual(4);
        });
        it("调用setCurrentFrame", function () {
            animation = new Animation(data);

            spyOn(animation, "setCurrentFrame");
            animation.Init(data);  //调用构造函数

            expect(animation.setCurrentFrame).toHaveBeenCalledWith(0);
        });
    });

    describe("setCurrentFrame", function () {
        it("设置 当前帧已播放时间为0,当前帧索引等于参数index，"
            + "当前选中帧数据为this._frames[index]", function () {
        });
    });

    describe("update", function () {
    });

    describe("getCurrentFrame", function () {
    });

    describe("getImg", function () {
    });
});