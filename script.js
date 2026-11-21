
"use strict";

/* =========================================================
   HAÏTISTORE / MARKET
   SCRIPT PRINCIPAL COMPLET
   VERSION AVEC PROTECTIONS DE BASE
   ========================================================= */


/* 1. CONFIGURATION */

const STORAGE_KEY = "haitiMarketAds";
const FAVORITES_KEY = "haitiMarketFavorites";
const LANGUAGE_KEY = "haitiMarketLanguage";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1200;
const MAX_ADS = 500;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 3000;
const AD_EXPIRATION = 3 * 365 * 24 * 60 * 60 * 1000;

const CATEGORIES = [
    "Immobilier",
    "Électronique",
    "Véhicules",
    "Vêtements",
    "Maison",
    "Emplois",
    "Autres"
];


/* 2. ÉLÉMENTS HTML */

const products = document.getElementById("products");
const favoriteProducts = document.getElementById("favoriteProducts");
const cityFilter = document.getElementById("cityFilter");
const searchInput = document.getElementById("searchInput");
const sortAds = document.getElementById("sortAds");
const categoryList = document.getElementById("categoryList");
const resultsCount = document.getElementById("resultsCount");

const publishForm = document.getElementById("publishForm");
const adTitle = document.getElementById("adTitle");
const adCategory = document.getElementById("adCategory");
const adPrice = document.getElementById("adPrice");
const adCity = document.getElementById("adCity");
const adWhatsapp = document.getElementById("adWhatsapp");
const adLanguage = document.getElementById("adLanguage");
const adImage = document.getElementById("adImage");
const imagePreview = document.getElementById("imagePreview");
const adDescription = document.getElementById("adDescription");
const adConsent = document.getElementById("adConsent");

