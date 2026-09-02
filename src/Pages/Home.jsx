
import { useEffect, useState } from "react";

import { getProducts } from "../Api/ProductApi";
import { getBanners } from "../Api/BannerApi";

import CategoryProducts from "./CategoryProducts";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL =
    "https://ecom-1-um8s.onrender.com";

// =====================================================
// HOME
// =====================================================

export default function Home() {

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    // =====================================================
    // BANNERS
    // =====================================================

    const [banners, setBanners] = useState([]);

    const [loadingBanners, setLoadingBanners] =
        useState(true);

    // =====================================================
    // SLIDER
    // =====================================================

    const [index, setIndex] = useState(1);

    const [isMoving, setIsMoving] = useState(true);

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        if (typeof image !== "string") {
            return "";
        }

        const trimmedImage = image.trim();

        if (!trimmedImage) {
            return "";
        }

        // Already a complete URL
        if (
            trimmedImage.startsWith("http://") ||
            trimmedImage.startsWith("https://") ||
            trimmedImage.startsWith("blob:")
        ) {
            return trimmedImage;
        }

        // Backend relative path
        if (trimmedImage.startsWith("/")) {
            return BACKEND_URL + trimmedImage;
        }

        return trimmedImage;
    };

    // =====================================================
    // GET BANNER IMAGE
    // =====================================================
// =====================================================
// GET BANNER IMAGE
// =====================================================

