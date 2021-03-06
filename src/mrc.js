'use strict';

var options = {
    epsg: "EPSG:4326",
    bounds: [23.7767658233643, 38.0244979858398, 23.779, 38.04],
    units: 'degrees',
    zoom: 10
};

var map;

// map initializing
gsc.map.create('map', options);

var interactions = [
    new ol.interaction.MouseWheelZoom(),
    new ol.interaction.DragPan()
];

gsc.map.interactions = interactions;


map = gsc.map.olMap;



// Selectors for editing popup overlay
var container = $('#popup');
var content = $('#popup-content');
var closer = $('#popup-closer');



//WFS layer
var url = 'http://hub.geosmartcity.eu/geoserver/gsc/ows';
var layerWFS = new ol.layer.Vector({
    title: 'Buildings-WFS',
    type: 'overlay',
    combine: true,
    visible: false,
    source: new ol.source.Vector({
        format: new ol.format.GeoJSON({
            defaultDataProjection: ol.proj.get('EPSG:4326')
        }),
        url: function (extent) {
            return 'http://hub.geosmartcity.eu/geoserver/gsc/ows?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=marousi&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox,
        projection: 'EPSG:4326'
    })
});

//WMS marousi
var marousi_complete_status = new ol.layer.Image({
    title: 'Buildings Completed Status',
    type: 'overlay',
    combine: true,
    visible: true,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/gsc/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'gsc:marousi',
            STYLES: 'complete_status'

        }
    })
});

var marousi_AgeOfConstruction = new ol.layer.Image({
    title: 'Buildings Age of Construction',
    type: 'overlay',
    combine: true,
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/gsc/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'gsc:marousi',
            STYLES: 'bdgAgeOfConstruction'

        }
    })
});


var marousi_Use = new ol.layer.Image({
    title: 'Buildings Age of Construction',
    type: 'overlay',
    combine: true,
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/gsc/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'gsc:marousi',
            STYLES: 'bdgUse'

        }
    })
});


var marousi_Height = new ol.layer.Image({
    title: 'Buildings Height',
    type: 'overlay',
    combine: true,
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/gsc/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'gsc:marousi',
            STYLES: 'bdgHeight'

        }
    })
});



var wps_source = new ol.source.Vector({
    url: 'data/marousi_wps.geojson',
    format: new ol.format.GeoJSON({
        defaultDataProjection: 'EPSG:4326',
        projection: 'EPSG:3857'
    })
});

/*
<30 #006600
31 - 60 #00ff80
61 -120 #b2ffd8
121- 180  #ffff00
181 - 220 #ff8000
221-270 #ff9999
>270 #ff0000 
*/

var customEpiStyleFunction = function (feature) {
    var fillcolor;
    if (feature.get('epi') < 30) {
        fillcolor = '#006600';
    } else if (feature.get('epi') >= 30 && feature.get('epi') < 60) {
        fillcolor = '#00ff80';
    } else if (feature.get('epi') >= 60 && feature.get('epi') < 120) {
        fillcolor = '#b2ffd8';
    } else if (feature.get('epi') >= 120 && feature.get('epi') < 180) {
        fillcolor = '#ffff00';
    } else if (feature.get('epi') >= 180 && feature.get('epi') < 220) {
        fillcolor = '#ff8000';
    } else if (feature.get('epi') >= 220 && feature.get('epi') < 270) {
        fillcolor = '#ff9999';
    } else if (feature.get('epi') >= 270) {
        fillcolor = '#ff0000';
    }
    return [new ol.style.Style({

        fill: new ol.style.Fill({
            color: fillcolor
        }),
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
        })
    })];
};



var customEpeStyleFunction = function (feature) {
    var fillcolor;
    if (feature.get('epe') < 30) {
        fillcolor = '#006600';
    } else if (feature.get('epe') >= 30 && feature.get('epi') < 60) {
        fillcolor = '#00ff80';
    } else if (feature.get('epe') >= 60 && feature.get('epi') < 120) {
        fillcolor = '#b2ffd8';
    } else if (feature.get('epe') >= 120 && feature.get('epi') < 180) {
        fillcolor = '#ffff00';
    } else if (feature.get('epe') >= 180 && feature.get('epi') < 220) {
        fillcolor = '#ff8000';
    } else if (feature.get('epi') >= 220 && feature.get('epi') < 270) {
        fillcolor = '#ff9999';
    } else if (feature.get('epe') >= 270) {
        fillcolor = '#ff0000';
    }
    return [new ol.style.Style({

        fill: new ol.style.Fill({
            color: fillcolor
        }),
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
        })
    })];
};