const submitAdButton = document.getElementById("submitAdButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formMessage = document.getElementById("formMessage");

const cityChoices = document.getElementById("cityChoices");
const citySearch = document.getElementById("citySearch");

const languageSelect = document.getElementById("languageSelect");

const detailsModal = document.getElementById("detailsModal");
const closeDetails = document.getElementById("closeDetails");
const detailsGallery = document.getElementById("detailsGallery");
const detailsCategory = document.getElementById("detailsCategory");
const detailsTitle = document.getElementById("detailsTitle");
const detailsPrice = document.getElementById("detailsPrice");
const detailsCity = document.getElementById("detailsCity");
const detailsDescription = document.getElementById("detailsDescription");
const detailsWhatsapp = document.getElementById("detailsWhatsapp");

const imageViewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerCounter = document.getElementById("viewerCounter");
const closeViewer = document.getElementById("closeViewer");
const prevViewer = document.getElementById("prevViewer");
const nextViewer = document.getElementById("nextViewer");

const legalModal = document.getElementById("legalModal");
const closeLegal = document.getElementById("closeLegal");
const legalTitle = document.getElementById("legalTitle");
const legalBody = document.getElementById("legalBody");


/* 3. DONNÉES ET ÉTAT */

let ads = [];
let favorites = [];
let selectedCategory = "Toutes";
let editingAdId = null;
let currentImages = [];
let selectedCities = [];

let viewerImages = [];
let viewerIndex = 0;
let currentLanguage = "fr";
let isPublishing = false;


/* 4. LISTE DES VILLES */

const HAITI_CITIES = [
    "Aquin",
    "Anse-à-Veau",
    "Anse-d'Ainault",
    "Arcahaie",
    "Baradères",
    "Bainet",
    "Cabaret",
    "Camp-Perrin",
    "Cap-Haïtien",
    "Caracol",
    "Carrefour",
    "Cavaillon",
    "Corail",
    "Croix-des-Bouquets",
    "Dame-Marie",
    "Delmas",
    "Dessalines",
    "Fort-Liberté",
    "Gonaïves",
    "Grand-Goâve",
    "Grande-Rivière-du-Nord",
    "Gressier",
    "Hinche",
    "Jacmel",
    "Jean-Rabel",
    "Jérémie",
    "Kenscoff",
    "Lascahobas",
    "Léogâne",
    "Limonade",
    "Marigot",
    "Mirebalais",
    "Milot",
    "Miragoâne",
    "Môle-Saint-Nicolas",
    "Ouanaminthe",
    "Petit-Goâve",
    "Petit-Trou-de-Nippes",
    "Petite-Rivière-de-l'Artibonite",
    "Pétion-Ville",
    "Port-au-Prince",
    "Port-de-Paix",
    "Port-Salut",
    "Saint-Louis-du-Nord",
    "Saint-Marc",
    "Saint-Raphaël",
    "Tabarre",
    "Thomonde",
    "Torbeck",
    "Trou-du-Nord",
    "Verrettes"
].sort(function (a, b) {
    return a.localeCompare(b, "fr");
});


/* 5. TRADUCTIONS */

const TRANSLATIONS = {
    fr: {
        hero_welcome: "BIENVENUE SUR HAÏTISTORE / MARKET",
        hero_title: "en toute simplicité.",
        hero_description: "La plateforme de petites annonces pour découvrir des produits, proposer vos services et trouver de bonnes opportunités partout en Haïti.",
        hero_point1: "Navigation simple",
        hero_point2: "Contact direct avec les vendeurs",
        hero_point3: "Annonces classées par catégorie",
        hero_discover: "Découvrir les annonces",
        hero_publish: "Publier gratuitement",
        hero_trust: "Une plateforme pensée pour les utilisateurs en Haïti.",

        trust_search: "Recherche facile",
        trust_search_text: "Trouvez rapidement une annonce.",
        trust_location: "Partout en Haïti",
        trust_location_text: "Explorez les annonces par ville.",
        trust_safety: "Conseils de sécurité",
        trust_safety_text: "Informez-vous avant chaque transaction.",

        category_eyebrow: "EXPLOREZ LE SITE",
        category_title: "Découvrez nos catégories",
        category_description: "Choisissez une catégorie pour découvrir les annonces.",
        cat_all: "Toutes",
        cat_real_estate: "Immobilier",
        cat_electronics: "Électronique",
        cat_vehicles: "Véhicules",
        cat_clothing: "Vêtements",
        cat_home: "Maison",
        cat_jobs: "Emplois",
        cat_other: "Autres",

        ads_eyebrow: "LES OPPORTUNITÉS DU MOMENT",
        ads_title: "Annonces récentes",
        ads_description: "Découvrez les produits et services proposés.",
        filter_city: "Ville :",
        filter_sort: "Trier :",

        favorites_eyebrow: "VOTRE SÉLECTION",
        favorites_title: "Mes favoris",
        favorites_description: "Retrouvez ici les annonces que vous avez enregistrées.",
        favorites_empty: "Vous n'avez pas encore ajouté d'annonce à vos favoris.",

        publish_eyebrow: "DEVENEZ VENDEUR",
        publish_title: "Publiez votre annonce",
        publish_description: "Présentez votre produit ou votre service aux visiteurs de Haïtistore / Market.",
        benefit_form: "Formulaire simple à remplir",
        benefit_photos: "Possibilité d'ajouter plusieurs photos",
        benefit_manage: "Gestion de vos annonces",
        benefit_contact: "Contact direct par WhatsApp",
        local_note_title: "Information importante :",
        local_note_text: "cette version utilise le stockage local du navigateur. Les annonces sont enregistrées sur cet appareil et ne sont pas encore partagées avec les autres visiteurs.",

        form_heading: "Informations de l'annonce",
        form_required: "Les champs marqués d'un * sont obligatoires.",
        label_title: "Titre de l'annonce *",
        label_category: "Catégorie *",
        choose_category: "Choisir une catégorie",
        label_price: "Prix (HTG)",
        price_hint: "Laissez vide si le prix est à discuter.",
        label_city: "Choisissez jusqu'à 3 villes *",
        label_whatsapp: "Téléphone WhatsApp",
        whatsapp_hint: "Indicatif d'Haïti : 509. Ne partagez que le numéro que vous souhaitez rendre public.",
        label_ad_language: "Langue de rédaction de l'annonce",
        ad_language_hint: "Votre annonce sera affichée dans la langue dans laquelle vous l'avez rédigée.",
        label_images: "Photos du produit (5 maximum) *",
        images_hint: "Ajoutez des photos claires de votre produit. Pendant une modification, vous pouvez conserver les anciennes photos.",
        label_description: "Description *",

        advice_title: "Conseils pour une bonne description",
        advice_intro: "Pour aider les visiteurs à faire leur choix, pensez à préciser :",
        advice_brand: "La marque et le modèle du produit.",
        advice_condition: "Son état : neuf, occasion ou à réparer.",
        advice_features: "Ses caractéristiques et fonctionnalités.",
        advice_size: "Ses dimensions ou sa capacité, si nécessaire.",
        advice_accessories: "Les accessoires inclus.",
        advice_defects: "Les défauts ou réparations éventuels.",
        advice_delivery: "Les possibilités de livraison ou de récupération.",
        advice_note: "Ces conseils sont facultatifs : rédigez librement votre annonce.",

        consent_text: "J'accepte les",
        terms_link: "conditions d'utilisation",
        consent_end: "et je confirme que les informations de mon annonce sont exactes.",
        submit_ad: "Publier l'annonce",
        cancel_edit: "Annuler la modification",

        security_eyebrow: "VOTRE SÉCURITÉ COMPTE",
        security_title: "Achetez et vendez avec prudence",
        security_description: "Quelques précautions peuvent vous aider à éviter les mauvaises surprises.",
        tip1_title: "Rencontrez-vous en lieu public",
        tip1_text: "Privilégiez un endroit fréquenté. Si possible, faites-vous accompagner.",
        tip2_title: "Vérifiez avant de payer",
        tip2_text: "Examinez le produit et vérifiez son état avant toute transaction.",
        tip3_title: "Méfiez-vous des offres suspectes",
        tip3_text: "Faites attention aux prix anormalement bas et aux demandes de paiement urgentes.",
        tip4_title: "Protégez vos informations",
        tip4_text: "Ne partagez jamais vos mots de passe, codes SMS ou documents personnels.",

        about_eyebrow: "NOTRE PLATEFORME",
        about_title: "À propos de Haïtistore / Market",
        about_text: "Haïtistore / Market est un projet de plateforme de petites annonces destiné au public haïtien. Notre objectif est de faciliter la découverte de produits et de services dans différentes catégories : immobilier, électronique, véhicules, vêtements, maison, emplois et bien plus. Nous souhaitons proposer une expérience simple, accessible et transparente, afin de faciliter les échanges entre acheteurs et vendeurs.",

        footer_description: "Les petites annonces en Haïti. Découvrez, proposez et échangez.",
        footer_navigation: "Navigation",
        footer_information: "Informations",
        nav_home: "Accueil",
        nav_ads: "Annonces",
        nav_categories: "Catégories",
        nav_publish: "Publier une annonce",
        nav_favorites: "Mes favoris",
        nav_security: "Sécurité",
        privacy_link: "Confidentialité",
        footer_local: "Version locale de démonstration."
    },

    ht: {
        hero_welcome: "BYENVENI SOU HAÏTISTORE / MARKET",
        hero_title: "nan tout senplisite.",
        hero_description: "Platfòm ti anons pou dekouvri pwodwi, pwopoze sèvis ou epi jwenn bon opòtinite toupatou ann Ayiti.",
        hero_point1: "Navigasyon fasil",
        hero_point2: "Kontak dirèk ak vandè yo",
        hero_point3: "Anons klase pa kategori",
        hero_discover: "Dekouvri anons yo",
        hero_publish: "Pibliye gratis",
        hero_trust: "Yon platfòm ki fèt pou itilizatè ann Ayiti.",

        trust_search: "Rechèch fasil",
        trust_search_text: "Jwenn anons byen vit.",
        trust_location: "Toupatou ann Ayiti",
        trust_location_text: "Eksplore anons yo selon vil.",
        trust_safety: "Konsèy sekirite",
        trust_safety_text: "Enfòme w anvan chak tranzaksyon.",

        category_eyebrow: "EKSplore SIT LA",
        category_title: "Dekouvri kategori nou yo",
        category_description: "Chwazi yon kategori pou dekouvri anons yo.",
        cat_all: "Tout",
        cat_real_estate: "Byen imobilye",
        cat_electronics: "Elektwonik",
        cat_vehicles: "Machin",
        cat_clothing: "Rad",
        cat_home: "Kay",
        cat_jobs: "Travay",
        cat_other: "Lòt",

        ads_eyebrow: "OPÒTINITE YO",
        ads_title: "Dènye anons yo",
        ads_description: "Dekouvri pwodwi ak sèvis moun ap pwopoze.",
        filter_city: "Vil :",
        filter_sort: "Klase :",

        favorites_eyebrow: "SELEKSYON OU",
        favorites_title: "Sa mwen renmen",
        favorites_description: "Men anons ou te konsève yo.",
        favorites_empty: "Ou poko ajoute okenn anons nan lis ou renmen yo.",

        publish_eyebrow: "VIN YON VANDÈ",
        publish_title: "Pibliye anons ou",
        publish_description: "Prezante pwodwi oswa sèvis ou bay vizitè Haïtistore / Market.",
        benefit_form: "Fòmilè fasil pou ranpli",
        benefit_photos: "Ou ka ajoute plizyè foto",
        benefit_manage: "Jesyon anons ou yo",
        benefit_contact: "Kontak dirèk sou WhatsApp",
        local_note_title: "Enfòmasyon enpòtan :",
        local_note_text: "vèsyon sa a itilize memwa navigatè a. Anons yo anrejistre sou aparèy sa a epi lòt vizitè yo poko ka wè yo.",

        form_heading: "Enfòmasyon sou anons la",
        form_required: "Chan ki gen yon * obligatwa.",
        label_title: "Tit anons la *",
        label_category: "Kategori *",
        choose_category: "Chwazi yon kategori",
        label_price: "Pri (HTG)",
        price_hint: "Kite vid si pri a negosyab.",
        label_city: "Chwazi jiska 3 vil *",
        label_whatsapp: "Telefòn WhatsApp",
        whatsapp_hint: "Kòd Ayiti : 509. Pataje sèlman nimewo ou vle piblik la wè.",
        label_ad_language: "Lang ou ekri anons la",
        ad_language_hint: "Anons ou ap parèt nan lang ou te itilize pou ekri li.",
        label_images: "Foto pwodwi a (5 maksimòm) *",
        images_hint: "Ajoute foto ki klè. Lè w ap modifye yon anons, ou ka konsève ansyen foto yo.",
        label_description: "Deskripsyon *",

        advice_title: "Konsèy pou yon bon deskripsyon",
        advice_intro: "Pou ede vizitè yo chwazi, sonje presize :",
        advice_brand: "Mak ak modèl pwodwi a.",
        advice_condition: "Eta li : nouvo, dezyèm men oswa pou repare.",
        advice_features: "Karakteristik ak fonksyon li yo.",
        advice_size: "Dimansyon oswa kapasite li, si sa nesesè.",
        advice_accessories: "Pwodwi ki vini avèk li.",
        advice_defects: "Defo oswa reparasyon li te genyen.",
        advice_delivery: "Posiblite pou livre oswa vin pran pwodwi a.",
        advice_note: "Konsèy sa yo pa obligatwa : ekri anons ou jan ou vle.",

        consent_text: "Mwen dakò ak",
        terms_link: "kondisyon itilizasyon yo",
        consent_end: "epi mwen konfime enfòmasyon anons mwen an egzak.",
        submit_ad: "Pibliye anons la",
        cancel_edit: "Anile modifikasyon an",

        security_eyebrow: "SEKIRITE OU ENPÒTAN",
        security_title: "Achte epi vann avèk prekosyon",
        security_description: "Kèk prekosyon ka ede w evite move sipriz.",
        tip1_title: "Rankontre nan yon kote piblik",
        tip1_text: "Chwazi yon kote ki gen moun. Si sa posib, ale ak yon moun.",
        tip2_title: "Verifye anvan ou peye",
        tip2_text: "Egzamine pwodwi a epi verifye eta li anvan tranzaksyon an.",
        tip3_title: "Pran prekosyon ak òf ki sispèk",
        tip3_text: "Fè atansyon ak pri ki twò ba ak demann peman prese.",
        tip4_title: "Pwoteje enfòmasyon ou",
        tip4_text: "Pa janm pataje modpas, kòd SMS oswa dokiman pèsonèl ou.",

        about_eyebrow: "PLATFÒM NOU AN",
        about_title: "Konsènan Haïtistore / Market",
        about_text: "Haïtistore / Market se yon pwojè platfòm ti anons pou piblik ayisyen an. Objektif nou se fasilite dekouvèt pwodwi ak sèvis nan plizyè kategori : byen imobilye, elektwonik, machin, rad, kay, travay ak plis ankò. Nou vle ofri yon eksperyans ki senp, aksesib epi transparan pou fasilite echanj ant achtè ak vandè.",

        footer_description: "Ti anons ann Ayiti. Dekouvri, pwopoze epi fè echanj.",
        footer_navigation: "Navigasyon",
        footer_information: "Enfòmasyon",
        nav_home: "Akèy",
        nav_ads: "Anons",
        nav_categories: "Kategori",
        nav_publish: "Pibliye yon anons",
        nav_favorites: "Sa mwen renmen",
        nav_security: "Sekirite",
        privacy_link: "Konfidansyalite",
        footer_local: "Vèsyon lokal demonstrasyon."
    }
};


/* 6. OUTILS GÉNÉRAUX ET VALIDATION */

function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function cleanText(value, maxLength) {
    return String(value ?? "")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim()
        .slice(0, maxLength);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return "ad-" + window.crypto.randomUUID();
    }

    return "ad-" + Date.now() + "-" +
        Math.random().toString(36).slice(2, 12);
}

