package voxta.user;

import io.javalin.Javalin;
import io.javalin.http.Context;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class AddNew {
    private static final String DB_PATH = "db/user.json";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void addUserHandler(Context ctx) {
        try {
            DataWrapper dataWrapper = ctx.bodyAsClass(DataWrapper.class);
            String[] userData = dataWrapper.data;

            String id = generateId(18);

            String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

            Map<String, Object> user = new HashMap<>();
            user.put("name", userData[0]);
            user.put("gmail", userData[1]);
            user.put("password", userData[2]);
            user.put("time", time);
            user.put("avatar", "http://localhost:" + dotenv.get("DATA_SERVICE") + "/");
            user.put("id", id);

            List<Map<String, Object>> users = new ArrayList<>();
            File dbFile = new File(DB_PATH);
            if (dbFile.exists()) {
                users = objectMapper.readValue(dbFile, new TypeReference<List<Map<String, Object>>>() {});
            }

            users.add(user);

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(dbFile, users);

            ctx.json(Collections.singletonMap("status", 1));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.json(Collections.singletonMap("status", 0));
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
