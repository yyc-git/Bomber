describe("StandLeftState.js", function () {
    var state = null;
    var context = null;

    function clearKeyState() {
        window.keyState = {};
    };
    function fakeKeyDown(keyCode) {
        window.keyState[keyCode] = true;
    };
    function fakeKeyUp(keyCode) {
        window.keyState[keyCode] = false;
    };

    beforeEach(function () {
        context = new Context(spriteFactory.createPlayer());
        state = new StandLeftState();
        state.setContext(context);
    });
    afterEach(function () {
        clearKeyState();
    });

    describe("stand", function () {
        it("则context.sprite的dirX为0", function () {
            state.stand();

            expect(context.sprite.dirX).toEqual(0);
        });
        it("context.sprite的动画为stand_left", function () {
            spyOn(context.sprite, "setAnim");

            state.stand();

            expect(context.sprite.setAnim).toHaveBeenCalledWith("stand_left");
        });
        it("context.sprite.moving为false", function () {
            context.sprite.moving = true;

            state.stand();

            expect(context.sprite.moving).toBeFalsy();
        });
    });

    describe("walkLeft", function () {
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkLeft();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
        it("状态过渡到WalkLeftState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkLeft();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkLeftState);
        });
        it("调用context.walkLeft", function () {
            spyOn(state.P_context, "walkLeft");

            state.walkLeft();

            expect(state.P_context.walkLeft).toHaveBeenCalled();
        });
    });

    describe("walkRight", function () {
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkRight();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
        it("状态过渡到WalkRightState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkRight();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkRightState);
        });
        it("调用context.walkRight", function () {
            spyOn(state.P_context, "walkRight");

            state.walkRight();

            expect(state.P_context.walkRight).toHaveBeenCalled();
        });
    });

    describe("walkUp", function () {
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkUp();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
        it("状态过渡到WalkUpState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();

            state.walkUp();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkUpState);
        });
        it("调用context.walkUp", function () {
            spyOn(state.P_context, "walkUp");

            state.walkUp();

            expect(state.P_context.walkUp).toHaveBeenCalled();
        });
    });

    describe("walkDown", function () {
        it("重置当前帧为0", function () {
            spyOn(state.P_context.sprite, "resetCurrentFrame");

            state.walkDown();

            expect(state.P_context.sprite.resetCurrentFrame).toHaveBeenCalledWith(0);
        });
        it("状态过渡到WalkDownState", function () {
            spyOn(state.P_context, "setPlayerState").andCallThrough();
            fakeKeyDown(keyCodeMap.Down);

            state.walkDown();

            expect(state.P_context.setPlayerState).toHaveBeenCalledWith(state.P_context.walkDownState);
        });
        it("调用context.walkDown", function () {
            spyOn(state.P_context, "walkDown");

            state.walkDown();

            expect(state.P_context.walkDown).toHaveBeenCalled();
        });
    });

    describe("addIndex", function () {
        it("sprite.moveIndex_x加1", function () {
        });
    });
});