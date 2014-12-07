(function () {
    var layerFactory = {
        createMap: function () {
            return new MapLayer();
        },
        createPlayer: function (deltaTime) {
            return new PlayerLayer(deltaTime);
        },
        createEnemy: function (deltaTime) {
            return new EnemyLayer(deltaTime);
        },
        createBomb: function () {
            return new BombLayer();
        },
        createFire: function () {
            return new FireLayer();
        }
    }

    window.layerFactory = layerFactory;
}());