(function () {
    var mapDataOperate = {
        getMapData: function () {
            return YYC.Tool.array.clone(window.mapData);
        },
        setMapData: function (x, y, data) {
            window.mapData[y][x] = data;
        }
    };

    window.mapDataOperate = mapDataOperate;
}());