import React, { Suspense, useEffect, useState } from "react";
import img from "/images/men/banner/new.jpg";
import UseFetch from "../data managment/UseFetch";
import { useSearchParams } from "react-router-dom";
import Products from "../front page/Products";
import ReactLenis from "@studio-freight/react-lenis";
const NewArrival = () => {
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
  console.log(searchParams);
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
    document.title = "NewArrival";

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
      const productsNew = product.newArrival === true;
      const productsType = user.type === "all" || product.type === user.type;
      const productsPrice = user.price === 0 || product.price >= user.price;
      const productsRating = user.rating === 1 || product.rating >= user.rating;
      const productsArrivals = !user.newArrival || product.newArrival;
      const productsSale = !user.onSale || product.onSale;
      const productsBest = !user.bestSeller || product.bestSeller;
      return (
        productsNew &&
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

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;
  const ogImage = data && data.images && data.images[0] ? data.images[0] : img;
  const pageTitle = `NewArrivals Products - ${
    productsFilter?.length || 0
  } items`;
  return (
    <ReactLenis root={true}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Browse our new arrival products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more to find the perfect item.`}
        />
        <meta
          property="og:title"
          content={`NewArrivals Products - ${
            productsFilter?.length || 0
          } items`}
        />
        <meta
          property="og:description"
          content={`Browse our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more.`}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Shop Products - ${productsFilter?.length || 0} items`}
        />
        <meta
          name="twitter:description"
          content={`Browse our new arrival products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and more.`}
        />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div>
        <h2 className="orderTitle">Your New Arrivals</h2>
        <form className="searchContainer">
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
        </form>
        <Suspense fallback={<h2>...is loading</h2>}>
          <Products
            productsFilter={productsFilter}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </ReactLenis>
  );
};

export default NewArrival;
