/*! gsc - v0.1.9 - 2016-09-06
 * https://github.com/GeoSmartCity-CIP/gsc-client
 * Copyright (c) 2016; Licensed  EUPL-1.1 */
'use strict';

/**
 * @namespace gsc
 */
var gsc = (function () {

  /**
   * Version number
   *
   * @type {String}
   * @private
   * @requires OpenLayers-3.13.1
   */
  var _version = '0.1.0';

  /**
   * URL of the GSC Datacatalog instance the API is working against
   * @type {String}
   * @private
   */
  var _dcUrl = 'http://hub.geosmartcity.eu/' +
    'gsc-datacatalogue/datacatalogservlet';

  /**
   * URL of the GSC Upload Features API
   * @type {String}
   * @private
   */
  var _uploadUrl = 'http://hub.geosmartcity.eu/building/';

  /**
   * 'gsc' is the root object of the gsc.js library and the only variable to
   * be introduced into the global namespace.
   *
   * @exports gsc
   * @memberof gsc
   */
  var mod = {};

  /**
   * Version number of the s4a.js library
   * @type {Number}
   */
  mod.version = _version;

  /**
   * Get or set GSC Datacatalog URL. If a parameter is supplied,
   * it is assumed to be a valid URL to the web service end-point of
   * a GSC Datacatalogue instance.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [dcUrl] URL to working instance of GSC Datacatalogue
   * @return {String} URL of GSC Datacatalogue instance web service end-point
   */
  mod.dcUrl = function (dcUrl) {
    if (dcUrl !== undefined) {
      _dcUrl = dcUrl;
    }
    return _dcUrl;
  };

  /**
   * Get or set GSC Upload feature URL. If a parameter is supplied,
   * it is assumed to be a valid URL to the upload feature API.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [uploadUrl] URL to upload feature API
   * @return {String} URL of upload feature API
   */
  mod.uploadUrl = function (uploadUrl) {
    if (uploadUrl !== undefined) {
      _uploadUrl = uploadUrl;
    }
    return _uploadUrl;
  };

  /**
   * Execute a HTTP post request and return the resulting promise
   *
   * @param {String} actionName Name of action to invoke
   * @param {Object} requestData  A JSON object with the parameters to send to the web service
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.doPost = function (actionName,
    requestData) {
    return $.post(gsc.dcUrl(), {
      actionName: actionName,
      request: JSON.stringify(requestData)
    }, null, 'json');
  };

  return mod;

}());

'use strict';

gsc.cs = (function () {
  /**
   *
   * @exports gsc/cs
   */
  var mod = {};

  mod._csUrl = 'http://geo.mapshakers.com:8080/CrowdSourcing';

  /**
   * Get or set GSC CrowdSourcing URL. If a parameter is supplied,.
   *
   * If no parameter is provided, the function will return the currently
   * configured URL.
   *
   * @param {String} [csUrl] URL to working instance of GSC CrowdSourcing Servlet
   * @return {String} URL of GSC CrowdSourcing instance web service end-point
   */
  mod.csUrl = function (csUrl) {
    if (csUrl !== undefined) {
      mod._csUrl = csUrl;
    }
    return mod._csUrl;
  };

  /**
   * Receive a config file
   *
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.getConfig = function () {
    return this.doPost_('/config', null);
  };

  /**
   * Login to cs API
   *
   * @param {JSON} data (Username and Password)
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.login = function (data) {
    return this.doPost_('/login', data);
  };

  /**
   * Create a comment
   *
   * @param {JSON} data The JSON data object
   * @param {String} uuid Identification string of event
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventComment = function (data, uuid) {
    return this.doPost_('/event/comment/' + uuid, data);
  };

  /**
   * Update an event
   *
   * @param {JSON} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventUpdate = function (data) {
    return this.doPost_('/event/change', data);
  };

  /**
   * Create an event
   *
   * @param {FormData} formdata The FormData object (JSON + attachment)
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventCreate = function (formdata) {
    return this.doPostFormData_('/event/create', formdata);
  };

  /**
   * Filter list
   **
   * @param {JSON} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   */
  mod.eventListFilter = function (data) {
    return this.doPost_('/event/list', data);
  };

  /**
   * send POST requests
   *
   * @private
   * @param {String} urlPart - Service url.
   * @param {Object} data The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   *
   */
  mod.doPost_ = function (urlPart, data) {
    return $.ajax({
      url: mod._csUrl + '/' + urlPart,
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json'
    });
  };

  /**
   * send POST formdata requests
   *
   * @private
   * @param {String} urlPart - Service url.
   * @param {FormData} formData The JSON data object
   * @return {Promise.<Object>} a jQuery promise object
   *
   */
  mod.doPostFormData_ = function (urlPart, formData) {
    return $.ajax({
      url: mod._csUrl + '/' + urlPart,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    });
  };

  return mod;

}());

'use strict';

