/**
 *
 *碰撞检测
 *
 **/

YYC.Pattern.namespace("Tool").collision = (function () {
    return {
        //获得精灵的碰撞区域,
        getCollideRect: function (obj) {
            return {
                x1: obj.x,
                y1: obj.y,
                x2: obj.x + obj.width,
                y2: obj.y + obj.height
            }
        },
        /**
         *矩形和矩形间的碰撞
         **/
        col_Between_Rects: function (obj1, obj2) {
            var rect1 = this.getCollideRect(obj1);
            var rect2 = this.getCollideRect(obj2);

            //如果碰撞，则返回true
            if (rect1 && rect2 && !(rect1.x1 >= rect2.x2 || rect1.y1 >= rect2.y2 || rect1.x2 <= rect2.x1 || rect1.y2 <= rect2.y1)) {
                return true;
            }
            return false;
        }
    };
}());

