package voxta.user;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.http.Context;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.javalin.http.HttpStatus;

import org.bson.Document;

import java.util.*;

public class AddNew {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Dotenv dotenv = Dotenv.load();

    public static void addUserHandler(Context ctx) {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("users");
            MongoCollection<Document> usersCollection = database.getCollection("users");

            Map<String, Object> jsonBody = ctx.bodyAsClass(Map.class);

            Object messagesObj = jsonBody.get("data");
            if (!(messagesObj instanceof List<?>)) {
                ctx.status(HttpStatus.BAD_REQUEST)
                   .json(Map.of("status", 2, "error", "Missing or invalid 'messages' array"));
                return;
            }

            @SuppressWarnings("unchecked")
            List<Object> data_res = (List<Object>) messagesObj;

            String id = generateId(18);

            Document userDoc = new Document("_id", id)
                    .append("name", data_res.get(0))
                    .append("gmail",  data_res.get(1))
                    .append("password",  data_res.get(2))
                    .append("time", data_res.get(3))
                    .append("avatar", "http://localhost:" + dotenv.get("DATA_SERVICE") + "/")
                    .append("desc", "hello");

            usersCollection.insertOne(userDoc);

            FuncGlobal.AuthLogin(id);

            ctx.json(Map.of("status", 1, "id", id));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.json(Map.of("status", 0, "error", e.getMessage()));
        }
    }

    public static String generateId(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder idBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            idBuilder.append(chars.charAt(random.nextInt(chars.length())));
        }
        return idBuilder.toString();
    }
}
