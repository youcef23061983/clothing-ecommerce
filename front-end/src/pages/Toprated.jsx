import { lazy, Suspense, useEffect, useState } from "react";
import img from "/images/men/banner/top.jpg";
import UseFetch from "../data managment/UseFetch";
import { useSearchParams } from "react-router-dom";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const HeavyComponent = lazy(() => import("../front page/Products"));
const Toprated = () => {
  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const key1 = "products";
  const { data, isPending, error } = UseFetch(url, key1);

  const initialUserState = {
    type: "all",
    price: 0,
    rating: 1,
    sortOption: "",
    on_sale: false,
    best_seller: false,
    new_arrival: false,
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
      on_sale: searchParams.get("on_sale") === "true",
      best_seller: searchParams.get("best_seller") === "true",
      new_arrival: searchParams.get("new_arrival") === "true",
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
        {rating} stars and up
      </option>
    );
  });
  let minPrice = data ? Math.min(...data.map((product) => product.price)) : 0;
  let maxPrice = data ? Math.max(...data.map((product) => product.price)) : 0;

  const productsFilter = data
    ?.filter((product) => {
      // const productsOrating = product.rating === true;

      const productsType = user.type === "all" || product.type === user.type;
      const productsPrice = user.price === 0 || product.price >= user.price;
      const productsRating = user.rating === 1 || product.rating >= user.rating;
      const productsArrivals = !user.new_arrival || product.new_arrival;
      const productsSale = !user.on_sale || product.on_sale;
      const productsBest = !user.best_seller || product.best_seller;
      return (
        // productsOrating &&
        productsType &&
        productsPrice &&
        productsRating &&
        productsArrivals &&
        productsSale &&
        productsBest
      );
    })
    ?.sort((a, b) => {
      return (b.newPrice || b.price) - (a.newPrice || a.price);
    });
  const Filter = {
    hidden: { opacity: 0 },
    visible: {
      x: [0, 10, -10, 0],
      opacity: 1,
      transition: { delay: 0.7, duration: 1 },
    },
  };
  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;
  const pageTitle = `Top Rated Products - ${productsFilter?.length || 0} items`;
  const pageDescription = `Browse our top-rated products${
    user.type !== "all" ? ` in ${user.type}` : ""
  }. Filter by price, rating, and more to find the perfect item.`;
  const ogImage = data && data.images && data.images[0] ? data.images[0] : img;

  return (
    <ReactLenis root={true}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:url"
          content={`https://clothing-ecommerce-phi.vercel.app/sale`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="rating, products, discounts, buy, offers, shopping"
        />
        <meta name="author" content="Desire" />
      </Helmet>

      <div className="headerimages">
        <img src={img} alt="top" loading="lazy" className="detailImg" />
      </div>
      <div>
        <h2 className="orderTitle">Your Top Rated</h2>
        <motion.form
          className="searchContainer"
          variants={Filter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
                name="on_sale"
                id="on_sale"
                checked={user.on_sale}
                onChange={handleChange}
              />
              <label htmlFor="on_sale">onSale:</label>
            </div>
            <div className="elementCheck">
              <input
                type="checkbox"
                name="best_seller"
                id="best_seller"
                checked={user.best_seller}
                onChange={handleChange}
              />
              <label htmlFor="best_seller">bestSeller:</label>
            </div>
            <div className="elementCheck">
              <input
                type="checkbox"
                name="new_arrival"
                id="new_arrival"
                checked={user.new_arrival}
                onChange={handleChange}
              />
              <label htmlFor="new_arrival">newArrival:</label>
            </div>
          </div>
        </motion.form>
        <Suspense fallback={<h2>...is loading</h2>}>
          <HeavyComponent
            productsFilter={productsFilter}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </ReactLenis>
  );
};

export default Toprated;
