
//create click event for search button
$("#searchCities").click(function(e){
    
    e.preventDefault();
    //grab  user input
    var newCity = $("#cityName").val().trim();
    //added the input as a button
    $("#cityList").append($("<div>").text(newCity).attr("class", "cityButton").attr("data-city", newCity));
   
    var apikey = "df386f59bf9d0383f54b54bbe9ca2290"
    pushText(newCity);
    //create function to push weather info to html
    function pushText(){
        //use user input to call api information
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q="+newCity+"&appid="+apikey,
            method: "GET"
        }).then(function(response) {
                // get different stats and create tags to hold them
                var tempF = (response.main.temp - 273.15) * 1.80 + 32;
                var myTemp = $("<p>").text("Temp: ").attr("id", "tempF");
                myTemp.append($("<span>").text(tempF.toFixed(1) + "°F"));

                var myHumidity = $("<p>").text("Humidity: ").attr("id", "cityHumidity");
                myHumidity.append($("<span>").text(response.main.humidity + "%"));

                var windSpeed = $("<p>").text("Wind Speed: ").attr("id", "cityWS");
                windSpeed.append($("<span>").text(response.wind.speed+"MPH"));

                var getIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon  + "@2x.png").attr("id", "Icon")
                var cityName = $("<h3>").text(response.name +" ("+ moment().format("l")+")").attr("id", "cityName");
                cityName.append(getIcon)

                var lat = response.coord.lat
                var lon = response.coord.lon

                // use the lat and lon to call an api with a 10 day forcast
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon +"&exclude={part}&appid=" + apikey,
                    method: "GET"
                }).then(function(response){

                        //get uvi stat and use if-else logic to deterimine which class to assign
                        var uvi = $("<p>").text("UV Index: ").attr("id", "cityUVI");
                        var uviClass;
                        if (response.current.uvi <= 2.9){
                            uviClass ="good";
                        } else if (response.current.uvi >= 3 && response.current.uvi <= 7.9){
                            console.log(response.current.uvi)
                            uviClass = "moderate";
                        } else {
                            uviClass = "severe";
                        };
                        uvi.append($("<span>").text(response.current.uvi).attr("class", uviClass));
                        //create a div to hold all stat tags
                        var currentDiv = $("<div>").attr("class", "cd")
                        currentDiv.append(cityName);
                        currentDiv.append(myTemp);
                        currentDiv.append(myHumidity);
                        currentDiv.append(windSpeed);
                        currentDiv.append(uvi);

                        //empty the last citie's info
                        $("#currentCity").empty();
                        //append new info
                        $("#currentCity").append(currentDiv);
                        //remove five day info
                        $(".fD").remove()

                        //create a for loop that creates the five day forcast
                        for (i = 0; i < 5; i ++){
                            var dayTemp = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
                            var fdTemp = $("<p>").text("Temp: ").attr("class", "fd");
                            fdTemp.append($("<span>").text(dayTemp.toFixed(1) +"°F"));

                            var fdHumidity = $("<p>").text("Humidity: ").attr("class", "fd");
                            fdHumidity.append($("<span>").text(response.daily[i].humidity + "%"));
                            console.log(response.daily[i].dt)
                            var date = moment().add(i + 1,'days').format("l");
                            var day = $("<h6>").text(date)
                            console.log(date);

                            var getfdIcon = response.daily[i].weather[0].icon 
                            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + getfdIcon + "@2x.png").attr("class", "fdIcon")

                            var fDiv = $("<div>").attr("class", "card-body fD")

                            fDiv.append(day);
                            fDiv.append(icon);
                            fDiv.append(fdTemp);
                            fDiv.append(fdHumidity);
                            $("#fiveDay").append(fDiv);
                    
                        }
                    })
            });
        }
        //create a click event for the ciiy buttons 
        $(".cityButton").on("click", function(){
            newCity = $(this).attr("data-city")
            pushText(newCity);
            console.log($(this).attr("data-city"))
        })
});