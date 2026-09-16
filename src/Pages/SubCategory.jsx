import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getProducts,
    deleteProduct
} from "../Api/ProductApi";


// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL =
    "https://ecom-1-um8s.onrender.com";


// =====================================================
// SUBCATEGORY PAGE
// =====================================================

export default function Subcategory() {

    const { subcategory } = useParams();
    const navigate = useNavigate();


    // =====================================================
    // SUBCATEGORY NAME
    // =====================================================

    const name = decodeURIComponent(
        subcategory || ""
    );


    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // ADMIN
    // =====================================================

    const [isAdmin, setIsAdmin] = useState(false);


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

            console.log(
                "SUBCATEGORY USER:",
                user
            );

            console.log(
                "SUBCATEGORY ADMIN:",
                admin
            );

            setIsAdmin(admin);

        } catch (error) {

            console.error(
                "Admin check error:",
                error
            );

            setIsAdmin(false);
        }

    }, []);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        loadProducts();

    }, []);


    const loadProducts = async () => {

        try {

            setLoading(true);

            const response =
                await getProducts();


            console.log(
                "========== SUBCATEGORY PRODUCTS =========="
            );

            console.log(
                "PRODUCTS FROM SPRING BOOT:",
                response
            );


            const data =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];


            console.log(
                "SUBCATEGORY PRODUCT DATA:",
                data
            );


            setProducts(data);

        } catch (error) {

            console.error(
                "Failed to load products:",
                error
            );

            setProducts([]);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // FILTER SUBCATEGORY
    // =====================================================

    const subcategoryProducts =
        products.filter(product => {

            return (
                String(product.subcategory || "")
                    .trim()
                    .toLowerCase()
                ===
                String(name)
                    .trim()
                    .toLowerCase()
            );

        });


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (
        event,
        product
    ) => {

        event.stopPropagation();

        if (!isAdmin) {
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

            await deleteProduct(
                product.id
            );


            setProducts(previousProducts =>
                previousProducts.filter(
                    item =>
                        item.id !== product.id
                )
            );


            alert(
                "Product deleted successfully"
            );

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

    const handleEdit = (
        event,
        product
    ) => {

        event.stopPropagation();

        if (!isAdmin) {
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
    // GET DATABASE IMAGE URL
    // =====================================================

    const getDatabaseImageUrl = (image) => {

        if (!image) {
            return "";
        }


        // -------------------------------------------------
        // DATABASE IMAGE OBJECT
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

                return (
                    `${BACKEND_URL}/api/products/images/${imageId}`
                );
            }


            return "";
        }


        // -------------------------------------------------
        // IMAGE ID
        // -------------------------------------------------

        if (typeof image === "number") {

            return (
                `${BACKEND_URL}/api/products/images/${image}`
            );
        }


        // -------------------------------------------------
        // STRING IMAGE
        // -------------------------------------------------

        if (typeof image === "string") {

            const trimmed =
                image.trim();


            if (!trimmed) {
                return "";
            }


            // Complete URL

            if (
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://")
            ) {

                return trimmed;
            }


            // Backend API

            if (
                trimmed.startsWith("/api/")
            ) {

                return (
                    `${BACKEND_URL}${trimmed}`
                );
            }


            // Backend uploads

            if (
                trimmed.startsWith("/uploads/")
            ) {

                return (
                    `${BACKEND_URL}${trimmed}`
                );
            }


            // Frontend public image

            if (
                trimmed.startsWith("/")
            ) {

                return trimmed;
            }


            return trimmed;
        }


        return "";
    };


    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    const getProductImage = (product) => {

        if (!product) {
            return "";
        }


        // =================================================
        // NEW DATABASE IMAGE
        // =================================================

        if (
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {

            const firstImage =
                product.images[0];


            const imageUrl =
                getDatabaseImageUrl(
                    firstImage
                );


            console.log(
                "SUBCATEGORY DATABASE IMAGE:",
                product.name,
                product.id,
                firstImage
            );


            console.log(
                "SUBCATEGORY FINAL IMAGE URL:",
                product.name,
                imageUrl
            );


            if (imageUrl) {
                return imageUrl;
            }
        }


        // =================================================
        // OLD IMAGE ARRAY
        // =================================================

        if (
            Array.isArray(product.image) &&
            product.image.length > 0
        ) {

            const imageUrl =
                getDatabaseImageUrl(
                    product.image[0]
                );


            if (imageUrl) {

                console.log(
                    "SUBCATEGORY OLD IMAGE:",
                    product.name,
                    imageUrl
                );

                return imageUrl;
            }
        }


        // =================================================
        // OLD SINGLE IMAGE
        // =================================================

        if (product.image) {

            const imageUrl =
                getDatabaseImageUrl(
                    product.image
                );


            if (imageUrl) {

                console.log(
                    "SUBCATEGORY OLD SINGLE IMAGE:",
                    product.name,
                    imageUrl
                );

                return imageUrl;
            }
        }


        console.log(
            "SUBCATEGORY NO IMAGE:",
            product.name,
            product.id
        );


        return "";
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="subcategory-page">

                <div className="subcategory-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back
                    </button>


                    <h1>
                        {name}
                    </h1>

                </div>


                <p className="no-products">
                    Loading products...
                </p>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="subcategory-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="subcategory-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>


                <h1>

                    {name}

                    <span>
                        {" "}
                        ({subcategoryProducts.length})
                    </span>

                </h1>

            </div>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            {subcategoryProducts.length === 0 ? (

                <p className="no-products">
                    No products found.
                </p>

            ) : (

                <div className="subcategory-product-grid">

                    {subcategoryProducts.map(
                        product => {

                            // =================================================
                            // PRICE
                            // =================================================

                            const price =
                                Number(
                                    product.price
                                ) || 0;


                            const offerprice =
                                Number(
                                    product.offerprice
                                ) || 0;


                            // =================================================
                            // DISCOUNT
                            // =================================================

                            const discount =
                                price > 0 &&
                                offerprice > 0

                                    ? Math.round(
                                        (
                                            (
                                                price -
                                                offerprice
                                            ) /
                                            price
                                        ) * 100
                                    )

                                    : 0;


                            // =================================================
                            // IMAGE
                            // =================================================

                            const productImage =
                                getProductImage(
                                    product
                                );


                            return (

                                <div

                                    className="subcategory-card"

                                    key={
                                        product.id
                                    }

                                    onClick={() =>
                                        navigate(
                                            `/product/${product.id}`
                                        )
                                    }

                                    role="button"

                                    tabIndex={0}

                                    onKeyDown={
                                        event => {

                                            if (
                                                event.key ===
                                                    "Enter" ||
                                                event.key ===
                                                    " "
                                            ) {

                                                event.preventDefault();

                                                navigate(
                                                    `/product/${product.id}`
                                                );
                                            }
                                        }
                                    }
                                >


                                    {/* =================================================
                                        IMAGE
                                    ================================================= */}

                                    <div className="subcategory-image-wrapper">

                                        {productImage ? (

                                            <img

                                                src={
                                                    productImage
                                                }

                                                alt={
                                                    product.name ||
                                                    "Product"
                                                }

                                                loading="lazy"

                                                onLoad={() => {

                                                    console.log(
                                                        "SUBCATEGORY IMAGE LOADED:",
                                                        product.name,
                                                        productImage
                                                    );

                                                }}

                                                onError={event => {

                                                    console.error(
                                                        "SUBCATEGORY IMAGE FAILED:",
                                                        product.name,
                                                        productImage
                                                    );

                                                    event.currentTarget.style.display =
                                                        "none";

                                                }}
                                            />

                                        ) : (

                                            <div className="subcategory-no-image">

                                                No Image

                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                                        PRODUCT NAME
                                    ================================================= */}

                                    <h3>
                                        {product.name}
                                    </h3>


                                    {/* =================================================
                                        PRICE
                                    ================================================= */}

                                    <div className="product-price">

                                        {offerprice > 0 ? (

                                            <>

                                                <span className="offer-price">

                                                    ₹
                                                    {offerprice}

                                                </span>


                                                {price > 0 && (

                                                    <span className="original-price">

                                                        ₹
                                                        {price}

                                                    </span>

                                                )}


                                                {discount > 0 && (

                                                    <span className="discount">

                                                        {discount}%
                                                        OFF

                                                    </span>

                                                )}

                                            </>

                                        ) : (

                                            <span className="offer-price">

                                                ₹
                                                {price}

                                            </span>

                                        )}

                                    </div>


                                    {/* =================================================
                                        ADMIN ACTIONS
                                    ================================================= */}

                                    {isAdmin && (

                                        <div

                                            className="subcategory-admin-actions"

                                            onClick={
                                                event =>
                                                    event.stopPropagation()
                                            }
                                        >

                                            <button

                                                type="button"

                                                className="subcategory-edit-btn"

                                                onClick={
                                                    event =>
                                                        handleEdit(
                                                            event,
                                                            product
                                                        )
                                                }
                                            >

                                                <i className="bi bi-pencil"></i>

                                                Edit

                                            </button>


                                            <button

                                                type="button"

                                                className="subcategory-delete-btn"

                                                onClick={
                                                    event =>
                                                        handleDelete(
                                                            event,
                                                            product
                                                        )
                                                }
                                            >

                                                <i className="bi bi-trash"></i>

                                                Delete

                                            </button>

                                        </div>

                                    )}

                                </div>
                            );

                        }
                    )}

                </div>

            )}

        </div>
    );
}