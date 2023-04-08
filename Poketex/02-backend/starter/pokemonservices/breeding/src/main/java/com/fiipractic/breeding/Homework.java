package com.fiipractic.breeding;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Homework {

    public static void main(String[] args) {
        String baseUrl = "https://images.alexonsager.net/pokemon/fused/%d/%d.%d.png";
        String localDirectory = "images_fussions";
        int minRange = 1;
        int maxRange = 151;

        createDirectory(localDirectory);

        for (int x = minRange; x <= maxRange; x++) {
            for (int y = minRange; y <= maxRange; y++) {
                String imageUrl = String.format(baseUrl, x, x, y);
                String localFilePath = String.format("%s/%d.%d.png", localDirectory, x, y);
                downloadImage(imageUrl, localFilePath);
            }
        }
    }

    private static void createDirectory(String directory) {
        Path path = Paths.get(directory);
        if (!Files.exists(path)) {
            try {
                Files.createDirectory(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void downloadImage(String imageUrl, String localFilePath) {
        try (BufferedInputStream in = new BufferedInputStream(new URL(imageUrl).openStream());
             FileOutputStream fileOutputStream = new FileOutputStream(localFilePath)) {

            byte[] dataBuffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                fileOutputStream.write(dataBuffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}