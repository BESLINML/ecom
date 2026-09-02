import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    getProducts,
    updateProduct,
    deleteProduct,
    deleteProductImage
} from "../Api/ProductApi";

import {
    getBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage
} from "../Api/BannerApi";


// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL =
    "https://ecom-1-um8s.onrender.com";


// =====================================================
// ADMIN
// =====================================================

const getBannerImageUrl = (banner) => {
    if (banner?.images?.length > 0) {
        return `https://ecom-1-um8s.onrender.com/api/banners/images/${banner.images[0].id}`;
    }

    return getImageUrl(banner?.image);
};



export default function Admin() {

    // =====================================================
    // SECTION REFS
    // =====================================================
    const bannerInputRef = useRef(null);
    const bannerManagementRef =
        useRef(null);

    const productManagementRef =
        useRef(null);


    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] =
        useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(true);


    // =====================================================
    // PRODUCT EDITING
    // =====================================================

    const [editingId, setEditingId] =
        useState(null);


    // =====================================================
    // PRODUCT IMAGES
    // =====================================================

    // New files selected from computer
   const [imageFiles, setImageFiles] =
    useState([]);

const [imagePreview, setImagePreview] =
    useState([]);

const [existingProductImages, setExistingProductImages] =
    useState([]);


    // =====================================================
    // PRODUCT LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // PRODUCT FORM
    // =====================================================

    const [form, setForm] = useState({

        name: "",
        category: "",
        subcategory: "",
        price: "",
        offerprice: "",
        description: ""

    });


    // =====================================================
    // BANNERS
    // =====================================================

    const [banners, setBanners] =
        useState([]);

    const [loadingBanners, setLoadingBanners] =
        useState(true);


    // =====================================================
    // BANNER EDITING
    // =====================================================

    const [editingBannerId, setEditingBannerId] =
        useState(null);


    // =====================================================
    // BANNER FILE
    // =====================================================

    const [bannerFile, setBannerFile] =
        useState(null);


    // =====================================================
    // BANNER PREVIEW
    // =====================================================

    const [bannerPreview, setBannerPreview] =
        useState("");


    // =====================================================
    // BANNER FORM
    // =====================================================

    const [bannerForm, setBannerForm] =
        useState({

            image: "",
            title: "",
            description: ""

        });


    // =====================================================
    // BANNER LOADING
    // =====================================================

    const [bannerLoading, setBannerLoading] =
        useState(false);


    // =====================================================
    // GENERIC IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

    if (!image) {
        return "/placeholder.png";
    }

    // ProductImage object
    if (
        typeof image === "object" &&
        image !== null
    ) {

        if (image.id) {

            return (
                `${BACKEND_URL}/api/products/images/${image.id}`
            );
        }

        if (image.imageUrl) {

            return getImageUrl(
                image.imageUrl
            );
        }

        if (image.url) {

            return getImageUrl(
                image.url
            );
        }

        if (image.image) {

            return getImageUrl(
                image.image
            );
        }

        return "/placeholder.png";
    }

    // String
    if (typeof image !== "string") {

        return "/placeholder.png";
    }

    const trimmed =
        image.trim();

    if (!trimmed) {

        return "/placeholder.png";
    }

    // Blob
    if (trimmed.startsWith("blob:")) {

        return trimmed;
    }

    // Full URL
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://")
    ) {

        return trimmed;
    }

    // Backend relative URL
    if (trimmed.startsWith("/")) {

        return (
            `${BACKEND_URL}${trimmed}`
        );
    }

    return trimmed;
};
    // =====================================================
    // PRODUCT IMAGE URL
    // =====================================================

    const getProductImageUrl = (image) => {

    if (!image) {
        return "/placeholder.png";
    }

    // ProductImage object
    if (
        typeof image === "object" &&
        image !== null
    ) {

        if (image.id) {

            return (
                `${BACKEND_URL}/api/products/images/${image.id}`
            );
        }

        if (image.imageUrl) {

            return getProductImageUrl(
                image.imageUrl
            );
        }

        if (image.url) {

            return getProductImageUrl(
                image.url
            );
        }

        if (image.image) {

            return getProductImageUrl(
                image.image
            );
        }

        return "/placeholder.png";
    }

    // String
    if (typeof image === "string") {

        const trimmed =
            image.trim();

        if (!trimmed) {

            return "/placeholder.png";
        }

        if (trimmed.startsWith("blob:")) {

            return trimmed;
        }

        if (
            trimmed.startsWith("http://") ||
            trimmed.startsWith("https://")
        ) {

            return trimmed;
        }

        if (trimmed.startsWith("/")) {

            return (
                `${BACKEND_URL}${trimmed}`
            );
        }

        return trimmed;
    }

    return "/placeholder.png";
};

    // =====================================================
    // GET PRODUCT IMAGES
    // =====================================================

    const getProductImages = (product) => {

        if (!product) {

            return [];

        }


        // -------------------------------------------------
        // NEW BACKEND FORMAT
        // -------------------------------------------------

        if (
            Array.isArray(product.images)
        ) {

            return product.images;

        }


        // -------------------------------------------------
        // OLD FORMAT SUPPORT
        // -------------------------------------------------

        if (product.image) {

            if (
                Array.isArray(product.image)
            ) {

                return product.image;

            }


            if (
                typeof product.image === "string"
            ) {

                try {

                    const parsed =
                        JSON.parse(
                            product.image
                        );

                    if (
                        Array.isArray(parsed)
                    ) {

                        return parsed;

                    }

                } catch {

                    return [
                        product.image
                    ];

                }

            }

        }


        return [];

    };


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            setLoadingProducts(true);


            const data =
                await getProducts();


            console.log(
                "Products received:",
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


            alert(
                error?.message ||
                "Failed to load products"
            );

        } finally {

            setLoadingProducts(false);

        }

    };


    // =====================================================
    // LOAD BANNERS
    // =====================================================

    const loadBanners = async () => {

        try {

            setLoadingBanners(true);


            const data =
                await getBanners();


            console.log(
                "Banners received:",
                data
            );


            setBanners(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading banners:",
                error
            );


            alert(
                error?.message ||
                "Failed to load banners"
            );

        } finally {

            setLoadingBanners(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadProducts();

        loadBanners();

    }, []);


    // =====================================================
    // LOAD PRODUCT FROM OTHER PAGE
    // =====================================================

    useEffect(() => {

        const editingProduct =
            localStorage.getItem(
                "editingProduct"
            );


        if (!editingProduct) {

            return;

        }


        try {

            const product =
                JSON.parse(
                    editingProduct
                );


            if (product) {

                handleEdit(product);

            }

        } catch (error) {

            console.error(
                "Editing product error:",
                error
            );

        }


        localStorage.removeItem(
            "editingProduct"
        );

    }, []);


    // =====================================================
    // PRODUCT INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(previous => ({

            ...previous,

            [name]: value

        }));

    };


    // =====================================================
    // PRODUCT IMAGE CHANGE
    // =====================================================

    const handleImageChange = (event) => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (files.length === 0) {

            return;

        }


        const maxSize =
            20 * 1024 * 1024;


        // -------------------------------------------------
        // VALIDATE FILES
        // -------------------------------------------------

        const invalidFile =
            files.find(
                file =>
                    !file.type ||
                    !file.type.startsWith("image/") ||
                    file.size > maxSize
            );


        if (invalidFile) {

            alert(
                `${invalidFile.name} is not a valid image or is larger than 20 MB.`
            );


            event.target.value = "";

            return;

        }


        // -------------------------------------------------
        // SAVE NEW FILES
        // -------------------------------------------------

        setImageFiles(previous => [

            ...previous,

            ...files

        ]);


        // -------------------------------------------------
        // CREATE NEW PREVIEWS
        // -------------------------------------------------

        const previews =
            files.map(
                file =>
                    URL.createObjectURL(file)
            );


        setImagePreview(previous => [

            ...previous,

            ...previews

        ]);


        // Reset input so selecting same file again works
        event.target.value = "";

    };


    // =====================================================
    // REMOVE NEW SELECTED IMAGE
    // =====================================================