function isValidCategory(category) {
    return CATEGORIES.includes(category);
}

function isValidCity(city) {
    return HAITI_CITIES.some(function (knownCity) {
        return normalizeText(knownCity) === normalizeText(city);
    });
}

function isValidImageData(image) {
    if (typeof image !== "string") return false;

    if (image.length > 5 * 1024 * 1024) return false;

    return /^data:image\/(jpeg|jpg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(image);
}

function formatPrice(price) {
    if (price === "" || price === null || price === undefined) {
        return currentLanguage === "ht" ? "Pri negosyab" : "Prix à discuter";
    }

    const number = Number(price);

    if (!Number.isFinite(number)) {
        return currentLanguage === "ht" ? "Pri negosyab" : "Prix à discuter";
    }

    return new Intl.NumberFormat("fr-FR").format(number) + " HTG";
}

function formatDate(timestamp) {
    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

function timeAgo(timestamp) {
    const difference = Math.max(0, Date.now() - Number(timestamp));

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
        return currentLanguage === "ht" ? "Kounye a" : "À l'instant";
    }

    if (minutes < 60) {
        return currentLanguage === "ht"
            ? "Sa gen " + minutes + " minit"
            : "Il y a " + minutes + " min";
    }

    if (hours < 24) {
        return currentLanguage === "ht"
            ? "Sa gen " + hours + " èdtan"
            : "Il y a " + hours + " h";
    }

    if (days < 30) {
        return currentLanguage === "ht"
            ? "Sa gen " + days + " jou"
            : "Il y a " + days + " j";
    }

    return formatDate(timestamp);
}


/* 7. NETTOYAGE ET STOCKAGE LOCAL */

function sanitizeAd(ad) {
    if (!ad || typeof ad !== "object") return null;

    const title = cleanText(ad.title, MAX_TITLE_LENGTH);
    const category = isValidCategory(ad.category)
        ? ad.category
        : "Autres";

    const cityList = String(ad.city || "")
        .split(",")
        .map(city => city.trim())
        .filter(isValidCity)
        .filter((city, index, list) =>
            list.findIndex(item => normalizeText(item) === normalizeText(city)) === index
        )
        .slice(0, 3);

    const rawImages = Array.isArray(ad.images)
        ? ad.images
        : (ad.image ? [ad.image] : []);

    const images = rawImages
        .filter(isValidImageData)
        .slice(0, MAX_IMAGES);

    const createdAt = Number(ad.createdAt || ad.timestamp || Date.now());

    if (!title || !Number.isFinite(createdAt) || createdAt <= 0) {
        return null;
    }

    const rawPrice = ad.price === "" || ad.price === null || ad.price === undefined
        ? ""
        : Number(ad.price);

    const price = rawPrice === "" ||
        (Number.isFinite(rawPrice) && rawPrice >= 0 && rawPrice <= 1000000000000)
        ? rawPrice
        : "";

    const rawId = cleanText(ad.id, 100);

    return {
        id: rawId || createId(),
        title: title,
        category: category,
        price: price,
        city: cityList.join(", "),
        whatsapp: normalizeWhatsApp(ad.whatsapp || ""),
        description: cleanText(ad.description, MAX_DESCRIPTION_LENGTH),
        images: images,
        createdAt: createdAt,
        updatedAt: Number(ad.updatedAt) > 0
            ? Number(ad.updatedAt)
            : createdAt,
        language: ad.language === "ht" ? "ht" : "fr"
    };
}

function loadAds() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (!Array.isArray(saved)) return [];

        return saved
            .map(sanitizeAd)
            .filter(Boolean)
            .slice(0, MAX_ADS);

    } catch (error) {
        console.error("Impossible de lire les annonces :", error);
        return [];
    }
}

