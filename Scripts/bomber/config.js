//炸弹人游戏配置信息
var bomberConfig = {
    //游戏帧数
    FPS: 60,
    //方格宽度
    WIDTH: 30,
    //方格高度
    HEIGHT: 30,

    game: {
        //游戏状态
        state: {
            NORAML: 1,
            OVER: 2,
            WIN: 3
        }
    },

    //画布
    canvas: {
        //画布宽度
        WIDTH: 600,
        //画布高度
        HEIGHT: 600,
        //定位坐标
        TOP: "0px",
        LEFT: "0px"
    },

    //层
    layer: {
        //状态
        //如果状态>=3个，就要考虑用状态模式了！
        state: {
            NORMAL: 1,
            CHANGE: 2
        }
    },

    //玩家
    player: {
        //截取一个动作的偏移量
        offset: {
            X: 18,
            Y: 6
        },

        //图片上截取一个动作的横向范围sw
        SW: 28,
        //图片上截取一个动作的纵向范围sh
        SH: 48,

        //一个动作的宽度
        WIDTH: 64,
        //一个动作的高度
        HEIGHT: 64,

        //一个动作图片在canvas中的尺寸
        IMGWIDTH: 30,
        IMGHEIGHT: 30,

        //速度
        speed: {
            SLOW: 1,
            NORMAL: 3,
            FAST: 6
        }
    },
    //敌人
    enemy: {
        //截取一个动作的偏移量
        offset: {
            X: 18,
            Y: 6
        },

        //图片上截取一个动作的横向范围sw
        SW: 28,
        //图片上截取一个动作的纵向范围sh
        SH: 48,

        //一个动作的宽度
        WIDTH: 64,
        //一个动作的高度
        HEIGHT: 64,

        //一个动作图片在canvas中的尺寸
        IMGWIDTH: 30,
        IMGHEIGHT: 30,

        //速度
        speed: {
            SLOW: 1,
            NORMAL: 2,
            FAST: 5
        }
    },
    //炸弹
    bomb: {
        //爆炸时间，以秒为单位
        TIME: 3
    },

    //A*算法设置
    algorithm: {
        //有几个方向
        DIRECTION: 4
    },


    //地图
    map: {
        //行数
        ROW: 20,
        //列数
        COL: 20,
        //元素类型
        type: {
            GROUND: 1,
            WALL: 2
        },
        //地形判断
        terrain: {
            pass: 0,
            stop: 1
        }
    },

    //url前缀
    url_pre: {
        //main.js
        main: {
            //图片
            IMAGE: "../Content/Image/"
        }
    }
};