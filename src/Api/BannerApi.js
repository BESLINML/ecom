const API_URL =
    "https://ecom-1-um8s.onrender.com/api/banners";

const IMAGE_API_URL =
    "https://ecom-1-um8s.onrender.com/api/images/upload";

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

                body:
                    JSON.stringify(banner)
            }
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to add banner: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// UPDATE BANNER
// =====================================================

export const updateBanner = async (
    id,
    banner
) => {

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(banner)
            }
        );

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to update banner: ${response.status} ${errorText}`
        );
    }

    return response.json();
};


// =====================================================
// DELETE BANNER
// =====================================================

export const deleteBanner = async (id) => {

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

    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Failed to delete banner: ${response.status} ${errorText}`
        );
    }

    return true;
};


// =====================================================
// UPLOAD BANNER IMAGE
// =====================================================

export const uploadBannerImage = async (file) => {

    if (!file) {
        throw new Error("No banner image selected");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image");
    }

    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
        "https://ecom-1-um8s.onrender.com/api/images/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const responseText = await response.text();

    console.log("Banner upload status:", response.status);
    console.log("Banner upload response:", responseText);

    if (!response.ok) {
        throw new Error(
            `Banner image upload failed: ${response.status} ${responseText}`
        );
    }

    return responseText.trim();
};