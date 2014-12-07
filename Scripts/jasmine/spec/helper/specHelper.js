beforeEach(function () {
    this.addMatchers({
        toBeFunction: function () {
            return Object.prototype.toString.call(this.actual, null) === "[object Function]";
        },
        toBeString: function () {
            return Object.prototype.toString.call(this.actual, null) === "[object String]";
        },
        toBeArray: function () {
            return Object.prototype.toString.call(this.actual, null) === "[object Array]";
        },
        toBeNumber: function () {
            return Object.prototype.toString.call(this.actual, null) === "[object Number]";
        },
        toBeSame: function (expected) {
            return this.actual === expected;
        },
        //判断是否为jQuery对象
        toBejQuery: function () {
            if (!jQuery) {
                throw new Error("jQuery未定义！");
            }

            return this.actual instanceof jQuery;
        },
        //判断是否为canvas对象
        toBeCanvas: function () {
            return Object.prototype.toString.call(this.actual) === "[object HTMLCanvasElement]";
        },
        toBeInstanceOf: function (expected) {
            return this.actual instanceof expected;
        },
        //判断是否为同一个数组（引用同一个数组）
        toBeSameArray: function (expected) {
            return this.actual === expected;
        },
        toBeExist: function () {
            return this.actual !== undefined && this.actual !== null;
        },
        //jasmine的原生方法toBeFalsy有问题：
        //expect(undefined).toBeFalsy();    //通过！
        //所以用我的方法覆盖原方法。
        toBeFalsy: function () {
            return this.actual === false;
        }
    });
});