var epe = new ol.layer.Vector({
    title: 'energy performance in summer',
    source: wps_source,
    name: 'energy performance in summer',
    visible: true,
    style: customEpeStyleFunction
});


var epi = new ol.layer.Vector({
    title: 'energy performance in winter',
    source: wps_source,
    name: 'energy performance in winter',
    visible: false,
    style: customEpiStyleFunction
});


var hoverInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    layers: [epe, epi] //Setting layers to be hovered
});

var container2 = document.getElementById('popup2');
var content2 = document.getElementById('popup-content2');
var closer2 = document.getElementById('popup-closer2');




var overlay = new ol.Overlay({
    element: container2,
    autoPan: false,
    autoPanAnimation: {
        duration: 250
    }
});
closer2.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
map.addOverlay(overlay);

map.addInteraction(hoverInteraction);
hoverInteraction.on('select', function (e) {
    var coordinate = e.mapBrowserEvent.coordinate;
    var text = '<ul>';
    var features = e.target.getFeatures();
    var feature = features.item(0);
    if (feature) {
        var atts = feature.getProperties();
        var keys = feature.getKeys();
        for (var property in atts) {
            if (atts.hasOwnProperty(property) != 'geometry') {
                if (property !== 'geometry') {
                    text += '<li>' + property + ': ' + atts[property] + '</li>';
                }
            }
        }
    }
    text += '</ul>'
    content2.innerHTML = text;
    overlay.setPosition(coordinate);

});







var basemapLayers = new ol.layer.Group({
    'title': 'Base maps',
    layers: [
        new ol.layer.Tile({
            title: 'Satellite and labels',
            type: 'base',
            combine: true,
            visible: false,
            source: new ol.source.BingMaps({
                // Get your own key at https://www.bingmapsportal.com/
                key: 'Ahd_32h3fT3C7xFHrqhpKzoixGJGHvOlcvXWy6k2RRYARRsrfu7KDctzDT2ei9xB',
                imagerySet: 'Aerial'
            })
        }), new ol.layer.Image({
            title: 'WMS ktimatologio',
            type: 'base',
            combine: true,
            visible: false,
            source: new ol.source.ImageWMS({
                ratio: 1,
                url: 'http://tiles.geodata.gov.gr/service',
                params: {
                    'FORMAT': 'image/png',
                    STYLES: '',
                    layers: "ktimatologio",
                    exceptions: "application/vnd.ogc.se_inimage",
                    'VERSION': '1.1.1',
                }
            })
        }),
        new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })

    ]
});
gsc.map.addLayer(basemapLayers);


var overlaygroupLayers = new ol.layer.Group({
    title: 'Overlays',
    layers: [
        marousi_complete_status,
        marousi_AgeOfConstruction,
        marousi_Use,
        marousi_Height,
        layerWFS,
        epe,
        epi
    ]
});

gsc.map.addLayer(overlaygroupLayers);









//Edit WFS attributes
var formatGML = new ol.format.GML({
    featureNS: 'featureNS',
    featureType: 'featureType',
    srsName: 'EPSG:4326'
});
gsc.editFeatures.create(container, content, closer, '#mdl-button', map, url);
gsc.editFeatures.addLayer(layerWFS, formatGML);


//added MousePosition control
gsc.map.addMousePositionControl('coordinate');
//added ScaleBar control
gsc.map.addScaleBarControl('scalebar');

//Layer Switcher
var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Layer Switcher' // Optional label for button
});
gsc.map.olMap.addControl(layerSwitcher);



// WMS filter
function setInfo() {
    var filterType = document.getElementById('filterType').value;
    if (filterType == "cql") {
        document.getElementById('filter').placeholder = "date = 2134|4113";
    }
    if (filterType == "ogc") {
        document.getElementById('filter').placeholder = "For example: <PropertyIsEqualTo><PropertyName>height_val</PropertyName><Literal>123.0</Literal></PropertyIsEqualTo>";
    }
    if (filterType == "fid") {
        document.getElementById('filter').placeholder = "For example: marousi.Maroussi_4081";
    }
}
$('#updateFilterButton').on('click', function () {
    gsc.map.filterOnAttributes($('#filterType').val(), $('#filter').val())
});
$('#resetFilterButton').on('click', function () {
    gsc.map.resetFilter('cql', '')
});
//gsc.map.addInfoOnFeatureEvent('nodelist', 50, marousi);


