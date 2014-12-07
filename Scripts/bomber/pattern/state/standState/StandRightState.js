(function () {
    var StandRightState = YYC.Class(StandState, {
        Public: {
            stand: function () {
                var sprite = this.P_context.sprite;

                sprite.dirX = 0;
                sprite.setAnim("stand_right");
                sprite.moving = false;
            }
        }
    });

    window.StandRightState = StandRightState;
}());