function saveAds() {
    try {
        if (ads.length > MAX_ADS) {
            showMessage(
                currentLanguage === "ht"
                    ? "Ou rive nan limit anons yo."
                    : "La limite d'annonces enregistrées est atteinte.",
                "error"
            );

            return false;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
        return true;

    } catch (error) {
        console.error("Impossible d'enregistrer les annonces :", error);

        showMessage(
            currentLanguage === "ht"
                ? "Espas memwa a pa sifi pou konsève anons la."
                : "L'espace de stockage est insuffisant pour enregistrer cette annonce.",
            "error"
        );

        return false;
    }
}

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

        if (!Array.isArray(saved)) return [];

        return saved
            .filter(id => typeof id === "string")
            .map(id => id.slice(0, 100))
            .slice(0, MAX_ADS);

    } catch (error) {
        return [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Impossible d'enregistrer les favoris :", error);
    }
}

function removeExpiredAds() {
    const cutoff = Date.now() - AD_EXPIRATION;
    const previousLength = ads.length;

    ads = ads.filter(function (ad) {
        return Number(ad.createdAt) >= cutoff;
    });

    if (ads.length !== previousLength) {
        saveAds();
    }
}


/* 8. MESSAGES */

function showMessage(message, type) {
    if (!formMessage) return;

    formMessage.textContent = message;

    formMessage.style.color = type === "error"
        ? "#c0392b"
        : "#16834b";
}

function clearMessage() {
    if (formMessage) {
        formMessage.textContent = "";
    }
}


/* 9. TRADUCTION DE L'INTERFACE */

function applyLanguage(language) {
    currentLanguage = language === "ht" ? "ht" : "fr";

    document.documentElement.lang = currentLanguage === "ht" ? "ht" : "fr";

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");
        const translation = TRANSLATIONS[currentLanguage][key];

        if (translation !== undefined) {
            element.textContent = translation;
        }
    });

    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    try {
        localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    } catch (error) {
        console.warn("Préférence de langue non enregistrée.");
    }

    renderAds();
    renderFavorites();
    updateCityFilter();
    updateSelectedCities();
}

function initializeLanguage() {
    let savedLanguage = "fr";

    try {
        savedLanguage = localStorage.getItem(LANGUAGE_KEY) || "fr";
    } catch (error) {
        savedLanguage = "fr";
    }

    applyLanguage(savedLanguage);
}

if (languageSelect) {
    languageSelect.addEventListener("change", function () {
        applyLanguage(languageSelect.value);
    });
}


/* 10. SÉLECTION DES VILLES */

function renderCityChoices() {
    if (!cityChoices) return;

    cityChoices.innerHTML = "";

    const search = citySearch
        ? normalizeText(citySearch.value)
        : "";

    const filteredCities = HAITI_CITIES.filter(function (city) {
        return normalizeText(city).includes(search);
    });

    if (filteredCities.length === 0) {
        const message = document.createElement("p");

        message.className = "city-no-result";
        message.textContent = currentLanguage === "ht"
            ? "Pa gen vil ki koresponn."
            : "Aucune ville trouvée.";

        cityChoices.appendChild(message);
        return;
    }

    filteredCities.forEach(function (city) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "city-choice";
        button.textContent = city;

        const selected = selectedCities.includes(city);

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));

        button.disabled = !selected && selectedCities.length >= 3;

        button.addEventListener("click", function () {
            if (selectedCities.includes(city)) {
                selectedCities = selectedCities.filter(function (item) {
                    return item !== city;
                });
            } else if (selectedCities.length < 3) {
                selectedCities.push(city);
            }

            updateSelectedCities();
            renderCityChoices();
        });

        cityChoices.appendChild(button);
    });
}

function updateSelectedCities() {
    if (adCity) {
        adCity.value = selectedCities.join(", ");
    }

    const message = document.getElementById("citySelectionMessage");

    if (message) {
        if (selectedCities.length === 3) {
            message.textContent = currentLanguage === "ht"
                ? "Ou chwazi 3 vil. Retire youn pou chwazi yon lòt."
                : "Vous avez sélectionné 3 villes. Retirez-en une pour en choisir une autre.";
        } else {
            message.textContent = currentLanguage === "ht"
                ? selectedCities.length + " sou 3 vil chwazi."
                : selectedCities.length + " ville(s) sélectionnée(s) sur 3.";
        }
    }
}

function setSelectedCities(value) {
    const requestedCities = String(value || "")
        .split(",")
        .map(city => city.trim())
        .filter(Boolean);

    selectedCities = [];

    requestedCities.forEach(function (city) {
        const match = HAITI_CITIES.find(function (knownCity) {
            return normalizeText(knownCity) === normalizeText(city);
        });

        if (match && !selectedCities.includes(match) && selectedCities.length < 3) {
            selectedCities.push(match);
        }
    });

    updateSelectedCities();
    renderCityChoices();
}

if (citySearch) {
    citySearch.addEventListener("input", renderCityChoices);
}


/* 11. FILTRE DES VILLES DES ANNONCES */

function getAdCities(ad) {
    return String(ad.city || "")
        .split(",")
        .map(city => city.trim())
        .filter(Boolean);
}

function updateCityFilter() {
    if (!cityFilter) return;

    const currentValue = cityFilter.value;

    const cities = Array.from(
        new Set(
            ads.flatMap(function (ad) {
                return getAdCities(ad);
            })
        )
    ).sort(function (a, b) {
        return a.localeCompare(b, "fr");
    });

    cityFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = currentLanguage === "ht" ? "Tout" : "Toutes";

    cityFilter.appendChild(allOption);

    cities.forEach(function (city) {
        const option = document.createElement("option");

        option.value = city;
        option.textContent = city;

        cityFilter.appendChild(option);
    });

    if (cities.includes(currentValue)) {
        cityFilter.value = currentValue;
    }
}


/* 12. FILTRAGE ET TRI DES ANNONCES */

