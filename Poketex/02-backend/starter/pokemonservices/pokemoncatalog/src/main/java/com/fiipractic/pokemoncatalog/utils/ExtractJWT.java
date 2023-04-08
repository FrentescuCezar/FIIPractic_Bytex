package com.fiipractic.pokemoncatalog.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {
    public static String payloadJWTExtraction(String token, String extraction) {
        token.replace("Bearer", "");

        String[] split_string = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(split_string[1]));

        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<String, String>();

        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }

                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }

        if(map.containsKey(extraction)){
            return map.get(extraction);
        }

        return null;
    }

    public static String nameJWTExtraction(String token, String extraction) {
        token = token.replace("Bearer", "").trim();

        String[] split_string = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(split_string[1]));

        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<String, String>();

        for (String entry : entries) {
            String[] keyValue = entry.split(":");

            // Remove quotes and trim the key
            String key = keyValue[0].replace("\"", "").trim();

            if (key.equals(extraction)) {
                // Remove quotes, braces, and trim the value
                String value = keyValue[1].replace("\"", "").replace("}", "").trim();

                map.put(key, value);
            }
        }

        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }

        return null;
    }
}
