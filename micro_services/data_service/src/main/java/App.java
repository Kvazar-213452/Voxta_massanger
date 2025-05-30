package voxta.data;

import io.javalin.Javalin;

public class App {
    public static void main(String[] args) {
        Javalin app = Javalin.create().start(7000);

        app.get("/", ctx -> ctx.result("Hello, Microservice on Javalin!"));

        app.get("/user/{id}", ctx -> {
            String userId = ctx.pathParam("id");
            ctx.json(new User(userId, "User " + userId));
        });
    }

    public static class User {
        public String id;
        public String name;

        public User(String id, String name) {
            this.id = id;
            this.name = name;
        }
    }
}
