export function formatPrice(price) {
    return price.toLocaleString("fr-FR");
}

export function isImageAvailable(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

export const generatePageNumbers = (totalPages, currentPage) => {
    const visiblePages = 3;
    const pages = [];

    pages.push(1);

    if (currentPage > visiblePages) {
        pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - visiblePages) {
        pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }

    return pages;
};

export const acceptedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

// useEffect(() => {
//     // Vérifier l'image principale
//     if (productData != null) {
//         const mainImage = new Image();
//         mainImage.src = `${urlBaseImage}/images/produits/${productData?.ArtID}/${productData?.str_propic}`;
//         mainImage.onload = () => setMainImageValid(true);
//         mainImage.onerror = () => setMainImageValid(false);

//         // Vérifier les images de la galerie
//         const validImages = [];
//         productData.gallerie.forEach((image) => {
//             const img = new Image();
//             img.src = `${fullUrl}${image.src.trim()}`;
//             img.onload = () =>
//                 validImages.push({
//                     src: image.src.trim(),
//                     lg_docid: image.lg_docid,
//                 });
//             img.onerror = () => {};
//         });

//         // Mettre à jour la galerie valide après un délai
//         setTimeout(() => {
//             setValidGallery(validImages);
//         }, 1000); // Ajuste le délai selon tes besoins
//     }
// }, [productData]);

export const formatDateOriginal = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};

export async function verifyImageLink(url) {
    try {
        // Vérifier le type MIME de la ressource
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.startsWith("image/")) {
            return false;
        }

        // Vérifier que l'image peut être chargée correctement
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true); // Si l'image est chargée correctement, on renvoie true
            img.onerror = () => resolve(false); // Si une erreur survient, on renvoie false
            img.src = url;
        });
    } catch (error) {
        return false; // En cas d'erreur, on renvoie false
    }
}

export const hasPrivilege = (userPrivileges, privileges) => {
    return userPrivileges[privileges] === true;
};

export function getMonthName(monthNumber) {
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    // Vérifier que le numéro est valide
    if (monthNumber < 1 || monthNumber > 12) {
        return "Numéro de mois invalide";
    }

    // Retourner le mois correspondant
    return months[monthNumber - 1]; // -1 car les indices commencent à 0
}

// let counts = setInterval(updatedNumber, 10);
// export function updatedNumber(upto, goal) {
//     let count = document.getElementById("counter");
//     count.innerHTML = ++upto;
//     if (upto === goal) {
//         clearInterval(counts);
//     }
// }

export const defaultImageLink =
    "extranetbackend/backoffice/images/default-product-image.jpg";
