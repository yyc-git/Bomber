//图片数据
//包括 图片url。

(function () {
    var getImages = (function () {
        var imgs = {
            ground: "Map/ground.png",
            wall: "Map/wall.png",
            player: "Player/player.png",
            enemy: "Enemy/enemy.png",
            bomb: "Bomb/bomb.png",
            explode: "Bomb/explode.png",
            fire: "Bomb/fire.png"
        };

        return function (id) {
            return bomberConfig.url_pre.main.IMAGE + imgs[id];
        };
    }());

    window.getImages = getImages;
}());