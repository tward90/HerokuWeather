// ///////////////////////////////////////////////////////////
// // GLOBAL VARIABLES
// ///////////////////////////////////////////////////////////
let date,
    modelAvgTemp,
    modelMinTemp,
    modelMaxTemp,
    modelDewp,
    modelPres,
    modelVisib,
    modelWdsp,
    modelRain,
    modelFog,
    modelSnow,
    modelThunder,
    modelHail,
    OWMAvgTemp,
    OWMMinTemp,
    OWMMaxTemp,
    OWMDewp,
    OWMPres,
    OWMVisib,
    OWMWdsp,
    OWMRain,
    OWMFog,
    OWMSnow,
    OWMThunder,
    OWMHail;

//////////////////////////////////////////////////////////////////
// FUNCTION TO FETCH MODEL RESULTS AND OPENWEATHERMAP FORECAST
//////////////////////////////////////////////////////////////////
function init(){
    d3.json('/model_data')
    .then((response)=>{
        modelResults = response;
        console.log('Model Results:')
        console.log(modelResults);

        // extract the data needed for each graph
        params = Object.values(modelResults);
        timestamp = Object.keys(modelResults);
        dt = timestamp.map(item=>parseInt(item));
        date = dt.map(item=>new Date(item));
        modelAvgTemp = params.map(item => Math.round(item['temp']));
        modelMinTemp = params.map(item => Math.round(item['min']));
        modelMaxTemp = params.map(item => Math.round(item['max']));
        modelDewp = params.map(item => Math.round(item['dewp']));
        modelPres = params.map(item => Math.round(item['slp']));
        modelVisib = params.map(item => Math.round(item['visib']));
        modelWdsp = params.map(item => Math.round(item['wdsp']));
        modelRain = params.map(item => Math.round(item['rain_drizzle']*100));
        modelFog = params.map(item => Math.round(item['fog']*100));
        modelSnow = params.map(item => Math.round(item['snow_ice_pellets']*100));
        modelThunder = params.map(item => Math.round(item['thunder']*100));
        modelHail = params.map(item => Math.round(item['hail']*100));

        ////////////////////////////////////////////////
        // LSTM MODEL AVERAGE TEMPERATURE PLOT
        ////////////////////////////////////////////////

        // create a trace object with x as the dates and y as the predicted temperatures
        const avgTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Mean Temperature',
            x: date,
            y: modelAvgTemp,
            line: {color:"#729ECE"}
        };
        const minTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Min Temperature',
            x: date,
            y: modelMinTemp,
            line: {color:'#FF9E4A'}
        };
        const maxTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Max Temperature',
            x: date,
            y: modelMaxTemp,
            line: {color:'#67BF5C'}
        };
        // define layout
        const layout = {
            yaxis: {
                title: 'Temperature (°F)',
                autorange: true,
            },
            title: 'Predicted Temperatures'
        };
        Plotly.newPlot('LSTM-plot', [maxTempTrace, avgTempTrace, minTempTrace], layout);
    }); 
    d3.json('/forecast_data')
    .then((response)=>{
        OWMResults = response;
        console.log('OpenWeatherMap Results:')
        console.log(OWMResults);

        // extract the data needed for each graph
        params = Object.values(OWMResults);
        futureDates = Object.keys(OWMResults).map(item => new Date(parseInt(item)));
        console.log(futureDates);
        OWMAvgTemp = params.map(item => Math.round(item['temp']));
        OWMMinTemp = params.map(item => Math.round(item['min']));
        OWMMaxTemp = params.map(item => Math.round(item['max']));
        OWMDewp = params.map(item => Math.round(item['dewp']));
        OWMPres = params.map(item => Math.round(item['slp']));
        OWMVisib = params.map(item => Math.round(item['visib']));
        OWMWdsp = params.map(item => Math.round(item['wdsp']));
        OWMRain = params.map(item => Math.round(item['rain_drizzle']*100));
        OWMFog = params.map(item => Math.round(item['fog']*100));
        OWMSnow = params.map(item => Math.round(item['snow_ice_pellets']*100));
        OWMThunder = params.map(item => Math.round(item['thunder']*100));
        OWMHail = params.map(item => Math.round(item['hail']*100));

        ////////////////////////////////////////////////
        // OPENWEATHERMAP AVERAGE TEMPERATURE PLOT
        ////////////////////////////////////////////////

        // create a trace object with x as the dates and y as the predicted temperatures
        const avgTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Mean Temperature',
            x: futureDates,
            y: OWMAvgTemp,
            line: {color:"#729ECE"}
        };
        const minTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Min Temperature',
            x: futureDates,
            y: OWMMinTemp,
            line: {color:'#FF9E4A'}
        };
        const maxTempTrace = {
            type: 'scatter',
            mode: 'lines',
            name: 'Max Temperature',
            x: futureDates,
            y: OWMMaxTemp,
            line: {color:'#67BF5C'}
        };
        // define layout
        const layout = {
            yaxis: {
                title: 'Temperature (°F)',
                autorange: true,
            },
            title: 'Predicted Temperatures'
        };
        Plotly.newPlot('web-forecast-plot', [maxTempTrace, avgTempTrace, minTempTrace], layout);
    }); 
};

