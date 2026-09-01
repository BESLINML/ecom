
package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // PRODUCT DETAILS
    // =====================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private String subcategory;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double offerprice;

    @Column(length = 1000)
    private String description;

    // =====================================================
    // PRODUCT IMAGES
    // =====================================================

    @OneToMany(
        mappedBy = "product",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<ProductImage> images = new ArrayList<>();

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Product() {
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =====================================================
    // NAME
    // =====================================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // =====================================================
    // CATEGORY
    // =====================================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // =====================================================
    // SUBCATEGORY
    // =====================================================

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    // =====================================================
    // PRICE
    // =====================================================

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    // =====================================================
    // OFFER PRICE
    // =====================================================

    public Double getOfferprice() {
        return offerprice;
    }

    public void setOfferprice(Double offerprice) {
        this.offerprice = offerprice;
    }

    // =====================================================
    // DESCRIPTION
    // =====================================================

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // =====================================================
    // IMAGES
    // =====================================================

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {

        this.images.clear();

        if (images != null) {

            for (ProductImage image : images) {
                addImage(image);
            }
        }
    }

    // =====================================================
    // ADD IMAGE
    // =====================================================

    public void addImage(ProductImage image) {

        if (image == null) {
            return;
        }

        images.add(image);
        image.setProduct(this);
    }

    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    public void removeImage(ProductImage image) {

        if (image == null) {
            return;
        }

        images.remove(image);
        image.setProduct(null);
    }

    // =====================================================
    // CLEAR ALL IMAGES
    // =====================================================

    public void clearImages() {

        for (ProductImage image : images) {
            image.setProduct(null);
        }

        images.clear();
    }
}
