import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import img from "/images/men/banner/bestSeller.jpg";
import { AppContext } from "../data managment/AppProvider";
import Rating from "./Rating";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Detail = () => {
  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;

  const { productID } = useParams();
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useContext(AppContext);
  const queryClient = useQueryClient();
  const location = useLocation();

  const productFun = async () => {
    const res = await fetch(`${url}/${productID}`);
    if (!res.ok) {
      throw Error("There is no product data");
    }
    return res.json();
  };
  const { data, error, isPending } = useQuery({
    queryKey: ["product", productID],
    queryFn: productFun,
    initialData: () => {
      return queryClient
        .getQueryData(["products"])
        ?.find((x) => x.id === parseInt(productID));
    },
  });

  useEffect(() => {
    if (data) {
      document.title = `${data.slug}`;
      setSelectedImage(data.images[0]);
    }
  }, [data]);
  const goBack = (search) => {
    if (search && search.includes("jacket")) {
      return "go back to jacket";
    } else if (search && search.includes("jeans")) {
      return "go back to jeans";
    } else if (search && search.includes("shirt")) {
      return "go back to shirt";
    } else if (search && search.includes("shoes")) {
      return "go back to shoes";
    } else if (search && search.includes("sneakers")) {
      return "go back to sneakers";
    } else if (search && search.includes("sweatshirt")) {
      return "go back to sweatshirt";
    } else if (search && search.includes("trousers")) {
      return "go back to trousesr";
    } else if (search && search.includes("tshirt")) {
      return "go back to tshirt";
    } else {
      return "go back to all products";
    }
  };

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;

  const {
    slug,
    price,
    newPrice,
    onSale,
    type,
    rating,
    preview,
    size,
    images,
    id,
  } = data;

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <h2 className="orderTitle" data-testid="detailId">
        Product Detail
      </h2>

      <div className="productContainer">
        <div className="imagesContainer">
          <div className="imagesDiv" key={id}>
            {images.map((image, index) => (
              <div className="imgSelect" key={index}>
                <img
                  src={`${image}`}
                  alt={`Image ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className="img"
                />
              </div>
            ))}
          </div>
          <div className="imgDiv" style={{ width: "30rem", margin: "0 auto" }}>
            <img src={selectedImage} alt="Selected" className="img" />
          </div>
        </div>
        <div className="productDetail">
          <p className="linkTitle">
            <span className="productSpan">product name:</span> {slug}
          </p>
          <p className="linkTitle">
            <span className="productSpan">product type:</span> {type}
          </p>
          <div className="sizeContainer">
            <span className="productSpan">size:</span>
            {size.map((x) => {
              return <button className="sizeBtn">{x}</button>;
            })}
          </div>
          <div className="rating">
            <Rating rating={rating} />
            <p>{preview} previews</p>
          </div>
          <div className="price">
            <div style={{ display: "flex" }}>
              <span className="productSpan">old price:</span>
              <h3 className={`${onSale ? "through" : ""}`}>{price} $</h3>
            </div>
            {onSale && <h3>new price: {newPrice} $</h3>}
          </div>
          <Link className="addCart" to="/cart" onClick={() => addToCart(id)}>
            add to cart
          </Link>
          <Link
            className="addCart"
            to={`..${location.state?.search || ""}`}
            relative="path"
          >
            &larr;
            <span>{goBack(location.state?.search)}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Detail;
