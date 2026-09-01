package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://dynamic-jelly-ad6cf3.netlify.app",
        "https://ecommerce-ebbc4.web.app"
    }
)
public class ImageController {

    private final String uploadDir = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile file) {

        try {

            // ================================
            // CHECK FILE
            // ================================

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Please select an image");
            }

            // ================================
            // CHECK IMAGE TYPE
            // ================================

            String contentType = file.getContentType();

            if (contentType == null ||
                    !contentType.startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed");
            }

            // ================================
            // CREATE UPLOAD DIRECTORY
            // ================================

            Path uploadPath =
                    Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {

                Files.createDirectories(uploadPath);
            }

            // ================================
            // GET EXTENSION
            // ================================

            String originalName =
                    file.getOriginalFilename();

            String extension = "";

            if (originalName != null &&
                    originalName.contains(".")) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }

            // ================================
            // CREATE UNIQUE FILE NAME
            // ================================

            String fileName =
                    UUID.randomUUID()
                    + extension;

            // ================================
            // FILE PATH
            // ================================

            Path filePath =
                    uploadPath.resolve(fileName);

            // ================================
            // SAVE FILE
            // ================================

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // ================================
            // RETURN URL
            // ================================

            String imageUrl =
                    "/uploads/" + fileName;

            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Image upload failed: " + e.getMessage());
        }
    }
}