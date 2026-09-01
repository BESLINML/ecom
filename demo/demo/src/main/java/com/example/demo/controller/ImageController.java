package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.entity.Banner;
import com.example.demo.entity.BannerImage;

import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.BannerRepository;
import com.example.demo.repository.BannerImageRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    // UPLOAD PRODUCT IMAGE
    // =====================================================

    @PostMapping("/products/upload")
    public ResponseEntity<String> uploadProductImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("productId") Long productId) {

        try {

            // -------------------------------------------------
            // CHECK FILE
            // -------------------------------------------------

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Please select an image");
            }


            // -------------------------------------------------
            // CHECK IMAGE TYPE
            // -------------------------------------------------

            if (file.getContentType() == null ||
                    !file.getContentType().startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed");
            }


            // -------------------------------------------------
            // FIND PRODUCT
            // -------------------------------------------------

            Product product =
                    productRepository.findById(productId)
                            .orElse(null);

            if (product == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // -------------------------------------------------
            // CREATE PRODUCT IMAGE
            // -------------------------------------------------

            ProductImage productImage =
                    new ProductImage();

            productImage.setProduct(product);

            productImage.setImageData(
                    file.getBytes()
            );

            productImage.setContentType(
                    file.getContentType()
            );


            // -------------------------------------------------
            // SAVE IMAGE TO MYSQL
            // -------------------------------------------------

            ProductImage savedImage =
                    productImageRepository.save(
                            productImage
                    );


            // -------------------------------------------------
            // RETURN IMAGE URL
            // -------------------------------------------------

            return ResponseEntity.ok(
                    "/api/images/products/"
                    + savedImage.getId()
            );


        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        "Product image upload failed: "
                        + e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    @GetMapping("/products/{id}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long id) {

        return productImageRepository
                .findById(id)
                .map(image -> {

                    MediaType mediaType =
                            MediaType.parseMediaType(
                                    image.getContentType()
                            );

                    return ResponseEntity.ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "max-age=31536000"
                            )
                            .body(
                                image.getImageData()
                            );

                })
                .orElseGet(
                    () -> ResponseEntity
                            .notFound()
                            .build()
                );
    }


    // =====================================================
    // UPLOAD BANNER IMAGE
    // =====================================================

    @PostMapping("/banners/upload")
    public ResponseEntity<String> uploadBannerImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("bannerId") Long bannerId) {

        try {

            // -------------------------------------------------
            // CHECK FILE
            // -------------------------------------------------

            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Please select a banner image");
            }


            // -------------------------------------------------
            // CHECK IMAGE TYPE
            // -------------------------------------------------

            if (file.getContentType() == null ||
                    !file.getContentType().startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed");
            }


            // -------------------------------------------------
            // FIND BANNER
            // -------------------------------------------------

            Banner banner =
                    bannerRepository.findById(bannerId)
                            .orElse(null);

            if (banner == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // -------------------------------------------------
            // CREATE BANNER IMAGE
            // -------------------------------------------------

            BannerImage bannerImage =
                    bannerImageRepository
                            .findByBannerId(bannerId)
                            .orElse(
                                new BannerImage()
                            );

            bannerImage.setBanner(banner);

            bannerImage.setImageData(
                    file.getBytes()
            );

            bannerImage.setContentType(
                    file.getContentType()
            );


            // -------------------------------------------------
            // SAVE IMAGE TO MYSQL
            // -------------------------------------------------

            BannerImage savedImage =
                    bannerImageRepository.save(
                            bannerImage
                    );


            // -------------------------------------------------
            // RETURN IMAGE URL
            // -------------------------------------------------

            return ResponseEntity.ok(
                    "/api/images/banners/"
                    + savedImage.getId()
            );


        } catch (IOException e) {

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
    // =====================================================

    @GetMapping("/banners/{id}")
    public ResponseEntity<byte[]> getBannerImage(
            @PathVariable Long id) {

        return bannerImageRepository
                .findById(id)
                .map(image -> {

                    MediaType mediaType =
                            MediaType.parseMediaType(
                                    image.getContentType()
                            );

                    return ResponseEntity.ok()
                            .contentType(mediaType)
                            .header(
                                HttpHeaders.CACHE_CONTROL,
                                "max-age=31536000"
                            )
                            .body(
                                image.getImageData()
                            );

                })
                .orElseGet(
                    () -> ResponseEntity
                            .notFound()
                            .build()
                );
    }
}