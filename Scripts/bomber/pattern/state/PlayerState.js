(function () {
    var PlayerState = YYC.AClass({
        Protected: {
            P_context: null,
            P_changeTerrainData: function (position) {
                var stop = bomberConfig.map.terrain.stop;

                terrainDataOperate.setTerrainData(position.x, position.y, stop);
            },
            P_bombExist: function (targetCellPos) {
                var stop = bomberConfig.map.terrain.stop;

                return terrainDataOperate.getTerrainData()[targetCellPos.y][targetCellPos.x] === stop;
            }
        },
        Public: {
            setContext: function (context) {
                this.P_context = context;
            }
        },
        Abstract: {
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
            createBomb: function () {
            }
        }
    });

    window.PlayerState = PlayerState;
}());