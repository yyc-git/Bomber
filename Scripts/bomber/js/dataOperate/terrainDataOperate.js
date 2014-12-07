(function () {
    var terrainDataOperate = {
        getTerrainData: function () {
            return YYC.Tool.array.clone(window.terrainData);
        },
        setTerrainData: function (x, y, data) {
            window.terrainData[y][x] = data;
        }
    };

    window.terrainDataOperate = terrainDataOperate;
}());