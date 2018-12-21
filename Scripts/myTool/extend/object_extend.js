/**
 *  扩展js的对象
 */
(function () {

    /************************************************** String对象扩展 ***********************************************************

     扩展方法：
     contain
     containIgnoreCase
     trim

     */
    String.prototype.contain = function (str) {
        /* 使用RegExp对象来构造动态匹配。
         注意！str是字符串，因此需要转义！

         由于JavaScript字符串中的“\”是一个转义字符，因此，使用显式构造函数创建RegExp实例对象时，应将原始正则表达式中的“\”用“\\”替换。例如，在代码1.2中的两条语句是等价的。

         代码1.2   转义字符中的“\”：1.2.htm

         <script language="javascript">

         var re1 = new RegExp("\\d{5}");

         var re2 = /\d{5}/;

         alert("re1="+re1+"\nre2="+re2);

         </script>



         由于正则表达式模式文本中的转义字符也是“\”，如果正则表达式中要匹配原义字符“\”，在正则表达式模式文本中要以“\\”来表示，当使用显式构造函数的方式创建RegExp实例对象的时候，就需要使用“\\\\”来表示原义字符“\”。

         var re = new RegExp(\\\\)。

         */
        var reg = new RegExp(str);
        if (this.match(reg)) {  //用this指针指代本体
            return true;
        }
        else {
            return false;
        }
    }

    String.prototype.containIgnoreCase = function (str) {   //不分大小写
        var reg = new RegExp(str, "i");  //使用RegExp对象来构造动态匹配
        if (this.match(reg)) {  //用this指针指代本体
            return true;
        }
        else {
            return false;
        }
    };

    String.prototype.trim = function () {
        var source = this;
        return source.replace(/^\s*/g, "").replace(/\s*$/g, "");
    };

    /*****************************************************************************************************************************/


    /************************************************** Array对象扩展 ***********************************************************

     扩展方法：
     forEach
     filter

     contain()
     indexof()
     get()
     modify()

     */

    window.$break = {};


    /*仿prototype.js库 扩展Array类

     Array类需要扩展的方法（形参未给出）：

     contain()
     indexof()
     get()
     modify()



     继承_Enumerable类，只用实现_each方法即可获得_Enumerable类的所有方法，这是混入的思想。

     */

    //为Object类加入_extend静态方法
    if (!Object._extend) {
        Object._extend = function (destination, source) {
            for (var property in source) {
                // if (!destination[property]) {
                    destination[property] = source[property];
                // }
            }
            return destination;
        }
    }

    //    $break = {};

    /*
     indexOf方法名要加_（否则1817行会报错！）(因为String类有同名方法indexOf？？？？？)，
     否则在ff下ckfinder不能删除（点击没反应）！上传文件个数到达指定的上限时不会提示（点击没反应）
     */
    var _Enumerable = (function () {     //集合类，该类为抽象类，需要子类实现_each方法
        function each(iterator, context) {
            var index = 0;
            try {
                this._each(function (value) {
                    iterator.call(context, value, index++);
                });
            } catch (e) {
                if (e != $break) throw e;
            }
            return this;
        };

        /*
         判断数组是否包含元素。

         示例：
         var result = ["a", "b", 1];
         var t = result.contain(function (value, index) {
         if (value == "c") {
         return true;
         }
         else {
         }
         });

         alert(t);   //  -> true
         */
        function contain(iterator) {
            var result = false;
            //        var source = this;
            this.each(function (value, index) {
                if (!!iterator.call(null, value, index)) {
                    result = true;
                    throw $break;   //如果包含，则置返回值为true,跳出循环
                }
            });
            return result;
        };

        /*
         修改数组的元素。

         此处的context为待修改的数组。

         示例：
         var result = [{ type: "a", num: 1 }, { type: "b", num: 2}];
         result.modify(function (value, index) {
         if (value.type == "a") {
         this.num = 10;
         return true;
         }
         }, result); //注意此处要传入待修改的数组(此处为result)

         alert(result[0].num);   //  -> 10
         */
        function modify(iterator, context) {
            //        var source = this;
            this.each(function (value, index) {
                if (iterator.call(context[index], value, index)) {  //context[index]为数组第index个元素
                    throw $break;   //修改成功后即退出循环
                }
            });
            return;
        };

        /*
         返回满足条件的元素的位置。
         如果找不到满足条件的元素，则返回-1。

         示例：
         var result = [{ type: "a", num: 1 }, { type: "b", num: 2}];
         var index = result.indexOf(function (value, index) {
         if (value.type == "b") {
         return index;
         }
         else {
         return false;
         }
         });
         alert(index);   //  -> 1
         */
        function indexOf(iterator) {
            if(iterator === "2d"){
                return;
            };

            var result = -1;
            var t = null;
            this.each(function (value, index) {
                t = iterator.call(null, value, index);
                if (t !== false) {
                    throw $break;
                }
            });
            result = t === false ? -1 : t;  //用"==="来判断，因为如果用"=="的话，0也为false！即t=0时，result也为-1！
            return result;
        };


        return {
            each: each,
            contain: contain,
            modify: modify,
            indexOf: indexOf   ////区别于String的indexOf方法
        }
    })();

    Object._extend(Array.prototype, (function () {   //自执行闭包，返回的Object对象拷贝给Array的原型
        Object._extend(Array.prototype, _Enumerable); //继承Enumerable类
        function _each(iterator) {  //实现_each方法
            for (var i = 0, length = this.length; i < length; i++) {
                iterator(this[i]);
            }
        }


        /*  对每个数组元素调用iterator，返回调用iterator返回false的元素索引的数组 
         如 source_arr = ["", "a", "b", ""];
         var result = source_arr.judge(arr, function (value, index) {
         if (value === "") {
         return false;
         }
         else {
         return true;
         }
         });
         //result = [0, 3];


         2012-11-16

         */
        function judge(iterator) {
            var result = [];
            this.each(function (value, index) {
                if (!iterator.call(null, value, index)) {
                    result.push(index);
                }
            });
            return result;
        };

        return {
            _each: _each,
            judge: judge
        }
    })());


    /* 扩展Array，增加forEach和filter方法 */

    //可抛出$break退出循环
    Array.prototype.forEach = function (fn, context) {
        var scope = context || window;
        try {
            for (var i = 0, j = this.length; i < j; ++i) {
                fn.call(scope, this[i], i, this);
            }
        }
        catch (e) {
            if (e != $break) throw e;
        }
    };

    Array.prototype.filter = function (fn, context) {
        var scope = context || window;
        var a = [];
        for (var i = 0, j = this.length; i < j; ++i) {
            if (!fn.call(scope, this[i], i, this)) {
                continue;
            }
            a.push(this[i]);
        }
        return a;
    };

    //筛选出的元素包括序号
    Array.prototype.filterWithIndex = function (fn, context) {
        var scope = context || window;
        var a = [];
        for (var i = 0, j = this.length; i < j; ++i) {
            if (!fn.call(scope, this[i], i, this)) {
                continue;
            }
            a.push([i, this[i]]);
        }
        return a;
    };

    //如果数组中不存在该元素，则push到数组末尾；否则不加入。
    //即不加入重复项。
    //obj为单个元素。
    //该方法参数只能有一个。
    Array.prototype.pushNoRepeat = function (obj) {
        if (!this.contain(function (value, index) {
            if (value === obj) {
                return true;
            }
            else {
                return false;
            }
        })) {
            this.push(obj);
        }
    };

    Array.prototype.remove = function (func, obj) {
        var self = this;
        var index = this.indexOf(function (e, index) {
            if (func.call(self, e, obj)) {
                return index;
            }
            return false;
        });

        if (index !== -1) {
            this.splice(index, 1);
        }
    };

    /*****************************************************************************************************************************/
})();
