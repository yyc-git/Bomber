//获得帧数据
(function () {
    var getFrames = (function () {
        //一个动作在图片中的宽度
        var width = bomberConfig.player.WIDTH,
        //一个动作在图片中的高度
            height = bomberConfig.player.HEIGHT,
        //一个动作的偏移量
            offset = {
                x: bomberConfig.player.offset.X,
                y: bomberConfig.player.offset.Y
            },
        //一个动作横向截取的长度
            sw = bomberConfig.player.SW,
        //一个动作纵向截取的长度
            sh = bomberConfig.player.SH;

        //帧数据
        var frames = function () {
            return {
                player: {
                    //向右站立
                    stand_right: [
                        {
                            x: offset.x, y: offset.y + 2 * height, width: sw, height: sh
                        }
                    ],
                    //向左站立
                    stand_left: [
                        { x: offset.x, y: offset.y + height, width: sw, height: sh }
                    ],
                    //向上站立
                    stand_up: [
                        { x: offset.x, y: offset.y + 3 * height, width: sw, height: sh }
                    ],
                    //向下站立
                    stand_down: [
                        { x: offset.x, y: offset.y, width: sw, height: sh }
                    ],
                    //向上走
                    walk_up: [
                        { x: offset.x, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 }
                    ],
                    //向下走
                    walk_down: [
                        { x: offset.x, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y, width: sw, height: sh, duration: 100 }
                    ],
                    //向右走
                    walk_right: [
                        { x: offset.x, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 }
                    ],
                    //向左走
                    walk_left: [
                        { x: offset.x, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + height, width: sw, height: sh, duration: 100 }
                    ]
                },
                enemy: {
                    //向右站立
                    stand_right: [
                        { x: offset.x, y: offset.y + 2 * height, width: sw, height: sh }
                    ],
                    //向左站立
                    stand_left: [
                        { x: offset.x, y: offset.y + height, width: sw, height: sh }
                    ],
                    //向上站立
                    stand_up: [
                        { x: offset.x, y: offset.y + 3 * height, width: sw, height: sh }
                    ],
                    //向下站立
                    stand_down: [
                        { x: offset.x, y: offset.y, width: sw, height: sh }
                    ],
                    //向上走
                    walk_up: [
                        { x: offset.x, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + 3 * height, width: sw, height: sh, duration: 100 }
                    ],
                    //向下走
                    walk_down: [
                        { x: offset.x, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y, width: sw, height: sh, duration: 100 }
                    ],
                    //向右走
                    walk_right: [
                        { x: offset.x, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + 2 * height, width: sw, height: sh, duration: 100 }
                    ],
                    //向左走
                    walk_left: [
                        { x: offset.x, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + width, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 2 * width, y: offset.y + height, width: sw, height: sh, duration: 100 },
                        { x: offset.x + 3 * width, y: offset.y + height, width: sw, height: sh, duration: 100 }
                    ]
                },
                //因为只有一张图片，所以帧数据为空
                bomb: {
                    bomb: [
                    ],
                    explode: [
                    ],
                    fire: [
                    ]
                }
            }
        }


        return function (who, animName) {
            return frames()[who][animName];
        };
    }());

    window.getFrames = getFrames;
}());