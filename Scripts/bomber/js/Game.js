(function () {
    //观察者全局实例
    window.subject = null;

    //游戏全局状态
    window.gameState = window.bomberConfig.game.state.NORMAL;

    var Game = YYC.Class({
        Init: function () {
            window.subject = new YYC.Pattern.Subject();
        },
        Private: {
            _pattern: null,
            _ground: null,

            _createLayerManager: function () {
                this.layerManager = new LayerManager();
                this.layerManager.addLayer("mapLayer", layerFactory.createMap());
                this.layerManager.addLayer("enemyLayer", layerFactory.createEnemy(this.sleep));
                this.layerManager.addLayer("playerLayer", layerFactory.createPlayer(this.sleep));
                this.layerManager.addLayer("bombLayer", layerFactory.createBomb());
                this.layerManager.addLayer("fireLayer", layerFactory.createFire());
            },
            _addElements: function () {
                var mapLayerElements = this._createMapLayerElement(),
                    playerLayerElements = this._createPlayerLayerElement(),
                    enemyLayerElements = this._createEnemyLayerElement();

                this.layerManager.addSprites("mapLayer", mapLayerElements);
                this.layerManager.addSprites("playerLayer", playerLayerElements);
                this.layerManager.addSprites("enemyLayer", enemyLayerElements);
            },
            //创建并设置每个地图方格精灵，加入到元素数组中并返回。
            _createMapLayerElement: function () {
                var i = 0,
                    j = 0,
                    x = 0,
                    y = 0,
                    row = bomberConfig.map.ROW,
                    col = bomberConfig.map.COL,
                    element = [],
                    mapData = mapDataOperate.getMapData(),
                    img = null;

                for (i = 0; i < row; i++) {
                    //注意！
                    //y为纵向height，x为横向width
                    y = i * bomberConfig.HEIGHT;

                    for (j = 0; j < col; j++) {
                        x = j * bomberConfig.WIDTH;
                        img = this._getMapImg(i, j, mapData);
                        element.push(spriteFactory.createMapElement({ x: x, y: y }, bitmapFactory.createBitmap({ img: img, width: bomberConfig.WIDTH, height: bomberConfig.HEIGHT })));
                    }
                }

                return element;
            },
            _getMapImg: function (i, j, mapData) {
                var img = null;

                switch (mapData[i][j]) {
                    case 1:
                        img = window.imgLoader.get("ground");
                        break;
                    case 2:
                        img = window.imgLoader.get("wall");
                        break;
                    default:
                        break
                }

                return img;
            },
            _createPlayerLayerElement: function () {
                var element = [],
                    player = spriteFactory.createPlayer();

                player.init();
                element.push(player);

                return element;
            },
            _createEnemyLayerElement: function () {
                var element = [],
                    enemy = spriteFactory.createEnemy(),
                    enemy2 = spriteFactory.createEnemy2();

                enemy.init();
                enemy2.init();
                element.push(enemy);
                element.push(enemy2);

                return element;
            },
            _initLayer: function () {
                this.layerManager.initLayer();
            },
            _initEvent: function () {
                //监听整个document的keydown,keyup事件
                keyEventManager.addKeyDown();
                keyEventManager.addKeyUp();
            },
            _judgeGameState: function () {
                switch (window.gameState) {
                    case window.bomberConfig.game.state.NORMAL:
                        break;
                    case window.bomberConfig.game.state.OVER:
                        this.gameOver();
                        return "over";
                        break;
                    case window.bomberConfig.game.state.WIN:
                        this.gameWin();
                        return "over";
                        break;
                    default:
                        throw new Error("未知的游戏状态");
                }
                return false;
            }
        },
        Public: {
            context: null,
            sleep: 0,
            x: 0,
            y: 0,
            layerManager: null,
            mainLoop: null,

            init: function () {
                this.sleep = Math.floor(1000 / bomberConfig.FPS);
                this._createLayerManager();
                this._addElements();
                this._initLayer();
                this._initEvent();

                window.subject.subscribe(this.layerManager.getLayer("mapLayer"), this.layerManager.getLayer("mapLayer").changeSpriteImg);
            },
            start: function () {
                var self = this;

                this.mainLoop = window.setInterval(function () {
                    self.run();
                }, this.sleep);
            },
            run: function () {
                if (this._judgeGameState() === "over") {
                    return;
                }

                this.layerManager.run();
                this.layerManager.change();
            },
            gameOver: function () {
                YYC.Tool.asyn.clearAllTimer(this.mainLoop);
                alert("Game Over！");
            },
            gameWin: function () {
                YYC.Tool.asyn.clearAllTimer(this.mainLoop);
                alert("You Win！");
            }
        }
    });

    window.Game = Game;
}());