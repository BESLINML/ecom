
package com.example.demo.controller;

import com.example.demo.entity.Banner;
import com.example.demo.repository.BannerRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://dynamic-jelly-ad6cf3.netlify.app",
        "https://ecommerce-ebbc4.web.app"
    }
)
public class BannerController {

    private final BannerRepository bannerRepository;

    public BannerController(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    // =====================================================
    // GET ALL BANNERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Banner>> getBanners() {

        List<Banner> banners =
                bannerRepository.findAll();

        return ResponseEntity.ok(banners);
    }

    // =====================================================
    // GET ONE BANNER
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Banner> getBanner(
            @PathVariable Long id
    ) {

        return bannerRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                    () -> ResponseEntity.notFound().build()
                );
    }

    // =====================================================
    // ADD BANNER
    // =====================================================

    @PostMapping
    public ResponseEntity<Banner> addBanner(
            @RequestBody Banner banner
    ) {

        // Make sure this is a NEW banner.
        // Never allow the frontend to accidentally
        // overwrite an existing banner ID.

        banner.setId(null);

        Banner savedBanner =
                bannerRepository.save(banner);

        return ResponseEntity.ok(savedBanner);
    }

    // =====================================================
    // UPDATE BANNER
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Banner> updateBanner(
            @PathVariable Long id,
            @RequestBody Banner banner
    ) {

        return bannerRepository
                .findById(id)
                .map(existingBanner -> {

                    if (banner.getImage() != null) {
                        existingBanner.setImage(
                            banner.getImage()
                        );
                    }

                    existingBanner.setTitle(
                        banner.getTitle()
                    );

                    existingBanner.setDescription(
                        banner.getDescription()
                    );

                    Banner updatedBanner =
                            bannerRepository.save(
                                existingBanner
                            );

                    return ResponseEntity.ok(
                        updatedBanner
                    );

                })
                .orElseGet(
                    () -> ResponseEntity.notFound().build()
                );
    }

    // =====================================================
    // DELETE BANNER
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(
            @PathVariable Long id
    ) {

        if (!bannerRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // IMPORTANT:
        // This deletes ONLY from banners table.
        //
        // It does NOT touch products table.

        bannerRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
