
package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banner_images")
public class BannerImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_id", nullable = false)
    private Banner banner;


    @Lob
    @Column(
        name = "image_data",
        columnDefinition = "LONGBLOB",
        nullable = false
    )
    private byte[] imageData;


    @Column(
        name = "content_type",
        length = 100,
        nullable = false
    )
    private String contentType;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BannerImage() {
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
    // BANNER
    // =====================================================

    public Banner getBanner() {
        return banner;
    }

    public void setBanner(Banner banner) {
        this.banner = banner;
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