function getVisibleAds() {
    let visibleAds = [...ads];

    const search = normalizeText(searchInput ? searchInput.value : "");
    const selectedCity = cityFilter ? cityFilter.value : "";
    const selectedSort = sortAds ? sortAds.value : "newest";

    if (selectedCategory !== "Toutes") {
        visibleAds = visibleAds.filter(function (ad) {
            return normalizeText(ad.category) === normalizeText(selectedCategory);
        });
    }

    if (search) {
        visibleAds = visibleAds.filter(function (ad) {
            const content = normalizeText([
                ad.title,
                ad.category,
                ad.city,
                ad.description
            ].join(" "));

            return content.includes(search);
        });
    }

    if (selectedCity) {
        visibleAds = visibleAds.filter(function (ad) {
            return getAdCities(ad).some(function (city) {
                return normalizeText(city) === normalizeText(selectedCity);
            });
        });
    }

    if (selectedSort === "price-asc") {
        visibleAds.sort(function (a, b) {
            const priceA = a.price === "" ? Infinity : Number(a.price);
            const priceB = b.price === "" ? Infinity : Number(b.price);

            return priceA - priceB;
        });

    } else if (selectedSort === "price-desc") {
        visibleAds.sort(function (a, b) {
            const priceA = a.price === "" ? -Infinity : Number(a.price);
            const priceB = b.price === "" ? -Infinity : Number(b.price);

            return priceB - priceA;

        });

    } else {
        visibleAds.sort(function (a, b) {
            return Number(b.createdAt) - Number(a.createdAt);
        });
    }

    return visibleAds;
}


/* 13. AFFICHAGE DES ANNONCES */

function renderAds() {
    if (!products) return;

    updateCityFilter();

    const visibleAds = getVisibleAds();

    products.innerHTML = "";

    if (resultsCount) {
        resultsCount.textContent = currentLanguage === "ht"
            ? visibleAds.length + " anons"
            : visibleAds.length + " annonce(s)";
    }

    if (visibleAds.length === 0) {
        const empty = document.createElement("p");

        empty.className = "empty-message";
        empty.textContent = currentLanguage === "ht"
            ? "Pa gen anons ki koresponn ak rechèch ou a."
            : "Aucune annonce ne correspond à votre recherche.";

        products.appendChild(empty);
        return;
    }

    visibleAds.forEach(function (ad) {
        products.appendChild(createAdCard(ad));
    });
}

function createAdCard(ad) {
    const card = document.createElement("article");

    card.className = "product-card";

    const isFavorite = favorites.includes(ad.id);

    const image = ad.images && ad.images.length > 0
        ? ad.images[0]
        : "";

    const imageHTML = image && isValidImageData(image)
        ? '<img class="product-image" src="' + escapeHTML(image) +
          '" alt="' + escapeHTML(ad.title) + '" loading="lazy">'
        : '<div class="product-image" aria-label="Aucune photo"></div>';

    card.innerHTML = `
        ${imageHTML}

        <div class="product-card-content">

            <span class="product-category">
                ${escapeHTML(ad.category)}
            </span>

            <h3>${escapeHTML(ad.title)}</h3>

            <p class="product-price">
                ${escapeHTML(formatPrice(ad.price))}
            </p>

            <p class="product-city">
                ◎ ${escapeHTML(ad.city)}
            </p>

            <p class="product-date">
                ${escapeHTML(timeAgo(ad.createdAt))}
            </p>

            <div class="product-actions">

                <button type="button"
                    class="details-button"
                    data-action="details"
                    data-id="${escapeHTML(ad.id)}">
                    ${currentLanguage === "ht" ? "Detay" : "Détails"}
                </button>

                <button type="button"
                    class="favorite-button"
                    data-action="favorite"
                    data-id="${escapeHTML(ad.id)}"
                    aria-pressed="${isFavorite}">
                    ${isFavorite ? "♥" : "♡"}
                    ${currentLanguage === "ht" ? "Renmen" : "Favori"}
                </button>

                <button type="button"
                    class="edit-button"
                    data-action="edit"
                    data-id="${escapeHTML(ad.id)}">
                    ${currentLanguage === "ht" ? "Modifye" : "Modifier"}
                </button>

                <button type="button"
                    class="delete-button"
                    data-action="delete"
                    data-id="${escapeHTML(ad.id)}">
                    ${currentLanguage === "ht" ? "Efase" : "Supprimer"}
                </button>

            </div>
        </div>
    `;

    return card;
}


/* 14. FAVORIS */

function renderFavorites() {
    if (!favoriteProducts) return;

    favoriteProducts.innerHTML = "";

    const favoriteAds = ads.filter(function (ad) {
        return favorites.includes(ad.id);
    });

    if (favoriteAds.length === 0) {
        const empty = document.createElement("p");

        empty.className = "empty-favorites";
        empty.textContent = currentLanguage === "ht"
            ? "Ou poko ajoute okenn anons nan lis ou renmen yo."
            : "Vous n'avez pas encore ajouté d'annonce à vos favoris.";

        favoriteProducts.appendChild(empty);
        return;
    }

    favoriteAds
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .forEach(function (ad) {
            favoriteProducts.appendChild(createAdCard(ad));
        });
}

function toggleFavorite(id) {
    if (!ads.some(ad => ad.id === id)) return;

    if (favorites.includes(id)) {
        favorites = favorites.filter(function (favoriteId) {
            return favoriteId !== id;
        });

    } else {
        if (favorites.length >= MAX_ADS) return;
        favorites.push(id);
    }

    saveFavorites();

    renderAds();
    renderFavorites();
}


/* 15. GESTION DES CLICS SUR LES ANNONCES */

function handleProductAction(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (!id || !ads.some(ad => ad.id === id)) return;

    if (action === "details") {
        openDetails(id);
    }

    if (action === "favorite") {
        toggleFavorite(id);
    }

    if (action === "edit") {
        startEdit(id);
    }

    if (action === "delete") {
        deleteAd(id);
    }
}

if (products) {
    products.addEventListener("click", handleProductAction);
}

if (favoriteProducts) {
    favoriteProducts.addEventListener("click", handleProductAction);
}


/* 16. RECHERCHE, CATÉGORIES ET TRI */

if (searchInput) {
    searchInput.addEventListener("input", renderAds);
}

if (cityFilter) {
    cityFilter.addEventListener("change", renderAds);
}

if (sortAds) {
    sortAds.addEventListener("change", renderAds);
}

if (categoryList) {
    categoryList.addEventListener("click", function (event) {
        const button = event.target.closest("[data-category]");

        if (!button) return;

        const requestedCategory = button.dataset.category || "Toutes";

        if (
            requestedCategory !== "Toutes" &&
            !CATEGORIES.includes(requestedCategory)
        ) {
            return;
        }

        selectedCategory = requestedCategory;

        categoryList.querySelectorAll("[data-category]").forEach(function (item) {
            const active = item === button;

            item.classList.toggle("is-active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        renderAds();
    });
}


/* 17. VALIDATION WHATSAPP */

function normalizeWhatsApp(value) {
    return String(value || "").replace(/\D/g, "").slice(0, 11);
}

function isValidWhatsApp(value) {
    if (!String(value || "").trim()) return true;

    const number = normalizeWhatsApp(value);

    return /^\d{8}$/.test(number) || /^509\d{8}$/.test(number);
}

function getWhatsAppLink(value) {
    const number = normalizeWhatsApp(value);

    if (!number || !isValidWhatsApp(number)) return "";

    return "https://wa.me/" +
        (number.length === 8 ? "509" + number : number);
}


/* 18. TRAITEMENT ET COMPRESSION DES PHOTOS */

function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(new Error("Lecture de la photo impossible."));
        };

        reader.readAsDataURL(file);
    });
}

