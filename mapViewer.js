$(document).ready(function () {
    $.getJSON('result/pic_b_2.json', function (imgInfo) {
        var maxZoom = 18;
        var minZoom = maxZoom - imgInfo.maxZ + 1;
        var map = new BMap.Map('medimg');
        map.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_LARGE
        }));
        map.setMinZoom(minZoom);
        map.setMaxZoom(maxZoom);
        map.enableScrollWheelZoom();
        map.centerAndZoom(new BMap.Point(0, 0), minZoom);

        var tileLayer = new BMap.TileLayer();
        tileLayer.getTilesUrl = function (tileCoord, zoom) {
            var url = 'blank.png';
            var zl = maxZoom - zoom;
            if ((Math.abs(tileCoord.x + 0.5) <= imgInfo.width / Math.pow(2, zl) / 512 + 0.5) && (Math.abs(tileCoord.y + 0.5) <= imgInfo.height / Math.pow(2, zl) / 512 + 0.5)) {
                url = 'precut/pic_b_2' + '_' + zl + '_' + tileCoord.x + '_' + tileCoord.y + '.jpg';
            }
            return url;
        };

        map.addTileLayer(tileLayer);

        function showInfo(e) {
            $('#pos').html(e.point.lng + ", " + e.point.lat);
        }

        map.addEventListener("click", showInfo);
    });
});