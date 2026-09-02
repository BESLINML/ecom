
package com.example.demo.controller;

import com.example.demo.entity.Banner;
import com.example.demo.entity.BannerImage;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
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

            Banner banner = bannerRepository
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
            bannerImage.setContentType(file.getContentType());

            BannerImage savedImage =
                    bannerImageRepository.save(bannerImage);

            return ResponseEntity.ok(
                    "/api/banners/images/" + savedImage.getId()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Banner image upload failed: "
                        + e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET BANNER IMAGE
    //
    // IMPORTANT:
    // Do NOT use /api/banners/{id}
    // because BannerController already uses that URL.
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
                            MediaType.APPLICATION_OCTET_STREAM;

                    if (image.getContentType() != null &&
                            !image.getContentType().isBlank()) {

                        try {

                            mediaType =
                                    MediaType.parseMediaType(
                                            image.getContentType()
                                    );

                        } catch (Exception ignored) {
                        }
                    }

                    return ResponseEntity
                            .ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "max-age=31536000"
                            )
                            .body(image.getImageData());

                })
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // OLD BANNER IMAGE URL
    //
    // GET /api/images/banners/{id}
    //
    // Kept for old frontend compatibility.
    // =====================================================

    @GetMapping("/images/banners/{id}")
    public ResponseEntity<byte[]> getOldBannerImage(
            @PathVariable Long id) {

        return getBannerImage(id);
    }


    // =====================================================
    // OLD PRODUCT IMAGE URL
    //
    // GET /api/images/products/{id}
    //
    // Kept for old frontend compatibility.
    // =====================================================

    @GetMapping("/images/products/{id}")
    public ResponseEntity<byte[]> getOldProductImage(
            @PathVariable Long id) {

        return getProductImage(id);
    }


    // =====================================================
    // GET PRODUCT IMAGE
    //
    // GET /api/products/images/{id}
    //
    // NOTE:
    // ProductController already has this endpoint.
    //
    // This method is intentionally NOT mapped here.
    // =====================================================

    private ResponseEntity<byte[]> getProductImage(
            Long id) {

        return productImageRepository
                .findById(id)
                .map(image -> {

                    MediaType mediaType =
                            MediaType.APPLICATION_OCTET_STREAM;

                    if (image.getContentType() != null &&
                            !image.getContentType().isBlank()) {

                        try {

                            mediaType =
                                    MediaType.parseMediaType(
                                            image.getContentType()
                                    );

                        } catch (Exception ignored) {
                        }
                    }

                    return ResponseEntity
                            .ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "max-age=31536000"
                            )
                            .body(image.getImageData());

                })
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }
}
