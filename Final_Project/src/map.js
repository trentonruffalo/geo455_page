// =========================================== FUTURE FEATURES =====================================================
//  1. Allow overlay multiple disaster types. Extract value for each type and add together to produce a new color. |
//            a. Will probably need to move all .geoJSON files into one big file.                                  |
//               Search each targeted property, add them together. If >0 => display country with the new color;    |
//                                                                 Else => do not display the country.             |
//  2. Search Country by Country Name                                                                              |
//  3. Add a Side Menu displaying countries in alphabetic/value order based on selected layer.                     |
//            a. On Click, zoom in on the country, display reports and dates                                       |
//                                                                                                                 |
// =========================================== END FUTURE FEATURES =================================================


// *************************** TO-DO ******************************************
// 1. Add % of the money spent on the disaster out of SUM total for the country to the Pop-Ups if layer is something other than Total
// 2. Dosplay a list of Countries Aided in an emergency
// 3. For small countries add a MARKER to make them easier to see ! ! ! !
// 4. Add CERF Logo with a hyperlink to the website
// 5. Add different basemaps layers

            var debug = false; //Console log degub control


            var newMap = L.map('map', {center: [0, 0], zoomDelta: 1, zoomSnap: 0.75, zoom: 3,}); //layers: [grayscale, cities]

            //Set up the baselayers and WMS layer
            var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            });

