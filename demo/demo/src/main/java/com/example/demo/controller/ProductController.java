package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ==========================================
    // ADD SINGLE PRODUCT
    // ==========================================

    @PostMapping
    public Product addProduct(@RequestBody Product product) {

        return productRepository.save(product);
    }

    // ==========================================
    // ADD MULTIPLE PRODUCTS
    // ==========================================

    @PostMapping("/bulk")
    public List<Product> addMultipleProducts(
            @RequestBody List<Product> products) {

        return productRepository.saveAll(products);
    }

    // ==========================================
    // GET ALL PRODUCTS
    // ==========================================

    @GetMapping
    public List<Product> getProducts() {

        return productRepository.findAll();
    }

    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
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

        existingProduct.setImage(
                product.getImage()
        );

        return productRepository.save(
                existingProduct
        );
    }

    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id) {

        productRepository.deleteById(id);
    }
}