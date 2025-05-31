package voxta.chat;

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

public class DelChat {
    private static final Dotenv dotenv = Dotenv.load();

    public static void Del(Context ctx) {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("chats");
            MongoCollection<Document> chatCollection = database.getCollection("chat");

            Map<String, Object> jsonBody = ctx.bodyAsClass(Map.class);

            Object messagesObj = jsonBody.get("data");
            if (!(messagesObj instanceof List<?>)) {
                ctx.status(HttpStatus.BAD_REQUEST)
                   .json(Map.of("status", 2, "error", "Missing or invalid 'messages' array"));
                return;
            }

            @SuppressWarnings("unchecked")
            List<Object> messages = (List<Object>) messagesObj;

            if (messages.isEmpty() || !(messages.get(0) instanceof String)) {
                ctx.status(HttpStatus.BAD_REQUEST)
                   .json(Map.of("status", 2, "error", "First element of 'messages' must be a valid chat ID"));
                return;
            }

            String chatId = (String) messages.get(0);

            // Видалити документ за ID
            Document deleted = chatCollection.findOneAndDelete(new Document("_id", chatId));

            if (deleted != null) {
                ctx.status(HttpStatus.OK)
                   .json(Map.of("status", 1, "message", "Chat with ID '" + chatId + "' deleted successfully"));
            } else {
                ctx.status(HttpStatus.NOT_FOUND)
                   .json(Map.of("status", 2, "error", "Chat with ID '" + chatId + "' not found"));
            }

        } catch (Exception e) {
            ctx.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .json(Map.of("status", 2, "error", e.getMessage()));
            e.printStackTrace();
        }
    }
}