//            var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
//                layers: 'TOPO-OSM-WMS'
//            });

            var shaded = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {});

            var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Map developed by: Dan Fedorenko',
                id: 'mapbox/light-v9',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(newMap);


            // ===============================================================================================================================

            // ========== INFO BOX TOGGLE =============

            var countryList = {countryName:'', amount:0};

            L.Control.Info = L.Control.extend({

              options: {
                title: 'Info',
                titleTooltip: 'Click here for more info',
                content: '',
                maxWidth: '350px',
                titleClass: '',
                contentClass: ''
              },

              initialize: function(options) {
                L.Util.setOptions(this, options);
                this._infoContainer = null;
                this._infoTitleContainer = null;
                this._infoBodyContainer = null;
                this._infoCloseButtonContainer = null;
                this._infoContentContainer = null;
                this._infoTitle = this.options.title;
                this._infoTitleTooltip = this.options.titleTooltip;
                this._infoContent = this.options.content;
                this._titleShown = false;
                this._titleClass = this.options.titleClass;
                this._contentClass = this.options.contentClass;
                this._infoTitleStyle = 'padding: 5px;';
                this._infoContainerClasses = 'leaflet-control-layers leaflet-control';
              },

              onAdd: function(map) {
                var infoContainer = L.DomUtil.create('div', 'leaflet-control-layers');

                var infoTitle = L.DomUtil.create('div');
                infoContainer.appendChild(infoTitle);
                infoTitle.setAttribute('style', this._infoTitleStyle);

                var infoBody = L.DomUtil.create('div', 'leaflet-popup-content-wraper');
                infoContainer.appendChild(infoBody);
                infoBody.setAttribute('style', 'max-width:' + this.options.maxWidth);

                var infoContent = L.DomUtil.create('div', 'leaflet-popup-content');
                infoBody.appendChild(infoContent);

                var infoCloseButton = L.DomUtil.create('a', 'leaflet-popup-close-button');
                infoContainer.appendChild(infoCloseButton);
                infoCloseButton.innerHTML = 'x';
                infoCloseButton.setAttribute('style', 'cursor: pointer');

                this._infoContainer = infoContainer;
                this._infoTitleContainer = infoTitle;
                this._infoBodyContainer = infoBody;
                this._infoContentContainer = infoContent;
                this._infoCloseButtonContainer = infoCloseButton;

                infoTitle.innerHTML = this._infoTitle;
                infoContent.innerHTML = this._infoContent;
                this._showTitle();

                L.DomEvent.disableClickPropagation(infoContainer);
                L.DomEvent.on(infoCloseButton, 'click', L.DomEvent.stop);
                L.DomEvent.on(infoContainer, 'click', this._showContent, this);
                L.DomEvent.on(infoCloseButton, 'click', this._showTitle, this);

                return infoContainer;
              },

              onRemove: function(map) {},

              setTitle: function(title) {
                this._infoTitle = title;
                if (this._infoTitleContainer != null) {
                  this._infoTitleContainer.innerHTML = title;
                }
              },

              setTitleTooltip: function(titleTooltip) {
                this._infoTitleTooltip = titleTooltip;
                if (this._titleShown) {
                  this._showTitleTooltip(true);
                }
              },

              setContent: function(content) {
                this._infoContent = content;
                if (this._infoContentContainer != null) {
                  this._infoContentContainer.innerHTML = content;
                }
              },

              setTitleClass: function(titleClass) {
                this._titleClass = titleClass;
                if (this._titleShown) {
                  this._addInfoClass(this._titleClass);
                }
              },

              setContentClass: function(contentClass) {
                this._contentClass = contentClass;
                if (!this._titleShown) {
                  this._addInfoClass(this._contentClass);
                }
              },

              _showTitle: function(evt) {
                this._addInfoClass(this._titleClass);
                this._displayElement(this._infoTitleContainer, true);
                this._displayElement(this._infoBodyContainer, false);
                this._displayElement(this._infoCloseButtonContainer, false);
                this._showTitleTooltip(true);
                this._setCursorToPointer(this._infoContainer, true);
                this._titleShown = true;
              },

              _showContent: function(evt) {
                this._addInfoClass(this._contentClass);
                this._displayElement(this._infoTitleContainer, false);
                this._displayElement(this._infoBodyContainer, true);
                this._displayElement(this._infoCloseButtonContainer, true);
                this._showTitleTooltip(false);
                this._setCursorToPointer(this._infoContainer, false);
                this._titleShown = false;
              },

              _showTitleTooltip: function(showIt) {
                this._infoContainer.setAttribute('Title', (showIt) ? this._infoTitleTooltip : '');
              },

              _displayElement: function(element, displayIt) {
                element.style.display = (displayIt) ? '' : 'none';
              },

              _setCursorToPointer: function(element, setIt) {
                element.style.cursor = (setIt) ? 'pointer' : '';
              },

              _addInfoClass: function(classToAdd) {
                L.DomUtil.setClass(this._infoContainer, this._infoContainerClasses + ' ' + classToAdd);
              }
            });

            L.control.info = function(opts) {
              return new L.Control.Info(opts);
            }

            var title = [];
            var tooltip = [];
            var text = [];
            var titleClass = [];
            var contentClass = [];

            title[0] = 'INFO';
            tooltip[0] = 'Click here for more info';
            text[0] = '<p style="margin-bottom: 6pt;"><b>All Emergencies</b></p>Number of countries Aided:'
            titleClass[0] = 'titleStyle1';
            contentClass[0] = 'contentStyle1';

            myInfoControl = L.control.info({
              position: 'topright',
              title: title[0],
              titleTooltip: tooltip[0],
              titleClass: titleClass[0],
              contentClass: contentClass[0]
            });

            myInfoControl.setContent(text[0]);

            myInfoControl.addTo(newMap);

            function changeText(newLayerInfo,  numCountries , sumSpendings) {
              if(newLayerInfo.toString() == 'All Emergencies'){
                myInfoControl.setContent('<p style="margin-bottom: 6pt;"><b>All Emergencies</b></p>Number of countries Aided: ' + numCountries.toString()+ '<br>Funds Allocated: <b style="color:#5b92e5">$' + sum.toString() + '</b>');
              }
              else{
                myInfoControl.setContent('<p style="margin-bottom: 6pt;"><b>Emergency Type: ' + newLayerInfo.toString() + '</b></p>Number of countries Aided:' + numCountries.toString() + '<br>Funds Allocated: <b style="color:#5b92e5">$' + sum.toString() + '</b>');
              }
            }
            
            
            // ADD A SCROLLABLE LIST OF COUNTRIES EFFECTED
