
package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // PRODUCT
    // =====================================================

    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "product_id",
        nullable = false
    )
    @JsonIgnore
    private Product product;

    // =====================================================
    // IMAGE DATA
    // =====================================================

    @Lob
    @Column(
        name = "image_data",
        columnDefinition = "LONGBLOB",
        nullable = false
    )
    private byte[] imageData;

    // =====================================================
    // CONTENT TYPE
    // =====================================================

    @Column(
        name = "content_type",
        length = 100,
        nullable = false
    )
    private String contentType;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ProductImage() {
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
    // PRODUCT
    // =====================================================

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // =====================================================
    // IMAGE DATA
    // =====================================================

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    // =====================================================
    // CONTENT TYPE
    // =====================================================

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}