init()

//////////////////////////////////////////////////////////
// UPDATE PLOTS PER USER SELECTION
//////////////////////////////////////////////////////////

// Function to change model plot parameters based on user selection    
function chooseModelParameter (parameter){
    switch(parameter){
        case "temp":
            return [modelAvgTemp, modelMinTemp, modelMaxTemp];
        case "Dew Point (°F)":
            return modelDewp;
        case "Barometric Pressure (hPa)":
            return modelPres;
        case "Wind Speed (mph)":
            return modelWdsp;
        case "Visibility (mi)":
            return modelVisib;
        case "prcp":
            return [modelRain, modelFog, modelSnow, modelThunder, modelHail];
        default:
            return [modelAvgTemp, modelMinTemp, modelMaxTemp];
    }
};
// Function to change OpenWeatherMap plot parameters based on user selection   
function chooseOpenWeatherParameter (parameter){
    switch(parameter){
        case "temp":
            return [OWMAvgTemp, OWMMinTemp, OWMMaxTemp];
        case "Dew Point (°F)":
            return OWMDewp;
        case "Barometric Pressure (hPa)":
            return OWMPres;
        case "Wind Speed (mph)":
            return OWMWdsp;
        case "Visibility (mi)":
            return OWMVisib;
        case "prcp":
            return [OWMRain, OWMFog, OWMSnow, OWMThunder, OWMHail];
        default:
            return [OWMAvgTemp, OWMMinTemp, OWMMaxTemp];
    }
};

// Event handler to update interactive plots based on user selection
function handlePlotSubmit(){
    // use D3 to select the dropdown menu
    const dropdownMenu = d3.select('#parameters');

    // Assign the value of the dropdown menu option to a variable
    const parameter = dropdownMenu.property('value');

    // build a plot with the new subject
    updateInteractivePlot(parameter);
};