//            +'<div style="height:100px;width:300px;overflow:auto;background-color:#7e7e7e;color:white;scrollbar-base-color:gold;font-family:sans-serif;padding:10px;">This HTML scroll box has had color added. You can add color to the background of your scroll box. You can also add color to the scroll bars.</div>'

            // ========== END INFO BOX TOGGLE =============

            // ========== BASE MAP LAYERS MENU =============
            // Create basemap layer menu items
            var baseLayers = {
                'Grayscale': grayscale,
                'Streets': streets,
//                'Topographic': topo,
                'Shaded Relief': shaded,
                };

             //Create basemap layer menu
             var layerControl = L.control.layers(baseLayers, null, {collapsed: true}).addTo(newMap);

            // ========= END BASE MAP LAYERS MENU ===========


            //=================================================================================================================================

            // Sidebar
            var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
            });
            newMap.addControl(sidebar);

            setTimeout(function () {
                sidebar.show();
            }, 1700);

            // Sidebar Menu Button
            L.easyButton(('<img src="https://toppng.com/uploads/preview/menu-icon-png-3-lines-11552744384er3xmq5ix5.png" style="width:22px">'), function () {
                sidebar.toggle();
            }).addTo(newMap);

            // Re-Center Button
            L.easyButton(('<img src="https://www.freeiconspng.com/thumbs/worldwide-web-icon/world-wide-web-globe-icon-images--pictures-becuo-0.png", height=85%>'), function(btn, map){
                map.setView([0.0, 0.0], 3);
            }).addTo(newMap);

            newMap.on('click', function () {
                sidebar.hide();
            })
//            newMap.on('dblclick', function () {
//                newMap.zoomIn();
//            })

// ===================== INTERVALS ===========================
            function getColor(value) {
                return  value > 359934395.018913 ? '#081D58':
                        value > 241382373.224978 ? '#192A7A':
                        value > 161781488.738343 ? '#253A97':
                        value > 108334059.372117 ? '#2352A2':
                        value > 72447175.3973870 ? '#216DAF':
                        value > 48351190.6758180 ? '#1E8ABD':
                        value > 32172118.6752800 ? '#2CA1C2':
                        value > 21308799.5860930 ? '#41B6C4':
                        value > 14014703.7547890 ? '#64C3BF':
                        value > 9117136.6706000 ?  '#89D1BA':
                        value > 5828701.21555700 ? '#B2E1B6':
                        value > 3620705.37678900 ? '#D2EDB3':
                        value > 2138162.78452300 ? '#E8F6B1':
                        value > 1142720.44749900 ? '#F5FBC2':
                                                   '#FFFFD9';
            }

