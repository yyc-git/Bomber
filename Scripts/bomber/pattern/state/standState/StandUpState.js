(function () {
    var StandUpState = YYC.Class(StandState, {
        Public: {
            stand: function () {
                var sprite = this.P_context.sprite;

                sprite.dirY = 0;
                sprite.setAnim("stand_up");
                sprite.moving = false;
            }
        }
    });

    window.StandUpState = StandUpState;
}());