function compressImage(file) {
    return new Promise(async function (resolve, reject) {
        try {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {
                reject(new Error(
                    "Format non accepté. Utilisez une photo JPG, PNG ou WebP."
                ));
                return;
            }

            if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
                reject(new Error(
                    "Chaque photo doit peser au maximum 8 Mo."
                ));
                return;
            }

            const dataURL = await readFileAsDataURL(file);
            const image = new Image();

            image.onload = function () {
                if (!image.naturalWidth || !image.naturalHeight) {
                    reject(new Error("Cette photo est invalide."));
                    return;
                }

                let width = image.naturalWidth;
                let height = image.naturalHeight;

                if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                    const ratio = Math.min(
                        MAX_IMAGE_DIMENSION / width,
                        MAX_IMAGE_DIMENSION / height
                    );

                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Compression de la photo impossible."));
                    return;
                }

                context.drawImage(image, 0, 0, width, height);

                const compressedImage = canvas.toDataURL("image/jpeg", 0.82);

                if (!isValidImageData(compressedImage)) {
                    reject(new Error("Le format de la photo obtenue est invalide."));
                    return;
                }

                resolve(compressedImage);
            };

            image.onerror = function () {
                reject(new Error("Impossible de traiter cette photo."));
            };

            image.src = dataURL;

        } catch (error) {
            reject(error);
        }
    });
}

function showImagePreview(images) {
    if (!imagePreview) return;

    imagePreview.innerHTML = "";

    images.forEach(function (image, index) {
        if (!isValidImageData(image)) return;

        const wrapper = document.createElement("div");
        wrapper.className = "preview-item";

        const img = document.createElement("img");

        img.src = image;
        img.alt = "Aperçu de la photo " + (index + 1);

        wrapper.appendChild(img);
        imagePreview.appendChild(wrapper);
    });
}

if (adImage) {
    adImage.addEventListener("change", async function () {
        const files = Array.from(adImage.files || []);

        if (files.length > MAX_IMAGES) {
            showMessage(
                currentLanguage === "ht"
                    ? "Ou ka chwazi 5 foto sèlman."
                    : "Vous pouvez sélectionner 5 photos maximum.",
                "error"
            );

            adImage.value = "";
            return;
        }

        try {
            clearMessage();

            const compressed = [];

            for (const file of files) {
                compressed.push(await compressImage(file));
            }

            currentImages = compressed;
            showImagePreview(currentImages);

        } catch (error) {
            adImage.value = "";

            currentImages = editingAdId
                ? [...(ads.find(ad => ad.id === editingAdId)?.images || [])]
                : [];

            showImagePreview(currentImages);
            showMessage(error.message, "error");
        }
    });
}


/* 19. VALIDATION DU FORMULAIRE */

function validateAdForm() {
    if (!adTitle || !adCategory || !adPrice ||
        !adWhatsapp || !adDescription || !adConsent) {
        showMessage(
            "Certains champs du formulaire sont introuvables. Vérifiez votre HTML.",
            "error"
        );

        return false;
    }

    const title = cleanText(adTitle.value, MAX_TITLE_LENGTH);
    const description = cleanText(adDescription.value, MAX_DESCRIPTION_LENGTH);

    if (title.length < 3 || title.length > MAX_TITLE_LENGTH) {
        showMessage(
            currentLanguage === "ht"
                ? "Tit anons la dwe genyen ant 3 ak 100 karaktè."
                : "Le titre doit contenir entre 3 et 100 caractères.",
            "error"
        );

        adTitle.focus();
        return false;
    }

    if (!isValidCategory(adCategory.value)) {
        showMessage(
            currentLanguage === "ht"
                ? "Tanpri chwazi yon kategori valab."
                : "Veuillez choisir une catégorie valide.",
            "error"
        );

        adCategory.focus();
        return false;
    }

    if (!selectedCities.length) {
        showMessage(
            currentLanguage === "ht"
                ? "Chwazi omwen yon vil."
                : "Veuillez sélectionner au moins une ville.",
            "error"
        );

        if (citySearch) citySearch.focus();
        return false;
    }

    if (
        selectedCities.length > 3 ||
        selectedCities.some(city => !isValidCity(city))
    ) {
        showMessage("La sélection des villes n'est pas valide.", "error");
        return false;
    }

    if (adPrice.value !== "") {
        const price = Number(adPrice.value);

        if (
            !Number.isFinite(price) ||
            price < 0 ||
            price > 1000000000000
        ) {
            showMessage("Veuillez saisir un prix valide.", "error");
            adPrice.focus();
            return false;
        }
    }

    if (!isValidWhatsApp(adWhatsapp.value)) {
        showMessage(
            "Le numéro WhatsApp doit contenir 8 chiffres ou 509 suivi de 8 chiffres.",
            "error"
        );

        adWhatsapp.focus();
        return false;
    }

    if (description.length < 10 || description.length > MAX_DESCRIPTION_LENGTH) {
        showMessage(
            currentLanguage === "ht"
                ? "Deskripsyon an dwe genyen ant 10 ak 3000 karaktè."
                : "La description doit contenir entre 10 et 3000 caractères.",
            "error"
        );

        adDescription.focus();
        return false;
    }

    if (!editingAdId && currentImages.length === 0) {
        showMessage("Veuillez ajouter au moins une photo.", "error");

        if (adImage) adImage.focus();
        return false;
    }

    if (editingAdId && currentImages.length === 0) {
        const existingAd = ads.find(ad => ad.id === editingAdId);

        if (!existingAd || !existingAd.images.length) {
            showMessage("Veuillez ajouter au moins une photo.", "error");

            if (adImage) adImage.focus();
            return false;
        }
    }

    if (!adConsent.checked) {
        showMessage(
            "Veuillez accepter les conditions d'utilisation.",
            "error"
        );

        adConsent.focus();
        return false;
    }

    return true;
}


/* 20. PUBLICATION ET MODIFICATION D'UNE ANNONCE */

