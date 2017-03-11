<h1>**Forecast App**</h1>

The forecast app is supposed to allow the user to select a city from the dropdown menu.
From here the map and the weather information is supposed to change.

<p>The hardest part of the code was attempting to make the icons work, when I would try
this part of the code, the rest of the code would break</p>

``` 
/*
			wsc.determinePicture = function(){
				
				switch(wsc.summary){
					case "Clear":
						wsc.imageSource ="https://www.behance.net/gallery/10740083/Animated-Weather-Icons";
					break;
					
					
				}
			};
	*/ 
	
```

<p>The other challenging part was making the dropdown update. It would work sometimes but not others,
as well as work in notepadd++ but cloud 9 would not seem to run it</p>

```
<select ng-model ="wsc.selected_city" ng-options="unit.name for unit in wsc.cities" ng-change="wsc.cityUpdated" ></select>



function cityUpdated(){
				console.log(wsc.cities);
					$scope.$watch('wsc.cities', wsc.getCurrentConditions)
					$scope.$watch('wsc.cities', wsc.getLatLonForSelected)
					$scope.$apply(wsc.getCurrentConditions)
					$scope.$apply(wsc.getLatLonForSelected)
				
			}

			$scope.$watch('wsc.cities', cityUpdated);
		
	
		//$scope.$watch('wsc.observation_time', wsc.getLatLonForSelected);
```