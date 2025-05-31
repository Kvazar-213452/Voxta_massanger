package voxta.chat;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;

public class MakeChat {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();

    public static void Make(Context ctx) {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("chats");
            MongoCollection<Document> chatCollection = database.getCollection("chat");

            Map<String, Object> jsonBody = ctx.bodyAsClass(Map.class);

            Object messagesObj = jsonBody.get("data");

            if (!(messagesObj instanceof List<?>)) {
                ctx.status(HttpStatus.BAD_REQUEST).json(Map.of("status", 2, "error", "Missing or invalid 'messages' array"));
                return;
            }

            @SuppressWarnings("unchecked")
            List<Object> messages = (List<Object>) messagesObj;

            String uniqueId = generateUniqueId(18);

            Document chatDoc = new Document("_id", uniqueId)
                                    .append("participants", messages);

            chatCollection.insertOne(chatDoc);

            System.out.println("Chat created with ID: " + uniqueId);

            // Відповідаємо
            ctx.json(Map.of("status", 1, "chatId", uniqueId));
        } catch (Exception e) {
            ctx.json(Map.of("status", 2, "error", e.getMessage()));
            e.printStackTrace();
        }
    }

    private static String generateUniqueId(int length) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(ALPHA_NUMERIC_STRING.length());
            builder.append(ALPHA_NUMERIC_STRING.charAt(index));
        }
        return builder.toString();
    }
}
