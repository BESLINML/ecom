
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
        await fetch(`${API_URL}/${id}`);

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
        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(banner)
        });


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

export const updateBanner =
    async (id, banner) => {

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

export const deleteBanner =
    async (id) => {

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

export const uploadBannerImage =
    async (file) => {

        // =================================================
        // CHECK FILE
        // =================================================

        if (!file) {

            throw new Error(
                "No banner image selected"
            );
        }


        console.log(
            "Banner file:",
            file
        );

        console.log(
            "Banner file name:",
            file.name
        );

        console.log(
            "Banner file type:",
            file.type
        );

        console.log(
            "Banner file size:",
            file.size
        );


        // =================================================
        // CREATE FORM DATA
        // =================================================

        const formData =
            new FormData();


        // IMPORTANT:
        // Spring Boot expects:
        //
        // @RequestPart("image")
        //

        formData.append(
            "image",
            file
        );


        // =================================================
        // UPLOAD
        // =================================================

        const response =
            await fetch(
                IMAGE_API_URL,
                {
                    method: "POST",

                    // DO NOT set Content-Type here.
                    // Browser automatically creates:
                    //
                    // multipart/form-data;
                    // boundary=...
                    //
                    body: formData
                }
            );


        // =================================================
        // READ RESPONSE
        // =================================================

        const responseText =
            await response.text();


        console.log(
            "Image upload status:",
            response.status
        );

        console.log(
            "Image upload response:",
            responseText
        );


        // =================================================
        // ERROR
        // =================================================

        if (!response.ok) {

            throw new Error(
                `Image upload failed: ${response.status} ${responseText}`
            );
        }


        // =================================================
        // SUCCESS
        // =================================================

        return responseText.trim();
    };
