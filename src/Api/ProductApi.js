
// =====================================================
// PRODUCT API
// =====================================================

export const API_BASE_URL =
    "https://ecom-1-um8s.onrender.com";

export const API_URL =
    `${API_BASE_URL}/api/products`;


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async () => {

    const response = await fetch(API_URL);

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `Failed to fetch products: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export const getProduct = async (id) => {

    if (!id) {
        throw new Error("Product ID is required");
    }

    const response =
        await fetch(`${API_URL}/${id}`);

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to fetch product: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// ADD PRODUCT
// =====================================================

export const addProduct = async (product) => {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(product)
            }
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to add product: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// ADD PRODUCT WITH IMAGES
// =====================================================

export const addProductWithImages = async (
    product,
    imageFiles = []
) => {

    if (!product) {
        throw new Error("Product data is required");
    }

    const formData = new FormData();

    formData.append(
        "name",
        product.name || ""
    );

    formData.append(
        "category",
        product.category || ""
    );

    formData.append(
        "subcategory",
        product.subcategory || ""
    );

    formData.append(
        "price",
        String(product.price ?? 0)
    );

    formData.append(
        "offerprice",
        String(product.offerprice ?? 0)
    );

    formData.append(
        "description",
        product.description || ""
    );


    // =================================================
    // IMAGES
    // =================================================

    imageFiles.forEach((file) => {

        if (file) {

            formData.append(
                "images",
                file
            );
        }
    });


    // =================================================
    // REQUEST
    // =================================================

    const response =
        await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",
                body: formData
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Add product response:",
        response.status,
        responseText
    );

    if (!response.ok) {

        throw new Error(
            `Failed to upload product: ${response.status} ${responseText}`
        );
    }

    try {

        return JSON.parse(responseText);

    } catch {

        return responseText;
    }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
    id,
    product
) => {

    if (!id) {
        throw new Error("Product ID is required");
    }

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(product)
            }
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to update product: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// UPLOAD IMAGES TO EXISTING PRODUCT
// =====================================================

export const uploadProductImages = async (
    productId,
    imageFiles = []
) => {

    if (!productId) {

        throw new Error(
            "Product ID is required"
        );
    }

    if (
        !Array.isArray(imageFiles) ||
        imageFiles.length === 0
    ) {

        throw new Error(
            "Please select at least one image"
        );
    }

    const maxSize =
        20 * 1024 * 1024;


    // =================================================
    // VALIDATE IMAGES
    // =================================================

    for (const file of imageFiles) {

        if (!file) {
            continue;
        }

        if (
            !file.type ||
            !file.type.startsWith("image/")
        ) {

            throw new Error(
                `${file.name} is not a valid image`
            );
        }

        if (file.size > maxSize) {

            throw new Error(
                `${file.name} is larger than 20 MB`
            );
        }
    }


    // =================================================
    // FORMDATA
    // =================================================

    const formData =
        new FormData();

    imageFiles.forEach((file) => {

        if (file) {

            formData.append(
                "images",
                file
            );
        }
    });


    // =================================================
    // REQUEST
    // =================================================

    const response =
        await fetch(
            `${API_URL}/${productId}/images`,
            {
                method: "POST",
                body: formData
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Product image upload:",
        response.status,
        responseText
    );

    if (!response.ok) {

        throw new Error(
            `Product image upload failed: ${response.status} ${responseText}`
        );
    }

    return responseText.trim();
};


// =====================================================
// GET PRODUCT IMAGES
// =====================================================

export const getProductImages = async (
    productId
) => {

    if (!productId) {

        throw new Error(
            "Product ID is required"
        );
    }

    const response =
        await fetch(
            `${API_URL}/${productId}/images`
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to fetch product images: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// GET PRODUCT IMAGE URL
// =====================================================

export const getProductImageUrl = (image) => {

    // -------------------------------------------------
    // No image
    // -------------------------------------------------

    if (!image) {
        return "/placeholder.png";
    }


    // -------------------------------------------------
    // Backend returned an image ID or URL string
    // -------------------------------------------------

    if (
        typeof image === "number" ||
        typeof image === "string"
    ) {

        const value =
            String(image).trim();

        if (!value) {
            return "/placeholder.png";
        }


        // Already complete URL
        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {

            return value;
        }


        // Backend API path
        if (value.startsWith("/api/")) {

            return `${API_BASE_URL}${value}`;
        }


        // Relative image path
        if (
            value.startsWith("/images/") ||
            value.startsWith("/uploads/")
        ) {

            return `${API_BASE_URL}${value}`;
        }


        // Assume value is image ID
        return `${API_URL}/images/${value}`;
    }


    // -------------------------------------------------
    // Backend returned image object
    // -------------------------------------------------

    if (
        typeof image === "object"
    ) {

        const imageId =
            image.id ??
            image.imageId ??
            image.productImageId;


        // Image ID exists
        if (imageId) {

            return `${API_URL}/images/${imageId}`;
        }


        // Possible URL fields
        const imageUrl =
            image.url ??
            image.imageUrl ??
            image.path;


        if (
            typeof imageUrl === "string" &&
            imageUrl.trim() !== ""
        ) {

            const value =
                imageUrl.trim();


            // Complete URL
            if (
                value.startsWith("http://") ||
                value.startsWith("https://")
            ) {

                return value;
            }


            // API path
            if (
                value.startsWith("/api/") ||
                value.startsWith("/images/") ||
                value.startsWith("/uploads/")
            ) {

                return `${API_BASE_URL}${value}`;
            }

            return `${API_BASE_URL}/${value.replace(/^\/+/, "")}`;
        }
    }


    // -------------------------------------------------
    // Fallback
    // -------------------------------------------------

    return "/placeholder.png";
};


// =====================================================
// GET IMAGES DIRECTLY FROM PRODUCT
// =====================================================

export const getProductImagesFromProduct = (
    product
) => {

    if (!product) {
        return ["/placeholder.png"];
    }


    // =================================================
    // NEW BACKEND FIELD: images
    // =================================================

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        const urls =
            product.images
                .map((image) =>
                    getProductImageUrl(image)
                )
                .filter(
                    (url) =>
                        url &&
                        url !== "/placeholder.png"
                );

        if (urls.length > 0) {
            return urls;
        }
    }


    // =================================================
    // OLD FIELD: image[]
    // =================================================

    if (
        Array.isArray(product.image) &&
        product.image.length > 0
    ) {

        const urls =
            product.image
                .map((image) =>
                    getProductImageUrl(image)
                )
                .filter(
                    (url) =>
                        url &&
                        url !== "/placeholder.png"
                );

        if (urls.length > 0) {
            return urls;
        }
    }


    // =================================================
    // OLD FIELD: image
    // =================================================

    if (
        typeof product.image === "string" ||
        typeof product.image === "number" ||
        typeof product.image === "object"
    ) {

        const url =
            getProductImageUrl(product.image);

        if (
            url &&
            url !== "/placeholder.png"
        ) {

            return [url];
        }
    }


    // =================================================
    // FALLBACK
    // =================================================

    return ["/placeholder.png"];
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Product ID is required"
        );
    }

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Delete product response:",
        response.status,
        responseText
    );

    if (!response.ok) {

        throw new Error(
            `Failed to delete product: ${response.status} ${responseText}`
        );
    }

    return true;
};


// =====================================================
// DELETE PRODUCT IMAGE
// =====================================================

export const deleteProductImage = async (
    imageId
) => {

    if (!imageId) {

        throw new Error(
            "Image ID is required"
        );
    }

    const response =
        await fetch(
            `${API_URL}/images/${imageId}`,
            {
                method: "DELETE"
            }
        );

    const responseText =
        await response.text();

    if (!response.ok) {

        throw new Error(
            `Failed to delete product image: ${response.status} ${responseText}`
        );
    }

    return true;
};
