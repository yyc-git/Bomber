describe("Hash.js", function () {
    var hash = null;

    //因为Hash为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance() {
        var T = YYC.Class(Hash, {});

        return new T();
    };

    beforeEach(function () {
        hash = getInstance();
    });
    afterEach(function () {
    });

    describe("getChilds", function () {
        it("获得容器", function () {
            hash.add("a1", 1);
            var childs = hash.getChilds();

            expect(childs).toBeSameArray(hash._childs);
            expect(childs.a1).toEqual(1);
        });
    });

    describe("getValue", function () {
        it("根据key获得value", function () {
            hash._childs = {"a1": 1};
            var value = hash.getValue("a1");

            expect(value).toEqual(1);
        });
    });

    describe("add", function () {
        it("加入到容器中，参数为：key，value", function () {
            var value1 = null,
                value2 = null;

            hash.add("a1", "1").add("a2", 2);
            value1 = hash.getValue("a1");
            value2 = hash.getValue("a2");

            expect([value1, value2]).toEqual(["1", 2]);
        });
        it("如果容器中已有键为key的值了，则覆盖该key", function () {
            var value1 = null;

            hash.add("a1", "1");
            hash.add("a1", 2);
            value = hash.getValue("a1");

            expect(value).toEqual(2);
        });
    });
});