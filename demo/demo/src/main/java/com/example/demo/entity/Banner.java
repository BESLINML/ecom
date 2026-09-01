
package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "banners")
public class Banner {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // BANNER IMAGE URL / OLD IMAGE FIELD
    // =====================================================
    //
    // Keep this as String if your existing BannerController
    // and frontend still use the "image" field.
    //
    // New uploaded images can be stored in BannerImage.
    // =====================================================

    @Column(name = "image")
    private String image;


    // =====================================================
    // TITLE
    // =====================================================

    @Column(name = "title")
    private String title;


    // =====================================================
    // DESCRIPTION
    // =====================================================

    @Column(name = "description", length = 2000)
    private String description;


    // =====================================================
    // BANNER IMAGES
    // =====================================================

    @OneToMany(
        mappedBy = "banner",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<BannerImage> images =
            new ArrayList<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Banner() {
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
    // IMAGE
    // =====================================================

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }


    // =====================================================
    // TITLE
    // =====================================================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public List<BannerImage> getImages() {
        return images;
    }

    public void setImages(List<BannerImage> images) {
        this.images = images;
    }


    // =====================================================
    // ADD IMAGE
    // =====================================================

    public void addImage(BannerImage image) {

        images.add(image);

        image.setBanner(this);
    }


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    public void removeImage(BannerImage image) {

        images.remove(image);

        image.setBanner(null);
    }
}
