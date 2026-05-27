module.exports = {
    name: "Legacy Revival Center",
    email: "dan@legacyrevival.org",
    phoneForTel: "618-345-5408",
    phoneFormatted: "(618) 345-5408",
    address: {
        lineOne: "1240 McDonough Lake Road",
        lineTwo: "",
        city: "Collinsville",
        state: "IL",
        zip: "62234",
        country: "US",
        mapLink: "https://maps.google.com/?q=1240+McDonough+Lake+Road,+Collinsville,+IL+62234",
    },
    socials: {
        facebook: "https://www.facebook.com/LegacyRevivalCenter",
        instagram: "https://www.instagram.com/legacyrevivalcenter/",
        youtube: "https://www.youtube.com/@legacyrevivalcenter3190",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.legacyrevival.org",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
