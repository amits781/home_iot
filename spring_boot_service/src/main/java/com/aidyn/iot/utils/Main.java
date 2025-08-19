// package com.aidyn.iot.utils;

// import com.google.gson.Gson;
// import com.google.gson.JsonElement;
// import com.google.gson.JsonObject;

// import java.util.Map.Entry;

// public class Main {
//     public static void main(String[] args) {
//         String jsonString = "{\"\": \"admin\"}";

//         Gson gson = new Gson();
//         JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class).getAsJsonObject();

//         for (Entry<String, JsonElement> entry : jsonObject.entrySet()) {
//             String key = entry.getKey();
//             String value = entry.getValue().getAsString(); // Convert the value to a string
//             System.out.println("Key: " + key);
//             System.out.println("Value: " + value);
//         }
//     }
// }
