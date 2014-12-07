describe("MoveSprite.js", function () {
    var sprite = null;
    var data = null;

    //因为MoveSprite为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance(data) {
        var T = YYC.Class(MoveSprite, {
            Init: function (data) {
                this.base(data);

                this.P__context = new Context(this);
            },
            Public: {
                move: function () {
                },
                setDir: function () {
                }
            }
        });

        return new T(data);
    };


    beforeEach(function () {
        data = {
            //x/y坐标的最大值和最小值, 可用来限定移动范围.
            minX: 0,
            maxX: 500,
            minY: 0,
            maxY: 500,

            walkSpeed: 1,

            defaultAnimId: "walk_down",

            anims: {
                "walk_down": new Animation(getFrames("player", "walk_down")),
                "walk_right": new Animation(getFrames("player", "walk_right"))
            }
        };

        sprite = getInstance(data);
    });
    afterEach(function () {
        sprite = null;
    });

    describe("构造函数", function () {
        beforeEach(function () {
            data = {
                //x/y坐标的最大值和最小值, 可用来限定移动范围.
                minX: 0,
                maxX: 500,
                minY: 0,
                maxY: 500,

                walkSpeed: 1
            };

            sprite = getInstance(data);
        });

        it("调用父类构造函数", function () {

        });
        it("获得minX、maxX、minY、maxY、defaultAnimID", function () {
            var expected = {
                //x/y坐标的最大值和最小值, 可用来限定移动范围.
                minX: sprite.minX,
                maxX: sprite.maxX,
                minY: sprite.minY,
                maxY: sprite.maxY,
                walkSpeed: sprite.walkSpeed
            };
            expect(expected).toEqual(data);
        });
        it("获得walkSpeed", function () {
            expect(sprite.walkSpeed).toEqual(data.walkSpeed);
        });
        it("令speedX、speedY等于walkSpeed", function () {
            expect(sprite.speedX).toEqual(data.walkSpeed);
            expect(sprite.speedY).toEqual(data.walkSpeed);
        });
    });

    describe("init", function () {
        it("初始状态为standRightState", function () {
            sprite.defaultAnimId = "stand_right";
            spyOn(sprite.P__context, "setPlayerState");

            sprite.init();

            expect(sprite.P__context.setPlayerState).toHaveBeenCalledWith(sprite.P__context.standRightState);
        });
        it("根据speedX、speedY计算一次移动步长中的需要移动的次数stepX、stepY", function () {
            var backUp = testTool.extendDeep(bomberConfig);
            window.bomberConfig.WIDTH = 65;
            window.bomberConfig.HEIGHT = 65;
            sprite.speedX = 5;
            sprite.speedY = 2;

            sprite.init();

            expect(sprite.stepX).toEqual(13);
            expect(sprite.stepY).toEqual(33);

            window.bomberConfig.WIDTH = backUp.WIDTH;
            window.bomberConfig.HEIGHT = backUp.HEIGHT;
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
            sprite.init();
        });

        it("如果sprite.currentAnim不存在，则不执行", function () {
            spyOn(context, "drawImage");

            sprite.currentAnim = null;
            sprite.draw(context);

            expect(context.drawImage).not.toHaveBeenCalled();
        });

        describe("如果sprite.currentAnim存在", function () {
            it("调用drawImage，参数为当前帧的数据", function () {
                spyOn(context, "drawImage");
                var currentAnim = sprite.currentAnim,
                    frame = currentAnim.getCurrentFrame(),
                    fakeBitmap = {
                        img: {},
                        width: 1,
                        height: 1
                    };
                sprite.bitmap = fakeBitmap;

                sprite.draw(context);

                expect(context.drawImage).toHaveBeenCalledWith(fakeBitmap.img, frame.x, frame.y, frame.width, frame.height, sprite.x, sprite.y, fakeBitmap.width, fakeBitmap.height);
            });
        });
    });
});