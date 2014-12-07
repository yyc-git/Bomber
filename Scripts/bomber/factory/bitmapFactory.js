(function () {


    var bitmapFactory = {
        createBitmap: function (data) {
            var bitmapData = YYC.Tool.extend.extend({
                width: data.img && data.img.width,
                height: data.img && data.img.height
            }, data);
            return new Bitmap(bitmapData);
        }
    }

    window.bitmapFactory = bitmapFactory;
}());

