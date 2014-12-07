(function () {
    var Sprite = YYC.AClass({
        Init: function (data, bitmap) {
            this.bitmap = bitmap;

            if (data) {
                //初始坐标
                this.x = data.x;
                this.y = data.y;

                this.defaultAnimId = data.defaultAnimId;
                this.anims = data.anims;
            }
        },
        Private: {
            //更新帧动画
            _updateFrame: function (deltaTime) {
                if (this.currentAnim) {
                    this.currentAnim.update(deltaTime);
                }
            }
        },
        Public: {
            //bitmap实例
            bitmap: null,

            //精灵的坐标
            x: 0,
            y: 0,

            //精灵包含的所有 Animation 集合. Object类型, 数据存放方式为" id : animation ".
            anims: null,
            //默认的Animation的Id , string类型
            defaultAnimId: null,

            //当前的Animation.
            currentAnim: null,

            //设置当前Animation, 参数为Animation的id, String类型
            setAnim: function (animId) {
                this.currentAnim = this.anims[animId];
            },
            //重置当前帧
            resetCurrentFrame: function (index) {
                this.currentAnim && this.currentAnim.setCurrentFrame(index);
            },
            //取得精灵的碰撞区域,
            getCollideRect: function () {
                var obj = {
                    x: this.x,
                    y: this.y,
                    width: this.bitmap.width,
                    height: this.bitmap.height
                };

                return YYC.Tool.collision.getCollideRect(obj);
            },
            Virtual: {
                //初始化方法
                init: function () {
                    //设置当前Animation
                    this.setAnim(this.defaultAnimId);
                },
                // 更新精灵当前状态.
                update: function (deltaTime) {
                    this._updateFrame(deltaTime);
                },
                //获得坐标对应的方格坐标（向下取值）
                getCellPosition: function (x, y) {
                    return {
                        x: Math.floor(x / bomberConfig.WIDTH),
                        y: Math.floor(y / bomberConfig.HEIGHT)
                    }
                },
                draw: function (context) {
                    context.drawImage(this.bitmap.img, this.x, this.y, this.bitmap.width, this.bitmap.height);
                },
                clear: function (context) {
                    //直接清空画布区域
                    context.clearRect(0, 0, bomberConfig.canvas.WIDTH, bomberConfig.canvas.HEIGHT);
                }
            }
        }
    });

    window.Sprite = Sprite;
}());