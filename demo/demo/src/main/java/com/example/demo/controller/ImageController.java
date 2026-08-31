
package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://dynamic-jelly-ad6cf3.netlify.app",
        "https://ecommerce-ebbc4.web.app"
})
public class ImageController {

    private final String uploadDir = "uploads/";

    // =====================================================
    // UPLOAD IMAGE
    // =====================================================

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadImage(
            @RequestPart("image") MultipartFile file) {

        try {

            // =================================================
            // CHECK FILE
            // =================================================

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Please select an image");
            }


            // =================================================
            // CHECK ORIGINAL FILE NAME
            // =================================================

            String originalName =
                    file.getOriginalFilename();

            if (originalName == null ||
                    originalName.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid image filename");
            }


            // =================================================
            // CREATE UPLOAD DIRECTORY
            // =================================================

            Path uploadPath =
                    Paths.get(uploadDir)
                            .toAbsolutePath()
                            .normalize();

            if (!Files.exists(uploadPath)) {

                Files.createDirectories(uploadPath);
            }


            // =================================================
            // GET FILE EXTENSION
            // =================================================

            String extension = "";

            int lastDot =
                    originalName.lastIndexOf(".");

            if (lastDot >= 0) {

                extension =
                        originalName.substring(lastDot)
                                .toLowerCase();
            }


            // =================================================
            // GENERATE UNIQUE FILE NAME
            // =================================================

            String fileName =
                    UUID.randomUUID()
                            .toString()
                    + extension;


            // =================================================
            // FILE PATH
            // =================================================

            Path filePath =
                    uploadPath.resolve(fileName)
                            .normalize();


            // =================================================
            // SAVE FILE
            // =================================================

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );


            // =================================================
            // RETURN IMAGE URL
            // =================================================

            String imageUrl =
                    "/uploads/" + fileName;


            System.out.println(
                    "Image uploaded successfully: "
                    + fileName
            );

            System.out.println(
                    "Image URL: "
                    + imageUrl
            );


            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Image upload failed: "
                            + e.getMessage()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unexpected image upload error: "
                            + e.getMessage()
                    );
        }
    }
}
