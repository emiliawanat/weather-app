const http = require('http');
const https = require('https');
const api = require('./api.json');

// Print out temp details
function printWeather(weather) {
    const message = `Current temperature in ${weather.name} is ${weather.main.temp}°C`;
    console.log(message);
}

// Print out error message
function printError(error) {
    console.error(error.message)
}

function get(query) {
    //Take out underscores for readability
    const readableQuery = query.replace('_', ' ');
    try {
        const request = https.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${api.key}`, response => {
            if (response.statusCode === 200) {
                let body = "";
                // Read the data
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    try {            
                        //Parse data
                        const weather = JSON.parse(body);
                        // Check if the location was found before printing
                        if (weather.name) {
                            //Print the data
                            printWeather(weather);
                        } else {
                            const queryError = new Error(`The location "${readableQuery}" was not found`);
                            printError(queryError);
                        }
                    } catch (error) {
                        // Parse Error
                        printError(error);
                    }
                });
            } else {
                // Status Code Error
                const statusCodeError = new Error(`There was an error getting the message for ${readableQuery}. (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusCodeError);
            }
    
        });

        request.on("error", printError);
    } catch (error) {
        // Malformed URL Error
        printError(error);
    }
}

module.exports.get = get;