const removeSelectedImage = (index) => {

    setImageFiles(previous =>
        previous.filter(
            (_, i) =>
                i !== index
        )
    );

    setImagePreview(previous =>
        previous.filter(
            (_, i) =>
                i !== index
        )
    );
};
    // =====================================================
    // SUBMIT PRODUCT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (loading) {

            return;

        }


        // =================================================
        // VALIDATION
        // =================================================

        if (!form.name.trim()) {

            alert(
                "Please enter product name"
            );

            return;

        }


        if (!form.category.trim()) {

            alert(
                "Please enter category"
            );

            return;

        }


        if (!form.subcategory.trim()) {

            alert(
                "Please enter subcategory"
            );

            return;

        }


        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {

            alert(
                "Please enter a valid price"
            );

            return;

        }


        if (
            form.offerprice === "" ||
            Number(form.offerprice) < 0
        ) {

            alert(
                "Please enter a valid offer price"
            );

            return;

        }


        // -------------------------------------------------
        // ADD PRODUCT IMAGE CHECK
        // -------------------------------------------------

        if (
            !editingId &&
            imageFiles.length === 0
        ) {

            alert(
                "Please select at least one product image"
            );

            return;

        }


        setLoading(true);


        try {

            // =================================================
            // ADD PRODUCT
            // =================================================

            if (!editingId) {

                const formData =
                    new FormData();


                formData.append(
                    "name",
                    form.name.trim()
                );


                formData.append(
                    "category",
                    form.category.trim()
                );


                formData.append(
                    "subcategory",
                    form.subcategory.trim()
                );


                formData.append(
                    "price",
                    String(
                        Number(form.price)
                    )
                );


                formData.append(
                    "offerprice",
                    String(
                        Number(form.offerprice)
                    )
                );


                formData.append(
                    "description",
                    form.description.trim()
                );


                // -------------------------------------------------
                // ADD IMAGES
                // -------------------------------------------------

                imageFiles.forEach(
                    file => {

                        formData.append(
                            "images",
                            file
                        );

                    }
                );


                console.log(
                    "================================="
                );


                console.log(
                    "UPLOADING PRODUCT"
                );


                console.log(
                    "Name:",
                    form.name
                );


                console.log(
                    "Category:",
                    form.category
                );


                console.log(
                    "Subcategory:",
                    form.subcategory
                );


                console.log(
                    "Images:",
                    imageFiles.length
                );


                console.log(
                    "================================="
                );


                // -------------------------------------------------
                // SEND PRODUCT
                // -------------------------------------------------

                const response =
                    await fetch(
                        `${BACKEND_URL}/api/products/upload`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // -------------------------------------------------
                // READ RESPONSE
                // -------------------------------------------------

                const responseText =
                    await response.text();


                console.log(
                    "Product upload response:",
                    response.status,
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        `Product upload failed (${response.status})`
                    );

                }


                let savedProduct;


                try {

                    savedProduct =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    savedProduct =
                        responseText;

                }


                console.log(
                    "Saved product:",
                    savedProduct
                );


                if (
                    savedProduct &&
                    typeof savedProduct === "object"
                ) {

                    console.log(
                        "Saved product images:",
                        savedProduct.images
                    );

                }


                alert(
                    "Product added successfully"
                );

            }


            // =================================================
            // UPDATE PRODUCT
            // =================================================

            else {

                const product = {

                    name:
                        form.name.trim(),

                    category:
                        form.category.trim(),

                    subcategory:
                        form.subcategory.trim(),

                    price:
                        Number(form.price),

                    offerprice:
                        Number(form.offerprice),

                    description:
                        form.description.trim()

                };


                console.log(
                    "Updating product:",
                    editingId,
                    product
                );


                // -------------------------------------------------
                // UPDATE PRODUCT DETAILS
                // -------------------------------------------------

                await updateProduct(
                    editingId,
                    product
                );


                // -------------------------------------------------
                // UPLOAD NEW IMAGES
                // -------------------------------------------------

                if (
                    imageFiles.length > 0
                ) {

                    const imageFormData =
                        new FormData();


                    imageFiles.forEach(
                        file => {

                            imageFormData.append(
                                "images",
                                file
                            );

                        }
                    );


                    console.log(
                        "Uploading new images for product:",
                        editingId
                    );


                    const response =
                        await fetch(
                            `${BACKEND_URL}/api/products/${editingId}/images`,
                            {
                                method: "POST",
                                body: imageFormData
                            }
                        );


                    const responseText =
                        await response.text();


                    console.log(
                        "Image upload response:",
                        response.status,
                        responseText
                    );


                    if (!response.ok) {

                        throw new Error(
                            responseText ||
                            "Failed to upload product images"
                        );

                    }

                }


                alert(
                    "Product updated successfully"
                );

            }


            // =================================================
            // RESET
            // =================================================

            resetForm();


            // =================================================
            // RELOAD
            // =================================================

            await loadProducts();

        } catch (error) {

            console.error(
                "Product save error:",
                error
            );


            alert(
                error?.message ||
                "Something went wrong while saving product"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const handleEdit = (product) => {

    console.log(
        "Editing product:",
        product
    );

    setEditingId(
        product.id
    );

    setForm({

        name:
            product.name || "",

        category:
            product.category || "",

        subcategory:
            product.subcategory || "",

        price:
            product.price ?? "",

        offerprice:
            product.offerprice ?? "",

        description:
            product.description || ""

    });

    // =================================================
    // EXISTING IMAGES
    // =================================================

    const existingImages =
        getProductImages(product);

    console.log(
        "Existing images:",
        existingImages
    );

    setExistingProductImages(
        existingImages
    );

    // =================================================
    // NEW FILES RESET
    // =================================================

    setImageFiles([]);

    setImagePreview([]);

    // =================================================
    // SCROLL
    // =================================================

    setTimeout(() => {

        productManagementRef.current?.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 100);
};
    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await deleteProduct(id);


            setProducts(previous =>

                previous.filter(
                    product =>
                        product.id !== id
                )

            );


            if (
                String(editingId) ===
                String(id)
            ) {

                resetForm();

            }


            alert(
                "Product deleted successfully"
            );

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            alert(
                error?.message ||
                "Failed to delete product"
            );

        }

    };


    // =====================================================
    // RESET PRODUCT FORM
    // =====================================================

    const resetForm = () => {

        // Revoke preview URLs
        imagePreview.forEach(
            preview => {

                if (
                    preview &&
                    preview.startsWith("blob:")
                ) {

                    URL.revokeObjectURL(
                        preview
                    );

                }

            }
        );


        setEditingId(null);

        setImageFiles([]);

        setImagePreview([]);

        setExistingProductImages([]);


        setForm({

            name: "",
            category: "",
            subcategory: "",
            price: "",
            offerprice: "",
            description: ""

        });


        const fileInput =
            document.getElementById(
                "product-images"
            );


        if (fileInput) {

            fileInput.value = "";

        }

    };


    // =====================================================
    // GET FIRST PRODUCT IMAGE
    // =====================================================

    const getFirstImage = (product) => {

        const images =
            getProductImages(
                product
            );


        if (
            images.length === 0
        ) {

            return "/placeholder.png";

        }


        return getProductImageUrl(
            images[0]
        );

    };


    // =====================================================
    // BANNER INPUT CHANGE
    // =====================================================

    const handleBannerChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setBannerForm(previous => ({

            ...previous,

            [name]: value

        }));

    };


    // =====================================================
    // BANNER IMAGE CHANGE
    // =====================================================

    const handleBannerImageChange =
        (event) => {

            const file =
                event.target.files?.[0];


            if (!file) {

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select a valid image"
                );


                event.target.value = "";

                return;

            }


            const maxSize =
                20 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                alert(
                    "Banner image must be smaller than 20 MB"
                );


                event.target.value = "";

                return;

            }


            // Revoke previous preview
            if (
                bannerPreview &&
                bannerPreview.startsWith("blob:")
            ) {

                URL.revokeObjectURL(
                    bannerPreview
                );

            }


            setBannerFile(file);


            setBannerPreview(
                URL.createObjectURL(
                    file
                )
            );

        };


    // =====================================================
    // ADD / UPDATE BANNER
    // =====================================================

   const handleBannerSubmit = async (event) => {
    event.preventDefault();

    console.log("🔥 BANNER SUBMIT CLICKED");

    try {
        // ==============================
        // VALIDATION
        // ==============================

        if (!bannerForm.title.trim()) {
            alert("Please enter banner title");
            return;
        }

        if (!bannerFile && !editingBannerId) {
            alert("Please select a banner image");
            return;
        }

        // ==============================
        // EDIT EXISTING BANNER
        // ==============================

        if (editingBannerId) {

            const bannerData = {
                image: bannerForm.image.trim(),
                title: bannerForm.title.trim(),
                description: bannerForm.description.trim()
            };

            console.log(
                "Updating banner:",
                editingBannerId,
                bannerData
            );

            await updateBanner(
                editingBannerId,
                bannerData
            );

            // Upload new image if selected
            if (bannerFile) {

                console.log(
                    "Uploading image for banner:",
                    editingBannerId
                );

                const imageUrl =
                    await uploadBannerImage(
                        editingBannerId,
                        bannerFile
                    );

                console.log(
                    "Banner image uploaded:",
                    imageUrl
                );
            }

            alert("Banner updated successfully");
        }

        // ==============================
        // ADD NEW BANNER
        // ==============================

        else {

            const bannerData = {
                image: "",
                title: bannerForm.title.trim(),
                description: bannerForm.description.trim()
            };

            console.log(
                "Creating banner:",
                bannerData
            );

            // FIRST: create banner
            const savedBanner =
                await addBanner(bannerData);

            console.log(
                "Saved banner:",
                savedBanner
            );

            // Get newly created banner ID
            const bannerId =
                savedBanner?.id;

            if (!bannerId) {
                throw new Error(
                    "Banner created but no banner ID was returned"
                );
            }

            console.log(
                "New banner ID:",
                bannerId
            );

            // SECOND: upload image using banner ID
            if (bannerFile) {

                console.log(
                    "Uploading banner image for banner:",
                    bannerId
                );

                const imageUrl =
                    await uploadBannerImage(
                        bannerId,
                        bannerFile
                    );

                console.log(
                    "Banner image uploaded:",
                    imageUrl
                );
            }

            alert("Banner added successfully");
        }

        // ==============================
        // RELOAD BANNERS
        // ==============================

        const updatedBanners =
            await getBanners();

        console.log(
            "Banners after save:",
            updatedBanners
        );

        setBanners(
            Array.isArray(updatedBanners)
                ? updatedBanners
                : []
        );

        // ==============================
        // RESET FORM
        // ==============================

        setBannerForm({
            image: "",
            title: "",
            description: ""
        });

        setBannerFile(null);
        setEditingBannerId(null);

        // Clear file input
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }

    } catch (error) {

        console.error(
            "Banner submit error:",
            error
        );

        alert(
            error.message ||
            "Failed to save banner"
        );
    }
};
    // =====================================================
    // EDIT BANNER
    // =====================================================

    const handleBannerEdit =
        (banner) => {

            setEditingBannerId(
                banner.id
            );


            setBannerForm({

                image:
                    banner.image || "",

                title:
                    banner.title || "",

                description:
                    banner.description || ""

            });


            setBannerFile(null);


            setBannerPreview(
                getImageUrl(
                    banner.image
                )
            );


            setTimeout(() => {

                bannerManagementRef.current?.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }, 100);

        };


    // =====================================================
    // DELETE BANNER
    // =====================================================

    const handleBannerDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this banner?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteBanner(id);


                setBanners(previous =>

                    previous.filter(
                        banner =>
                            banner.id !== id
                    )

                );


                if (
                    String(editingBannerId) ===
                    String(id)
                ) {

                    resetBannerForm();

                }


                alert(
                    "Banner deleted successfully"
                );

            } catch (error) {

                console.error(
                    "Delete banner error:",
                    error
                );


                alert(
                    error?.message ||
                    "Failed to delete banner"
                );

            }

        };


    // =====================================================
    // RESET BANNER FORM
    // =====================================================

    const resetBannerForm = () => {

        if (
            bannerPreview &&
            bannerPreview.startsWith("blob:")
        ) {

            URL.revokeObjectURL(
                bannerPreview
            );

        }


        setEditingBannerId(null);

        setBannerFile(null);

        setBannerPreview("");


        setBannerForm({

            image: "",
            title: "",
            description: ""

        });


        const input =
            document.getElementById(
                "banner-image"
            );


        if (input) {

            input.value = "";

        }

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="admin-page">

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <h1>
                Admin Panel
            </h1>


            {/* =================================================
                BANNER MANAGEMENT
            ================================================= */}

            <section
                className="admin-banner-section"
                ref={bannerManagementRef}
            >

                <h2>
                    Hero Banner Management
                </h2>


                {/* =================================================
                    BANNER FORM
                ================================================= */}

                <form
                    className="admin-banner-form"
                    onSubmit={
                        handleBannerSubmit
                    }
                >

                    <h3>

                        {editingBannerId
                            ? "Edit Hero Banner"
                            : "Add Hero Banner"}

                    </h3>


                    <label htmlFor="banner-image">

                        Banner Image

                    </label>

<input
    ref={bannerInputRef}
    id="banner-image"
    type="file"
    accept="image/*"
    onChange={handleBannerImageChange}
/>


                    {bannerPreview && (

                        <div className="admin-banner-preview">

                            <img
                                src={bannerPreview}
                                alt="Banner Preview"
                            />

                        </div>

                    )}


                    <label>

                        Banner Title

                    </label>


                    <input
                        type="text"
                        name="title"
                        placeholder="Banner Title"
                        value={
                            bannerForm.title
                        }
                        onChange={
                            handleBannerChange
                        }
                        required
                    />


                    <label>

                        Banner Description

                    </label>


                    <textarea
                        name="description"
                        placeholder="Banner Description"
                        value={
                            bannerForm.description
                        }
                        onChange={
                            handleBannerChange
                        }
                    />


                    <button
                        type="submit"
                        disabled={
                            bannerLoading
                        }
                    >

                        {bannerLoading

                            ? "Uploading..."

                            : editingBannerId

                                ? "Update Banner"

                                : "Add Banner"}

                    </button>


                    {editingBannerId && (

                        <button
                            type="button"
                            onClick={
                                resetBannerForm
                            }
                        >

                            Cancel

                        </button>

                    )}

                </form>


                {/* =================================================
                    BANNER LIST
                ================================================= */}

                <div className="admin-banner-list">

                    <h3>

                        Existing Banners (
                        {banners.length}
                        )

                    </h3>


                    {loadingBanners && (

                        <p>
                            Loading banners...
                        </p>

                    )}


                    {!loadingBanners &&
                        banners.length === 0 && (

                            <p>
                                No banners found.
                            </p>

                        )}


                    {!loadingBanners &&
                        banners.length > 0 && (

                            <div className="admin-banner-grid">

                                {banners.map(
                                    banner => (

                                        <div
                                            className="admin-banner-card"
                                            key={
                                                banner.id
                                            }
                                        >

     <img
    src={getBannerImageUrl(banner)}
    alt={banner.title || "Banner"}
    onError={(event) => {
        event.currentTarget.src = "/placeholder.png";
    }}
/>


                                            <h3>
                                                {
                                                    banner.title
                                                }
                                            </h3>


                                            <p>
                                                {
                                                    banner.description
                                                }
                                            </p>


                                            <div className="admin-banner-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleBannerEdit(
                                                            banner
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-pencil"></i>

                                                    Edit

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleBannerDelete(
                                                            banner.id
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-trash"></i>

                                                    Delete

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </section>


            {/* =================================================
                PRODUCT MANAGEMENT
            ================================================= */}

            <section
                className="admin-product-section"
                ref={productManagementRef}
            >

                <h2>
                    Product Management
                </h2>


                {/* =================================================
                    PRODUCT FORM
                ================================================= */}

                <form
                    className="admin-product-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <h2>

                        {editingId
                            ? "Edit Product"
                            : "Add Product"}

                    </h2>


                    <label>
                        Product Name
                    </label>


                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={
                            form.name
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />


                    <label>
                        Category
                    </label>


                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={
                            form.category
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />


                    <label>
                        Subcategory
                    </label>


                    <input
                        type="text"
                        name="subcategory"
                        placeholder="Subcategory"
                        value={
                            form.subcategory
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />


                    <label>
                        Original Price
                    </label>


                    <input
                        type="number"
                        name="price"
                        placeholder="Original Price"
                        value={
                            form.price
                        }
                        onChange={
                            handleChange
                        }
                        min="0"
                        required
                    />


                    <label>
                        Offer Price
                    </label>


                    <input
                        type="number"
                        name="offerprice"
                        placeholder="Offer Price"
                        value={
                            form.offerprice
                        }
                        onChange={
                            handleChange
                        }
                        min="0"
                        required
                    />


                    {/* =================================================
                        PRODUCT IMAGES
                    ================================================= */}

                    <label htmlFor="product-images">

                        Product Images

                    </label>


                    <input
                        id="product-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                            handleImageChange
                        }
                    />

{/* =================================================
    EXISTING PRODUCT IMAGES
================================================= */}

{existingProductImages.length > 0 && (

    <div className="admin-image-preview-container">

        {existingProductImages.map(
            (image, index) => (

                <div
                    className="admin-image-preview"
                    key={`existing-${image.id}`}
                >

                    <img
                        src={
                            getProductImageUrl(
                                image
                            )
                        }
                        alt={
                            `Existing Product ${index + 1}`
                        }
                        onError={(event) => {

                            event.currentTarget.src =
                                "/placeholder.png";

                        }}
                    />

                    <button
                        type="button"
                        onClick={async () => {

                            try {

                                if (!image.id) {

                                    return;
                                }

                                const confirmed =
                                    window.confirm(
                                        "Delete this product image?"
                                    );

                                if (!confirmed) {

                                    return;
                                }

                                await deleteProductImage(
                                    image.id
                                );

                                setExistingProductImages(
                                    previous =>
                                        previous.filter(
                                            item =>
                                                item.id !==
                                                image.id
                                        )
                                );

                            } catch (error) {

                                console.error(
                                    "Delete image error:",
                                    error
                                );

                                alert(
                                    error?.message ||
                                    "Failed to delete image"
                                );
                            }

                        }}
                        title="Delete existing image"
                    >

                        ×

                    </button>

                </div>
            )
        )}

    </div>
)}


{/* =================================================
    NEW IMAGE PREVIEWS
================================================= */}

{imagePreview.length > 0 && (

    <div className="admin-image-preview-container">

        {imagePreview.map(
            (image, index) => (

                <div
                    className="admin-image-preview"
                    key={`new-${index}`}
                >

                    <img
                        src={image}
                        alt={
                            `New Product ${index + 1}`
                        }
                    />

                    <button
                        type="button"
                        onClick={() =>
                            removeSelectedImage(index)
                        }
                        title="Remove image"
                    >

                        ×

                    </button>

                </div>
            )
        )}

    </div>
)}


                    <label>
                        Product Description
                    </label>


                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                    >

                        {loading

                            ? "Uploading..."

                            : editingId

                                ? "Update Product"

                                : "Add Product"}

                    </button>


                    {editingId && (

                        <button
                            type="button"
                            onClick={
                                resetForm
                            }
                        >

                            Cancel

                        </button>

                    )}

                </form>


                {/* =================================================
                    PRODUCT LIST
                ================================================= */}

                <div className="admin-products">

                    <h2>

                        Products (
                        {products.length}
                        )

                    </h2>


                    {loadingProducts && (

                        <p className="products-loading">

                            Loading products...

                        </p>

                    )}


                    {!loadingProducts &&
                        products.length === 0 && (

                            <p className="no-products">

                                No products found.

                            </p>

                        )}


                    {!loadingProducts &&
                        products.length > 0 && (

                            <div className="admin-product-grid">

                                {products.map(
                                    product => (

                                        <div
                                            className="admin-product-card"
                                            key={
                                                product.id
                                            }
                                        >

                                            {/* -----------------------------------------
                                                PRODUCT IMAGE
                                            ----------------------------------------- */}

                                            <img
                                                src={
                                                    getFirstImage(
                                                        product
                                                    )
                                                }
                                                alt={
                                                    product.name ||
                                                    "Product"
                                                }
                                                onError={(event) => {

                                                    event.currentTarget.src =
                                                        "/placeholder.png";

                                                }}
                                            />


                                            {/* -----------------------------------------
                                                ACTIONS
                                            ----------------------------------------- */}

                                            <div className="admin-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            product
                                                        )
                                                    }
                                                    title="Edit Product"
                                                    aria-label="Edit Product"
                                                >

                                                    <i className="bi bi-pencil"></i>

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id
                                                        )
                                                    }
                                                    title="Delete Product"
                                                    aria-label="Delete Product"
                                                >

                                                    <i className="bi bi-trash"></i>

                                                </button>

                                            </div>


                                            {/* -----------------------------------------
                                                NAME
                                            ----------------------------------------- */}

                                            <h3>

                                                {
                                                    product.name
                                                }

                                            </h3>


                                            {/* -----------------------------------------
                                                CATEGORY
                                            ----------------------------------------- */}

                                            <p>

                                                <strong>
                                                    Category:
                                                </strong>{" "}

                                                {
                                                    product.category
                                                }

                                            </p>


                                            {/* -----------------------------------------
                                                SUBCATEGORY
                                            ----------------------------------------- */}

                                            <p>

                                                <strong>
                                                    Subcategory:
                                                </strong>{" "}

                                                {
                                                    product.subcategory
                                                }

                                            </p>


                                            {/* -----------------------------------------
                                                PRICE
                                            ----------------------------------------- */}

                                            <div className="admin-product-price">

                                                ₹
                                                {
                                                    product.offerprice
                                                }

                                                {" "}

                                                <del>

                                                    ₹
                                                    {
                                                        product.price
                                                    }

                                                </del>

                                            </div>


                                            {/* -----------------------------------------
                                                IMAGE COUNT
                                            ----------------------------------------- */}

                                            <small>

                                                {
                                                    getProductImages(
                                                        product
                                                    ).length
                                                }

                                                {" "}

                                                {
                                                    getProductImages(
                                                        product
                                                    ).length === 1
                                                        ? "image"
                                                        : "images"
                                                }

                                            </small>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </section>

        </div>

    );

}