package com.example.demo.controller;

import com.example.demo.entity.Banner;
import com.example.demo.repository.BannerRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")

public class BannerController {

    private final BannerRepository bannerRepository;

    public BannerController(
            BannerRepository bannerRepository
    ) {
        this.bannerRepository = bannerRepository;
    }

    // =========================
    // GET ALL BANNERS
    // =========================

    @GetMapping
    public List<Banner> getBanners() {

        return bannerRepository.findAll();

    }

    // =========================
    // GET ONE BANNER
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Banner> getBanner(
            @PathVariable Long id
    ) {

        return bannerRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                    ResponseEntity.notFound().build()
                );

    }

    // =========================
    // ADD BANNER
    // =========================

    @PostMapping
    public Banner addBanner(
            @RequestBody Banner banner
    ) {

        return bannerRepository.save(banner);

    }

    // =========================
    // UPDATE BANNER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Banner> updateBanner(
            @PathVariable Long id,
            @RequestBody Banner banner
    ) {

        return bannerRepository
                .findById(id)
                .map(existingBanner -> {

                    existingBanner.setImage(
                        banner.getImage()
                    );

                    existingBanner.setTitle(
                        banner.getTitle()
                    );

                    existingBanner.setDescription(
                        banner.getDescription()
                    );

                    Banner updated =
                        bannerRepository.save(
                            existingBanner
                        );

                    return ResponseEntity.ok(
                        updated
                    );

                })
                .orElse(
                    ResponseEntity.notFound().build()
                );

    }

    // =========================
    // DELETE BANNER
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(
            @PathVariable Long id
    ) {

        if (
            !bannerRepository.existsById(id)
        ) {

            return ResponseEntity
                    .notFound()
                    .build();

        }

        bannerRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();

    }
}
