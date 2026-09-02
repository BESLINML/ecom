package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image")
    private String image;

    @Column(name = "title")
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @OneToMany(
        mappedBy = "banner",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<BannerImage> images = new ArrayList<>();

    public Banner() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BannerImage> getImages() {
        return images;
    }

    public void setImages(List<BannerImage> images) {
        this.images.clear();

        if (images != null) {
            for (BannerImage image : images) {
                addImage(image);
            }
        }
    }

    public void addImage(BannerImage image) {
        if (image == null) {
            return;
        }

        images.add(image);
        image.setBanner(this);
    }

    public void removeImage(BannerImage image) {
        if (image == null) {
            return;
        }

        images.remove(image);
        image.setBanner(null);
    }

    public void clearImages() {
        for (BannerImage image : images) {
            image.setBanner(null);
        }

        images.clear();
    }
}