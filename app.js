angular.module("ForecastApp", [])
    .controller("WeatherServiceController", ["$scope", "$http", 
        "GoogleGeolocationService", "DarkSkyWeatherService",
        function($scope, $http, 
                 GoogleGeolocationService,
                 DarkSkyWeatherService){
	   
            var wsc = this;
			/* Doesn't seem to actually get the data from the data.txt file..
			$http.get("data.txt")
				.then(function(response){
					wsc.temporary = response.data;
					wsc.cities = wsc.temporary.cities;
					wsc.displayName = wsc.cities[0].name;
					wsc.selected_city = wsc.cities[0];
					wsc.getLatLonForSelected();
				});
            */
			//wsc.imageSource = "";
            wsc.selected_lat = 0;
            wsc.selected_lon = 0;
        
            //key: sdfgsde5dfgsdfg34tsdfg

            //App name    
            wsc.app_name = "Weather App";
        
            wsc.cities = 
            [
                {
                    name: "Amarillo",
                    url_name: "Amarillo",
                    state: "TX",
                    lat: 0,
                    lon: 0
                }, 
                {
                    name: "Anchorage",
                    url_name: "Anchorage",
                    state: "AK",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Denver",
                    url_name: "Denver",
                    state: "CO",
                    lat: 0,
                    lon: 0
                },
				{
                    name: "Charlotte",
                    url_name: "Charlotte",
                    state: "NC",
                    lat: 0,
                    lon: 0
                }
            ];
			
			function cityUpdated(){
				console.log(wsc.selected_city);
					$scope.$watch('wsc.selected_city', wsc.getCurrentConditions)
					$scope.$watch('wsc.selected_city',wsc.getLatLonForSelected)
			}
            
            wsc.getLatLonForSelected = function(){
                GoogleGeolocationService.geoLocate(wsc.selected_city)
                    .then(function(res){
                        wsc.selected_lat = res.data.results[0].geometry.location.lat;
                        wsc.selected_lon = res.data.results[0].geometry.location.lng;
                        
                        wsc.selected_city.lat = wsc.selected_lat;
                        wsc.selected_city.lon = wsc.selected_lon;
                        
                        //var google_static_maps_key = "AIzaSyAVIugWFEfJlG9Y5HS-kkkoQISjDNWWDtM";
                        var google_static_maps_key = "AIzaSyC4tT_4VUXDbiSLz_AJVuTLDOzewjj7O9A";
                        
                        wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                                     wsc.selected_lat + "," +
                                                     wsc.selected_lon + 
                                                     "&zoom=10&size=600x300&key=" +
                                                     google_static_maps_key;
                                                     
                        console.log("Google Static Map API URL");
                        console.log(wsc.google_static_maps_url);                        
                        
                        //console.log(res);
                        
                        
                        wsc.getCurrentConditions();        
                        
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            };
            
            wsc.getCurrentConditions = function(){
                DarkSkyWeatherService.getCurrentConditions(wsc.selected_city)
                    .then(function(res){
                        console.log(res);
                        
                        //get the weather stuff from the Dark Sky service here
                        wsc.observation_time = new Date(res.data.currently.time * 1000);
                        wsc.temperature      = res.data.currently.temperature;
                        wsc.dewpoint         = res.data.currently.dewPoint;
                        wsc.windBearing      = res.data.currently.windBearing;
                        wsc.windSpeed        = res.data.currently.windSpeed;
                        wsc.summary          = res.data.currently.summary;
						
						//wsc.determinePicture();
						//console.log(res);
                        
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            };
           // wsc.selectTheCity = function(){
			//	wsc.getLatLonForSelected();
			//};
            wsc.selected_city = wsc.cities[0];
            wsc.getLatLonForSelected();
            wsc.getCurrentConditions();            

           /*
			wsc.determinePicture = function(){
				
				switch(wsc.summary){
					case "Clear":
						wsc.imageSource ="https://www.behance.net/gallery/10740083/Animated-Weather-Icons";
					break;
					
					
				}
			};
	*/ 
    }])
	
    .directive('myConditionsSpecial', ['$sce', function($sce){
        
        //a reminder on naming conventions for directives: 
        //https://medium.com/@cironunesdev/angularjs-how-to-name-directives-118ac44b81d4#.idz35zby4

        /* https://docs.angularjs.org/guide/directive
        The restrict option is typically set to:

        'A' - only matches attribute name
        'E' - only matches element name
        'C' - only matches class name
        'M' - only matches comment
        */
        
        return{
            restrict: 'E',
            scope: true,
            templateUrl: $sce.trustAsResourceUrl('currentConditions.html')
        }
    }])
    .factory('GoogleGeolocationService', ['$sce', '$http', 
        function($sce, $http){
            //https://docs.angularjs.org/api/ng/service/$sce
            
            //create an empty object
            var geolocationService = {};
            
            //Google Maps Geocoding API key   
            var key = "AIzaSyA9n1o2N0pNoSsL5As9OPZHxc6yh2EEx_8";
            
            geolocationService.geoLocate = function(location){

                var address = "+" + location.name + ",+" + location.state;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                          address + "&key=" + key;

                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.get(trustedurl);
				//semicolon???
            };
            
            return geolocationService;            
            
        }])
    .factory('DarkSkyWeatherService',['$sce', '$http', 
        function($sce, $http){
            //work happens here
            
            var darkSkyWeatherService = {};
            
            //DarkSky API key
            var key = "2e51769109a23ee7e0c44994055c4b20";
            
            darkSkyWeatherService.getCurrentConditions = function(location){
                
                var url = "https://api.darksky.net/forecast/" +
                          key + "/" + location.lat + "," + location.lon;
                          
                console.log("DarkSky API URL:");
                console.log(url);
                
                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});
                
            }
            
            return darkSkyWeatherService;
        }
    ])
	
	

	.filter("windDirection", function(){
		return function(bearing){
			var direction;
			bearing.toFixed(2);
			if(bearing >= 337.5 || bearing <= 22.5){
				direction = "N";
			}else if(bearing >= 22.5 && bearing <=67.5){
				direction = "NE";
			}else if(bearing > 67.5 && bearing <=112.5){
				direction = "E";
			}else if(bearing >112.5 && bearing <= 157.5){
				direction = "SE";
			}else if(bearing >157.5 && bearing <= 202.5){
				direction = "S";
			}else if(bearing >202.5 && bearing <= 247.5){
				direction = "SW";
			}else if(bearing > 247.5 && bearing <= 292.5){
				direction = "W";
			}else if(bearing >292.5 && bearing <= 337.5){
				direction = "NW";
			}
			return "From the " + direction + " ";
		}
	})
	.filter("temp",function(){
		return function(fa){
			var celc = (fa -32) *(5/9);
			var realCelsius = celc.toFixed(2);
			
			return fa + "F  (" + realCelsius + ") C";
		};
	})
    .filter("addMph", function(){
		return function(speed){
			return speed + "mph"
		}
	})
	
	//filter for F in Fahrenheit
	.filter("addFa", function(){
		return function(temp){
		return temp + "F"
	}
	})
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    