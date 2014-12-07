(function () {
    var BombSprite = YYC.Class(Sprite, {
        Init: function (playerSprite, bitmap) {
            this.playerSprite = playerSprite;

            this.base(null, bitmap);
        },
        Protected: {
        },
        Private: {
            //返回火焰范围
            //返回顺序为[center、[up]、[down]、[left]、[right]]
            __getFireAllRange: function () {

                return [
                    { x: this.x, y: this.y },
                    [
                        { x: this.x, y: this.y - bomberConfig.HEIGHT },
                        { x: this.x, y: this.y - bomberConfig.HEIGHT * 2 }
                    ],
                    [
                        { x: this.x, y: this.y + bomberConfig.HEIGHT },
                        { x: this.x, y: this.y + bomberConfig.HEIGHT * 2 }
                    ],
                    [
                        { x: this.x - bomberConfig.WIDTH, y: this.y },
                        { x: this.x - bomberConfig.WIDTH * 2, y: this.y }
                    ],
                    [
                        { x: this.x + bomberConfig.WIDTH, y: this.y },
                        { x: this.x + bomberConfig.WIDTH * 2, y: this.y }
                    ]
                ];
            },
            __getCenterEffectiveRange: function (effectiveRange, center) {
                effectiveRange.center = { x: center.x, y: center.y };
            },
            __getFourDirEffectiveRange: function (effectiveRange, allRange) {
                var i = 0,
                    j = 0,
                    len1 = 0,
                    len2 = 0,
                    firePos = null,
                    cellPos = null,
                    groundRange = [],
                    wallRange = [];

                for (i = 0, len1 = allRange.length; i < len1; i++) {
                    for (j = 0, len2 = allRange[i].length; j < len2; j++) {
                        firePos = allRange[i][j];
                        cellPos = this.getCellPosition(firePos.x, firePos.y);

                        if (this.__isNotBorder(cellPos)) {
                            if (this.__isGround(cellPos)) {
                                groundRange.push(firePos);
                            }
                            else if (this.__isWall(cellPos)) {
                                wallRange.push(firePos);
                                break;
                            }
                            else {
                                throw new Error("未知的地图类型");
                            }
                        }
                    }
                }
                effectiveRange.groundRange = groundRange;
                effectiveRange.wallRange = wallRange;
            },
            __createFire: function (effectiveRange) {
                var fires = [];

                this.__createCenter(fires, effectiveRange);
                this.__createFourDir(fires, effectiveRange);

                return fires;
            },
            __createCenter: function (fires, effectiveRange) {
                var center = spriteFactory.createExplode();

                center.x = effectiveRange.center.x;
                center.y = effectiveRange.center.y;
                fires.push(center);
            },
            __createFourDir: function (fires, effectiveRange) {
                var i = 0,
                    len = 0,
                    fire = null,
                    groundRange = effectiveRange.groundRange;

                for (i = 0, len = groundRange.length; i < len; i++) {
                    fire = spriteFactory.createFire();
                    fire.x = groundRange[i].x;
                    fire.y = groundRange[i].y;
                    fires.push(fire);
                }
            },
            __isNotBorder: function (position) {
                if (position.x < 0 || position.y < 0) {
                    return false;
                }

                if (position.x >= window.mapData[0].length || position.y >= window.mapData.length) {
                    return false;
                }

                return true;
            },
            __isGround: function (position) {
                return window.mapDataOperate.getMapData()[position.y][position.x] === window.bomberConfig.map.type.GROUND;
            },
            __bombPass: function () {
                var pass = bomberConfig.map.terrain.pass,
                    position = this.getCellPosition(this.x, this.y);

                terrainDataOperate.setTerrainData(position.x, position.y, pass);
            },
            __destroyWall: function (effectiveRange) {
                var i = 0,
                    len = 0,
                    mapChange = false,
                    wallRange = effectiveRange.wallRange,
                    cellPos = null,
                    ground = bomberConfig.map.type.GROUND,
                    groundImg = window.imgLoader.get("ground"),
                    wall = bomberConfig.map.type.WALL,
                    pass = bomberConfig.map.terrain.pass,
                    stop = bomberConfig.map.terrain.stop;

                for (i = 0, len = wallRange.length; i < len; i++) {
                    cellPos = this.getCellPosition(wallRange[i].x, wallRange[i].y);
                    window.mapDataOperate.setMapData(cellPos.x, cellPos.y, ground);
                    window.terrainDataOperate.setTerrainData(cellPos.x, cellPos.y, pass);

                    window.subject.publishAll(null, cellPos.x, cellPos.y, groundImg);
                    if (!mapChange) {
                        mapChange = true;
                    }
                }

                return mapChange;
            },
            __isWall: function (position) {
                return window.mapDataOperate.getMapData()[position.y][position.x] === window.bomberConfig.map.type.WALL;
            },
            __isInEffectiveRange: function (effectiveRange) {
                var range = null;

                range = effectiveRange.groundRange.concat(effectiveRange.wallRange);
                range.push(effectiveRange.center);

                if (this.__isInRange(range)) {
                    return true;
                }
                else {
                    return false;
                }
            },
            __isInRange: function (range) {
                var i = 0,
                    len = 0;

                for (i = 0, len = range.length; i < len; i++) {
                    if (range[i].x === this.x && range[i].y === this.y) {
                        return true;
                    }
                }

                return false;
            }
        },
        Public: {
            playerSprite: null,
            //是否已爆炸标志
            exploded: false,

            explode: function () {
                var fires = null,
                    mapChange = false,
                    effectiveRange = [];

                this.playerSprite.bombNum -= 1;
                this.exploded = true;
                this.__bombPass();
                effectiveRange = this.getFireEffectiveRange();
                fires = this.__createFire(effectiveRange);
                mapChange = this.__destroyWall(effectiveRange);

                return {
                    fires: fires,
                    mapChange: mapChange
                };
            },
            collideFireWithCharacter: function (sprite) {
                var effectiveRange = this.getFireEffectiveRange(),
                    range = [],
                    fire = {},
                    obj2 = {},
                    i = 0,
                    len = 0;

                //放到数组中
                range.push(effectiveRange.center);
                range = range.concat(effectiveRange.groundRange, effectiveRange.wallRange);

                for (i = 0, len = range.length; i < len; i++) {
                    fire = {
                        x: range[i].x,
                        y: range[i].y,
                        width: this.bitmap.width,
                        height: this.bitmap.height
                    };
                    obj2 = {
                        x: sprite.x,
                        y: sprite.y,
                        width: sprite.bitmap.width,
                        height: sprite.bitmap.height
                    };
                    if (YYC.Tool.collision.col_Between_Rects(fire, obj2)) {
                        return true;
                    }
                }

                return false;
            },
            //返回有效范围。（考虑墙、边界阻挡等问题）
            //返回值形如：{center: {x: 1,y: 1}}, {groundRange: [{{x: 1,y: 1}]}, {wallRange: [{{x: 1,y: 1}]}
            getFireEffectiveRange: function () {
                var effectiveRange = {},
                    allRange = this.__getFireAllRange();

                this.__getCenterEffectiveRange(effectiveRange, allRange.shift());
                this.__getFourDirEffectiveRange(effectiveRange, allRange);

                return effectiveRange;
            },
            isInEffectiveRange: function (bomb) {
                return this.__isInEffectiveRange(bomb.getFireEffectiveRange());
            }
        }
    });

    window.BombSprite = BombSprite;
}());