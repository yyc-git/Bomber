(function () {
    var getSpriteData = (function () {
        var data = function () {
            return {
                //玩家精灵类
                player: {
                    //初始坐标
                    x: bomberConfig.WIDTH * 3,
                    //x: 0,
                    y: bomberConfig.HEIGHT * 19,
                    //定义sprite走路速度的绝对值
                    walkSpeed: bomberConfig.player.speed.NORMAL,

                    //速度
                    speedX: 1,
                    speedY: 1,

                    minX: 0,
                    maxX: bomberConfig.canvas.WIDTH - bomberConfig.player.IMGWIDTH,
                    minY: 0,
                    maxY: bomberConfig.canvas.HEIGHT - bomberConfig.player.IMGHEIGHT,

                    defaultAnimId: "stand_right",

                    anims: {
                        "stand_right": new Animation(getFrames("player", "stand_right")),
                        "stand_left": new Animation(getFrames("player", "stand_left")),
                        "stand_down": new Animation(getFrames("player", "stand_down")),
                        "stand_up": new Animation(getFrames("player", "stand_up")),
                        "walk_up": new Animation(getFrames("player", "walk_up")),
                        "walk_down": new Animation(getFrames("player", "walk_down")),
                        "walk_right": new Animation(getFrames("player", "walk_right")),
                        "walk_left": new Animation(getFrames("player", "walk_left"))
                    }
                },
                //敌人精灵类
                enemy: {
                    //初始坐标
                    x: bomberConfig.WIDTH * 10,
                    //x: 0,
                    y: bomberConfig.HEIGHT * 3,
                    //定义sprite走路速度的绝对值
                    walkSpeed: bomberConfig.enemy.speed.NORMAL,

                    //速度
                    speedX: 1,
                    speedY: 1,

                    minX: 0,
                    maxX: bomberConfig.canvas.WIDTH - bomberConfig.player.IMGWIDTH,
                    minY: 0,
                    maxY: bomberConfig.canvas.HEIGHT - bomberConfig.player.IMGHEIGHT,

                    defaultAnimId: "stand_left",

                    anims: {
                        "stand_right": new Animation(getFrames("enemy", "stand_right")),
                        "stand_left": new Animation(getFrames("enemy", "stand_left")),
                        "stand_down": new Animation(getFrames("enemy", "stand_down")),
                        "stand_up": new Animation(getFrames("enemy", "stand_up")),
                        "walk_up": new Animation(getFrames("enemy", "walk_up")),
                        "walk_down": new Animation(getFrames("enemy", "walk_down")),
                        "walk_right": new Animation(getFrames("enemy", "walk_right")),
                        "walk_left": new Animation(getFrames("enemy", "walk_left"))
                    }
                },
                enemy2: {
                    //初始坐标
                    x: bomberConfig.WIDTH * 10,
                    //x: 0,
                    y: bomberConfig.HEIGHT * 10,
                    //定义sprite走路速度的绝对值
                    walkSpeed: bomberConfig.enemy.speed.NORMAL,

                    //速度
                    speedX: 1,
                    speedY: 1,

                    minX: 0,
                    maxX: bomberConfig.canvas.WIDTH - bomberConfig.player.IMGWIDTH,
                    minY: 0,
                    maxY: bomberConfig.canvas.HEIGHT - bomberConfig.player.IMGHEIGHT,

                    defaultAnimId: "stand_left",

                    anims: {
                        "stand_right": new Animation(getFrames("enemy", "stand_right")),
                        "stand_left": new Animation(getFrames("enemy", "stand_left")),
                        "stand_down": new Animation(getFrames("enemy", "stand_down")),
                        "stand_up": new Animation(getFrames("enemy", "stand_up")),
                        "walk_up": new Animation(getFrames("enemy", "walk_up")),
                        "walk_down": new Animation(getFrames("enemy", "walk_down")),
                        "walk_right": new Animation(getFrames("enemy", "walk_right")),
                        "walk_left": new Animation(getFrames("enemy", "walk_left"))
                    }
                }
            }
        };

        return function (spriteName) {
            return data()[spriteName];
        };
    }());

    window.getSpriteData = getSpriteData;
}());