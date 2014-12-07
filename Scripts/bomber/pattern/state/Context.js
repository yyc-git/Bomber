(function () {
    var Context = YYC.Class({
        Init: function (sprite) {
            this.sprite = sprite;

            this.walkLeftState = new WalkLeftState();
            this.walkRightState = new WalkRightState();
            this.walkUpState = new WalkUpState();
            this.walkDownState = new WalkDownState();
            this.standLeftState = new StandLeftState();
            this.standRightState = new StandRightState();
            this.standUpState = new StandUpState();
            this.standDownState = new StandDownState();
        },
        Private: {
            _state: null
        },
        Public: {
            sprite: null,

            walkLeftState: null,
            walkRightState: null,
            walkUpState: null,
            walkDownState: null,
            standLeftState: null,
            standRightState: null,
            standUpState: null,
            standDownState: null,


            setPlayerState: function (state) {
                this._state = state;
                //把当前的上下文通知到当前状态类对象中
                this._state.setContext(this);
            },
            walkLeft: function () {
                this._state.walkLeft();
            },
            walkRight: function () {
                this._state.walkRight();
            },
            walkUp: function () {
                this._state.walkUp();
            },
            walkDown: function () {
                this._state.walkDown();
            },
            stand: function () {
                this._state.stand();
            },
            move: function () {
                this._state.move();
            },
            createBomb: function () {
                return this._state.createBomb();
            }
        },
        Static: {
        }
    });

    window.Context = Context;
}());