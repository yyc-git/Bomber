(function () {
    var StandDownState = YYC.Class(StandState, {
        Public: {
            stand: function () {
                var sprite = this.P_context.sprite;

                sprite.dirY = 0;
                sprite.setAnim("stand_down");
                sprite.moving = false;
            }
        }
    });

    window.StandDownState = StandDownState;
}());