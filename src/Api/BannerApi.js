const API_URL = "https://ecom-1-um8s.onrender.com/api/banners";

const IMAGE_API_URL =
    "https://ecom-1-um8s.onrender.com/api/images/upload";

// ================================
// GET ALL BANNERS
// ================================

export const getBanners = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch banners");
    }

    return response.json();
};

// ================================
// GET ONE BANNER
// ================================

export const getBanner = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch banner");
    }

    return response.json();
};

// ================================
// ADD BANNER
// ================================

export const addBanner = async (banner) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(banner)
    });

    if (!response.ok) {
        throw new Error("Failed to add banner");
    }

    return response.json();
};

// ================================
// UPDATE BANNER
// ================================

export const updateBanner = async (id, banner) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(banner)
    });

    if (!response.ok) {
        throw new Error("Failed to update banner");
    }

    return response.json();
};

// ================================
// DELETE BANNER
// ================================

export const deleteBanner = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete banner");
    }

    return true;
};

// ================================
// UPLOAD BANNER IMAGE
// ================================

export const uploadBannerImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(IMAGE_API_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to upload banner image");
    }

    return response.text();
};