//键盘事件管理类
(function () {
    //枚举值
    var keyCodeMap = {
        Left: 65, // A键
        Right: 68, // D键
        Down: 83, // S键
        Up: 87, // W键
        Space: 32   //空格键
    };
    //按键状态
    var keyState = {
    };

    keyState[keyCodeMap.Left] = false;
    keyState[keyCodeMap.Right] = false;
    keyState[keyCodeMap.Up] = false;
    keyState[keyCodeMap.Down] = false;
    keyState[keyCodeMap.Space] = false;

    var KeyEventManager = YYC.Class({
        Private: {
            _keyDown: function () {
            },
            _keyUp: function () {
            }
        },
        Public: {
            addKeyDown: function () {
                this._keyDown = YYC.Tool.event.bindEvent(this, function (e) {
                    keyState[e.keyCode] = true;

                    e.preventDefault();
                });

                YYC.Tool.event.addEvent(document, "keydown", this._keyDown);
            },
            removeKeyDown: function () {
                YYC.Tool.event.removeEvent(document, "keydown", this._keyDown);
            },
            addKeyUp: function () {
                this._keyUp = YYC.Tool.event.bindEvent(this, function (e) {
                    keyState[e.keyCode] = false;
                });

                YYC.Tool.event.addEvent(document, "keyup", this._keyUp);
            },
            removeKeyUp: function () {
                YYC.Tool.event.removeEvent(document, "keyup", this._keyUp);
            }
        }
    });

    window.keyCodeMap = keyCodeMap;
    window.keyState = keyState;
    window.keyEventManager = new KeyEventManager();
}());
