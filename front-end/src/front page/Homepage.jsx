import React, { useState, useEffect, Suspense, useRef, lazy } from "react";
import img from "/images/men/banner/homepage3.jpg";
import UseFetch from "../data managment/UseFetch";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
};
const HeavyComponent = lazy(() => import("./Products"));

const Homepage = () => {
  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const key1 = "products";
  const { data, isPending, error } = UseFetch(url, key1);

  const initialUserState = {
    type: "all",
    price: 0,
    rating: 1,
    sortOption: "",
    onSale: false,
    bestSeller: false,
    newArrival: false,
  };

  const [user, setUser] = useState(initialUserState);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [name]: newValue };
      setSearchParams((prevParams) => {
        if (
          newValue === "" ||
          newValue === false ||
          newValue === "0" ||
          newValue === "all" ||
          newValue === "17.99" ||
          newValue === "1"
        ) {
          prevParams.delete(name);
        } else {
          prevParams.set(name, newValue);
        }

        return prevParams;
      });
      return updatedUser;
    });
  };

  useEffect(() => {
    const updatedUserState = {
      ...initialUserState,
      type: searchParams.get("type") || "all",
      price: searchParams.get("price") || 0,
      rating: searchParams.get("rating") || 1,
      sortOption: searchParams.get("sortOption") || "",
      onSale: searchParams.get("onSale") === "true",
      bestSeller: searchParams.get("bestSeller") === "true",
      newArrival: searchParams.get("newArrival") === "true",
    };
    setUser(updatedUserState);
  }, [searchParams]);

  let types = ["all", ...new Set(data?.map((product) => product.type))];
  types = types.map((type, index) => {
    return (
      <option value={type} key={index}>
        {type}
      </option>
    );
  });

  let ratings = [2, 3, 4];
  ratings = ratings.map((rating, index) => {
    return (
      <option value={rating} key={index}>
        {rating} <h3>stars and up</h3>
      </option>
    );
  });

  let minPrice = data ? Math.min(...data.map((product) => product.price)) : 0;
  let maxPrice = data ? Math.max(...data.map((product) => product.price)) : 0;

  const productsFilter = data
    ?.filter((product) => {
      const productsType = user.type === "all" || product.type === user.type;
      const productsPrice = user.price === 0 || product.price >= user.price;
      const productsRating = user.rating === 1 || product.rating >= user.rating;
      const productsArrivals = !user.newArrival || product.newArrival;
      const productsSale = !user.onSale || product.onSale;
      const productsBest = !user.bestSeller || product.bestSeller;
      return (
        productsType &&
        productsPrice &&
        productsRating &&
        productsArrivals &&
        productsSale &&
        productsBest
      );
    })
    ?.sort((a, b) => {
      if (user.sortOption === "priceLowToHigh") {
        return (a.newPrice || a.price) - (b.newPrice || b.price);
      } else if (user.sortOption === "priceHighToLow") {
        return (b.newPrice || b.price) - (a.newPrice || a.price);
      } else {
        return "";
      }
    });

  const filterVariant = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { delay: 0.3, ease: "easeInOut" },
    }),
  };

  useLenis((lenis) => {
    lenis.on("scroll", ({ scroll }) => {
      console.log("Scroll position:", scroll);
    });
  });
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", isMediumScreen ? "0.4 1" : "0.2 1"],
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;
  const ogImage = data && data.images && data.images[0] ? data.images[0] : img;
  const pageTitle = `Shop Products - ${productsFilter?.length || 0} items`;

  return (
    <ReactLenis root={true}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Browse our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more to find the perfect item.`}
        />
        <meta
          property="og:title"
          content={`Shop Products - ${productsFilter?.length || 0} items`}
        />
        <meta
          property="og:description"
          content={`Browse our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more.`}
        />
        {/* <meta property="og:image" content={ogImage} /> */}
        <meta property="og:image" content={img} />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Shop Products - ${productsFilter?.length || 0} items`}
        />
        <meta
          name="twitter:description"
          content={`Browse our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more.`}
        />
        {/* <meta name="twitter:image" content={ogImage} /> */}
        <meta name="twitter:image" content={img} />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="shop, products, discounts, buy, offers, shopping"
        />
        <meta name="author" content="Desire" />
      </Helmet>
      <div className="headerimages">
        <img src={img} alt="Product" loading="lazy" className="detailImg" />
      </div>
      <motion.form
        className="searchContainer"
        ref={ref}
        style={{
          opacity: scrollOpacity,
          x: scrollX,
          willChange: "transform, opacity",
        }}
      >
        <div className="searchElement">
          <label htmlFor="type">Products Type</label>
          <select
            name="type"
            id="type"
            value={user.type}
            onChange={handleChange}
            className="formSelect"
          >
            {types}
          </select>
        </div>
        <div className="searchElement">
          <label htmlFor="price">price:{user.price} $</label>
          <input
            type="range"
            name="price"
            id="price"
            value={user.price}
            min={minPrice}
            max={maxPrice}
            onChange={handleChange}
            className="formSelect"
          />
        </div>
        <div className="searchElement">
          <label htmlFor="rating">Products Rating</label>
          <select
            name="rating"
            id="rating"
            value={user.rating}
            onChange={handleChange}
            className="formSelect"
          >
            {ratings}
          </select>
        </div>
        <div className="searchElement">
          <div className="elementCheck">
            <input
              type="checkbox"
              name="onSale"
              id="onSale"
              checked={user.onSale}
              onChange={handleChange}
            />
            <label htmlFor="onSale">onSale:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="bestSeller"
              id="bestSeller"
              checked={user.bestSeller}
              onChange={handleChange}
            />
            <label htmlFor="bestSeller">bestSeller:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="newArrival"
              id="newArrival"
              checked={user.newArrival}
              onChange={handleChange}
            />
            <label htmlFor="newArrival">newArrival:</label>
          </div>
        </div>
        <div className="searchElement">
          <label htmlFor="sortPrice">Sort By:</label>
          <select
            name="sortOption"
            id="sortPrice"
            value={user.sortOption}
            onChange={handleChange}
            className="formSelect"
          >
            <option value="">-- Select --</option>
            <option value="priceLowToHigh">Price Low to High</option>
            <option value="priceHighToLow">Price High to Low</option>
          </select>
        </div>
      </motion.form>
      <Suspense fallback={<h2>...is loading</h2>}>
        <HeavyComponent
          productsFilter={productsFilter}
          searchParams={searchParams}
        />
      </Suspense>
    </ReactLenis>
  );
};

export default Homepage;
