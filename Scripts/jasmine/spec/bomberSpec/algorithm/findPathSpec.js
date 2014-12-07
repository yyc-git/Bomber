describe("findPath.js", function () {

    describe("A*改进算法测试aCompute", function () {

        describe("如果能寻找到路径", function () {
            it("返回的path为寻找的路径（二维数组），time为算法时间", function () {
                var fakeTerrainData = [
                        [0, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 1, 0],
                        [0, 0, 0, 0]
                    ],
                    begin = { x: 0, y: 0 },
                    end = { x: 2, y: 3 },
                    result = null;

                result = findPath.aCompute(fakeTerrainData, begin, end);

                expect(result.path).toEqual([
                    { x: 0, y: 1 },
                    { x: 0, y: 2 },
                    { x: 0, y: 3 },
                    { x: 1, y: 3 },
                    { x: 2, y: 3 }
                ]);
                expect(result.time).toBeNumber();

            });
        });

        describe("如果不能找到路径", function () {
        });

        describe("bug测试", function () {
        });
    });
});