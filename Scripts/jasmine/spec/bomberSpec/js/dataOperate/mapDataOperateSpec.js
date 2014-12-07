describe("mapDataOperate.js", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });

    describe("getMapData", function () {
        it("返回值为mapData的副本", function () {
            var data = mapDataOperate.getMapData();

            expect(data).not.toBeSameArray(mapData);
            expect(data).toEqual(mapData);
        });
    });
});