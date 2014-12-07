describe("Context.js", function () {
    var context = null;
    var sprite = null;

    beforeEach(function () {
        sprite = spriteFactory.createPlayer();
        context = new Context(sprite);
    });

    describe("构造函数", function () {
        it("获得sprite", function () {
            context = new Context(sprite);

            expect(context.sprite).toEqual(sprite);
        });
    });

    describe("setPlayerState", function () {
        var state = null;

        beforeEach(function () {
            state = new WalkLeftState();
        });

        it("获得当前状态类对象", function () {
            context.setPlayerState(state);

            expect(context._state).toEqual(state);
        });
        it("把当前的上下文通知到当前状态类对象中", function () {
            spyOn(state, "setContext");

            context.setPlayerState(state);

            expect(state.setContext).toHaveBeenCalledWith(context);
        });
    });

    describe("各个状态的方法", function () {
        var state = null;

        beforeEach(function () {
            state = new WalkLeftState();
            context.setPlayerState(state);
        });

        describe("walkLeft", function () {
            it("调用当前状态类对象的walkLeft方法", function () {
                spyOn(state, "walkLeft");

                context.walkLeft();

                expect(state.walkLeft).toHaveBeenCalled();
            });
        });

        describe("walkRight", function () {
            it("调用当前状态类对象的walkRight方法", function () {
                spyOn(state, "walkRight");

                context.walkRight();

                expect(state.walkRight).toHaveBeenCalled();
            });
        });

        describe("walkDown", function () {
            it("调用当前状态类对象的walkDown方法", function () {
                spyOn(state, "walkDown");

                context.walkDown();

                expect(state.walkDown).toHaveBeenCalled();
            });
        });

        describe("walkUp", function () {
            it("调用当前状态类对象的walkUp方法", function () {
                spyOn(state, "walkUp");

                context.walkUp();

                expect(state.walkUp).toHaveBeenCalled();
            });
        });

        describe("stand", function () {
            it("调用当前状态类对象的stand方法", function () {
                spyOn(state, "stand");

                context.stand();

                expect(state.stand).toHaveBeenCalled();
            });
        });

        describe("move", function () {
            it("调用当前状态类对象的move方法", function () {
                spyOn(state, "move");

                context.move();

                expect(state.move).toHaveBeenCalled();
            });
        });
    });
});