<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App - FUNTOONS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="style.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet">
    <style>
        /* Weather display styling */
        .weather-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 2.5rem;
            padding: 3rem;
        }

        .weather-item {
            background: rgba(13, 24, 41, 0.9);
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 20px;
            padding: 2.5rem 2rem;
            min-height: 220px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .weather-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                45deg,
                rgba(99, 179, 237, 0.1),
                rgba(66, 153, 225, 0.1)
            );
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .weather-item:hover {
            transform: translateY(-5px);
            border-color: rgba(99, 179, 237, 0.4);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2),
                        0 0 20px rgba(99, 179, 237, 0.2);
        }

        .weather-item:hover::before {
            opacity: 1;
        }

        /* Weather info styling */
        .cityDetails {
            font-size: 3.2rem;
            color: #63b3ed;
            text-shadow: 0 0 20px rgba(99, 179, 237, 0.4);
            margin-bottom: 2.5rem;
        }

        .weather-icon {
            font-size: 2.8rem;
            margin-bottom: 2rem;
            color: #63b3ed;
            filter: drop-shadow(0 0 10px rgba(99, 179, 237, 0.4));
        }

        .date {
            color: #90cdf4;
            font-size: 1.6rem;
            text-shadow: 0 0 10px rgba(144, 205, 244, 0.4);
        }

        .temp {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            color: #63b3ed;
            line-height: 1.3;
        }

        .temp strong {
            font-size: 1.6rem;
            color: #ffd700;
            margin: 0.3rem 0;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .temperature-value {
            font-size: 2.4rem;
            color: #63b3ed;
            font-weight: 600;
            margin-top: 0.3rem;
            text-shadow: 0 0 10px rgba(99, 179, 237, 0.4);
        }

        .condition {
            color: #9f7aea;
            font-size: 1.8rem;
            text-shadow: 0 0 10px rgba(159, 122, 234, 0.4);
        }

        .humidity {
            color: #4299e1;
            font-size: 1.8rem;
            text-shadow: 0 0 10px rgba(66, 153, 225, 0.4);
        }

        .wind {
            color: #48bb78;
            font-size: 1.8rem;
            text-shadow: 0 0 10px rgba(72, 187, 120, 0.4);
        }

        /* Back button styling */
        .btn-back {
            background: rgba(99, 179, 237, 0.1);
            border: 1px solid rgba(99, 179, 237, 0.2);
            color: #63b3ed;
            padding: 1rem 2.5rem;
            border-radius: 12px;
            font-size: 1.6rem;
            transition: all 0.3s ease;
        }

        .btn-back:hover {
            background: rgba(99, 179, 237, 0.2);
            border-color: rgba(99, 179, 237, 0.4);
            box-shadow: 0 0 20px rgba(99, 179, 237, 0.2);
            transform: translateY(-2px);
        }

        /* Earth section enhancement */
        .earth-section {
            padding: 4rem 2rem;
        }

        #earth-container {
            border: 1px solid rgba(99, 179, 237, 0.2);
            box-shadow: 0 0 40px rgba(99, 179, 237, 0.15);
            border-radius: 20px;
            overflow: hidden;
        }
    </style>
</head>

<body>
    <div class="magical-sparkles"></div>
    <div class="mainContainer">
        <nav class="navbar">
            <div class="logo">
                <i class="fas fa-hat-wizard"></i>
                <span>Magical Weather Charm</span>
            </div>
        </nav>

        <%
        String errorMessage = (String) request.getAttribute("errorMessage");
        if (errorMessage != null) {
        %>
            <div class="error-message"><%= errorMessage %></div>
        <% } else { 
           String date = (String) request.getAttribute("date");
           String city = (String) request.getAttribute("city");
           Integer temperature = (Integer) request.getAttribute("temperature");
           Integer humidity = (Integer) request.getAttribute("humidity");
           Double windSpeed = (Double) request.getAttribute("windSpeed"); %>

            <div class="weather-info">
                <h2 class="cityDetails">
                    <i class="fas fa-map-marker-alt"></i> 
                    <%= city != null ? city : "Unknown Realm" %>
                    <% 
                        String lat = request.getParameter("latitude");
                        String lon = request.getParameter("longitude");
                        if (lat != null && lon != null && !lat.isEmpty() && !lon.isEmpty()) { 
                    %>
                        <div class="coordinates">
                            <i class="fas fa-compass"></i>
                            <%= String.format("%.4f°, %.4f°", 
                                Double.parseDouble(request.getParameter("latitude")),
                                Double.parseDouble(request.getParameter("longitude"))) %>
                        </div>
                    <% } %>
                </h2>
                
                <div class="weather-grid">
                    <div class="weather-item">
                        <i class="fas fa-hourglass-half weather-icon"></i>
                        <div class="date">
                            <span class="label">Time Turner</span>
                            <span class="value">${date}</span>
                            <span class="subtitle">Mystical Time</span>
                        </div>
                    </div>
                    
                    <div class="weather-item">
                        <i class="fas fa-temperature-high weather-icon"></i>
                        <div class="temp">
                            <span class="label">Temperature</span>
                            <span class="value">${temperature}°C</span>
                            <span class="subtitle">Charm</span>
                        </div>
                    </div>
                    
                    <div class="weather-item">
                        <i class="fas fa-cloud weather-icon"></i>
                        <div class="condition">
                            <span class="label">Atmospheric</span>
                            <span class="value">${weatherCondition}</span>
                            <span class="subtitle">Enchantment</span>
                        </div>
                    </div>
                    
                    <div class="weather-item">
                        <i class="fas fa-tint weather-icon"></i>
                        <div class="humidity">
                            <span class="label">Humidity</span>
                            <span class="value">${humidity}%</span>
                            <span class="subtitle">Charm</span>
                        </div>
                    </div>
                    
                    <div class="weather-item">
                        <i class="fas fa-wind weather-icon"></i>
                        <div class="wind">
                            <span class="label">Wind</span>
                            <span class="value">${windSpeed} m/s</span>
                            <span class="subtitle">Spell</span>
                        </div>
                    </div>
                </div>
            </div>
        <% } %>

        <div class="earth-section" style="padding: 4rem 2rem; text-align: center;">
            <h2 style="font-size: 3rem; margin-bottom: 2rem; color: #fff;">Click Anywhere on the Globe</h2>
            <div id="earth-container"></div>
        </div>

        <div class="back-link">
            <a href="index.html" class="btn-back">
                <i class="fas fa-arrow-left"></i> Back to Home
            </a>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="myScript.js"></script>
</body>

</html>
