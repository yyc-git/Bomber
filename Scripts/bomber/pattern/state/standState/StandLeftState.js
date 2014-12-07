(function () {
    var StandLeftState = YYC.Class(StandState, {
        Public: {
            stand: function () {
                var sprite = this.P_context.sprite;

                sprite.dirX = 0;
                sprite.setAnim("stand_left");
                sprite.moving = false;
            }
        }
    });

    window.StandLeftState = StandLeftState;
}());