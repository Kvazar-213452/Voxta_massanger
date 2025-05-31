package voxta.user;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.http.Context;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class GetChats {
    private static final Dotenv dotenv = Dotenv.load();

    public static void Get(Context ctx) {
        try {


            ctx.json(Map.of("status", 1));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.json(Map.of("status", 2));
        }
    }
}