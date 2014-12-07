(function () {
    var Hash = YYC.AClass({
        Private: {
            //容器
            _childs: {}
        },
        Public: {
            getChilds: function () {
                return this._childs;
            },
            getValue: function (key) {
                return this._childs[key];
            },
            add: function (key, value) {
                this._childs[key] = value;
                return this;
            }
        }
    });

    window.Hash = Hash;
}());