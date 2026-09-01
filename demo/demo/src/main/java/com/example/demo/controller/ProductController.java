
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
@CrossOrigin(origins = "http://localhost:5173")
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
    // ADD SINGLE PRODUCT - JSON
    // =====================================================

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product) {

        Product savedProduct = productRepository.save(product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }

    // =====================================================
    // ADD MULTIPLE PRODUCTS
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
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {

        List<Product> products =
                productRepository.findAll();

        return ResponseEntity.ok(products);
    }

    // =====================================================
    // GET SINGLE PRODUCT
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

            @RequestParam(value = "subcategory", required = false)
            String subcategory,

            @RequestParam("price")
            Double price,

            @RequestParam("offerprice")
            Double offerprice,

            @RequestParam(value = "description", required = false)
            String description,

            @RequestParam(value = "images", required = false)
            MultipartFile[] images) throws Exception {

        // ================================================
        // CREATE PRODUCT
        // ================================================

        Product product = new Product();

        product.setName(name);
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setPrice(price);
        product.setOfferprice(offerprice);
        product.setDescription(description);

        // ================================================
        // SAVE PRODUCT FIRST
        // ================================================

        Product savedProduct =
                productRepository.save(product);

        // ================================================
        // SAVE IMAGES
        // ================================================

        if (images != null) {

            for (MultipartFile file : images) {

                if (file == null || file.isEmpty()) {
                    continue;
                }

                ProductImage productImage =
                        new ProductImage();

                productImage.setProduct(savedProduct);

                productImage.setImageData(
                        file.getBytes()
                );

                productImage.setContentType(
                        file.getContentType()
                );

                productImageRepository.save(
                        productImage
                );
            }
        }

        // ================================================
        // RETURN UPDATED PRODUCT
        // ================================================

        Product finalProduct =
                productRepository.findById(savedProduct.getId())
                        .orElse(savedProduct);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(finalProduct);
    }

    // =====================================================
    // UPLOAD IMAGES TO EXISTING PRODUCT
    // =====================================================

    @PostMapping(
            value = "/{id}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadImages(
            @PathVariable Long id,
            @RequestParam("images") MultipartFile[] images)
            throws Exception {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        if (images == null || images.length == 0) {

            return ResponseEntity
                    .badRequest()
                    .body("No images selected");
        }

        int uploadedCount = 0;

        for (MultipartFile file : images) {

            if (file == null || file.isEmpty()) {
                continue;
            }

            ProductImage productImage =
                    new ProductImage();

            productImage.setProduct(product);

            productImage.setImageData(
                    file.getBytes()
            );

            productImage.setContentType(
                    file.getContentType()
            );

            productImageRepository.save(
                    productImage
            );

            uploadedCount++;
        }

        return ResponseEntity.ok(
                uploadedCount +
                " image(s) uploaded successfully"
        );
    }

    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long imageId) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Image not found with id: " + imageId
                                )
                        );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                image.getContentType()
                        )
                )
                .body(image.getImageData());
    }

    // =====================================================
    // GET ALL IMAGES FOR PRODUCT
    // =====================================================

    @GetMapping("/{id}/images")
    public ResponseEntity<List<String>> getProductImages(
            @PathVariable Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        List<String> imageUrls =
                new ArrayList<>();

        for (ProductImage image : product.getImages()) {

            imageUrls.add(
                    "/api/products/images/" +
                    image.getId()
            );
        }

        return ResponseEntity.ok(imageUrls);
    }

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
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
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: " + id
                                )
                        );

        productRepository.delete(product);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }

    // =====================================================
    // DELETE PRODUCT IMAGE
    // =====================================================

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<String> deleteProductImage(
            @PathVariable Long imageId) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Image not found with id: " + imageId
                                )
                        );

        productImageRepository.delete(image);

        return ResponseEntity.ok(
                "Image deleted successfully"
        );
    }
}
