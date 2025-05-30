package voxta.user;

import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class FuncGlobal {
    private static final Dotenv dotenv = Dotenv.load();
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final HttpClient httpClient = HttpClient.newHttpClient();

    public static boolean AuthLogin(String userId) {
        try {
            ObjectNode json = mapper.createObjectNode();
            json.put("id", userId);
            String requestBody = mapper.writeValueAsString(json);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:" + dotenv.get("AUTH_SERVICE") + "/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.statusCode() == 200;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}