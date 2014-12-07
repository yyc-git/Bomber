describe("Sprite.js", function () {
    var sprite = null;
    var data = null;

    //因为Sprite为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance(data, bitmap) {
        var T = YYC.Class(Sprite, {
            Init: function (data, bitmap) {
                this.base(data, bitmap);
            },
            Public: {
            }
        });

        return new T(data, bitmap);
    };

    beforeEach(function () {
        data = {
            //初始坐标
            x: 0,
            y: 0,

            defaultAnimId: "stand_right",

            anims: {
                "stand_right": new Animation(getFrames("player", "stand_right")),
                "stand_left": new Animation(getFrames("player", "stand_left")),
                "stand_down": new Animation(getFrames("player", "stand_down")),
                "stand_up": new Animation(getFrames("player", "stand_up")),
                "walk_up": new Animation(getFrames("player", "walk_up")),
                "walk_down": new Animation(getFrames("player", "walk_down")),
                "walk_right": new Animation(getFrames("player", "walk_right")),
                "walk_left": new Animation(getFrames("player", "walk_left"))
            }
        };

        sprite = getInstance(data);
    });

    //抽象类中的构造函数供子类构造函数中调用
    describe("构造函数", function () {
        beforeEach(function () {
        });

        it("获得bitmap", function () {
            var sprite = getInstance(data, {});

            expect(sprite.bitmap).toEqual({});
        });
        it("如果data不存在，则返回", function () {
            sprite = getInstance();

            expect(sprite.defaultAnimId).toBeNull();
        });
        it("如果data存在，获得x、ydefaultAnimID", function () {
            var expected = {
                x: sprite.x,
                y: sprite.y,

                defaultAnimId: sprite.defaultAnimId,

                anims: sprite.anims
            };
            expect(expected).toEqual(data);
        });
    });

    describe("setAnim", function () {
        it("获得当前动画currentAnim", function () {
            sprite.setAnim("walk_right");

            expect(sprite.currentAnim).toEqual(new Animation(getFrames("player", "walk_right")));
        });
    });

    describe("resetCurrentFrame", function () {
        function fakeAnim() {
            return {
                setCurrentFrame: function () {
                }
            }
        };

        beforeEach(function () {
            sprite.currentAnim = fakeAnim();
        })

        it("调用_resetCurrentFrame", function () {
            spyOn(sprite.currentAnim, "setCurrentFrame");

            sprite.resetCurrentFrame(0);

            expect(sprite.currentAnim.setCurrentFrame).toHaveBeenCalledWith(0);
        });
    });

    describe("getCollideRect", function () {
        describe("如果currentAnim存在", function () {
            function fakeBitmap() {
                return {
                    width: 1,
                    height: 2
                };
            };

            beforeEach(function () {
                //sprite.currentAnim = fakeAnim();
                sprite.x = 10;
                sprite.y = 11;
                sprite.bitmap = fakeBitmap();
            })

            it("取得精灵的碰撞区域", function () {
                var result = sprite.getCollideRect();

                expect([result.x1, result.y1, result.x2, result.y2]).toEqual([10, 11, 11, 13]);
            });
        });
    });

    describe("init", function () {
        it("调用setAnim", function () {
            spyOn(sprite, "setAnim");

            sprite.init();

            expect(sprite.setAnim).toHaveBeenCalledWith(data.defaultAnimId);
        });
    });

    describe("update", function () {
        beforeEach(function () {
            sprite.init();
        });

        it("如果currentAnim为null，则调用currentAnim.update", function () {
            spyOn(sprite.currentAnim, "update");

            sprite.update(1);

            expect(sprite.currentAnim.update).toHaveBeenCalledWith(1);
        });
        it("如果currentAnim为null，则不执行", function () {
            spyOn(sprite.currentAnim, "update");

            sprite.currentAnim = null;
            sprite.update(1);

            sprite.currentAnim && expect(sprite.currentAnim.update).not.toHaveBeenCalled();
        });
    });

    describe("getCellPosition", function () {
        var bomberConfig = testTool.extendDeep(window.bomberConfig);

        //假的地图方格尺寸
        function fakeWidthAndHeight(width, height) {
            window.bomberConfig.WIDTH = width;
            window.bomberConfig.HEIGHT = height;
        };
        function restore() {
            window.bomberConfig.WIDTH = bomberConfig.WIDTH;
            window.bomberConfig.HEIGHT = bomberConfig.HEIGHT;
        };

        beforeEach(function () {
            fakeWidthAndHeight(10, 20);
        });
        afterEach(function () {
            restore();
        });

        it("获得坐标对应的方格坐标（向下取值）。", function () {
            var x = 10,
                y = 18;

            var result = sprite.getCellPosition(x, y);

            expect(result).toEqual({ x: 1, y: 0 });
        });
    });

    describe("draw", function () {
        var context = null;

        function fakeContext() {
            return {
                drawImage: function () {
                }
            }
        };

        beforeEach(function () {
            context = fakeContext();
            //sprite.init();
        });

        it("调用drawImage，参数为bitmap.img,x,y,bitmap.width,bitmap.height", function () {
            spyOn(context, "drawImage");
            fakeBitmap = {
                img: {},
                width: 1,
                height: 1
            };
            sprite.bitmap = fakeBitmap;

            sprite.draw(context);

            expect(context.drawImage).toHaveBeenCalledWith(fakeBitmap.img, sprite.x, sprite.y, fakeBitmap.width, fakeBitmap.height);
        });
    });

    describe("clear", function () {
        var context = null;

        function fakeContext() {
            return {
                clearRect: function () {
                }
            }
        };

        beforeEach(function () {
            context = fakeContext();
        });

        it("清空画布", function () {
            spyOn(context, "clearRect");

            sprite.clear(context);

            expect(context.clearRect).toHaveBeenCalledWith(0, 0, bomberConfig.canvas.WIDTH, bomberConfig.canvas.HEIGHT);
        });
    });
});