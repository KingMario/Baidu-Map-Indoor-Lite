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

        var points = [
            {"lng": -0.003854, "lat": -0.00062, "count": 500},
            {"lng": -0.001141, "lat": -0.000547, "count": 924},
            {"lng": -0.004258, "lat": 0.002058, "count": 273},
            {"lng": -0.003845, "lat": -0.00062, "count": 365},
            {"lng": -0.002237, "lat": -0.00062, "count": 600},
            {"lng": -0.003854, "lat": 0.001379, "count": 460},
            {"lng": -0.000485, "lat": -0.0008, "count": 480},
            {"lng": -0.002138, "lat": 0.001388, "count": 800},
            {"lng": -0.00097, "lat": 0.000674, "count": 920},
            {"lng": 0.001752, "lat": -0.000222, "count": 920},
            {"lng": 0.000719, "lat": 0.001262, "count": 726},
            {"lng": 0.001536, "lat": 0.00128, "count": 432}];

        heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 100});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points, max: 1000});
    });
});