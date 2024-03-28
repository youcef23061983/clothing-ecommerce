import React from "react";
import img from "../images/men/banner/top.jpg";
import Product from "./Product";
import { useQuery } from "@tanstack/react-query";

const Toprated = () => {
  const productsFun = async () => {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) {
      throw Error("there is no products data");
    }
    return res.json();
  };
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: productsFun,
  });
  const productsFilter = data?.sort((a, b) => {
    return b.rating - a.rating;
  });
  console.log(productsFilter);
  console.log(data);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div>
        <h2 className="orderTitle">Your Top Rated</h2>
        <div className="productsDiv">
          {productsFilter?.map((product) => {
            return <Product key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Toprated;
