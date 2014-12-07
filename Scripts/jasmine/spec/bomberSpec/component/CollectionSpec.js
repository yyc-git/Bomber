describe("Collection.js", function () {
    var collection = null;

    //因为Collection为抽象类，因此不能直接实例化，而是通过获得子类的实例。
    function getInstance() {
        var T = YYC.Class(Collection, {});

        return new T();
    };

    beforeEach(function () {
        collection = getInstance();
    });
    afterEach(function () {
    });

    describe("getChilds", function () {
        it("获得容器的副本", function () {
            var childs = collection.getChilds();

            expect(childs).not.toBeSameArray(collection._childs);
        });
    });

    describe("getChildAt", function () {
        it("获得容器指定位置的数据", function () {
            collection._childs = [1, 2];
            var child = collection.getChildAt(1);

            expect(child).toEqual(2);
        });
    });

    describe("appendChild", function () {
        it("插入到容器的末尾", function () {
            var childs = null;

            collection.appendChild(1).appendChild(2);

            childs = collection.getChilds();

            expect(childs).toEqual([1, 2]);
        });
    });

    describe("appendChilds", function () {
        it("批量加入元素", function () {
            var fakeElement = [1, 2];

            collection.appendChilds(fakeElement);

            expect(collection.getChilds()).toEqual(fakeElement);
        });
    });

    describe("remove", function () {
        it("删除容器中调用func返回true的元素。", function () {
            var child = {
                x: 1,
                y: 1
            };
            collection.appendChild(child);

            collection.remove(function (e, obj) {
                if (e.x === obj.x && e.y === obj.y) {
                    return true;
                }
                return false;
            }, {
                x: 1,
                y: 1
            });

            expect(collection.getChilds().length).toEqual(0);
        });
    });

    describe("removeAll", function () {
        it("清空容器", function () {
            collection.appendChild(1).appendChild(2);

            collection.removeAll();

            expect(collection.getChilds().length).toEqual(0);
        });
    });

    describe("hasNext", function () {
        it("没有到达尾部，则返回true", function () {
            collection.appendChild(1);

            expect(collection.hasNext()).toBeTruthy();
        });
        it("已经到达尾部，则返回false", function () {
            expect(collection.hasNext()).toBeFalsy();
        });
    });

    describe("next", function () {
        it("没有到达尾部，则返回下一个元素,并且游标指向下一个元素", function () {
            collection.appendChild(1);

            expect(collection.next()).toEqual(1);
            expect(collection.hasNext()).toBeFalsy();
        });
        it("已经到达尾部，则返回null", function () {
            expect(collection.next()).toBeNull();
        });
    });

    describe("resetCursor", function () {
        it("重置游标为0", function () {
            collection.appendChild(1);

            collection.next();
            collection.resetCursor();

            expect(collection.hasNext()).toBeTruthy();
        });
    });
});