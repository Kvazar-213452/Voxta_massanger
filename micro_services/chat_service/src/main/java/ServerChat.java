package voxta.chat;

import com.mongodb.client.*;
import org.bson.Document;
import java.util.Arrays;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;
import io.javalin.json.JavalinJackson;

import voxta.chat.MakeChat;
import voxta.chat.GetChat;
import voxta.chat.MsgChat;
import voxta.chat.DelChat;

public class ServerChat {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        int port = Integer.parseInt(dotenv.get("CHAT_SERVICE"));

        Javalin app = Javalin.create(config -> {
            config.jsonMapper(new JavalinJackson());
        }).start(port);

        // get
        app.get("/", ctx -> ctx.result("chat service voxta"));

        // post
        app.post("/make_chat", MakeChat::Make);
        app.post("/get_chat", GetChat::Get);
        app.post("/del_chat", DelChat::Del);
        app.post("/msg_chat", MsgChat::Msg);
    }
}