gsc.dataset = (function () {
  /**
   * @exports gsc/dataset
   */
  var mod = {};

  /**
   * Delete a data source
   *
   * @param {Number} dataSetId - Id of dataset
   * @return {Promise} Response
   */
  mod.delete = function (dataSetId) {

    return gsc.doPost('deletedataset', {
      iddataset: dataSetId
    });

  };

  /**
   * List/search for data sets
   *
   * @param {Number} [dataSourceId] - Id of data source to retrieve data sets for
   * @param {Number} [dataSetId] - Id of data set to retrieve
   * @param {String} [dataSetName] - Name or part of data set name to search for
   * @return {Promise} Data set response
   */
  mod.list = function (dataSourceId,
    dataSetId,
    dataSetName) {

    var params = {};

    if (dataSourceId !== undefined) {
      params.iddatasource = dataSourceId;
    }

    if (dataSetId !== undefined) {
      params.iddataset = dataSetId;
    }

    if (dataSetName !== undefined) {
      params.datasetname = dataSetName;
    }

    return gsc.doPost('listdataset', params);

  };

  /**
   * Create a new data set
   *
   * @param {String} dataSetName - Name of data set
   * @param {String} realName - Real name, i.e. file name of data set
   * @param {Number} dataSourceId - Id of data source that data set is based on
   * @param {String} description - Description of data set
   * @param {Boolean} [toBeIngested=false] - To be ingested
   * @param {Number} [refreshInterval=-1] - Refresh interval in minutes
   * @param {String} [url=null] - URL
   * @return {Promise.<Object>} Data set response
   */
  mod.create = function (dataSetName,
    realName,
    dataSourceId,
    description,
    toBeIngested,
    refreshInterval,
    url
  ) {
    if (toBeIngested === undefined) {
      toBeIngested = false;
    }

    if (refreshInterval === undefined) {
      refreshInterval = -1;
    }

    if (url === undefined) {
      url = '';
    }

    var params = {
      datasetname: dataSetName,
      realname: realName,
      iddatasource: dataSourceId,
      description: description,
      tobeingested: toBeIngested,
      refreshinterval: refreshInterval,
      url: url
    };

    return gsc.doPost('createdataset', params);

  };

  /**
   * Update a data set
   *
   * @param {Number} dataSetId - Id of data set to update
   * @param {String} dataSetName - Name of data set
   * @param {String} realName - Real name of data set
   * @param {Number} dataSourceId - Data source the data set is based on
   * @param {String} description - Description of data set
   * @param {Boolean} [toBeIngested=false] - Flag indicating whether data set is to be ingested
   * @param {Number} [refreshInterval=-1] - Refresh interval in minutes
   * @param {String} [url=null] - URL
   * @return {Promise.<Object>} Update data set response
   */
  mod.update = function (
    dataSetId,
    dataSetName,
    realName,
    dataSourceId,
    description,
    toBeIngested,
    refreshInterval,
    url
  ) {

    if (toBeIngested === undefined) {
      toBeIngested = false;
    }

    if (refreshInterval === undefined) {
      refreshInterval = -1;
    }

    if (url === undefined) {
      url = '';
    }

    var params = {
      iddataset: dataSetId,
      datasetname: dataSetName,
      realname: realName,
      iddatasource: dataSourceId,
      description: description,
      tobeingested: toBeIngested,
      refreshinterval: refreshInterval,
      url: url
    };

    return gsc.doPost('updatedataset', params);

  };

  /**
   * List columns of data set
   *
   * @param {Number} dataSetId - Identifier of dataset
   * @return {Promise.<Object>} Data set response
   */
  mod.listCols = function (dataSetId) {
    return gsc.doPost('listcols', {
      iddataset: dataSetId
    });
  };

  /**
   * Update column metadata
   *
   * @param {Number} dataSetId - Identifier of data set to update column metadata for
   * @param {Object[]} columnList - List of column objects
   * @returns {Promise.<Object>}
   */
  mod.updateCols = function (dataSetId, columnList) {
    return gsc.doPost('updcolsmetadata', {
      iddataset: dataSetId,
      columns: columnList
    });
  };

  mod.createCron = function (dataSetId) {
    return gsc.doPost('createcron', {});
  };

  return mod;
}());

'use strict';

gsc.datasource = (function () {

  /**
   * @exports gsc/datasource
   */
  var mod = {};

  /**
   * Datasource type enumeration
   * @readonly
   * @enum {string}
   */
  mod.DatasourceType = {
    /**
     * Oracle database
     * @type {String}
     */
    ORACLE: 'Oracle',
    /**
     * ESRI Shapefile
     * @type {String}
     */
    SHAPE: 'Shape',
    /**
     * PostgreSQL+PostGIS database
     * @type {String}
     */
    POSTGIS: 'PostGIS'
  };

  /**
   * Datasource object
   *
   * @property {string} datasourcename - Indicates whether the Courage component is present.
   * @property {number} organization - Indicates whether the Power component is present.
   * @property {gsc.datasource.DatasourceType} type - Indicates whether the Wisdom component is present.
   * @property {string} description - A description of the data source
   * @property {string} updated - Time and date when the source was updated
   * @property {string} [url] - URL of remote datasource
   * @property {string} [username] - Username for database
   * @property {string} [password] - Password for database
   * @property {string} [ipaddress] - IP address of local database connection
   * @property {number} [port] - Port number of database connection
   * @property {string} [path] - Path to local datasource directory, name of database
   * @class
   */
  mod.Datasource = function () {

  };

  /**
   * Create datasource
   *
   * @param {String} datasourcename [description]
   * @param {String} organization [description]
   * @param {gsc.datasource.DatasourceType} type [description]
   * @param {String} description [description]
   * @param {String} updated [description]
   * @param {String} url [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} ipaddress [description]
   * @param {String} schema [description]
   * @param {String} port [description]
   * @param {String} path [description]
   * @return {Promise.<gsc.datasource.DataSource>} [description]
   * @public
   */
  mod.create = function (datasourcename,
    organization,
    type,
    description,
    updated,
    url,
    username,
    password,
    ipaddress,
    schema,
    port,
    path) {

    return gsc.doPost('createdatasrc', {
      datasourcename: datasourcename,
      organization: organization,
      type: type,
      description: description,
      updated: updated,
      url: url,
      username: username,
      password: password,
      ipaddress: ipaddress,
      schema: schema,
      port: port,
      path: path
    });

  };

  /**
   * List datasources - one of datasourceId or organization must be specified.
   * Organization may be combined with (partial) datasourceName queries
   *
   * @param {Number} [datasourceId=null] Identifier of datasource to be retrieved
   * @param {Number} [organization=null] Whether to include details
   * @param {String} [datasourceName=null] Name or partial name of datasource
   * @param {Boolean} [includeDetail=false] Whether to include details
   * @return {Promise.<Object>} A list of datasource objects
   */
  mod.list = function (
    datasourceId,
    organization,
    datasourceName,
    includeDetail) {

    var params = {};

    if (includeDetail === undefined) {
      includeDetail = false;
    }

    params.detail = includeDetail;

    if (!gsc.util.isNull(datasourceId)) {
      params.iddatasource = datasourceId;
    }

    if (!gsc.util.isNull(datasourceName)) {
      params.datasourcename = datasourceName;
    }

    if (!gsc.util.isNull(organization)) {
      params.organization = organization;
    }

    if (params.iddatasource === undefined &&
      params.organization === undefined) {
      return gsc.util.errorPromise(
        'Parameter datasourceId or organization must be present in request');
    }

    return gsc.doPost('listdatasrc', params);
  };

  /**
   * Delete datasource
   *
   * @param {number} datasourceId - Identifier of datasource to be deleted
   * @return {Promise.<Object>} The deleted datasource
   */
  mod.delete = function (datasourceId) {
    return gsc.doPost('deletedatasrc', {
      iddatasource: datasourceId
    });
  };

  /**
   * Update datasource
   *
   * @param {number} datasourceId [description]
   * @param {String} datasourcename [description]
   * @param {String} organization [description]
   * @param {gsc.datasource.DatasourceType} type [description]
   * @param {String} description [description]
   * @param {String} updated [description]
   * @param {String} url [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} ipaddress [description]
   * @param {String} schema [description]
   * @param {String} port [description]
   * @param {String} path [description]
   * @return {Promise.<Response>} [description]
   */
  mod.update = function (datasourceId,
    datasourcename,
    organization,
    type,
    description,
    updated,
    url,
    username,
    password,
    ipaddress,
    schema,
    port,
    path) {
    return gsc.doPost('updatedatasrc', {
      iddatasource: datasourceId,
      datasourcename: datasourcename,
      organization: organization,
      type: type,
      description: description,
      updated: updated,
      url: url,
      username: username,
      password: password,
      ipaddress: ipaddress,
      schema: schema,
      port: port,
      path: path
    });
  };

  /**
   * List data source origin?
   *
   * @param {number} datasourceId The id of the data source to list origin for
   * @return {Promise.<Response>} A response object
   */
  mod.listDataOrigin = function (datasourceId) {

    return gsc.doPost('listdataorigin', {
      iddatasource: datasourceId
    });

  };

  return mod;

}());

