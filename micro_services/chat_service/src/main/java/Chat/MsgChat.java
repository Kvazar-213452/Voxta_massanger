package voxta.chat;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;

public class MsgChat {
    private static final Dotenv dotenv = Dotenv.load();

    public static void Msg(Context ctx) {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            MongoDatabase database = mongoClient.getDatabase("chats");
            MongoCollection<Document> chatCollection = database.getCollection("chat");

            Map<String, Object> jsonBody = ctx.bodyAsClass(Map.class);

            Object messagesObj = jsonBody.get("data");
            if (!(messagesObj instanceof List<?>)) {
                ctx.status(HttpStatus.BAD_REQUEST)
                   .json(Map.of("status", 2, "error", "Missing or invalid 'data' array"));
                return;
            }

            @SuppressWarnings("unchecked")
            List<Object> messages = (List<Object>) messagesObj;

            if (messages.size() < 3 || !(messages.get(0) instanceof String)) {
                ctx.status(HttpStatus.BAD_REQUEST)
                   .json(Map.of("status", 2, "error", "Data array must have at least 3 elements: [chatId, message1, message2]"));
                return;
            }

            String chatId = (String) messages.get(0);

            Document chatDocument = chatCollection.find(new Document("_id", chatId)).first();

            if (chatDocument != null) {
                List<Object> newMessage = List.of(messages.get(1), messages.get(2), messages.get(3));

                chatCollection.updateOne(
                    new Document("_id", chatId),
                    Updates.push("messages", newMessage)
                );

                ctx.status(HttpStatus.OK)
                   .json(Map.of("status", 1, "message", "Messages added successfully"));
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
