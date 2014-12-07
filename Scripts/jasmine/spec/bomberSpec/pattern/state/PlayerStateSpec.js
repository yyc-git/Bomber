describe("PlayerState.js", function () {
    var state = null;

    //因为PlayerState为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance() {
        var T = YYC.Class(PlayerState, {
            Protected: {
            },
            Public: {
                addIndex: function () {
                },
                stand: function () {
                },
                walkLeft: function () {
                },
                walkRight: function () {
                },
                walkUp: function () {
                },
                walkDown: function () {
                },
                move: function () {
                },
                createBomb: function(){
                }
            }
        });

        return new T();
    };

    beforeEach(function () {
        state = getInstance();
    });
    afterEach(function () {
    });

    describe("setContext", function () {
        it("获得context", function () {
            var fakeContext = {};

            state.setContext(fakeContext);

            expect(state.P_context).toEqual(fakeContext);
        });
    });
});