async function publishAd(event) {
    event.preventDefault();

    if (isPublishing) return;

    clearMessage();

    if (!validateAdForm()) return;

    if (ads.length >= MAX_ADS && !editingAdId) {
        showMessage(
            "La limite d'annonces enregistrées est atteinte.",
            "error"
        );

        return;
    }

    isPublishing = true;

    if (submitAdButton) {
        submitAdButton.disabled = true;
    }

    try {
        const title = cleanText(adTitle.value, MAX_TITLE_LENGTH);
        const category = adCategory.value;

        const price = adPrice.value === ""
            ? ""
            : Number(adPrice.value);

        const city = selectedCities.join(", ");
        const whatsapp = normalizeWhatsApp(adWhatsapp.value);

        const description = cleanText(
            adDescription.value,
            MAX_DESCRIPTION_LENGTH
        );

        const language = adLanguage
            ? adLanguage.value
            : "fr";

        const oldAd = editingAdId
            ? ads.find(ad => ad.id === editingAdId)
            : null;

        if (editingAdId && !oldAd) {
            showMessage(
                "Cette annonce n'existe plus. Veuillez recommencer.",
                "error"
            );

            resetPublishForm();
            return;
        }

        const images = currentImages.length > 0
            ? [...currentImages]
            : (oldAd ? [...oldAd.images] : []);

        if (!images.length || images.some(image => !isValidImageData(image))) {
            showMessage("Les photos de cette annonce ne sont pas valides.", "error");
            return;
        }

        const now = Date.now();

        const newAd = {
            id: oldAd ? oldAd.id : createId(),
            title: title,
            category: category,
            price: price,
            city: city,
            whatsapp: whatsapp,
            description: description,
            images: images,
            createdAt: oldAd ? oldAd.createdAt : now,
            updatedAt: now,
            language: language === "ht" ? "ht" : "fr"
        };

        const previousAds = [...ads];

        if (oldAd) {
            ads = ads.map(function (ad) {
                return ad.id === editingAdId ? newAd : ad;
            });

        } else {
            ads.unshift(newAd);
        }

        if (!saveAds()) {
            ads = previousAds;
            return;
        }

        const wasEditing = Boolean(oldAd);

        renderAds();
        renderFavorites();
        updateCityFilter();

        resetPublishForm();

        showMessage(
            wasEditing
                ? (
                    currentLanguage === "ht"
                        ? "Anons ou a modifye avèk siksè."
                        : "Votre annonce a été modifiée avec succès."
                )
                : (
                    currentLanguage === "ht"
                        ? "Anons ou a pibliye avèk siksè."
                        : "Votre annonce a été publiée avec succès."
                ),
            "success"
        );

        const publishSection = document.getElementById("publier");

        if (publishSection) {
            publishSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    } catch (error) {
        console.error("Erreur pendant la publication :", error);

        showMessage(
            "Une erreur est survenue. Votre annonce n'a peut-être pas été enregistrée.",
            "error"
        );

    } finally {
        isPublishing = false;

        if (submitAdButton) {
            submitAdButton.disabled = false;
        }
    }
}

if (publishForm) {
    publishForm.addEventListener("submit", publishAd);
}


/* 21. MODIFICATION D'UNE ANNONCE */

function startEdit(id) {
    const ad = ads.find(function (item) {
        return item.id === id;
    });

    if (!ad) return;

    if (!publishForm || !adTitle || !adCategory || !adPrice ||
        !adWhatsapp || !adDescription) {
        showMessage("Le formulaire de modification est incomplet.", "error");
        return;
    }

    editingAdId = id;

    adTitle.value = ad.title;
    adCategory.value = ad.category;
    adPrice.value = ad.price;

    setSelectedCities(ad.city);

    adWhatsapp.value = ad.whatsapp || "";
    adDescription.value = ad.description;

    currentImages = [...(ad.images || [])];

    if (adLanguage) {
        adLanguage.value = ad.language || "fr";
    }

    if (adImage) {
        adImage.required = false;
        adImage.value = "";
    }

    showImagePreview(currentImages);

    if (submitAdButton) {
        submitAdButton.textContent = currentLanguage === "ht"
            ? "Anrejistre chanjman yo"
            : "Enregistrer les modifications";
    }

    if (cancelEditButton) {
        cancelEditButton.hidden = false;
    }

    showMessage(
        currentLanguage === "ht"
            ? "Ou ap modifye anons sa a. Ansyen foto yo konsève si ou pa chwazi lòt."
            : "Vous modifiez cette annonce. Les anciennes photos seront conservées si vous n'en choisissez pas de nouvelles.",
        "success"
    );

    if (citySearch) {
        citySearch.value = "";
        renderCityChoices();
    }

    const publishSection = document.getElementById("publier");

    if (publishSection) {
        publishSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* 22. RÉINITIALISATION ET ANNULATION */

function resetPublishForm() {
    if (publishForm) {
        publishForm.reset();
    }

    editingAdId = null;
    currentImages = [];

    setSelectedCities("");

    if (citySearch) {
        citySearch.value = "";
    }

    if (adImage) {
        adImage.required = true;
        adImage.value = "";
    }

    if (adLanguage) {
        adLanguage.value = "fr";
    }

    showImagePreview([]);

    if (submitAdButton) {
        submitAdButton.textContent =
            TRANSLATIONS[currentLanguage].submit_ad;
    }

    if (cancelEditButton) {
        cancelEditButton.hidden = true;
    }

    renderCityChoices();
}

if (cancelEditButton) {
    cancelEditButton.addEventListener("click", function () {
        resetPublishForm();
        clearMessage();
    });
}


/* 23. SUPPRESSION D'UNE ANNONCE */

function deleteAd(id) {
    const ad = ads.find(item => item.id === id);

    if (!ad) return;

    const confirmation = window.confirm(
        currentLanguage === "ht"
            ? "Èske ou sèten ou vle efase anons sa a ?"
            : "Voulez-vous vraiment supprimer cette annonce ?"
    );

    if (!confirmation) return;

    const previousAds = [...ads];
    const previousFavorites = [...favorites];

    ads = ads.filter(function (item) {
        return item.id !== id;
    });

    favorites = favorites.filter(function (favoriteId) {
        return favoriteId !== id;
    });

    if (!saveAds()) {
        ads = previousAds;
        favorites = previousFavorites;
        return;
    }

    saveFavorites();

    if (editingAdId === id) {
        resetPublishForm();
    }

    renderAds();
    renderFavorites();
    updateCityFilter();
}


/* 24. FENÊTRE DES DÉTAILS */

function openDetails(id) {
    const ad = ads.find(item => item.id === id);

    if (!ad || !detailsModal) return;

    if (
        detailsCategory
    ) detailsCategory.textContent = ad.category;

    if (
        detailsTitle
    ) detailsTitle.textContent = ad.title;

    if (
        detailsPrice
    ) detailsPrice.textContent = formatPrice(ad.price);

    if (
        detailsCity
    ) detailsCity.textContent = "◎ " + ad.city;

    if (
        detailsDescription
    ) detailsDescription.textContent = ad.description;

    if (detailsGallery) {
        detailsGallery.innerHTML = "";

        (ad.images || []).forEach(function (image, index) {
            if (!isValidImageData(image)) return;

            const img = document.createElement("img");

            img.src = image;
            img.alt = ad.title + " - photo " + (index + 1);
            img.loading = "lazy";

            img.addEventListener("click", function () {
                openImageViewer(ad.images, index);
            });

            detailsGallery.appendChild(img);
        });
    }

    if (detailsWhatsapp) {
        const whatsappLink = getWhatsAppLink(ad.whatsapp);

        if (whatsappLink) {
            detailsWhatsapp.href = whatsappLink;
            detailsWhatsapp.target = "_blank";
            detailsWhatsapp.rel = "noopener noreferrer";
            detailsWhatsapp.hidden = false;
        } else {
            detailsWhatsapp.removeAttribute("href");
            detailsWhatsapp.hidden = true;
        }
    }

    detailsModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeDetailsModal() {
    if (detailsModal) {
        detailsModal.hidden = true;
    }

    document.body.style.overflow = "";
}

if (closeDetails) {
    closeDetails.addEventListener("click", closeDetailsModal);
}

document.querySelectorAll("[data-close-details]").forEach(function (element) {
    element.addEventListener("click", closeDetailsModal);
});


/* 25. AGRANDISSEMENT DES PHOTOS */

function openImageViewer(images, index) {
    if (!imageViewer || !viewerImage || !Array.isArray(images) || !images.length) {
        return;
    }

    viewerImages = images.filter(isValidImageData);

    if (!viewerImages.length) return;

    viewerIndex = Math.max(
        0,
        Math.min(Number(index) || 0, viewerImages.length - 1)
    );

    updateImageViewer();

    imageViewer.hidden = false;
    document.body.style.overflow = "hidden";
}

function updateImageViewer() {
    if (!viewerImages.length || !viewerImage) return;

    viewerImage.src = viewerImages[viewerIndex];

    if (viewerCounter) {
        viewerCounter.textContent =
            (viewerIndex + 1) + " / " + viewerImages.length;
    }
}

function closeImageViewer() {
    if (imageViewer) {
        imageViewer.hidden = true;
    }

    document.body.style.overflow =
        detailsModal && !detailsModal.hidden
            ? "hidden"
            : "";
}

function previousImage() {
    if (!viewerImages.length) return;

    viewerIndex =
        (viewerIndex - 1 + viewerImages.length) % viewerImages.length;

    updateImageViewer();
}

function nextImage() {
    if (!viewerImages.length) return;

    viewerIndex = (viewerIndex + 1) % viewerImages.length;

    updateImageViewer();
}

if (closeViewer) {
    closeViewer.addEventListener("click", closeImageViewer);
}

if (prevViewer) {
    prevViewer.addEventListener("click", previousImage);
}

if (nextViewer) {
    nextViewer.addEventListener("click", nextImage);
}


/* 26. FENÊTRES LÉGALES */

const LEGAL_CONTENT = {
    terms: {
        fr: {
            title: "Conditions d'utilisation",
            paragraphs: [
                "Haïtistore / Market est une plateforme de petites annonces destinée à faciliter la présentation de produits et de services.",
                "Les vendeurs sont responsables de l'exactitude des informations, des photos et des prix publiés dans leurs annonces.",
                "Les utilisateurs doivent respecter les lois applicables et ne pas publier de contenu frauduleux, trompeur, illégal ou portant atteinte aux droits d'autrui.",
                "Les acheteurs doivent vérifier les produits et les informations auprès du vendeur avant toute transaction.",
                "Cette version de démonstration utilise le stockage local du navigateur. Les annonces ne sont pas encore partagées entre les appareils."
            ]
        },
        ht: {
            title: "Kondisyon itilizasyon",
            paragraphs: [
                "Haïtistore / Market se yon platfòm ti anons ki la pou fasilite prezantasyon pwodwi ak sèvis.",
                "Vandè yo responsab enfòmasyon, foto ak pri yo mete nan anons yo.",
                "Itilizatè yo dwe respekte lalwa epi yo pa dwe pibliye kontni ki twonpe moun oswa ki ilegal.",
                "Achtè yo dwe verifye pwodwi ak enfòmasyon yo avèk vandè a anvan tranzaksyon.",
                "Vèsyon demonstrasyon sa a itilize memwa navigatè a. Anons yo poko pataje ant aparèy yo."
            ]
        }
    },

    privacy: {
        fr: {
            title: "Confidentialité",
            paragraphs: [
                "Cette version de Haïtistore / Market enregistre les annonces et les favoris dans le stockage local du navigateur.",
                "Les informations enregistrées restent sur l'appareil et le navigateur utilisés. Elles ne sont pas automatiquement transmises aux autres visiteurs.",
                "Le numéro WhatsApp ajouté à une annonce peut être visible par les personnes qui consultent cette annonce sur cet appareil.",
                "Évitez de publier des informations personnelles que vous ne souhaitez pas rendre publiques."
            ]
        },
        ht: {
            title: "Konfidansyalite",
            paragraphs: [
                "Vèsyon Haïtistore / Market sa a konsève anons ak lis ou renmen yo nan memwa navigatè a.",
                "Enfòmasyon yo rete sou aparèy ak navigatè ou itilize a. Yo pa voye bay lòt vizitè otomatikman.",
                "Nimewo WhatsApp ou mete nan yon anons ka vizib pou moun k ap konsilte anons sa a sou aparèy sa a.",
                "Evite pibliye enfòmasyon pèsonèl ou pa vle lòt moun wè."
            ]
        }
    }
};

function openLegal(type) {
    const content = LEGAL_CONTENT[type];

    if (!content || !legalModal || !legalTitle || !legalBody) return;

    const languageContent = content[currentLanguage] || content.fr;

    legalTitle.textContent = languageContent.title;
    legalBody.innerHTML = "";

    languageContent.paragraphs.forEach(function (paragraph) {
        const p = document.createElement("p");

        p.textContent = paragraph;
        p.style.marginBottom = "13px";
        p.style.lineHeight = "1.7";

        legalBody.appendChild(p);
    });

    legalModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeLegalModal() {
    if (legalModal) {
        legalModal.hidden = true;
    }

    document.body.style.overflow = "";
}

document.querySelectorAll("[data-legal]").forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        openLegal(link.dataset.legal);
    });
});

if (closeLegal) {
    closeLegal.addEventListener("click", closeLegalModal);
}

document.querySelectorAll("[data-close-legal]").forEach(function (element) {
    element.addEventListener("click", closeLegalModal);
});


/* 27. RACCOURCIS CLAVIER */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (imageViewer && !imageViewer.hidden) {
            closeImageViewer();

        } else if (detailsModal && !detailsModal.hidden) {
            closeDetailsModal();

        } else if (legalModal && !legalModal.hidden) {
            closeLegalModal();
        }
    }

    if (imageViewer && !imageViewer.hidden) {
        if (event.key === "ArrowLeft") {
            previousImage();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }
    }
});


/* 28. ANNÉE AUTOMATIQUE */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* 29. INITIALISATION DU SITE */

function initializeSite() {
    ads = loadAds();
    favorites = loadFavorites();

    removeExpiredAds();

    favorites = favorites.filter(function (id) {
        return ads.some(ad => ad.id === id);
    });

    saveFavorites();

    initializeLanguage();

    setSelectedCities("");

    renderCityChoices();
    updateCityFilter();
    renderAds();
    renderFavorites();
}

initializeSite();


/* =========================================================
   FIN DU SCRIPT PRINCIPAL
   HAÏTISTORE / MARKET
   ========================================================= */
