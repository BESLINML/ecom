// =====================================================
// PRODUCT API
// =====================================================

const API_URL =
    "https://ecom-1-um8s.onrender.com/api/products";


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async () => {

    const response =
        await fetch(API_URL);

    if (!response.ok) {

        const errorText =
            await response.text();

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

    const formData =
        new FormData();

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

    imageFiles.forEach(file => {

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
    // VALIDATE
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

    imageFiles.forEach(file => {

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

export const getProductImageUrl = (
    imageId
) => {

    if (!imageId) {

        return "/placeholder.png";
    }

    return (
        `${API_URL}/images/${imageId}`
    );
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