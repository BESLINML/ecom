// =====================================================
// BANNER API
// =====================================================

const API_URL =
    "https://ecom-1-um8s.onrender.com/api/banners";

const IMAGE_API_URL =
    "https://ecom-1-um8s.onrender.com/api";


// =====================================================
// GET ALL BANNERS
// =====================================================

export const getBanners = async () => {

    const response =
        await fetch(API_URL);

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to fetch banners: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// GET ONE BANNER
// =====================================================

export const getBanner = async (id) => {

    if (!id) {
        throw new Error("Banner ID is required");
    }

    const response =
        await fetch(
            `${API_URL}/${id}`
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to fetch banner: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// ADD BANNER
// =====================================================

export const addBanner = async (banner) => {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(banner)
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Add banner:",
        response.status,
        responseText
    );

    if (!response.ok) {

        throw new Error(
            `Failed to add banner: ${response.status} ${responseText}`
        );
    }

    return JSON.parse(responseText);
};


// =====================================================
// UPDATE BANNER
// =====================================================

export const uploadBannerImage = async (
    bannerId,
    file
) => {

    if (!bannerId) {
        throw new Error("Banner ID is required");
    }

    if (!file) {
        throw new Error("No banner image selected");
    }

    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {
        throw new Error("Please select a valid image");
    }

    const maxSize =
        20 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Banner image must be smaller than 20 MB"
        );
    }

    const formData =
        new FormData();

    formData.append(
        "image",
        file
    );

    formData.append(
        "bannerId",
        String(bannerId)
    );

    const response =
        await fetch(
            `${IMAGE_API_URL}/banners/upload`,
            {
                method: "POST",
                body: formData
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Banner image upload:",
        response.status,
        responseText
    );

    if (!response.ok) {
        throw new Error(
            `Banner image upload failed: ${response.status} ${responseText}`
        );
    }

    return responseText.trim();
};


// =====================================================
// UPDATE BANNER
// =====================================================

export const updateBanner = async (
    id,
    banner
) => {

    if (!id) {
        throw new Error("Banner ID is required");
    }

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(banner)
            }
        );

    const responseText =
        await response.text();

    console.log(
        "Update banner:",
        response.status,
        responseText
    );

    if (!response.ok) {

        throw new Error(
            `Failed to update banner: ${response.status} ${responseText}`
        );
    }

    return JSON.parse(responseText);
};


// =====================================================
// DELETE BANNER
// =====================================================

export const deleteBanner = async (id) => {

    if (!id) {
        throw new Error("Banner ID is required");
    }

    console.log(
        "DELETE BANNER:",
        id
    );

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

    const responseText =
        await response.text();

    if (!response.ok) {

        throw new Error(
            `Failed to delete banner: ${response.status} ${responseText}`
        );
    }

    return true;
};