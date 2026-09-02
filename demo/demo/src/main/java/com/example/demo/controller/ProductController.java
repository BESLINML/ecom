package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductImageRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://dynamic-jelly-ad6cf3.netlify.app",
        "https://ecommerce-ebbc4.web.app"
    }
)
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ProductController(
            ProductRepository productRepository,
            ProductImageRepository productImageRepository) {

        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    // =====================================================
    // ADD SINGLE PRODUCT
    // POST /api/products
    // =====================================================

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product) {

        Product savedProduct =
                productRepository.save(product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }

    // =====================================================
    // ADD MULTIPLE PRODUCTS
    // POST /api/products/bulk
    // =====================================================

    @PostMapping("/bulk")
    public ResponseEntity<List<Product>> addMultipleProducts(
            @RequestBody List<Product> products) {

        List<Product> savedProducts =
                productRepository.saveAll(products);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProducts);
    }

    // =====================================================
    // GET ALL PRODUCTS
    // GET /api/products
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {

        List<Product> products =
                productRepository.findAll();

        return ResponseEntity.ok(products);
    }

    // =====================================================
    // GET SINGLE PRODUCT
    // GET /api/products/{id}
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(
            @PathVariable Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Product not found with id: " + id
                                )
                        );

        return ResponseEntity.ok(product);
    }

    // =====================================================
    // ADD PRODUCT WITH MULTIPLE IMAGES
    //
    // POST /api/products/upload
    // =====================================================

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> addProductWithImages(

            @RequestParam("name")
            String name,

            @RequestParam("category")
            String category,

            @RequestParam(
                value = "subcategory",
                required = false
            )
            String subcategory,

            @RequestParam("price")
            Double price,

            @RequestParam("offerprice")
            Double offerprice,

            @RequestParam(
                value = "description",
                required = false
            )
            String description,

            @RequestParam(
                value = "images",
                required = false
            )
            MultipartFile[] images)

            throws Exception {

        // =================================================
        // CREATE PRODUCT
        // =================================================

        Product product = new Product();

        product.setName(name);
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setPrice(price);
        product.setOfferprice(offerprice);
        product.setDescription(description);

        // =================================================
        // ADD IMAGES TO PRODUCT
        // =================================================

        if (images != null) {

            for (MultipartFile file : images) {

                if (file == null || file.isEmpty()) {
                    continue;
                }

                if (
                    file.getContentType() == null ||
                    !file.getContentType()
                            .startsWith("image/")
                ) {
                    continue;
                }

                ProductImage productImage =
                        new ProductImage();

                productImage.setImageData(
                        file.getBytes()
                );

                productImage.setContentType(
                        file.getContentType()
                );

                // IMPORTANT
                product.addImage(productImage);
            }
        }

        // =================================================
        // SAVE PRODUCT + IMAGES
        // =================================================

        Product savedProduct =
                productRepository.save(product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }

    // =====================================================
    // UPLOAD IMAGES TO EXISTING PRODUCT
    //
    // POST /api/products/{id}/images
    // =====================================================

    @PostMapping(
        value = "/{id}/images",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadImages(
            @PathVariable Long id,
            @RequestParam("images")
            MultipartFile[] images)
            throws Exception {

        // =================================================
        // FIND PRODUCT
        // =================================================

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Product not found with id: " + id
                                )
                        );

        // =================================================
        // VALIDATE IMAGES
        // =================================================

        if (
            images == null ||
            images.length == 0
        ) {

            return ResponseEntity
                    .badRequest()
                    .body("No images selected");
        }

        int uploadedCount = 0;

        // =================================================
        // SAVE IMAGES
        // =================================================

        for (MultipartFile file : images) {

            if (file == null || file.isEmpty()) {
                continue;
            }

            if (
                file.getContentType() == null ||
                !file.getContentType()
                        .startsWith("image/")
            ) {

                continue;
            }

            ProductImage productImage =
                    new ProductImage();

            productImage.setImageData(
                    file.getBytes()
            );

            productImage.setContentType(
                    file.getContentType()
            );

            // IMPORTANT
            product.addImage(productImage);

            uploadedCount++;
        }

        // =================================================
        // SAVE PRODUCT + NEW IMAGES
        // =================================================

        productRepository.save(product);

        return ResponseEntity.ok(
                uploadedCount +
                " image(s) uploaded successfully"
        );
    }

    // =====================================================
    // GET PRODUCT IMAGE
    //
    // GET /api/products/images/{imageId}
    // =====================================================

    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long imageId) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Image not found with id: " +
                                    imageId
                                )
                        );

        MediaType mediaType;

        try {

            mediaType =
                    MediaType.parseMediaType(
                            image.getContentType()
                    );

        } catch (Exception e) {

            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(image.getImageData());
    }

    // =====================================================
    // GET ALL IMAGES FOR PRODUCT
    //
    // GET /api/products/{id}/images
    // =====================================================

    @GetMapping("/{id}/images")
    public ResponseEntity<List<String>> getProductImages(
            @PathVariable Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Product not found with id: " +
                                    id
                                )
                        );

        List<String> imageUrls =
                new ArrayList<>();

        for (
            ProductImage image :
            product.getImages()
        ) {

            imageUrls.add(
                    "/api/products/images/" +
                    image.getId()
            );
        }

        return ResponseEntity.ok(imageUrls);
    }

    // =====================================================
    // UPDATE PRODUCT
    //
    // PUT /api/products/{id}
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Product not found with id: " +
                                    id
                                )
                        );

        existingProduct.setName(
                product.getName()
        );

        existingProduct.setCategory(
                product.getCategory()
        );

        existingProduct.setSubcategory(
                product.getSubcategory()
        );

        existingProduct.setPrice(
                product.getPrice()
        );

        existingProduct.setOfferprice(
                product.getOfferprice()
        );

        existingProduct.setDescription(
                product.getDescription()
        );

        Product updatedProduct =
                productRepository.save(
                        existingProduct
                );

        return ResponseEntity.ok(
                updatedProduct
        );
    }

    // =====================================================
    // DELETE PRODUCT
    //
    // DELETE /api/products/{id}
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Product not found with id: " +
                                    id
                                )
                        );

        // CascadeType.ALL + orphanRemoval
        // will remove product images too.

        productRepository.delete(product);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }

    // =====================================================
    // DELETE PRODUCT IMAGE
    //
    // DELETE /api/products/images/{imageId}
    // =====================================================

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<String> deleteProductImage(
            @PathVariable Long imageId) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Image not found with id: " +
                                    imageId
                                )
                        );

        productImageRepository.delete(image);

        return ResponseEntity.ok(
                "Image deleted successfully"
        );
    }
}