// ============== COLOR INTERVAL ON DATA LAYER =================


            // IN FUTURE PUT ALL OF THESE INTO A SINGLE FUNCTION ! ! !

            function styleTotal(feature){
                return {
                    fillColor: getColor(feature.properties.SUM),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleCholera(feature){
                return {
                    fillColor: getColor(feature.properties.CholeraTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleDisplacement(feature){
                return {
                    fillColor: getColor(feature.properties.DisplacementTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleDrought(feature){
                return {
                    fillColor: getColor(feature.properties.DroughtTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleEarthquake(feature){
                return {
                    fillColor: getColor(feature.properties.EarthquakeTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleEbola(feature){
                return {
                    fillColor: getColor(feature.properties.EbolaTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleEconomicDisruption(feature){
                return {
                    fillColor: getColor(feature.properties.EconomicDisruptionTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleFlood(feature){
                return {
                    fillColor: getColor(feature.properties.FloodTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleWave(feature){
                return {
                    fillColor: getColor(feature.properties.HeatColdWaveTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleHumanRights(feature){
                return {
                    fillColor: getColor(feature.properties.HumanRightsTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleInsect(feature){
                return {
                    fillColor: getColor(feature.properties.InsectInfestationTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleMeasles(feature){
                return {
                    fillColor: getColor(feature.properties.MeaslesTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleMultipleEmergencies(feature){
                return {
                    fillColor: getColor(feature.properties.MultipleEmergenciesTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function stylePostConflict(feature){
                return {
                    fillColor: getColor(feature.properties.PostConflictTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleRefugee(feature){
                return {
                    fillColor: getColor(feature.properties.RefugeesTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleStorm(feature){
                return {
                    fillColor: getColor(feature.properties.StormTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleUnEm(feature){
                return {
                    fillColor: getColor(feature.properties.UnEmTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleUnHeEm(feature){
                return {
                    fillColor: getColor(feature.properties.UnHeEmTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleClashes(feature){
                return {
                    fillColor: getColor(feature.properties.ClashesTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

            function styleVolcano(feature){
                return {
                    fillColor: getColor(feature.properties.VolcanoTotal),
                    weight: 1,
                    opacity: 1,
                    color: '#D3D3D3',
                    fillOpacity: 0.9
                };
            }

// =========== END STYLING =================


// ========== SELECTED BUTTON STYLING =================
            $('button').on('click', function(){
                $('button').removeClass('selected');
                $(this).addClass('selected');
            });
// ========== END SELECTED BUTTON STYLING =============


// =========== HOVER STYLING FOR SHAPES ===============

            function highlightFeature(e) {
                // Get access to the feature that was hovered through e.target
                var feature = e.target;

                // Set a thick grey border on the feature as mouseover effect
                // Adjust the values below to change the highlighting styles of features on mouseover
                // Check out https://leafletjs.com/reference-1.3.4.html#path for more options for changing style
                feature.setStyle({
                    weight: 3,
                    color: 'white',
                    fillOpacity: 0.7
                });

                // Bring the highlighted feature to front so that the border doesn’t clash with nearby states
                // But not for IE, Opera or Edge, since they have problems doing bringToFront on mouseover
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    feature.bringToFront();
                }
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature, // Do what defined by the highlightFeature function on mouseover
                    mouseout: resetHighlight,    // Do what defined by the resetHighlight function on mouseout
                });
            }
// =========== END HOVER STYLING ===============


// =============================================
            function markSmallCountry(feature, layer){
                var center = feature.geometry.coordinates.getBounds().getCenter();
                L.marker(center).addTo(markerLayer);
            }

// =============================================


// =========== BUTTONS TO SWITCH BETWEEN DATA LAYERS =================
            var geojson; // define a variable to make the geojson layer accessible for the funtions to use
            var layerGroup = L.layerGroup().addTo(newMap);
            var sum = 0;
            var markerLayer = L.layerGroup().addTo(newMap);
            
            
            //#008080 green blue

            //Initial layer displays total for all disasters
            geojson = L.geoJson(totalData, {
                        style: styleTotal,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.SUM;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
//                                console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                    + '</u></h5><p style="color:black"> <b>Total Aid 2006-2022: <span style="color:#5b92e5">$' + feature.properties.SUM.toString() + '</span></b></p>';
                                 });
                            }
                        }
                     }).bindPopup(function (layer){
                        return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p style="color:black"> <b>Total Aid 2006-2022: <span style="color:#5b92e5">$' + layer.feature.properties.SUM.toString() + '</span></b></b></p>';
                     }).addTo(layerGroup);
            newMap.fitBounds(geojson.getBounds());
            changeText('All Emergencies', totalData.features.length, sum);

            // Functions to toggle between layers
            $(document).ready(function() {
                //CERF TOTAL 2006 - 2022
                $("#total").click(function(btn, map){
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(totalData, {
                        style: styleTotal,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.SUM;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                    + '</u></h5><p style="color:black"> <b>Total Aid 2006-2022: <span style="color:#5b92e5">$' + feature.properties.SUM.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p style="color:black"> <b>Total Aid: <span style="color:#5b92e5">$' + layer.feature.properties.SUM.toString() + '</span></b></p>';
                    }).addTo(layerGroup);
                    changeText('All Emergencies', totalData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //CHOLERA
                $("#cholera").click(function(btn, map){
//                    changeText('Cholera Outbreak');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(choleraData, {
                        style: styleCholera,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.CholeraTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Cholera</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.CholeraTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Cholera</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.CholeraTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.CholeraTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Cholera Outbreak', choleraData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //DISPLACEMENT
                $("#displacement").click(function(btn, map){
//                    changeText('Displacement');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(displacementData, {
                        style: styleDisplacement,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.DisplacementTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Displacement</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.DisplacementTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Displacement</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.DisplacementTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.DisplacementTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Displacement', displacementData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //DROUGHT
                $("#drought").click(function(btn, map){
//                    changeText('Drought');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(droughtData, {
                        style: styleDrought,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.DroughtTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Drought</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.DroughtTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Drought</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.DroughtTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.DroughtTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Drought', droughtData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //EARTHQUAKE
                $("#earthquake").click(function(btn, map){
//                    changeText('Earthquake');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(earthquakeData, {
                        style: styleEarthquake,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.EarthquakeTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Earthquake</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.EarthquakeTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Earthquake</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.EarthquakeTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.EarthquakeTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Earthquake', earthquakeData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //EBOLA
                $("#ebola").click(function(btn, map){
//                    changeText('Ebola Outbreak');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(ebolaData, {
                        style: styleEbola,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.EbolaTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Ebola Outbreak</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.EbolaTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Ebola Outbreak</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.EbolaTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.EbolaTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Ebola Outbreak', ebolaData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //ECONOMIC DISRUPTIONS
                $("#econ").click(function(btn, map){
//                    changeText('Economic Disruptions');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(economicDisruptionData, {
                        style: styleEconomicDisruption,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.EconomicDisruptionTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Economic Disruptions</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.EconomicDisruptionTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Economic Disruptions</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.EconomicDisruptionTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.EconomicDisruptionTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Economic Disruptions', economicDisruptionData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //FLOOD
                $("#flood").click(function(btn, map){
//                    changeText('Flood');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(floodData, {
                        style: styleFlood,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.FloodTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Flood</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.FloodTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Flood</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.FloodTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.FloodTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Flood', floodData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //HEAT/COLD WAVE
                $("#wave").click(function(btn, map){
//                    changeText('Heat/Cold Wave');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(waveData, {
                        style: styleWave,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.HeatColdWaveTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Heat/Cold Wave</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.HeatColdWaveTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Heat/Cold Wave</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.HeatColdWaveTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.HeatColdWaveTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Heat/Cold Wave', waveData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //HUMAN RIGHTS
                $("#human").click(function(btn, map){
//                    changeText('Human Rights');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(humanRightsData, {
                        style: styleHumanRights,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.HumanRightsTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Human Rights</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.HumanRightsTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Human Rights</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.HumanRightsTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.HumanRightsTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Human Rights', humanRightsData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //INSECT
                $("#insect").click(function(btn, map){
//                    changeText('Insect Infestation');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(insectData, {
                        style: styleInsect,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.InsectInfestationTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Insect Infestation</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.InsectInfestationTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Insect Infestation</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.InsectInfestationTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.InsectInfestationTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Insect Infestation', insectData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //MEASLES
                $("#measles").click(function(btn, map){
//                    changeText('Measles Outbreak');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(measlesData, {
                        style: styleMeasles,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.MeaslesTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Measles Outbreak</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.MeaslesTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Measles Outbreak</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.MeaslesTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.MeaslesTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Measles Outbreak', measlesData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });


                //MULTIPLE EMERGENCIES
                $("#multiple").click(function(btn, map){
//                    changeText('Multiple Emergencies');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(multipleEmergenciesData, {
                        style: styleMultipleEmergencies,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.MultipleEmergenciesTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Multiple Emergencies</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.MultipleEmergenciesTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Multiple Emergencies</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.MultipleEmergenciesTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.MultipleEmergenciesTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Multiple Emergencies', multipleEmergenciesData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //POST CONFLICT
                $("#postConflict").click(function(btn, map){
//                    changeText('Post Conflict Needs');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(postConflictData, {
                        style: stylePostConflict,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.PostConflictTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Post Conflic Needs</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.PostConflictTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Post Conflic Needs</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.PostConflictTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.PostConflictTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Post Conflict Needs', postConflictData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //REFUGEES
                $("#refugee").click(function(btn, map){
//                    changeText('Refugees');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(refugeeData, {
                        style: styleRefugee,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.RefugeesTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Refugees</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.RefugeesTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Refugees</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.RefugeesTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.RefugeesTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Refugees', refugeeData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //STORM
                $("#storm").click(function(btn, map){
//                    changeText('Severe Storms');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(stormData, {
                        style: styleStorm,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.StormTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Severe Storms</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.StormTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Severe Storms</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.StormTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.StormTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Severe Storms', stormData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //UNSPECIFIED EMERGENCY
                $("#unEm").click(function(btn, map){
//                    changeText('Unspecified Emergency');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(unspecifiedEmergencyData, {
                        style: styleUnEm,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.UnEmTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Unspecified Emergency</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.UnEmTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Unspecified Emergency</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.UnEmTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.UnEmTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Unspecified Emergency', unspecifiedEmergencyData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //UNSPECIFIED HEALTH EMERGENCY
                $("#unHeEm").click(function(btn, map){
//                    changeText('Unspecified Health Emergency');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(unspecifiedHealthEmergencyData, {
                        style: styleUnHeEm,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.UnHeEmTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Unspecified Health Emergency</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.UnHeEmTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Unspecified Health Emergency</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.UnHeEmTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.UnHeEmTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Unspecified Health Emergency', unspecifiedHealthEmergencyData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //VIOLENT CLASHES
                $("#clash").click(function(btn, map){
//                    changeText('Violent Clashes');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(clashesData, {
                        style: styleClashes,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.ClashesTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Violent Clashes</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.ClashesTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Violent Clashes</b></p> <p> <b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.ClashesTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.ClashesTotal.toString() + '</p>';
                    }).addTo(layerGroup);
                    changeText('Violent Clashes', clashesData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });

                //VOLCANO
                $("#volcano").click(function(btn, map){
//                    changeText('Volcano Eruption');
                    layerGroup.clearLayers();
                    markerLayer.clearLayers();
                    sum = 0;

                    geojson = L.geoJson(volcanoData, {
                        style: styleVolcano,
                        onEachFeature: function (feature, layer) {
                            sum += feature.properties.VolcanoTotal;
                            onEachFeature(feature, layer);
                            if(feature.properties.Shape_Area < 1.2){
                                var center = turf.centerOfMass(feature);
                                if (debug == true){
                                    console.log(center.geometry.coordinates[1], center.geometry.coordinates[0]);
                                }
                                L.marker([center.geometry.coordinates[1], center.geometry.coordinates[0]]).addTo(markerLayer).bindPopup(function (layer){
                                    return '<h5><u>' + feature.properties.Country
                                        + '</u></h5><p>Emergency Type: <b>Volcano Eruption</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + feature.properties.VolcanoTotal.toString() + '</span></b></p>';
                                 });
                            }
                        }
                    }).bindPopup(function (layer){
                    return '<h5><u>' + layer.feature.properties.Country
                        + '</u></h5><p>Emergency Type: <b>Volcano Eruption</b></p> <p><b>Aid Amount: <span style="color:#5b92e5">$' + layer.feature.properties.VolcanoTotal.toString() + '</span></b></p>';
//                    return layer.feature.properties.Country
//                            + '<p style="color:purple"> Total: $' + layer.feature.properties.VolcanoTotal.toString() + '</p>'
                    }).addTo(layerGroup);
                    changeText('Volcano Eruption', volcanoData.features.length, sum);
//                    newMap.fitBounds(geojson.getBounds());
                });
            });

// =========== END BUTTONS =================

// ================= LEGEND + SCALE BAR =====================

            //Scale Bar
            L.control.scale({position: 'bottomleft', maxWidth: '150', metric: 'True'}).addTo(newMap); //Set dynamic scale bar to bottom left corner

            var legend = L.control({position: 'bottomright'}); // Set legend to bottom right corner

            legend.onAdd = function (newMap) {

                var div = L.DomUtil.create('div', 'legend'),
                    grades = [1142720, 2138162, 3620705, 5828701, 9117136, 14014703, 21308799, 32172118, 48351190, 72447175, 108334059, 161781488, 241382373, 359934395]; // The break values to define the intervals of population, note we begin from 0 here
                    var nice_grades = ['1.14M', '2.14M', '3.62M', '5.83M', '9.12M', '14.01M', '21.31M', '32.17M', '48.35M', '72.45M', '108.33M', '161.78M', '241.38M', '359.93M'];

                    div.innerHTML = '<b>CERF Humanitarian Aid (USD)<br></b>'; // The legend title (HTML-based), in this case it's Population Density 2011

                    // Loop through our the classes and generate a label with a color box for each interval.
                    // If you are creating a choropleth map, you DO NOT need to change lines below.
                    for (var i = 0; i < grades.length; i++) {
                        div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
                        nice_grades[i] + (nice_grades[i + 1] ? '&ndash;' + nice_grades[i + 1] + '<br>' : '+');
                    }
                    return div;
            };

            legend.addTo(newMap);

// ================= END LEGEND + SCALE BAR =====================