'use strict';

gsc.download = (function () {
  /**
   * @exports gsc/download
   */
  var mod = {};

  /** @type ol.Map */
  mod.olMap = null;

  /** @type ol.Layer */
  mod.layer = null;

  /** @type Array.<ol.Feature> */
  mod.selectedFeatures = null;

  /** @type ol.interaction.Select */
  mod.select = null;

  /** @type ol.interaction.DragBox */
  mod.dragBox = null;

  mod.create = function (map, layer) {
    mod.olMap = map;
    mod.layer = layer;
    mod.select = new ol.interaction.Select();
    mod.olMap.addInteraction(mod.select);
    mod.selectedFeatures = mod.select.getFeatures();
    mod.dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [0, 0, 255, 1]
        })
      })
    });
    mod.olMap.addInteraction(mod.dragBox);

    mod.dragBox.on('boxend', function () {
      var extent = mod.dragBox.getGeometry().getExtent();
      mod.layer.getSource().forEachFeatureIntersectingExtent(
        extent,
        function (feature) {
          mod.selectedFeatures.push(feature);
        });
    });

    mod.dragBox.on('boxstart', function () {
      mod.selectedFeatures.clear();
    });
    mod.olMap.on('click', function () {
      mod.selectedFeatures.clear();
    });
  };

  mod.addLayer = function (layer) {
    mod.removeLayer();
    mod.layer = layer;
  };

  mod.removeLayer = function () {
    mod.layer = null;
  };

  /**
   * @returns {string} .kml string
   */
  mod.kml = function () {
    var kml = new ol.format.KML();
    return kml.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @param {ol.format.GML} gml
   * @returns {string} .gml string
   */
  mod.gml = function (gml) {
    return gml.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @returns {string} .gpx string
   */
  mod.gpx = function () {
    var gpx = new ol.format.GPX();
    return gpx.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @returns {string} .json string
   */
  mod.json = function () {
    var json = new ol.format.GeoJSON();
    return json.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @returns {string} .wkt string
   */
  mod.wkt = function () {
    var wkt = new ol.format.WKT();
    return wkt.writeFeatures(mod.selectedFeatures.getArray());
  };

  return mod;
}());

// jscs:disable disallowTrailingWhitespace
'use strict';

gsc.editFeatures = (function () {
  /**
   * @exports gsc/editFeatures
   */
  var mod = {};

  /** @type divObject */
  mod.container = null;

  /** @type divObject */
  mod.content = null;

  /** @type aObject */
  mod.closer = null;

  /** Class of edit buttons */
  mod.buttonClass = null;

  /** @type ol.format.WFS */
  mod.formatWFS = null;

  /** @type ol.format.GML */
  mod.formatGML = null;

  /** @type ol.Layer */
  mod.layer = null;

  /** @type ol.Map */
  mod.olMap = null;

  /** Adress of WFS-T */
  mod.wfs = null;

  mod.selectedFeature = null;

  var attTitle = [];

  mod.editingFeature = {};

  mod.interaction = null;

  mod.popupContent = null;

  mod.overlay = null;

  mod.interactionSingleSelect = new ol.interaction.Select({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF2828'
      })
    }),
    toggleCondition: ol.events.condition.never
  });

  mod.interactionMultipleSelect = new ol.interaction.Select({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF2828'
      })
    })
  });

  mod.interactionSnap = null;

  mod.create = function (divContainer, divContent, aCloser,
    classButton, mapObject, wfs) {

    mod.container = divContainer;

    mod.content = divContent;

    mod.closer = aCloser;

    mod.buttonClass = classButton;

    mod.formatWFS = new ol.format.WFS();

    mod.olMap = mapObject;

    mod.wfs = wfs;

    /**
     * Create an overlay to anchor the popup to the map.
     */
    mod.overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
      element: mod.container.get(0),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    mod.olMap.addOverlay(mod.overlay);

    /**
     * Create an interaction to let select features at map by moving pointer.
     */
    mod.interactionMultipleSelectPointerMove = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove
    });

    mod.olMap.addInteraction(mod.interactionMultipleSelectPointerMove);

    /**
     * Add a click handler to hide the popup.
     *
     * @return {boolean} Don't follow the href.
     */
    mod.closer.click(function () {
      mod.overlay.setPosition(undefined);
      mod.closer.blur();
      return false;
    });
  };

  mod.addLayer = function (layer, gml) {
    mod.removeLayer();
    mod.layer = layer;
    mod.changeSnapLayer();
    mod.formatGML = gml;
  };

  mod.removeLayer = function () {
    mod.layer = null;
    mod.formatGML = null;
  };

  mod.changeSnapLayer = function () {
    mod.interactionSnap = new ol.interaction.Snap({
      pixelTolerance: 5,
      source: mod.layer.getSource()
    });
  };

  mod.transactWFS = function (mode, f) {
    var node;
    switch (mode) {
      case 'insert':
        node = mod.formatWFS.writeTransaction([f], null, null, mod.formatGML);
        break;
      case 'update':
        var sF = f.clone();
        sF.getGeometry().applyTransform(function (crd, crd2, std) {
          for (var i = 0; i < crd.length; i += std) {
            var y = crd[i];
            var x = crd[i + 1];
            crd[i] = x;
            crd[i + 1] = y;
          }
        });
        sF.setId(f.getId());
        node = mod.formatWFS.writeTransaction(null, [sF], null, mod.formatGML);
        break;
      case 'delete':
        node = mod.formatWFS.writeTransaction(null, null, [f], mod.formatGML);
        break;
    }
    var xs = new XMLSerializer();
    var payload = xs.serializeToString(node);
    $.ajax(mod.wfs, {
      type: 'POST',
      dataType: 'xml',
      processData: false,
      contentType: 'text/xml',
      data: payload
    }).done(function () {
      mod.layer.getSource().clear();
    });
  };

  $('button').click(function () {
    mod.olMap.removeInteraction(mod.interaction);
    mod.interactionMultipleSelect.getFeatures().clear();
    mod.interactionSingleSelect.getFeatures().clear();
    mod.olMap.removeInteraction(mod.interactionMultipleSelect);
    mod.olMap.removeInteraction(mod.interactionSingleSelect);

    switch ($(this).attr('id')) {

      case 'btnEdit':
        mod.olMap.addInteraction(mod.interactionMultipleSelect);
        mod.interaction = new ol.interaction.Modify({
          features: mod.interactionMultipleSelect.getFeatures()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.editingFeature = {};
        mod.interactionMultipleSelect.getFeatures().on('add', function (e) {
          e.element.on('change', function (e) {
            mod.editingFeature[e.target.getId()] = true;
          });
        });
        mod.interactionMultipleSelect.getFeatures().on('remove', function (e) {
          var f = e.element;
          if (mod.editingFeature[f.getId()]) {
            delete mod.editingFeature[f.getId()];
            var featureProperties = f.getProperties();
            delete featureProperties.boundedBy;
            var clone = new ol.Feature(featureProperties);
            clone.setId(f.getId());
            mod.transactWFS('update', clone);
          }
        });
        break;

      case 'btnEditAttributes':
        mod.olMap.addInteraction(mod.interactionSingleSelect);
        mod.interactionSingleSelect.on('select', function (evt) {
          if (evt.selected.length == 1) {
            mod.selectedFeature = evt.selected[0];
            mod.popupContent = '';
            attTitle = [];
            mod.popupContent = '<table id="feature" ' +
              'class="table table-bordered table-hover" ' +
              'style="clear: both"><tbody>';
            Object.getOwnPropertyNames(mod.selectedFeature.getProperties()).
            forEach(function (val, idx, array) {
              if (val != 'bbox' && val != 'geometry') {
                var i = 0;
                attTitle.push(val);
                mod.popupContent += '<tr>' +
                  '<td width="35%">' + val + '</td>' +
                  '<td width="65%">' +
                  '<a href="#" id="' + val + '" class="edit' + i + '" ' +
                  'data-type="text">' + mod.selectedFeature.
                getProperties()[val] +
                  '</a>' +
                  '</td>' +
                  '</tr>';
                i++;
              }
            });
            mod.popupContent += '</tbody></table><script>';
            mod.popupContent += '$.fn.editable.defaults.mode = "inline";';
            mod.popupContent += '$(document).ready(function() {';
            attTitle.forEach(function (val, idx, array) {
              mod.popupContent += '	$(".edit' + idx + '").editable({';
              mod.popupContent += 'type: "text",';
              mod.popupContent += 'title: "' + attTitle[idx] + '",';
              mod.popupContent += 'success: function(response, newValue) {';
              mod.popupContent += 'gsc.editFeatures.selectedFeature.set("' +
                attTitle[idx] + '", newValue, false);';
              mod.popupContent += 'gsc.editFeatures.transactWFS("update", ' +
                'gsc.editFeatures.selectedFeature);';
              mod.popupContent += '}';
              mod.popupContent += '})';
            });
            mod.popupContent += '});</script>';
            mod.content.html(mod.popupContent);
            var popupCoordinates = mod.selectedFeature.getGeometry().
            getClosestPoint(evt.mapBrowserEvent.coordinate);
            mod.overlay.setPosition(popupCoordinates);
          }
        });
        break;

      case 'btnPoint':
        mod.interaction = new ol.interaction.Draw({
          type: 'Point',
          source: mod.layer.getSource()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.interaction.on('drawend', function (e) {
          mod.transactWFS('insert', e.feature);
        });
        break;

      case 'btnLine':
        mod.interaction = new ol.interaction.Draw({
          type: 'LineString',
          source: mod.layer.getSource()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.interaction.on('drawend', function (e) {
          mod.transactWFS('insert', e.feature);
        });
        break;

      case 'btnArea':
        mod.interaction = new ol.interaction.Draw({
          type: 'Polygon',
          source: mod.layer.getSource()
        });
        mod.interaction.on('drawend', function (e) {
          mod.transactWFS('insert', e.feature);
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        break;

      case 'btnDelete':
        mod.interaction = new ol.interaction.Select();
        mod.interaction.getFeatures().on('add', function (e) {
          mod.transactWFS('delete', e.target.item(0));
          mod.interactionMultipleSelectPointerMove.getFeatures().clear();
          mod.interaction.getFeatures().clear();
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        break;

      default:
        break;
    }
  });
  return mod;
}());

'use strict';

var gsc = gsc || {};

gsc.geocode = gsc.geocode || {};

/**
 * Get a list of coordinates for a name
 *
 * @param {String[]} geonames An array of one or more geonames
 */
gsc.geocode.geocode = function (geonames) {

  // pseudo code
  // lookup coordinate based on name

  return [{
    name: 'Brussels',
    lon: 1,
    lat: 2,
    match: 50 // percent
  }];

};

/**
 * Get a list of names for a coordinate
 *
 * @param {Number} lat Latitude
 * @param {Number} lon Longitude
 * @param {Number} srs Spatial reference system code (EPSG)
 */
gsc.geocode.reverseGeocode = function (lat, lon, srs) {

  // pseudo code
  // lookup name based on location

  return [{
    name: 'Brussels',
    lon: 1,
    lat: 2,
    distance: 100 // meters
  }];

};

'use strict';

var gsc = gsc || {};

/**
 * Response object
 *
 * @param {string} [status] [description]
 * @param {string} [description] [description]
 *
 * @property {string} status - Whether the request was successful (done) or failed (error)
 * @property {string} description - Any error or status message
 * @property {Object} request - The request object
 * @property {number} [id] - Identifier of inserted object, only available on create statements
 * @class
 * @memberof gsc
 */
gsc.Response = function (status, description) {

  if (status === undefined) {
    status = 'error';
  }

  if (description === undefined) {
    description = '';
  }

  return {
    status: status,
    description: description
  };

};

'use strict';

gsc.layer = (function () {

  /**
   * @exports gsc/layer
   */
  var mod = {};

  /**
   * Create a new layer
   *
   * @param {String} layerName - The name of the layer
   * @param {Number} dataSetId - The identifier of the data set the layer is based on
   * @param {String} description - A description of the layer
   * @param {String} metadataFile - Metadata XML
   * @param {String} sld - SLD XML
   * @returns {Promise.<Object>}
   */
  mod.create = function (layerName,
    dataSetId,
    description,
    metadataFile,
    sld) {

    return gsc.doPost('createlyr', {
      layername: layerName,
      iddataset: dataSetId,
      description: description,
      metadatafile: metadataFile,
      sld: sld
    });

  };

  /**
   * Update a layer new layer
   *
   * @param {type} layerId - The identifier of the layer to update
   * @param {String} layerName - The name of the layer
   * @param {Number} dataSetId - The identifier of the data set the layer is based on
   * @param {String} description - A description of the layer
   * @param {String} metadataFile - Metadata XML
   * @param {String} sld - SLD XML
   * @returns {Promise.<Object>}
   */
  mod.update = function (layerId,
    layerName,
    dataSetId,
    description,
    metadataFile,
    sld) {

    return gsc.doPost('updatelyr', {
      idlayer: layerId,
      layername: layerName,
      iddataset: dataSetId,
      description: description,
      metadatafile: metadataFile,
      sld: sld
    });

  };

  /**
   * Delete a layer
   *
   * @param {Number} layerId - The identifier of the layer to delete
   * @returns {Promise.<Object>}
   */
  mod.delete = function (layerId) {
    return gsc.doPost('deletelyr', {
      idlayer: layerId
    });
  };

  /**
   * Search for layers
   *
   * @param {Number} [dataSetId=null] - The identifier of the data set for which layers should be retrieved
   * @param {type} [layerId=null] - The identifier of the layer that should be retrieved
   * @param {type} [layerName=null] - The name or partial name of layers to be retrieved
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.list = function (dataSetId,
    layerId,
    layerName) {

    var param = {};

    if (dataSetId !== undefined && dataSetId !== null) {
      param.iddataset = dataSetId;
    }

    if (layerId !== undefined && layerId !== null) {
      param.idlayer = layerId;
    }

    if (layerName !== undefined && layerName !== null) {
      param.layername = layerName;
    }

    return gsc.doPost('listlyr', param);

  };

  return mod;

}());

'use strict';

gsc.map = (function () {

  /**
   * @exports gsc/map
   */
  var mod = {};

  /** @type ol.map */
  mod.olMap = null;

  /** @type mapOptions */
  mod.mapOptions_ = null;

  /**
   * Create a map with standard functions (pan,zoom, view layers) and
   * other optional  specific functionality as info on feature and filter
   * on attributes
   *
   * @param {divObject} divObject is the map div
   * @param {mapOptions} mapOptions are the map options
   */
  mod.create = function (divObject, mapOptions) {
    mod.mapOptions_ = mapOptions;
    mod.layers_ = mapOptions.layers || [];

    var projection = new ol.proj.Projection({
      code: mapOptions.epsg,
      units: mapOptions.units
    });

    mod.olMap = new ol.Map({
      controls: ol.control.defaults({
        attribution: false
      }),
      layers: mod.layers_,
      target: divObject,
      view: new ol.View({
        projection: projection
      })
    });

    if (mod.mapOptions_.bounds) {
      mod.olMap.getView().fit(mod.mapOptions_.bounds, mod.olMap.getSize());
    }
  };

  /**
   * Add layer to existing map
   *
   * @param {ol.layer} layer layer to show in map
   */
  mod.addLayer = function (layer) {
    mod.olMap.addLayer(layer);
    mod.layers_.push(layer);
  };

  /**
   * Return element of map viewport
   *
   * @return {element} DOM element of viewport
   */
  mod.getDomElement = function () {
    return $(mod.olMap.getViewport());
  };

  /**
   * Return ol map object
   *
   * @return {ol.map} map object
   */
  mod.getOlMap = function () {
    return mod.olMap;
  };

  /**
   * Redraw all layers
   *
   */
  mod.redraw = function () {
    mod.olMap.getLayers().forEach(function (lyr) {
      lyr.redraw();
    });
  };

  /**
   * Remove layer from map
   *
   */
  mod.removeLayer = function (layer) {
    mod.olMap.removeLayer(layer);
    mod.layers_ = mod.layers_.filter(function (value) {
      return value !== layer;
    });
  };

  /**
   * Fit to features
   *
   * @param {el.extent} bounds
   */
  mod.fit = function (bounds) {
    mod.olMap.getView().fit(bounds, mod.olMap.getSize());
  };

  mod.addMousePositionControl = function (location) {
    var mousePositionControl = new ol.control.MousePosition({
      className: 'custom-mouse-position',
      target: document.getElementById(location),
      coordinateFormat: ol.coordinate.createStringXY(5),
      undefinedHTML: '&nbsp;'
    });
    mod.olMap.addControl(mousePositionControl);
  };

  mod.addScaleBarControl = function (scalediv) {
    mod.olMap.getView().on('change:resolution', function (evt) {
      var resolution = evt.target.get('resolution');
      var units = mod.olMap.getView().getProjection().getUnits();
      var dpi = 25.4 / 0.28;
      var mpu = ol.proj.METERS_PER_UNIT[units];
      var scale = resolution * mpu * 39.37 * dpi;
      if (scale >= 9500 && scale <= 950000) {
        scale = Math.round(scale / 1000) + 'K';
      } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) + 'M';
      } else {
        scale = Math.round(scale);
      }
      document.getElementById(scalediv).innerHTML = 'Scale = 1 : ' + scale;
    });
    //fire change resolution event and restore previous configuration
    mod.olMap.getView().setZoom(mod.olMap.getView().getZoom() + 1);
    mod.olMap.getView().setZoom(mod.olMap.getView().getZoom() - 1);
  };

  mod.infoOnFeatureEvent = function (evt) {
    document.getElementById(this.nodelist).innerHTML = 'Loading... please ' +
      'wait...';
    var view = mod.olMap.getView();
    var viewResolution = view.getResolution();
    var source = this.layer.getSource();
    var url = source.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, view.getProjection(), {
        'INFO_FORMAT': 'text/html',
        'FEATURE_COUNT': this.maxFeaturesNumber
      });
    if (url) {
      document.getElementById(this.nodelist).innerHTML = '<iframe seamless ' +
        'src="' + url + '"></iframe>';
    }
  };

  mod.addInfoOnFeatureEvent = function (nodelist, maxFeaturesNumber, layer) {
    var opts = {
      nodelist: nodelist,
      maxFeaturesNumber: maxFeaturesNumber,
      layer: layer
    };
    mod.olMap.on('singleclick', mod.infoOnFeatureEvent, opts);
  };

  mod.removeInfoOnFeatureEvent = function () {
    mod.olMap.on('singleclick', mod.infoOnFeatureEvent);
  };

  mod.filterOnAttributes = function (filterType, filter) {
    // by default, reset all filters
    var filterParams = {
      'FILTER': null,
      'CQL_FILTER': null,
      'FEATUREID': null
    };
    if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') !== '') {
      if (filterType === 'cql') {
        filterParams.CQL_FILTER = filter;
      }
      if (filterType === 'ogc') {
        filterParams.FILTER = filter;
      }
      if (filterType === 'fid') {
        filterParams.FEATUREID = filter;
      }
    }
    // merge the new filter definitions
    mod.olMap.getLayers().forEach(function (lyr) {
      lyr.getLayers().forEach(function (layer) {
        var source = layer.getSource()
        if(source instanceof ol.source.Image){
          source.updateParams(filterParams);
        }
      });
    });
  };

  mod.resetFilter = function () {
    mod.filterOnAttributes('cql', '');
  };

  return mod;

}());

'use strict';
gsc.organization = (function () {

  /**
   * @exports gsc/organization
   */
  var mod = {};

  /**
   * Create a new organization
   *
   * @param {type} organizationname
   * @param {type} description
   * @returns {Promise.<Object>}
   */
  mod.create = function (organizationname, description) {
    return gsc.doPost('createorg', {
      organizationname: organizationname,
      description: description
    });
  };

  /**
   * List/search for organizations
   *
   * @param {type} [organizationname] - Optionally name of organization
   * @returns {Promise.<Object>}
   */
  mod.list = function (organizationname) {
    var param = {};
    if (organizationname !== null && organizationname !== undefined) {
      param.organizationname = organizationname;
    }
    return gsc.doPost('listorg', param);
  };

  /**
   * Delete organization
   *
   * @param {type} organizationId
   * @returns {Promise.<Object>}
   */
  mod.delete = function (organizationId) {
    return gsc.doPost('deleteorg', {
      idorganization: organizationId
    });
  };

  /**
   * Updatea an organization object
   *
   * @param {type} organizationId
   * @param {type} organizationname
   * @param {type} description
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.update = function (organizationId, organizationname, description) {
    return gsc.doPost('updateorg', {
      idorganization: organizationId,
      organizationname: organizationname,
      description: description
    });
  };

  return mod;

}());

'use strict';

var gsc = gsc || {};

gsc.routing = gsc.routing || {};

/**
 * Get a vector layer with the root
 *
 * @param {double} x1 coordinate of the start point
 * @param {double} y1 coordinate of the start point
 * @param {double} x2 coordinate of the end point
 * @param {double} y2 coordinate of the end point
 */
gsc.routing.routing = function (x1, y1, x2, y2) {

  var RoutingUrl = 'http:/hub.geosmartcity.eu' +
    //var RoutingUrl = 'http://localhost:8080' +
    '/GironaRouting/geo/RestService/getroute?';

  RoutingUrl += ('x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' + y2);
  console.log(RoutingUrl);

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: RoutingUrl,
      format: new ol.format.GeoJSON()
    })
  });
  return vectorLayer;
};


'use strict';

var gsc = gsc || {};

/**
 * <p>API for crowd sourcing feature of gsc.js library</p>
 * <p>Functions to handle server side crowd sourcing app.</p>
 *
 * @namespace gsc.upload
 * @requires jQuery-2.1.4
 */
gsc.upload = {
  /**
   * Version number of the uploading feature of gsc.js
   * @type {String}
   */
  version: '1.0.0',
  /**
   * Byte size of the uploading file
   * @type {Number}
   */
  fileSize: 8000000
};

gsc.upload.uploadForm = function (selector) {
  var html =
    `<div class='upload'>
        <form role='form'>
          <h4>Upload file</h4>
          <div class='upload-file'>
            <div class='input-group'>
              <span class='input-group-btn'>
            <span class='btn btn-primary btn-file'>
            Browse... 
            <input type='file' required='true' id='geometryFile' accept='.gml, .kml, .zip'>
            </span>
              </span>
              <input type='text' class='form-control' style='width: 20%'
                readonly>
            </div>
            <span class='help-block'>
            Select .gml, .kml, .zip (containing .shp, .shx, and .dbf )  
            </span>
          </div>
          <div class='epsg'>
            <div class='input-group'>
              <span class='input-group-addon' id='basic-addon1'>&#128196;
            </span>
              <input type='text' required='true' id='epsg' class='form-control numbersOnly'
                style='width: 20%' placeholder='EPSG'
                aria-describedby='basic-addon1'>
            </div>
            <span class='help-block'>
            Provide EPSG for the reference system
            </span>
          </div>
          <div class='building-height collapse'>
            <div class='input-group'>
              <span class='input-group-addon' id='basic-addon1'>&#127970;
            </span>
              <input type='text' required='true' id='height' class='form-control numbersOnly'
                style='width: 20%' placeholder='Height'
                aria-describedby='basic-addon1'>
            </div>
            <span class='help-block'>
            Provide height of the building in meters
            </span>
          </div>
          <div class='inspireIdLoc'>
            <div class='input-group'>
              <span class='input-group-addon' id='basic-addon1'>&#128448;
            </span>
              <input type='text' id='inspireIdLoc' class='form-control'
                style='width: 20%'
                aria-describedby='basic-addon1'>
            </div>
            <span class='help-block'>
            Field that contains the localId for Inspire
            </span>
          </div>
          <div class='inspireIdName'>
            <div class='input-group'>
              <span class='input-group-addon' id='basic-addon1'>&#128448;
            </span>
              <input type='text' id='inspireIdName' class='form-control'
                style='width: 20%'
                aria-describedby='basic-addon1'>
            </div>
            <span class='help-block'>
            Field that contains the namespace for Inspire
            </span>
          </div>
          <button type='submit' class='btn btn-primary '>Submit</button>
        </form>
        <div class='progress'>
          <div class='progress-bar' aria-valuenow='0'
            aria-valuemin='0' aria-valuemax='100'
            id='progressbar' style='min-width: 2em; width: 0'>0%</div>
        </div>
        <div class='alert collapse' id='alert' role='alert'>...</div>
      </div>`;
  jQuery(selector).html(html);

  var script =
    `<script>
      jQuery(document).on('change', '.btn-file :file', function() {
        var input = jQuery(this); 
        var label = input.val();
        if (label.substring(3, 11) == 'fakepath') {
          label = label.substring(12);
        }
        input.trigger('fileselect', [label]);
      });
      
      jQuery(document).ready(function() {
        jQuery('.btn-file :file').on('fileselect', function(event,
          label) {
          jQuery('#progressbar').width('0%').text('0%');
          jQuery('#alert').addClass('collapse').removeClass(
            'alert-danger alert-success').text('');
          var input = jQuery(this).parents('.input-group').find(
            ':text');
          var extension = label.substr(-3, 3);
          if (extension === 'zip' || extension === 'gml') {
            jQuery('.building-height').removeClass('collapse');
          } else {
            jQuery('.building-height').addClass('collapse');
          }
          if (input.length) {
            input.val(label);
          } else {
            if (label) {
              alert(label);
            }
          }
        });
      });
      
      jQuery('.numbersOnly').keyup(function() {
        if (jQuery.isNumeric(this.value) === false) {
          this.value = this.value.slice(0, -1);
        }
      });
      
      progressCallback = function(progress) {
        if (progress > 0) {
          jQuery('#progressbar').width(progress + '%').text(progress +
            ' %');
        }
      };
      
      successCallback = function(success) {
        jQuery('#alert').removeClass('collapse').addClass('alert-success')
          .text('Upload successful');
      };
      
      failedCallback = function(error) {
        if(error == undefined){
            error = '';
        }
        jQuery('#alert').removeClass('collapse').addClass('alert-danger')
          .text('Upload failed ' + error);
      };
      
      jQuery('form').on('submit', function(e) {
        e.preventDefault();
        jQuery('#progressbar').width('0%').text('0%');
        jQuery('#alert').addClass('collapse').removeClass(
          'alert-danger alert-success').text('');
        var fileToProcess = document.getElementById('geometryFile').files[
          0];
        var height = jQuery('#height').val();
        var epsg = jQuery('#epsg').val();
        var inspireIdLoc = jQuery('#inspireIdLoc').val();
        var inspireIdName = jQuery('#inspireIdName').val();
        var dataToProcess = new gsc.upload.Data(fileToProcess, epsg, height, inspireIdLoc, inspireIdName);
        dataToProcess.send(progressCallback, successCallback, failedCallback);
      });
      </script>`;
  jQuery(function () {
    jQuery('head').append(script);
  });

  jQuery('.btn-file').css({
    'position': 'relative',
    'overflow': 'hidden'
  });
  jQuery('.btn-file input[type=file]').css({
    'position': 'absolute',
    'top': '0',
    'right': '0',
    'min-width': '100%',
    'min-height': '100%',
    'font-size': '100px',
    'text-align': 'right',
    'filter': 'alpha(opacity=0)',
    'opacity': '0',
    'background': 'red',
    'cursor': 'inherit',
    'display': 'block'
  });
  jQuery('input[readonly]').css({
    'background-color': 'white !important',
    'cursor': 'text !important'
  });
  jQuery('.upload').css({
    'margin': '2em'
  });
  jQuery('.progress').css({
    'margin-top': '1em',
    'width': '25%'
  });
  jQuery('.alert').css({
    'margin-top': '1em',
    'width': '25%'
  });
};

/**
 * Create a Data with uploaded file and building height
 *
 * @param {File} file First element of FileList provided by input type file
 * @param {Number} epsg EPSG for the reference system of data
 * @param {String} [height] Height in meters of the building
 * @param {String} [inspireIdLoc] Field that contains the localId for Inspire
 * @param {String} [inspireIdName] Field that contains the namespace for Inspire
 * @constructor
 */
gsc.upload.Data = function (file, epsg, height, inspireIdLoc, inspireIdName) {
  /**
   * File to send
   * @type {File}
   */
  if (typeof file === undefined) {
    this.file = new File([''], 'filename');
  } else {
    this.file = file;
  }
  /**
   * EPSG for the reference system
   * @type {String}
   */
  this.epsg = epsg;
  /**
   * Height of the building (for solar potential calculation) in meters
   * @type {String}
   */
  this.height = height;
  /**
   * Name of the field that contains the localId for Inspire
   * @type {String}
   */
  this.inspireIdLoc = inspireIdLoc;
  /**
   * Name of the field that contains the namespace for Inspire
   * @type {String}
   */
  this.inspireIdName = inspireIdName;
};

/**
 * The name of the file referenced by the File object
 * @property {String} name of the file
 * @name gsc.upload.Data#name
 */
Object.defineProperty(gsc.upload.Data.prototype, 'name', {
  get: function () {
    return this.file && this.file.name;
  }
});

/**
 * Returns the last modified date of the file.
 * Files without a known last modified date use the current date instead
 * @property {Date} last modified date
 * @name gsc.upload.Data#lastModifiedDate
 */
Object.defineProperty(gsc.upload.Data.prototype, 'lastModifiedDate', {
  get: function () {
    return this.file && this.file.lastModifiedDate;
  }
});

/**
 * The size, in bytes, of the data contained in the file
 * @property {Number} size in bytes
 * @name gsc.upload.Data#size
 */
Object.defineProperty(gsc.upload.Data.prototype, 'size', {
  get: function () {
    return this.file && this.file.size;
  }
});

/**
 * A string indicating the MIME type of the data contained in the Blob.
 * If the type is unknown, this string is empty
 * @property {String} MIME type
 * @name gsc.upload.Data#type
 */
Object.defineProperty(gsc.upload.Data.prototype, 'type', {
  get: function () {
    return this.file && this.file.type;
  }
});

/**
 * Checks if size of file to be uploaded is smaller or equals to
 * config {@link gsc.upload#fileSize}
 *
 * @returns {Boolean} True if file size is smaller or equals to config
 */
gsc.upload.Data.prototype.isFileSizeCorrect = function () {
  return (this.size <= gsc.upload.fileSize);
};

/**
 * Callback for handling upload progress percentage
 *
 * @callback progressCallback
 * @param {number} Percentage
 */

/**
 * Callback for handling upload success
 *
 * @callback successCallback
 * @param {event}
 */

/**
 * Callback for handling upload failure
 *
 * @callback failedCallback
 * @param {event}
 */
/**
 * Function
 *
 * @param {progressCallback} pc Callback that handles upload progress
 * @param {successCallback} sc Callback that handles upload success
 * @param {failedCallback} fc Callback that handles upload failure
 */
gsc.upload.Data.prototype.send = function (pc, sc, fc) {
  if (this.isFileSizeCorrect()) {
    var formData = new FormData();
    formData.append('file', this.file, this.name);
    formData.append('epsg', this.epsg);
    formData.append('fieldHeight', this.height);
    formData.append('fieldInspireIdLoc', this.inspireIdLoc);
    formData.append('fieldInspireIdName', this.inspireIdName);
    var request = new XMLHttpRequest();
    if (pc || typeof pc === 'function') {
      request.upload.addEventListener('progress', function (e) {
        pc(parseInt(e.loaded / e.total * 100));
      }, false);
    }
    if (sc || typeof sc === 'function') {
      request.upload.addEventListener('load', function (e) {
        sc(e);
      }, false);
    }
    if (fc || typeof fc === 'function') {
      request.upload.addEventListener('error', function () {
        if (request.status === 400) {
          fc('Format not supported');
        } else {
          fc();
        }
      }, false);
    }
    request.open('POST', gsc.uploadUrl(), true);
    request.send(formData);
  }
};

'use strict';

gsc.user = (function () {

  /**
   *
   * @exports gsc/user
   */
  var mod = {};

  /**
   * Register a new user
   *
   * @param {String} email [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} confirmpassword [description]
   * @param {Object[]} organizations [description]
   * @return {Promise.<Object>} [description]
   */
  mod.register = function (email,
    username,
    password,
    confirmpassword,
    organizations) {

    return gsc.doPost('reguser', {
      email: email,
      username: username,
      password: password,
      confirmpassword: confirmpassword,
      organizations: organizations
    });

  };

  /**
   * Authenticate a user
   *
   * @param {string} username - Username
   * @param {string} password - Password
   * @return {Promise.<Response.<User>>} User object
   */
  mod.login = function (username, password) {
    return gsc.doPost('login', {
      username: username,
      password: password
    });
  };

  /**
   * Delete a user
   *
   * @param {String} username User name
   * @param {String} password Password
   * @return {Promise.<Object>}
   */
  mod.delete = function (username, password) {
    return gsc.doPost('unreguser', {
      username: username,
      password: password
    });
  };

  /**
   * Get a password reminder
   * If both arguments are supplied, email takes presedent
   *
   * @param {string} email - E-mail of user to get reminder for
   * @param {string} username - Username of user to get reminder for
   * @return {Promise} [description]
   */
  mod.remindPassword = function (email, username) {

    var params = {};

    if (email !== undefined && email !== null) {
      params.email = email;
    } else if (username !== undefined && username !== null) {
      params.username = username;
    }

    return gsc.doPost('remindpwd', params);

  };

  /**
   * Change password for user
   *
   * @param {string} username [description]
   * @param {string} oldpassword [description]
   * @param {string} newpassword [description]
   * @param {string} confirmnewpassword [description]
   * @return {Promise} [description]
   */
  mod.changePassword = function (username,
    oldpassword,
    newpassword,
    confirmnewpassword) {

    return gsc.doPost('changepwd', {
      username: username,
      oldpassword: oldpassword,
      newpassword: newpassword,
      confirmnewpassword: confirmnewpassword
    });

  };

  /**
   * Update user
   *
   * @param {number} userId Id of user to update
   * @return {Promise.<Object>} Updated user object
   */
  mod.update = function (userId, email, username, organizations) {

    return gsc.doPost('updateuser', {
      id: userId,
      email: email,
      username: username,
      organizations: organizations
    });

  };

  /**
   * Lock user
   *
   * @param {string} username Username
   * @param {boolean} [lock=true] Boolean flag to lock user
   * @return {Promise.<Object>}
   */
  mod.lock = function (username, lock) {

    if (lock === undefined) {
      lock = true;
    }

    return gsc.doPost('lockuser', {
      username: username,
      lock: lock
    });

  };

  /**
   * Verify registered email
   *
   * @param {number} verificationId Id to confirm - sent to registerred email
   * @return {Promise.<Object>}
   */
  mod.verifyEmail = function (verificationId) {

    return gsc.doPost('verifymail', {
      id: verificationId
    });

  };

  return mod;

}());

'use strict';

var gsc = gsc || {};

gsc.usrdat = gsc.usrdat || {};

/**
 * Store a location to the user profile
 *
 * @param {gsc.usrdat.Location} location A location to store
 * @return {gsc.usrdat.Location} The inserted location
 */
gsc.usrdat.storeLocation = function (location) {

  return {

  };
};

gsc.usrdat.storeRoute = function (route) {

};

'use strict';

gsc.util = gsc.util || {};

/**
 * Returns a resolved promise object
 *
 * @param {string} message [description]
 * @return {Promise.<gsc.Response>} [description]
 * @memberof gsc.util
 */
gsc.util.errorPromise = function (message) {
  var p = jQuery.Deferred();
  p.resolve(new gsc.Response('error', message));
  return p;
};

'use strict';

gsc.util = gsc.util || {};

/**
 * Checks if a variable is an array and contains at least one element
 *
 * @param {Array|Object|null|undefined} arrayCandidate
 * @returns {Boolean} True if array with >= 1 entry, false otherwise
 */
gsc.util.isArrayWithContent = function (arrayCandidate) {
  if (arrayCandidate !== undefined &&
    jQuery.isArray(arrayCandidate) &&
    arrayCandidate.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Clears an existing array and adds all elements from another array into it.
 * Modifies the targetArray.
 *
 * @param {Object[]} targetArray
 * @param {Object[]} sourceArray
 */
gsc.util.clearExtendArray = function (targetArray, sourceArray) {
  targetArray.length = 0;
  jQuery.extend(targetArray, sourceArray);
};

/**
 * Clears all the properties of the target object and copies the properties
 * from the source object onto the target. Modifies the target object.
 *
 * @param {type} targetObject
 * @param {type} sourceObject
 */
gsc.util.clearExtendObject = function (targetObject, sourceObject) {
  jQuery.each(targetObject, function (key, value) {
    targetObject[key] = undefined;
  });
  jQuery.extend(targetObject, sourceObject);
};

'use strict';
/**
 * @namespace gsc.util
 */

gsc.util = gsc.util || {};

/**
 * Checks whether a response is an error or not
 *
 * @param {Object} response The variable to test
 * @return {Boolean} True if response status is 'error',
 * false if response status is not 'error' or missing
 * @memberof gsc.util
 */
gsc.util.isError = function (response) {

  if (response.status !== undefined && response.status === 'error') {
    return true;
  }

  return false;

};

'use strict';

gsc.util = gsc.util || {};

/**
 * Checks whether a variable is undefined or null
 *
 * @param {Mixed} mvar The variable to test
 * @return {Boolean} True if null, false if non-null
 * @memberof gsc.util
 */
gsc.util.isNull = function (mvar) {

  if (mvar !== undefined && mvar !== null) {
    return false;
  } else {
    return true;
  }

};