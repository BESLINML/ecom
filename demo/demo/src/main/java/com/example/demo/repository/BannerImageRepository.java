package com.example.demo.repository;

import com.example.demo.entity.BannerImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BannerImageRepository
        extends JpaRepository<BannerImage, Long> {

    Optional<BannerImage> findByBannerId(Long bannerId);
}