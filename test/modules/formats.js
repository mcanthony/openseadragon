(function() {

    // This module tests whether our various file formats can be opened.
    // TODO: Add more file formats (with corresponding test data).

    module('Formats', {
        setup: function () {
            var example = document.createElement("div");
            example.id = "example";
            document.getElementById("qunit-fixture").appendChild(example);
        }
    });

    var viewer = null;

    // ----------
    var testOpenUrl = function(relativeUrl) {
        testOpen('/test/data/' + relativeUrl);
    };

    var testOpen = function(tileSource) {
        $(document).ready(function() {
            var timeWatcher = Util.timeWatcher(7000);

            viewer = OpenSeadragon({
                id:            'example',
                prefixUrl:     '/build/openseadragon/images/',
                tileSources:   tileSource
            });

            ok(viewer, 'Viewer exists');

            var openHandler = function(event) {
                viewer.removeHandler('open', openHandler);
                ok(true, 'Open event was sent');
                viewer.addHandler('tile-drawn', tileDrawnHandler);
            };

            var tileDrawnHandler = function(event) {
                viewer.removeHandler('tile-drawn', tileDrawnHandler);
                ok(true, 'A tile has been drawn');
                viewer.addHandler('close', closeHandler);
                viewer.close();
            };

            var closeHandler = function(event) {
                viewer.removeHandler('close', closeHandler);
                $('#example').empty();
                ok(true, 'Close event was sent');
                timeWatcher.done();
            };

            viewer.addHandler('open', openHandler);
        });
    };

    // ----------
    asyncTest('DZI', function() {
        testOpenUrl('testpattern.dzi');
    });

    // ----------
    asyncTest('DZI JSONp', function() {
        testOpenUrl('testpattern.js');
    });

    // ----------
    asyncTest('DZI XML', function() {
        testOpenUrl('testpattern.xml');
    });

    // ----------
    asyncTest('DZI XML with query parameter', function() {
        testOpenUrl('testpattern.xml?param=value');
    });

     // ----------
    asyncTest('IIIF 1.0 JSON', function() {
        testOpenUrl('iiif_1_0_files/info.json');
    });

    // ----------
    asyncTest('IIIF 1.0 XML', function() {
        testOpenUrl('iiif_1_0_files/info.xml');
    });

    // ----------
    asyncTest('IIIF 1.1 JSON', function() {
        testOpenUrl('iiif_1_1_tiled/info.json');
    });

    // ----------
    asyncTest('IIIF No Tiles, Less than 256', function() {
        testOpenUrl('iiif_1_1_no_tiles_255/info.json');
    });

    // ----------
    asyncTest('IIIF No Tiles, Bet. 256 and 512', function() {
        testOpenUrl('iiif_1_1_no_tiles_384/info.json');
    });

    // ----------
    asyncTest('IIIF No Tiles, Bet. 512 and 1024', function() {
        testOpenUrl('iiif_1_1_no_tiles_768/info.json');
    });

    // ----------
    asyncTest('IIIF No Tiles, Larger than 1024', function() {
        testOpenUrl('iiif_1_1_no_tiles_1048/info.json');
    });

    // ----------
    asyncTest('IIIF 2.0 JSON', function() {
        testOpenUrl('iiif_2_0_tiled/info.json');
    });

    // ----------
    asyncTest('IIIF 2.0 JSON String', function() {
        testOpen(
            '{' +
            '  "@context": "http://iiif.io/api/image/2/context.json",' +
            '  "@id": "http://localhost:8000/test/data/iiif_2_0_tiled",' +
            '  "protocol": "http://iiif.io/api/image",' +
            '  "height": 1024,' +
            '  "width": 775,' +
            '  "tiles" : [{"width":256, "scaleFactors":[1,2,4,8]}],' +
            '  "profile": ["http://iiif.io/api/image/2/level1.json",' +
            '    {' +
            '      "qualities": [' +
            '        "native",' +
            '        "bitonal",' +
            '        "grey",' +
            '        "color"' +
            '      ],' +
            '      "formats": [' +
            '        "jpg",' +
            '        "png",' +
            '        "gif"' +
            '      ]' +
            '    }' +
            '  ]' +
            '}');
    });

})();
