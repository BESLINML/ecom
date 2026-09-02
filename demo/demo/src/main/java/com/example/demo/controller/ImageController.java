package com.example.demo.controller;

import com.example.demo.entity.Banner;
import com.example.demo.entity.BannerImage;
import com.example.demo.repository.BannerImageRepository;
import com.example.demo.repository.BannerRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://dynamic-jelly-ad6cf3.netlify.app",
        "https://ecommerce-ebbc4.web.app"
    }
)
public class ImageController {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    private final BannerRepository bannerRepository;
    private final BannerImageRepository bannerImageRepository;

    public ImageController(
            ProductRepository productRepository,
            ProductImageRepository productImageRepository,
            BannerRepository bannerRepository,
            BannerImageRepository bannerImageRepository) {

        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.bannerRepository = bannerRepository;
        this.bannerImageRepository = bannerImageRepository;
    }

    // =====================================================
    // BANNER IMAGE UPLOAD
    //
    // POST /api/banners/upload
    // =====================================================

    @PostMapping(
        value = "/banners/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadBannerImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("bannerId") Long bannerId) {

        try {

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Please select a banner image");
            }

            if (file.getContentType() == null ||
                    !file.getContentType().startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed");
            }

            Banner banner =
                    bannerRepository
                            .findById(bannerId)
                            .orElse(null);

            if (banner == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            BannerImage bannerImage =
                    bannerImageRepository
                            .findByBannerId(bannerId)
                            .orElse(new BannerImage());

            bannerImage.setBanner(banner);
            bannerImage.setImageData(file.getBytes());
            bannerImage.setContentType(
                    file.getContentType()
            );

            BannerImage savedImage =
                    bannerImageRepository.save(
                            bannerImage
                    );

            return ResponseEntity.ok(
                    "/api/banners/images/" +
                    savedImage.getId()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Banner image upload failed: " +
                        e.getMessage()
                    );
        }
    }

    // =====================================================
    // GET BANNER IMAGE
    //
    // GET /api/banners/images/{id}
    // =====================================================

    @GetMapping("/banners/images/{id}")
    public ResponseEntity<byte[]> getBannerImage(
            @PathVariable Long id) {

        return bannerImageRepository
                .findById(id)
                .map(image -> {

                    MediaType mediaType =
                            getMediaType(
                                    image.getContentType()
                            );

                    return ResponseEntity
                            .ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "public, max-age=31536000"
                            )
                            .body(
                                image.getImageData()
                            );
                })
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =====================================================
    // GET PRODUCT IMAGE
    //
    // THIS IS THE IMPORTANT ENDPOINT
    //
    // GET /api/products/images/{id}
    // =====================================================

    @GetMapping("/products/images/{id}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long id) {

        return productImageRepository
                .findById(id)
                .map(image -> {

                    MediaType mediaType =
                            getMediaType(
                                    image.getContentType()
                            );

                    byte[] imageData =
                            image.getImageData();

                    if (imageData == null ||
                            imageData.length == 0) {

                        return ResponseEntity
                                .status(404)
                                .<byte[]>build();
                    }

                    return ResponseEntity
                            .ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "public, max-age=31536000"
                            )
                            .body(imageData);
                })
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =====================================================
    // OLD PRODUCT IMAGE URL
    //
    // GET /api/images/products/{id}
    //
    // Keep for old frontend compatibility
    // =====================================================

    @GetMapping("/images/products/{id}")
    public ResponseEntity<byte[]> getOldProductImage(
            @PathVariable Long id) {

        return getProductImage(id);
    }

    // =====================================================
    // OLD BANNER IMAGE URL
    //
    // GET /api/images/banners/{id}
    //
    // Keep for old frontend compatibility
    // =====================================================

    @GetMapping("/images/banners/{id}")
    public ResponseEntity<byte[]> getOldBannerImage(
            @PathVariable Long id) {

        return getBannerImage(id);
    }

    // =====================================================
    // MEDIA TYPE
    // =====================================================

    private MediaType getMediaType(
            String contentType) {

        if (
            contentType != null &&
            !contentType.isBlank()
        ) {

            try {

                return MediaType.parseMediaType(
                        contentType
                );

            } catch (Exception ignored) {
            }
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }
}