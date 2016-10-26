'use strict';

var options = {
    epsg: "EPSG:4326",
    bounds: [23.7767658233643, 38.0244979858398, 23.779, 38.04],
    units: 'degrees',
    zoom:10
};

// map initializing
gsc.map.create('map', options);



// Selectors for editing popup overlay
var container = $('#popup');
var content = $('#popup-content');
var closer = $('#popup-closer');


var url = 'http://hub.geosmartcity.eu/geoserver/gsc/ows';

var sourceWFS = new ol.source.Vector({
        format: new ol.format.GeoJSON({
			defaultDataProjection: ol.proj.get('EPSG:4326')
		}),
        url: function(extent) {
          return 'http://hub.geosmartcity.eu/geoserver/gsc/ows?service=WFS&' +
              'version=1.1.0&request=GetFeature&typename=marousi&' +
              'outputFormat=application/json&srsname=EPSG:4326&' +
              'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox,
		projection: 'EPSG:4326'
      });


var layerWFS = new ol.layer.Vector({
    source: sourceWFS
});






var marousi = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/gsc/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'gsc:marousi',
            STYLES: ''
        }
    })
});

var osm =  new ol.layer.Tile({
            source: new ol.source.OSM()
          });

gsc.map.addLayer(osm);









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


gsc.map.addLayer(marousi);

//gsc.map.addLayer(layerWFS);

//gsc.editFeatures.create(container, content, closer, '#mdl-button', gsc.map.olMap, url);
//gsc.editFeatures.addLayer(layerWFS);

gsc.map.addMousePositionControl('coordinate');

gsc.map.addScaleBarControl('scalebar');


$('#updateFilterButton').on('click', function () {
    gsc.map.filterOnAttributes($('#filterType').val(), $('#filter').val())
});



$('#resetFilterButton').on('click', function () {
    gsc.map.resetFilter('cql', '')
});

//gsc.map.addInfoOnFeatureEvent('nodelist', 50, marousi);



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
        gsc.user.register(email, username, password, confirmpassword, [{ 'organization': organization }])
            .then(function (res) {
                var userId = res.id;
                console.log(res.description);
                console.log(userId);
            })
    });
});


// add info on feature functionality
//gsc.map.addInfoOnFeatureEvent('nodelist', 50, navarre_cadaster);
var comment=gsc.GeoComment({
	map:gsc.map,
	container:".botonera",
	layer:marousi,
	url:"service/"});
/*gsc.map.addInfoOnFeatureEvent('nodelist', 50, navarre_cadaster,function(capas){
	comment.show();
});*/

 $(document).ready(function(){
var val = "";
     $("#submit").click(function(event){
	 
         event.preventDefault();
         var address = $('#address').val();

         $.ajax({
             type: "GET",
             data: {address:address},
             dataType:"json",
             url:  "http://hub.geosmartcity.eu/MarousiGeocoderServer/geo/RestService/getaddress",
             //url: "http://localhost:8080/MarousiGeocoderServer/geo/RestService/getaddress",
             success: function(results) {
                 //console.log("response:" + results);
                 $("#data").html('');
                 var items = [];
                var pointFeatures =[];
                 
                 $.each( results, function( object, value ) {
                	 
                	 var point;
                	 var name;
                	 var coor;
                	 var lon;
                	 var lat;
                	 $.each(value, function(key, val)
                       {  
                		if(key=='geometry')
                			 {
                			 	var json = $.parseJSON(val); 
                			 	lon = json.coordinates[0];
           			         	lat = json.coordinates[1];
                			 	items.push([lon,lat]);
                			 }
                		if(key=='address')
                			{
                				name = val;
                			}
                       });
                	pointFeatures.push([[lon,lat], name]);
                 });
                 var iconFeatures=[];
                 for(var i=0; i<pointFeatures.length; i++)
				 {
					var iconFeature = new ol.Feature({
					   geometry: new ol.geom.Point(ol.proj.transform(pointFeatures[i][0], 'EPSG:4326',     
					   'EPSG:3857')),
					   address: pointFeatures[i][1]
					 });
					 iconFeatures.push(iconFeature);
				 }
				 
				 
				 
				 var vectorSource = new ol.source.Vector({
				   features: iconFeatures //add an array of features
				 });

				 var iconStyle = new ol.style.Style({
				   image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
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
                 var test = ol.proj.transform([items[0][0], items[0][1]],'EPSG:4326', 'EPSG:3857');
                
                 
                 
                 
                 
                 
             },
             error: function(jqXHR, textStatus, errorThrown) {
                 alert(' Error in processing! '+textStatus);
             }
         });
     });
 });
