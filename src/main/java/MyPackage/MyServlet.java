package MyPackage;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.Scanner;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

// @WebServlet("/MyServlet")
public class MyServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("index.html");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String apiKey = "2fb64bf6eed4e7516e52d58a3b439c94"; // Replace with your OpenWeather API key
        String city = request.getParameter("city");
        String latitude = request.getParameter("latitude");
        String longitude = request.getParameter("longitude");

        String apiUrl;

        // Determine whether to use city name or coordinates
        if (city != null && !city.isEmpty()) {
            // Use city name
            apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
        } else if (latitude != null && longitude != null) {
            // Use latitude and longitude
            apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
        } else {
            // Handle case where neither city nor coordinates are provided
            request.setAttribute("errorMessage", "Please provide a valid city name or coordinates.");
            request.getRequestDispatcher("index.jsp").forward(request, response);
            return;
        }

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            InputStream inputStream = connection.getInputStream();
            InputStreamReader reader = new InputStreamReader(inputStream);
            Scanner scanner = new Scanner(reader);
            StringBuilder responseContent = new StringBuilder();

            while (scanner.hasNext()) {
                responseContent.append(scanner.nextLine());
            }
            scanner.close();

            // Parse the JSON response to extract temperature, date, and humidity
            Gson gson = new Gson();
            JsonObject jsonObject = gson.fromJson(responseContent.toString(), JsonObject.class);

            // Date & Time
            long dateTimestamp = jsonObject.get("dt").getAsLong() * 1000;
            String date = new Date(dateTimestamp).toString();

            // Temperature
            double temperatureKelvin = jsonObject.getAsJsonObject("main").get("temp").getAsDouble();
            int temperatureCelsius = (int) (temperatureKelvin - 273.15);

            // Humidity
            int humidity = jsonObject.getAsJsonObject("main").get("humidity").getAsInt();

            // Wind Speed
            double windSpeed = jsonObject.getAsJsonObject("wind").get("speed").getAsDouble();

            // Weather Condition
            String weatherCondition = jsonObject.getAsJsonArray("weather")
                    .get(0).getAsJsonObject().get("main").getAsString();
            
            // Add Christmas-themed descriptions
            String christmasWeather = weatherCondition;
            switch(weatherCondition.toLowerCase()) {
                case "clear":
                    christmasWeather = "Magical Starlit Night";
                    break;
                case "clouds":
                    christmasWeather = "Santa's Cloud Cover";
                    break;
                case "rain":
                    christmasWeather = "Christmas Shower Blessing";
                    break;
                case "snow":
                    christmasWeather = "Holiday Snowfall Magic";
                    break;
                case "thunderstorm":
                    christmasWeather = "Magical Thunder Show";
                    break;
                case "mist":
                case "fog":
                    christmasWeather = "Christmas Morning Mist";
                    break;
            }
            
            request.setAttribute("weatherCondition", christmasWeather);

            // Set the data as request attributes for sending to the JSP page
            request.setAttribute("date", date);
            request.setAttribute("city", city != null ? city : "Location");
            request.setAttribute("temperature", temperatureCelsius);
            request.setAttribute("humidity", humidity);
            request.setAttribute("windSpeed", windSpeed);

        } catch (IOException e) {
            e.printStackTrace();
        }

        // Forward the request to the index.jsp page for rendering
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
}