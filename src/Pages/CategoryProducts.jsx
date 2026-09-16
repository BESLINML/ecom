import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteProduct } from "../Api/ProductApi";

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "https://ecom-1-um8s.onrender.com";

// =====================================================
// CATEGORY PRODUCTS
// =====================================================

export default function CategoryProducts({
    subcategory,
    products = []
}) {

    const navigate = useNavigate();

    // =====================================================
    // ADMIN CHECK
    // =====================================================

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        console.log("CATEGORY USER:", user);
        console.log("CATEGORY ROLE:", user?.role);

        setIsAdmin(
            user?.role?.toString().toUpperCase() === "ADMIN"
        );

    }, []);

    // =====================================================
    // RANDOM PRODUCTS
    // =====================================================

    const [randomProducts, setRandomProducts] = useState([]);

    // =====================================================
    // UPDATE RANDOM PRODUCTS
    // =====================================================

    useEffect(() => {

        if (!Array.isArray(products)) {

            setRandomProducts([]);

            return;
        }

        const shuffled =
            [...products]
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);

        setRandomProducts(shuffled);

    }, [products]);

    // =====================================================
    // ADMIN = ALL PRODUCTS
    // USER = 4 PRODUCTS
    // =====================================================

    const displayedProducts =
        isAdmin
            ? products
            : randomProducts;

    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (
        event,
        product
    ) => {

        event.stopPropagation();

        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteProduct(product.id);

            alert(
                "Product deleted successfully"
            );

            setRandomProducts(
                previous =>
                    previous.filter(
                        item =>
                            item.id !== product.id
                    )
            );

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            alert(
                "Failed to delete product"
            );
        }
    };

    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = (
        event,
        product
    ) => {

        event.stopPropagation();

        localStorage.setItem(
            "editingProduct",
            JSON.stringify(product)
        );

        navigate("/admin");
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (

        <section className="home-category-section">

            {/* CATEGORY HEADER */}

            <div className="home-category-header">

                <h2>
                    {subcategory}
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/category/${encodeURIComponent(
                                subcategory
                            )}`
                        )
                    }
                >
                    View All
                </button>

            </div>

            {/* PRODUCT ROW */}

            <div className="home-product-row">

                {displayedProducts.map(
                    product => (

                        <ProductCard

                            key={product.id}

                            product={product}

                            isAdmin={isAdmin}

                            onClick={() =>
                                navigate(
                                    `/product/${product.id}`
                                )
                            }

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    )
                )}

            </div>

        </section>
    );
}

// =====================================================
// PRODUCT CARD
// =====================================================

export function ProductCard({
    product,
    onClick,
    isAdmin,
    onEdit,
    onDelete
}) {

    const [imageIndex, setImageIndex] =
        useState(0);

    const [isHovered, setIsHovered] =
        useState(false);

    // =====================================================
    // ADMIN CHECK
    // =====================================================

    const storedUser =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

    const adminUser =
        storedUser?.role
            ?.toString()
            .toUpperCase() === "ADMIN";

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // =================================================
        // DATABASE IMAGE OBJECT
        // =================================================

        if (typeof image === "object") {

            const imageId =
                image.id ??
                image.imageId ??
                image.productImageId;

            if (imageId) {

                console.log(
                    "DATABASE IMAGE ID:",
                    imageId
                );

                return `${BACKEND_URL}/api/products/images/${imageId}`;
            }

            const objectUrl =
                image.url ??
                image.imageUrl ??
                image.path;

            if (objectUrl) {

                return getImageUrl(objectUrl);
            }

            return "";
        }

        // =================================================
        // DATABASE IMAGE ID
        // =================================================

        if (typeof image === "number") {

            return `${BACKEND_URL}/api/products/images/${image}`;
        }

        // =================================================
        // STRING
        // =================================================

        if (typeof image !== "string") {
            return "";
        }

        const trimmed =
            image.trim();

        if (!trimmed) {
            return "";
        }

        // =================================================
        // COMPLETE URL
        // =================================================

        if (
            trimmed.startsWith("http://") ||
            trimmed.startsWith("https://") ||
            trimmed.startsWith("blob:")
        ) {

            return trimmed;
        }

        // =================================================
        // API IMAGE PATH
        // =================================================

        if (
            trimmed.startsWith("/api/")
        ) {

            return `${BACKEND_URL}${trimmed}`;
        }

        // =================================================
        // UPLOAD PATH
        // =================================================

        if (
            trimmed.startsWith("/uploads/")
        ) {

            return `${BACKEND_URL}${trimmed}`;
        }

        // =================================================
        // FRONTEND PUBLIC IMAGE
        // =================================================

        if (
            trimmed.startsWith("/")
        ) {

            return trimmed;
        }

        // =================================================
        // FALLBACK
        // =================================================

        return trimmed;
    };

    // =====================================================
    // GET PRODUCT IMAGES
    // =====================================================

    const getProductImages = (product) => {

    if (!product) {
        return [];
    }

    // DATABASE IMAGES
    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return product.images
            .map(image => {

                const imageId =
                    image?.id ??
                    image?.imageId ??
                    image?.productImageId;

                if (!imageId) {
                    return "";
                }

                return `${BACKEND_URL}/api/products/images/${imageId}`;
            })
            .filter(Boolean);
    }

    // OLD IMAGE ARRAY
    if (
        Array.isArray(product.image) &&
        product.image.length > 0
    ) {

        return product.image
            .map(image => getImageUrl(image))
            .filter(Boolean);
    }

    // OLD SINGLE IMAGE
    if (product.image) {

        const image = getImageUrl(product.image);

        if (image) {
            return [image];
        }
    }

    return [];
};
    // =====================================================
    // PRODUCT IMAGES
    // =====================================================

    const productImages =
        getProductImages(product);

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
        "======================================"
    );

    console.log(
        "PRODUCT:",
        product?.name
    );

    console.log(
        "PRODUCT ID:",
        product?.id
    );

    console.log(
        "DATABASE IMAGES:",
        product?.images
    );

    console.log(
        "OLD IMAGE:",
        product?.image
    );

    console.log(
        "FINAL IMAGE URL:",
        productImages
    );

    console.log(
        "======================================"
    );

    // =====================================================
    // RESET IMAGE
    // =====================================================

    useEffect(() => {

        setImageIndex(0);

    }, [
        product?.id,
        product?.images
    ]);

    // =====================================================
    // HOVER IMAGE SLIDER
    // =====================================================

    useEffect(() => {

        if (
            !isHovered ||
            productImages.length <= 1
        ) {

            return;
        }

        const interval =
            setInterval(() => {

                setImageIndex(
                    previous =>
                        (
                            previous + 1
                        ) %
                        productImages.length
                );

            }, 1000);

        return () => {

            clearInterval(interval);

        };

    }, [
        isHovered,
        product?.id,
        productImages.length
    ]);

    // =====================================================
    // PRICE
    // =====================================================

    const price =
        Number(product?.price) || 0;

    const offerprice =
        Number(product?.offerprice) || 0;

    // =====================================================
    // DISCOUNT
    // =====================================================

    const discount =
        price > 0 &&
        offerprice > 0
            ? Math.round(
                (
                    (price - offerprice) /
                    price
                ) * 100
            )
            : 0;

    // =====================================================
    // CURRENT IMAGE
    // =====================================================

    const currentImage =
        productImages[imageIndex];

    // =====================================================
    // CARD
    // =====================================================

    return (

        <div
            className="home-product-card"

            onClick={onClick}

            onMouseEnter={() =>
                setIsHovered(true)
            }

            onMouseLeave={() => {

                setIsHovered(false);

                setImageIndex(0);

            }}
        >

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="home-product-image">

                {currentImage ? (

                    <img
                        src={currentImage}
                        alt={
                            product?.name ||
                            "Product"
                        }

                        onError={(event) => {

                            console.error(
                                "IMAGE LOAD FAILED:",
                                currentImage
                            );

                            console.error(
                                "PRODUCT:",
                                product
                            );

                            event.currentTarget.onerror =
                                null;

                            event.currentTarget.style.display =
                                "none";
                        }}
                    />

                ) : (

                    <div
                        className="product-no-image"
                    >
                        No Image
                    </div>

                )}

            </div>

            {/* =================================================
                ADMIN BUTTONS
            ================================================= */}

            {adminUser && (

                <div
                    className="home-admin-actions"

                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <button
                        type="button"
                        className="home-edit-btn"

                        onClick={(event) =>
                            onEdit(
                                event,
                                product
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="home-delete-btn"

                        onClick={(event) =>
                            onDelete(
                                event,
                                product
                            )
                        }
                    >
                        Delete
                    </button>

                </div>
            )}

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="home-product-info">

                <h3>
                    {product?.name}
                </h3>

                <div className="product-price">

                    <span className="offer-price">
                        ₹{offerprice}
                    </span>

                    {price > 0 && (

                        <span className="original-price">
                            ₹{price}
                        </span>

                    )}

                    {discount > 0 && (

                        <span className="discount">
                            {discount}% OFF
                        </span>

                    )}

                </div>

            </div>

        </div>
    );
}