// Function to update the plots
function updateInteractivePlot(parameter){
    // array of available parameters for line graphs
    const parametersArr = [
        "temp",
        "Dew Point (°F)",
        "Barometric Pressure (hPa)",
        "Wind Speed (mph)",
        "Visibility (mi)"
    ];

    const parameterSelected = parameter;

    if(parametersArr.includes(parameterSelected)){
        // Plot the model temperature results
        if (parameterSelected == 'temp'){
            const modelAvgTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Mean Temperature',
                x: date,
                y: chooseModelParameter(parameterSelected)[0],
                line: {color:"#729ECE"}
            };
            const modelMinTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: date,
                y: chooseModelParameter(parameterSelected)[1],
                line: {color:'#FF9E4A'}
            };
            const modelMaxTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Max Temperature',
                x: date,
                y: chooseModelParameter(parameterSelected)[2],
                line: {color:'#67BF5C'}
            };
            // define layout
            const layout = {
                yaxis: {
                    title: 'Temperature (°F)',
                    autorange: true,
                    range: [-40,110]
                },
                title: 'Predicted Temperatures'
            };
            Plotly.newPlot('LSTM-plot', [modelMaxTempTrace, modelAvgTempTrace, modelMinTempTrace], layout);

            // Plot the forecasted temperatures from OpenWeatherMap
            const OWMAvgTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Mean Temperature',
                x: date,
                y: chooseOpenWeatherParameter(parameterSelected)[0],
                line: {color:"#729ECE"}
            };
            const OWMMinTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Min Temperature',
                x: date,
                y: chooseOpenWeatherParameter(parameterSelected)[1],
                line: {color:'#FF9E4A'}
            };
            const OWMMaxTempTrace = {
                type: 'scatter',
                mode: 'lines',
                name: 'Max Temperature',
                x: date,
                y: chooseOpenWeatherParameter(parameterSelected)[2],
                line: {color:'#67BF5C'}
            };
            // define layout
            const OWMlayout = {
                yaxis: {
                    title: 'Temperature (°F)',
                    autorange: true,
                    range: [-40,110]
                },
                title: 'Predicted Temperatures'
            };
            Plotly.newPlot('web-forecast-plot', [OWMMaxTempTrace, OWMAvgTempTrace, OWMMinTempTrace], OWMlayout);
        }
        else {
            // Plot model parameter chosen by user
            const modelParamTrace = {
                type: 'scatter',
                mode: 'lines',
                name: `${parameterSelected}`,
                x: date,
                y: chooseModelParameter(parameterSelected),
                line: {color:"#729ECE"}
            };
            // define layout
            const layout = {
                yaxis: {
                    title: `${parameterSelected}`,
                    autorange: true,
                    range: [-40,110]
                },
                title: `Predicted ${parameterSelected}`
            };
            Plotly.newPlot('LSTM-plot', [modelParamTrace], layout);

            //  Plot OpenWeather parameter chosen by user
            const OWMParamTrace = {
                type: 'scatter',
                mode: 'lines',
                name: `${parameterSelected}`,
                x: date,
                y: chooseOpenWeatherParameter(parameterSelected),
                line: {color:"#729ECE"}
            };
            // define layout
            const OWMlayout = {
                yaxis: {
                    title: `${parameterSelected}`,
                    autorange: true,
                    range: [-40,110]
                },
                title: `Predicted ${parameterSelected}`
            };
            Plotly.newPlot('web-forecast-plot', [OWMParamTrace], OWMlayout);
        }
    }
    else {
    // create a bar chart to show all other model parameters: rain, fog, snow, thunder, and hail
    const modelRainTrace = {
        x: date,
        y: modelRain,
        name: 'Rain or Drizzle',
        type: 'bar'
    };
    const modelFogTrace = {
        x: date,
        y: modelFog,
        name: 'Fog',
        type: 'bar'
    };
    const modelSnowTrace = {
        x: date,
        y: modelSnow,
        name: 'Snow',
        type: 'bar'
    };
    const modelThunderTrace = {
        x: date,
        y: modelThunder,
        name: 'Thunder',
        type: 'bar'
    };
    const modelHailTrace = {
        x: date,
        y: modelHail,
        name: 'Hail',
        type: 'bar'
    };

    const modelParametersTrace = [modelRainTrace, modelFogTrace, modelSnowTrace, modelThunderTrace, modelHailTrace];

    const modelGroupLayout = {
        barmode: 'group',
        title: 'Precipitation',
        yaxis:{
            title: 'Probability (%)'
        }
    };

    Plotly.newPlot('LSTM-plot', modelParametersTrace, modelGroupLayout);

    // create a bar chart to show all other OpenWeather parameters: rain, fog, snow, thunder, and hail
    const OWMrainTrace = {
        x: date,
        y: OWMRain,
        name: 'Rain or Drizzle',
        type: 'bar'
    };
    const OWMfogTrace = {
        x: date,
        y: OWMFog,
        name: 'Fog',
        type: 'bar'
    };
    const OWMsnowTrace = {
        x: date,
        y: OWMSnow,
        name: 'Snow',
        type: 'bar'
    };
    const OWMthunderTrace = {
        x: date,
        y: OWMThunder,
        name: 'Thunder',
        type: 'bar'
    };
    const OWMhailTrace = {
        x: date,
        y: OWMHail,
        name: 'Hail',
        type: 'bar'
    };

    const OWMParametersTrace = [OWMrainTrace, OWMfogTrace, OWMsnowTrace, OWMthunderTrace, OWMhailTrace];

    const OWMGroupLayout = {
        barmode: 'group',
        title: 'Precipitation',
        yaxis:{
            title: 'Probability (%)'
        }
    };

    Plotly.newPlot('web-forecast-plot', OWMParametersTrace, OWMGroupLayout);
    }
};