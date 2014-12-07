YYC.Pattern.namespace("Tool").array = {
    /*
     判断数组中是否有重复项，有即返回true，否则返回false
     发送给多人时，判断是否重复发给同一人
     如收件人：yang11,yang11,111111
     此处yang11重复！
     */
    repeat: function (array) {
        var new_array = array;
        /*
         如果为第一次调用（即不是递归调用的），
         就赋值原数组array，并使new_array指向新数组。
         这样可防止修改原数组array（如删除元素）
         */
        if (!arguments[1]) {
            new_array = this.clone(array);
        }

        if (new_array.length == 0) {
            return false;
        }
        var first = new_array[0];
        /*判断数组是否有重复的第一个元素*/
        for (var i = 1; i < new_array.length; i++) {
            if (first == new_array[i]) {
                return true;    //退出for循环，返回函数返回值true
            }

            else {
                continue;
            }
        }
        new_array.shift();  //删除数组第一个元素
        /*
         递归，判断数组其他元素是否重复
         注意：此处要用return！
         */
        return this.repeat(new_array, "next");
    },
    /*返回一个新的数组，元素与array相同（地址不同）*/
    clone: function (array) {
        var new_array = new Array(array.length);
        for (var i = 0, _length = array.length; i < _length; i++) {
            new_array[i] = array[i];
        }
        return new_array;
    }
};