//Get Address module
$(function () {
    var val = "";
    $("#submit").click(function (event) {

        event.preventDefault();
        var address = $('#address').val();

        $.ajax({
            type: "GET",
            data: {
                address: address
            },

            crossDomain: "true",
            url: "http://hub.geosmartcity.eu/MarousiGeocoderServer/geo/RestService/getaddress",
            //url: "http://localhost:8080/MarousiGeocoderServer/geo/RestService/getaddress",
            success: function (results) {
                console.log("response:" + results);
                $("#data").html('');
                var items = [];
                var pointFeatures = [];

                $.each(results, function (object, value) {

                    var point;
                    var name;
                    var coor;
                    var lon;
                    var lat;
                    $.each(value, function (key, val) {
                        if (key == 'geometry') {
                            var json = $.parseJSON(val);
                            lon = json.coordinates[0];
                            lat = json.coordinates[1];
                            items.push([lon, lat]);
                        }
                        if (key == 'address') {
                            name = val;
                        }
                    });
                    pointFeatures.push([
                        [lon, lat], name
                    ]);
                });
                var iconFeatures = [];
                for (var i = 0; i < pointFeatures.length; i++) {
                    var iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point(pointFeatures[i][0]),
                        address: pointFeatures[i][1]
                    });
                    iconFeatures.push(iconFeature);
                }



                var vectorSource = new ol.source.Vector({
                    features: iconFeatures //add an array of features
                });

                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 0.75,
                        src: 'http://findicons.com/files/icons/1030/windows_7/32/pin.png'
                    }))
                });


                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: iconStyle
                });

                gsc.map.addLayer(vectorLayer);

                var lon = items[0];
                var lat = items[1];
                var test = ol.proj.transform([items[0][0], items[0][1]], 'EPSG:4326', 'EPSG:3857');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(' Error in processing! ' + textStatus);
            }
        });
    });
});

//registrtion Area
$(function () {
    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });


    $('#login-submit').click(function (e) {
        e.preventDefault();
        var username = $('#login-username').value;
        var password = $('#login-password').value;
        gsc.user.login(username, password).then(function (res) {
            console.log(res.description);
        })
    });


    $('#register-form').click(function (e) {
        e.preventDefault();
        var email = $('#register-email').value;
        var username = $('#register-username').value;
        var password = $('#register-password').value;
        var confirmpassword = $('#register-confirm-password').value;
        var organization = $('#organization').value;
        gsc.user.register(email, username, password, confirmpassword, [{
                'organization': organization
            }])
            .then(function (res) {
                var userId = res.id;
                console.log(res.description);
                console.log(userId);
            })
    });
});




//Download WFS layer module
gsc.download.create(map, layerWFS);
$(function () {
    $('#btnDownload').click(function () {
        var yourSelect = document.getElementById('slcformat');
        var format = yourSelect.options[yourSelect.selectedIndex].value
        var result, contentType;
        if (format == "kml") {
            result = gsc.download.kml();
            contentType = 'application/vnd.google-earth.kml+xml';
            console.log(result);
        }
        if (format == "wkt") {
            result = gsc.download.wkt();
            contentType = 'text/plain';
        }
        if (format == "gpx") {
            result = gsc.download.gpx();
            contentType = 'text/plain';
        }
        if (format == "json") {
            result = gsc.download.json();
            contentType = 'text/javascript';
        }
        if (format == "gml") {
            result = gsc.download.gml(ol.format.GML);
            contentType = "application/gml+xml";
        }

        download(result, 'result.' + format, contentType);
    });
});







function applyMargins() {
    var leftToggler = $(".mini-submenu-left");
    if (leftToggler.is(":visible")) {
        $("#map .ol-zoom")
            .css("margin-left", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");
    } else {
        $("#map .ol-zoom")
            .css("margin-left", $(".sidebar-left").width())
            .removeClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
    }
}

function isConstrained() {
    return $(".sidebar").width() == $(window).width();
}

function applyInitialUIState() {
    if (isConstrained()) {
        $(".sidebar-left .sidebar-body").fadeOut('slide');
        $('.mini-submenu-left').fadeIn();
    }
}

$(function () {
    $('.sidebar-left .slide-submenu').on('click', function () {
        var thisEl = $(this);
        thisEl.closest('.sidebar-body').fadeOut('slide', function () {
            $('.mini-submenu-left').fadeIn();
            applyMargins();
        });
    });

    $('.mini-submenu-left').on('click', function () {
        var thisEl = $(this);
        $('.sidebar-left .sidebar-body').toggle('slide');
        thisEl.hide();
        applyMargins();
    });

    $(window).on("resize", applyMargins);


    applyInitialUIState();
    applyMargins();
});