package voxta.user;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.json.JavalinJackson;
import voxta.user.UserFunc;

public class ServerUser {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        int port = Integer.parseInt(dotenv.get("USER_SERVICE"));

        Javalin app = Javalin.create(config -> {
            config.jsonMapper(new JavalinJackson());
        }).start(port);

        // get
        app.get("/", ctx -> ctx.result("user service voxta"));

        // post
        app.post("/add_user", UserFunc::AddUser);
        app.post("/get_user", UserFunc::GetUser);
    }
}
