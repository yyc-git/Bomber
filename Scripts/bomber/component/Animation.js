(function () {
    var Animation = YYC.Class({
        Init: function (config) {
            this._frames = YYC.Tool.array.clone(config);
            this._init();
        },
        Private: {
            // Animation 包含的Frame, 类型:数组
            _frames: null,
            // 包含的Frame数目
            _frameCount: -1,
            // 所使用的图片id(在ImgCache中存放的Key), 字符串类型. 
            _img: null,
            _currentFrame: null,
            _currentFrameIndex: -1,
            _currentFramePlayed: -1,

            _init: function () {
                this._frameCount = this._frames.length;

                this.setCurrentFrame(0);
            }
        },
        Public: {
            setCurrentFrame: function (index) {
                this._currentFrameIndex = index;
                this._currentFrame = this._frames[index];
                this._currentFramePlayed = 0;
            },
            // 更新Animation状态. deltaTime表示时间的变化量.
            update: function (deltaTime) {
                //如果没有duration属性（表示只有一帧），则返回
                if (this._currentFrame.duration === undefined) {
                    return;
                }

                //判断当前Frame是否已经播放完成, 
                if (this._currentFramePlayed >= this._currentFrame.duration) {
                    //播放下一帧

                    if (this._currentFrameIndex >= this._frameCount - 1) {
                        //当前是最后一帧,则播放第0帧
                        this._currentFrameIndex = 0;
                    } else {
                        //播放下一帧
                        this._currentFrameIndex++;
                    }
                    //设置当前帧信息
                    this.setCurrentFrame(this._currentFrameIndex);

                } else {
                    //增加当前帧的已播放时间.
                    this._currentFramePlayed += deltaTime;
                }
            },
            getCurrentFrame: function () {
                return this._currentFrame;
            }
        }
    });

    window.Animation = Animation;
}());