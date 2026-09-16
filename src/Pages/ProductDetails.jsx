import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CartContext } from "./CartContext";
import { getProducts, deleteProduct } from "../Api/ProductApi";

const BACKEND_URL = "https://ecom-1-um8s.onrender.com";

export default function ProductDetails() {

    const { addToCart } = useContext(CartContext);

    const [message, setMessage] = useState("");
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();


    // =====================================================
    // CHECK ADMIN
    // =====================================================

    useEffect(() => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            const admin =
                user?.role?.toString().toUpperCase() === "ADMIN";

            console.log("PRODUCT DETAILS USER:", user);
            console.log("PRODUCT DETAILS ADMIN:", admin);

            setIsAdmin(admin);

        } catch (error) {

            console.error("Admin check error:", error);

            setIsAdmin(false);
        }

    }, []);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, [id]);


    const loadProducts = async () => {

        try {

            setLoading(true);

            const response = await getProducts();

            const data =
                Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];

            console.log(
                "PRODUCT DETAILS ALL PRODUCTS:",
                data
            );

            const foundProduct = data.find(
                item =>
                    String(item.id) === String(id)
            );

            console.log(
                "PRODUCT DETAILS FOUND PRODUCT:",
                foundProduct
            );

            console.log(
                "PRODUCT DETAILS DATABASE IMAGES:",
                foundProduct?.images
            );

            setAllProducts(data);
            setProduct(foundProduct || null);
            setSelectedImage(0);

        } catch (error) {

            console.error(
                "Error loading product:",
                error
            );

            setProduct(null);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // DATABASE IMAGE URL
    // =====================================================

    const getDatabaseImageUrl = (image) => {

        if (!image) {
            return "";
        }


        // -------------------------------------------------
        // ProductImage object
        // -------------------------------------------------

        if (typeof image === "object") {

            const imageId =
                image.id ??
                image.imageId ??
                image.productImageId;

            if (
                imageId !== undefined &&
                imageId !== null
            ) {

                return `${BACKEND_URL}/api/products/images/${imageId}`;
            }

            return "";
        }


        // -------------------------------------------------
        // Numeric image ID
        // -------------------------------------------------

        if (typeof image === "number") {

            return `${BACKEND_URL}/api/products/images/${image}`;
        }


        // -------------------------------------------------
        // String image
        // -------------------------------------------------

        if (typeof image === "string") {

            const trimmed = image.trim();

            if (!trimmed) {
                return "";
            }


            // Already complete URL

            if (
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://")
            ) {

                return trimmed;
            }


            // Backend API path

            if (trimmed.startsWith("/api/")) {

                return `${BACKEND_URL}${trimmed}`;
            }


            // Old uploads path

            if (trimmed.startsWith("/uploads/")) {

                return `${BACKEND_URL}${trimmed}`;
            }


            // Local/public frontend image

            if (trimmed.startsWith("/")) {

                return trimmed;
            }


            return trimmed;
        }


        return "";
    };


    // =====================================================
    // GET PRODUCT IMAGE URLS
    // =====================================================

    const getProductImages = (currentProduct) => {

        if (!currentProduct) {
            return [];
        }


        // -------------------------------------------------
        // NEW DATABASE IMAGES
        // -------------------------------------------------

        if (
            Array.isArray(currentProduct.images) &&
            currentProduct.images.length > 0
        ) {

            const databaseImages =
                currentProduct.images
                    .map(image =>
                        getDatabaseImageUrl(image)
                    )
                    .filter(Boolean);

            if (databaseImages.length > 0) {

                return databaseImages;
            }
        }


        // -------------------------------------------------
        // OLD image ARRAY
        // -------------------------------------------------

        if (
            Array.isArray(currentProduct.image)
        ) {

            const oldImages =
                currentProduct.image
                    .map(image =>
                        getDatabaseImageUrl(image)
                    )
                    .filter(Boolean);

            if (oldImages.length > 0) {

                return oldImages;
            }
        }


        // -------------------------------------------------
        // OLD SINGLE image
        // -------------------------------------------------

        if (currentProduct.image) {

            const oldImage =
                getDatabaseImageUrl(
                    currentProduct.image
                );

            if (oldImage) {

                return [oldImage];
            }
        }


        return [];
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async () => {

        if (!isAdmin || !product) {
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${product.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            console.log(
                "Deleting product:",
                product.id
            );

            await deleteProduct(product.id);

            alert(
                "Product deleted successfully"
            );

            navigate("/");

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );

            alert(
                "Failed to delete product"
            );
        }
    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = () => {

        if (!isAdmin || !product) {
            return;
        }

        console.log(
            "Editing product:",
            product
        );

        localStorage.setItem(
            "editingProduct",
            JSON.stringify(product)
        );

        navigate("/admin");
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="product-loading">

                <h2>
                    Loading product...
                </h2>

            </div>
        );
    }


    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {

        return (

            <div className="product-not-found">

                <h2>
                    Product not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Go Home
                </button>

            </div>
        );
    }


    // =====================================================
    // PRODUCT IMAGES
    // =====================================================

    const productImages =
        getProductImages(product);

    console.log(
        "FINAL PRODUCT IMAGES:",
        productImages
    );


    // =====================================================
    // RELATED PRODUCTS
    // =====================================================

    const relatedProducts =
        allProducts
            .filter(
                item =>

                    String(
                        item.subcategory || ""
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    String(
                        product.subcategory || ""
                    )
                        .trim()
                        .toLowerCase()

                    &&

                    String(item.id) !==
                    String(product.id)
            )
            .slice(0, 4);


    // =====================================================
    // PRICE
    // =====================================================

    const price =
        Number(product.price) || 0;

    const offerprice =
        Number(product.offerprice) || 0;


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
    // ADD TO CART
    // =====================================================

    const handleAddToCart = () => {

        addToCart(product);

        setMessage(
            "Product added to cart!"
        );

        setTimeout(() => {

            setMessage("");

        }, 2000);
    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="product-details-page">


            {/* =================================================
                MAIN PRODUCT
            ================================================= */}

            <div className="product-details-container">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="product-left">


                    {/* THUMBNAILS */}

                    <div className="product-thumbnails">

                        {productImages.length > 0 &&

                            productImages.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <div
                                        key={index}

                                        className={
                                            selectedImage === index
                                                ? "thumbnail active"
                                                : "thumbnail"
                                        }

                                        onClick={() =>
                                            setSelectedImage(
                                                index
                                            )
                                        }
                                    >

                                        <img
                                            src={image}

                                            alt={
                                                product.name
                                            }

                                            onError={(event) => {

                                                console.error(
                                                    "PRODUCT THUMBNAIL IMAGE FAILED:",
                                                    image
                                                );

                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                    </div>
                                )
                            )
                        }

                    </div>


                    {/* MAIN IMAGE */}

                    <div className="product-main-image">

                        {productImages.length > 0 ? (

                            <img
                                src={
                                    productImages[
                                        selectedImage
                                    ]
                                }

                                alt={
                                    product.name
                                }

                                onError={(event) => {

                                    console.error(
                                        "PRODUCT MAIN IMAGE FAILED:",
                                        productImages[selectedImage]
                                    );

                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />

                        ) : (

                            <div className="product-no-image">
                                No Image
                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div className="product-right">


                    {/* PRODUCT NAME */}

                    <h1>
                        {product.name}
                    </h1>


                    {/* PRICE */}

                    <div className="product-price">

                        <span className="offer-pricemain">

                            ₹
                            {
                                offerprice > 0
                                    ? offerprice
                                    : price
                            }
                            /-

                        </span>


                        {offerprice > 0 &&
                            price > 0 && (

                                <span className="original-price">

                                    ₹
                                    {price}

                                </span>

                            )}


                        {discount > 0 && (

                            <span className="discount">

                                {discount}% OFF

                            </span>

                        )}

                    </div>


                    <hr />


                    {/* DESCRIPTION */}

                    <h3>
                        Product Description
                    </h3>

                    <p>
                        {
                            product.description ||
                            "No description available."
                        }
                    </p>


                    {/* ADMIN ACTIONS */}

                    {isAdmin && (

                        <div className="product-admin-actions">

                            <button
                                type="button"

                                className="product-edit-btn"

                                onClick={
                                    handleEdit
                                }
                            >

                                <i className="bi bi-pencil"></i>

                                Edit Product

                            </button>


                            <button
                                type="button"

                                className="product-delete-btn"

                                onClick={
                                    handleDelete
                                }
                            >

                                <i className="bi bi-trash"></i>

                                Delete Product

                            </button>

                        </div>

                    )}


                    {/* CART / BUY */}

                    <div className="product-buttons">


                        <button
                            className="cart-button"

                            onClick={
                                handleAddToCart
                            }
                        >

                            Add to Cart

                        </button>


                        <button
                            className="buy-button"

                            onClick={() => {

                                addToCart(product);

                                navigate("/cart");

                            }}
                        >

                            Buy Now

                        </button>

                    </div>


                    {/* NOTIFICATION */}

                    {message && (

                        <div className="cart-notification">

                            {message}

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                RELATED PRODUCTS
            ================================================= */}

            <div className="related-products">

                <h2>
                    Related Products
                </h2>


                <div className="related-row">

                    {relatedProducts.map(
                        relatedProduct => {

                            const relatedImages =
                                getProductImages(
                                    relatedProduct
                                );


                            const relatedImage =
                                relatedImages.length > 0
                                    ? relatedImages[0]
                                    : "";


                            // -----------------------------------------
                            // RELATED PRICE
                            // -----------------------------------------

                            const relatedPrice =
                                Number(
                                    relatedProduct.price
                                ) || 0;


                            const relatedOfferPrice =
                                Number(
                                    relatedProduct.offerprice
                                ) || 0;


                            // -----------------------------------------
                            // RELATED DISCOUNT
                            // -----------------------------------------

                            const relatedDiscount =
                                relatedPrice > 0 &&
                                relatedOfferPrice > 0

                                    ? Math.round(
                                        (
                                            (
                                                relatedPrice -
                                                relatedOfferPrice
                                            ) /
                                            relatedPrice
                                        ) * 100
                                    )

                                    : 0;


                            return (

                                <div
                                    className="related-card"

                                    key={
                                        relatedProduct.id
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/product/${relatedProduct.id}`
                                        )
                                    }
                                >


                                    {/* IMAGE */}

                                    {relatedImage ? (

                                        <img
                                            src={
                                                relatedImage
                                            }

                                            alt={
                                                relatedProduct.name
                                            }

                                            onError={(event) => {

                                                console.error(
                                                    "RELATED PRODUCT IMAGE FAILED:",
                                                    relatedImage
                                                );

                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                    ) : (

                                        <div className="related-no-image">
                                            No Image
                                        </div>

                                    )}


                                    {/* NAME */}

                                    <h3>
                                        {
                                            relatedProduct.name
                                        }
                                    </h3>


                                    {/* PRICE */}

                                    <div className="product-price">

                                        {relatedOfferPrice > 0 ? (

                                            <>

                                                <span className="offer-price">

                                                    ₹
                                                    {
                                                        relatedOfferPrice
                                                    }

                                                </span>


                                                {relatedPrice > 0 && (

                                                    <span className="original-price">

                                                        ₹
                                                        {
                                                            relatedPrice
                                                        }

                                                    </span>

                                                )}


                                                {relatedDiscount > 0 && (

                                                    <span className="discount">

                                                        {
                                                            relatedDiscount
                                                        }% OFF

                                                    </span>

                                                )}

                                            </>

                                        ) : (

                                            <span className="offer-price">

                                                ₹
                                                {
                                                    relatedPrice
                                                }

                                            </span>

                                        )}

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            </div>

        </div>
    );
}