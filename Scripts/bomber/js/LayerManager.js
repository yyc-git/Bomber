(function () {

    var LayerManager = YYC.Class(Hash, {
        Private: {
            __iterator: function (handler, args) {
                var args = Array.prototype.slice.call(arguments, 1),
                    i = null,
                    layers = this.getChilds();

                for (i in layers) {
                    if (layers.hasOwnProperty(i)) {
                        layers[i][handler].apply(layers[i], args);
                    }
                }
            },
            __getLayers: function () {
                return this.getChilds();
            }
        },
        Public: {
            addLayer: function (name, layer) {
                this.add(name, layer);
                return this;
            },
            getLayer: function (name) {
                return this.getValue(name);
            },
            addSprites: function (name, elements) {
                this.getLayer(name).addSprites(elements);
            },
            initLayer: function () {
                this.__iterator("setCanvas");
                this.__iterator("init", this.__getLayers());
            },
            run: function () {
                this.__iterator("run");
            },
            change: function () {
                this.__iterator("change");
            }
        }
    });

    window.LayerManager = LayerManager;
}());