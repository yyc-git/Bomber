(function () {


    var Bitmap = YYC.Class({
        Init: function (data) {
            this.img = data.img;
            this.width = data.width;
            this.height = data.height;
        },
        Private: {
        },
        Public: {
            img: null,
            width: 0,
            height: 0
        }
    });

    window.Bitmap = Bitmap;
}());

