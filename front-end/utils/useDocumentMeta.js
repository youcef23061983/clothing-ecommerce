import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Function to get document metadata based on the current path
const getDocumentProps = (path) => {
  const baseMetadata = {
    title: "Default Title",
    description: "Default description for the website.",
    ogTitle: "Default Title",
    ogDescription: "Default description for the website.",
    ogImage: "/images/default-og-image.jpg",
    ogUrl: window.location.href,
  };

  // Customize metadata for specific paths
  if (path === "/") {
    return {
      title: "Home Page",
      description: "Welcome to our homepage.",
      ogTitle: "Home Page",
      ogDescription: "Welcome to the homepage of our website.",
      ogImage: "/images/home-og-image.jpg",
      ogUrl: window.location.href,
    };
  } else if (path === "/best") {
    return {
      title: "Best Products",
      description:
        "Browse our best products.. Filter by price, rating, and more to find the perfect item.",
      ogUrl: window.location.href,
      ogTitle: "Best Products",
      ogDescription:
        "Browse our best products.. Filter by price, rating, and more to find the perfect item.",

      ogImage:
        "https://clothing-ecommerce-phi.vercel.app/images/men/banner/new.jpg",
    };
  } else if (path.includes(":productID")) {
    const productID = path.split("/")[1]; // Assuming productID is in the path like /:productID
    return {
      title: `Product ${productID}`,
      description: `Details for product ${productID}`,
      ogTitle: `Product ${productID}`,
      ogDescription: `Details for product ${productID}`,
      ogImage: `/images/product-${productID}-image.jpg`,
      ogUrl: window.location.href,
    };
  }

  return baseMetadata; // Return default metadata if no specific path matches
};

// Custom hook to update document metadata dynamically
function useDocumentMeta() {
  const location = useLocation();

  useEffect(() => {
    const documentProps = getDocumentProps(location.pathname); // Use location.pathname for path-based metadata

    if (documentProps) {
      const { title, description, ogTitle, ogDescription, ogImage, ogUrl } =
        documentProps;

      // Update document title
      document.title = title;

      // Update meta tags dynamically, or create them if they don't exist
      const setMetaTag = (name, content) => {
        let tag = document.querySelector(`meta[name='${name}']`);
        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute("name", name);
          document.head.appendChild(tag);
        }
        tag.setAttribute("content", content);
      };

      // Update meta tags for description, og:title, og:description, etc.
      setMetaTag("description", description);
      setMetaTag("og:title", ogTitle);
      setMetaTag("og:description", ogDescription);
      setMetaTag("og:image", ogImage);
      setMetaTag("og:url", ogUrl);
    }
  }, [location]); // Re-run the effect when location changes
}

export default useDocumentMeta;
