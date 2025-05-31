package voxta.chat;

import com.mongodb.client.*;
import org.bson.Document;
import java.util.Arrays;

public class ServerChat {
    public static void main(String[] args) {
        // Підключення до MongoDB на localhost
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {

            // Вибір бази даних chats (буде створена автоматично, якщо нема)
            MongoDatabase database = mongoClient.getDatabase("chats");

            // Вибір колекції chat (буде створена автоматично, якщо нема)
            MongoCollection<Document> chatCollection = database.getCollection("chat");

            // Створення першого чату
            Document chat1 = new Document("_id", "chat1")
                .append("messages", Arrays.asList(
                    Arrays.asList("343243243333gegrgrg21", "healo")
                ));

            // Створення другого чату
            Document chat2 = new Document("_id", "chat2")
                .append("messages", Arrays.asList(
                    Arrays.asList("343243243333gegrgrg21", "221433243243243232432423")
                ));

            // Вставка чатів у колекцію
            chatCollection.insertMany(Arrays.asList(chat1, chat2));

            System.out.println("Два чати успішно створені у колекції chat.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