const getBannerImage = (banner) => {

    if (!banner) {
        return "";
    }

    // =================================================
    // NEW DATABASE IMAGE
    // BannerImage is stored in MySQL as BLOB
    // =================================================

    if (
        Array.isArray(banner.images) &&
        banner.images.length > 0
    ) {

        const bannerImage =
            banner.images[0];

        if (bannerImage?.id) {

            return `${BACKEND_URL}/api/banners/images/${bannerImage.id}`;

        }
    }

    // =================================================
    // OLD IMAGE FIELD
    // Keep this for old banners that still use
    // the "image" column.
    // =================================================

    if (
        typeof banner.image === "string" &&
        banner.image.trim()
    ) {

        const image =
            banner.image.trim();

        // Old JSON array stored as string
        try {

            const parsed =
                JSON.parse(image);

            if (Array.isArray(parsed)) {

                if (parsed.length > 0) {

                    return getImageUrl(
                        parsed[0]
                    );

                }

            }

        } catch {
            // Normal string
        }

        return getImageUrl(image);
    }

    return "";
};
    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);

                const data =
                    await getProducts();

                console.log(
                    "Products from Spring Boot:",
                    data
                );

                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error loading products:",
                    error
                );

                setProducts([]);

            } finally {

                setLoading(false);

            }
        };

        loadProducts();

    }, []);

    // =====================================================
    // LOAD BANNERS
    // =====================================================

    useEffect(() => {

        const loadBanners = async () => {

            try {

                setLoadingBanners(true);

                const data =
                    await getBanners();

                console.log(
                    "Banners from Spring Boot:",
                    data
                );

                if (Array.isArray(data)) {

                    setBanners(data);

                } else {

                    setBanners([]);

                }

            } catch (error) {

                console.error(
                    "Error loading banners:",
                    error
                );

                setBanners([]);

            } finally {

                setLoadingBanners(false);

            }
        };

        loadBanners();

    }, []);

    // =====================================================
    // VALID BANNERS
    // =====================================================

    const validBanners =
        banners.filter(
            banner =>
                getBannerImage(banner) !== ""
        );

    // =====================================================
    // CREATE INFINITE SLIDES
    // =====================================================

    const slides =
        validBanners.length > 1
            ? [
                validBanners[
                    validBanners.length - 1
                ],

                ...validBanners,

                validBanners[0]
            ]
            : validBanners;

    // =====================================================
    // RESET SLIDER
    // =====================================================

    useEffect(() => {

        if (validBanners.length === 0) {

            setIndex(0);

            return;
        }

        if (validBanners.length === 1) {

            setIndex(0);

            return;
        }

        setIsMoving(false);

        setIndex(1);

        const timer =
            setTimeout(() => {

                setIsMoving(true);

            }, 50);

        return () => {
            clearTimeout(timer);
        };

    }, [validBanners.length]);

    // =====================================================
    // AUTO SLIDER
    // =====================================================

    useEffect(() => {

        if (validBanners.length <= 1) {
            return;
        }

        const timer =
            setInterval(() => {

                setIsMoving(true);

                setIndex(
                    previous =>
                        previous + 1
                );

            }, 5000);

        return () => {

            clearInterval(timer);

        };

    }, [validBanners.length]);

    // =====================================================
    // INFINITE LOOP
    // =====================================================

    useEffect(() => {

        if (
            validBanners.length <= 1
        ) {
            return;
        }

        if (
            index ===
            slides.length - 1
        ) {

            const timer =
                setTimeout(() => {

                    setIsMoving(false);

                    setIndex(1);

                }, 2500);

            return () => {

                clearTimeout(timer);

            };
        }

    }, [
        index,
        slides.length,
        validBanners.length
    ]);

    // =====================================================
    // TURN ANIMATION BACK ON
    // =====================================================

    useEffect(() => {

        if (!isMoving) {

            const timer =
                setTimeout(() => {

                    setIsMoving(true);

                }, 50);

            return () => {

                clearTimeout(timer);

            };
        }

    }, [isMoving]);

    // =====================================================
    // GROUP PRODUCTS BY SUBCATEGORY
    // =====================================================

    const groupedProducts =
        products.reduce(

            (groups, product) => {

                if (
                    !product.subcategory ||
                    !product.subcategory.trim()
                ) {

                    return groups;

                }

                const subcategory =
                    product.subcategory.trim();

                if (
                    !groups[subcategory]
                ) {

                    groups[subcategory] = [];

                }

                groups[subcategory].push(
                    product
                );

                return groups;

            },

            {}

        );

    // =====================================================
    // GET RANDOM 4 PRODUCTS
    // =====================================================

    const getRandomProducts = (
        subcategory,
        productList
    ) => {

        const storageKey =
            `home_random_products_${subcategory}`;

        const savedIds =
            localStorage.getItem(
                storageKey
            );

        if (savedIds) {

            try {

                const ids =
                    JSON.parse(
                        savedIds
                    );

                const savedProducts =
                    ids
                        .map(
                            id =>
                                productList.find(
                                    product =>
                                        String(
                                            product.id
                                        ) ===
                                        String(id)
                                )
                        )
                        .filter(Boolean);

                const requiredCount =
                    Math.min(
                        4,
                        productList.length
                    );

                if (
                    savedProducts.length ===
                    requiredCount
                ) {

                    return savedProducts;

                }

            } catch (error) {

                console.error(
                    "Error reading saved random products:",
                    error
                );

            }
        }

        const shuffled =
            [...productList].sort(
                () =>
                    Math.random() - 0.5
            );

        const selected =
            shuffled.slice(0, 4);

        try {

            localStorage.setItem(
                storageKey,
                JSON.stringify(
                    selected.map(
                        product =>
                            product.id
                    )
                )
            );

        } catch (error) {

            console.error(
                "Unable to save random products:",
                error
            );

        }

        return selected;
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="home">

            {/* =================================================
                HERO BANNER
            ================================================= */}

            <section className="hero-banner">

                {/* ---------------------------------------------
                    LOADING
                --------------------------------------------- */}

                {loadingBanners && (

                    <div className="hero-loading">

                        <p>
                            Loading banners...
                        </p>

                    </div>

                )}

                {/* ---------------------------------------------
                    NO BANNERS
                --------------------------------------------- */}

                {!loadingBanners &&
                    validBanners.length === 0 && (

                        <div className="hero-empty">

                            <p>
                                No banners available.
                            </p>

                        </div>

                    )}

                {/* ---------------------------------------------
                    HERO SLIDER
                --------------------------------------------- */}

                {!loadingBanners &&
                    validBanners.length > 0 && (

                        <div
                            className="hero-slider"

                            style={{

                                transform:
                                    `translateX(-${index * 100}%)`,

                                transition:
                                    isMoving &&
                                    validBanners.length > 1
                                        ? "transform 2.5s ease-in-out"
                                        : "none"

                            }}
                        >

                            {slides.map(
                                (banner, i) => {

                                    const image =
                                        getBannerImage(
                                            banner
                                        );

                                    return (

                                        <div
                                            className="hero-slide"
                                            key={`${banner.id}-${i}`}
                                        >

                                            <img
                                                src={image}

                                                alt={
                                                    banner.title ||
                                                    "Hero Banner"
                                                }

                                                onError={(event) => {

                                                    console.error(
                                                        "Banner image failed:",
                                                        image
                                                    );

                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = "/placeholder.png";


                                                }}

                                            />

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

            </section>

            {/* =================================================
                SPECIAL CATEGORIES
            ================================================= */}

            <section className="home-specialcat">

                <div>

                    <img
                        src="/sm1.webp"
                        alt="Trending Gifts"
                    />

                    <h4>
                        Trending Gifts
                    </h4>

                </div>

                <div>

                    <img
                        src="/sm2.webp"
                        alt="Bestsellers"
                    />

                    <h4>
                        Bestsellers
                    </h4>

                </div>

                <div>

                    <img
                        src="/sm3.webp"
                        alt="Wedding Gifts"
                    />

                    <h4>
                        Wedding Gifts
                    </h4>

                </div>

                <div>

                    <img
                        src="/sm4.webp"
                        alt="Gifts Under 999"
                    />

                    <h4>
                        Gifts Under 999
                    </h4>

                </div>

                <div>

                    <img
                        src="/rg1.webp"
                        alt="Special Offers"
                    />

                    <h4>
                        Special Offers
                    </h4>

                </div>

                <div>

                    <img
                        src="/cus-gift32.webp"
                        alt="Limited Edition"
                    />

                    <h4>
                        Limited Edition
                    </h4>

                </div>

                <div>

                    <img
                        src="/tg12.webp"
                        alt="New Arrivals"
                    />

                    <h4>
                        New Arrivals
                    </h4>

                </div>

            </section>

            {/* =================================================
                PRODUCTS LOADING
            ================================================= */}

            {loading && (

                <div className="products-loading">

                    <p>
                        Loading products...
                    </p>

                </div>

            )}

            {/* =================================================
                NO PRODUCTS
            ================================================= */}

            {!loading &&
                products.length === 0 && (

                    <div className="no-products">

                        <p>
                            No products found.
                        </p>

                    </div>

                )}

            {/* =================================================
                PRODUCT SECTIONS
            ================================================= */}

            {!loading &&
                products.length > 0 && (

                    <>

                        {Object.entries(
                            groupedProducts
                        ).map(

                            ([
                                subcategory,
                                productList
                            ]) => {

                                const randomProducts =
                                    getRandomProducts(
                                        subcategory,
                                        productList
                                    );

                                if (
                                    randomProducts.length === 0
                                ) {

                                    return null;

                                }

                                return (

                                    <CategoryProducts

                                        key={
                                            subcategory
                                        }

                                        subcategory={
                                            subcategory
                                        }

                                        products={
                                            randomProducts
                                        }

                                    />

                                );

                            }

                        )}

                    </>

                )}

        </div>

    );
}
