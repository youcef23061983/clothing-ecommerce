// import { useQuery } from "@tanstack/react-query";
// const UseFetch = (url, key1) => {
//   const productFun = async () => {
//     const res = await fetch(url);
//     if (!res.ok) {
//       throw Error("There is no product data");
//     }
//     return res.json();
//   };
//   const { data, error, isPending } = useQuery({
//     queryKey: [key1],
//     queryFn: () => productFun(),
//   });
//   return { data, error, isPending };
// };

// export default UseFetch;

// **********************second method filter input with a filter in the front:

// import { useQuery } from "@tanstack/react-query";

// const UseFetch = (url, key1, searchTerm) => {
//   const productFun = async ({ signal, searchTerm }) => {
//     // build the URL with the search term if present
//     let finalUrl = url;
//     if (searchTerm) {
//       finalUrl += `?search=${encodeURIComponent(searchTerm)}`;
//     }

//     const res = await fetch(finalUrl, { signal });
//     if (!res.ok) {
//       throw new Error("There is no product data");
//     }
//     return res.json();
//   };

//   const { data, error, isPending } = useQuery({
//     queryKey: [key1, { search: searchTerm }],
//     queryFn: ({ signal }) => productFun({ signal, searchTerm }),
//   });

//   return { data, error, isPending };
// };

// export default UseFetch;

// //////////third appraoch with backend filter
import { useQuery } from "@tanstack/react-query";

const UseFetch = (url, key1, searchParams) => {
  const productFun = async ({ signal }) => {
    const queryString = searchParams.toString();

    const finalUrl = queryString ? `${url}?${queryString}` : url;

    console.log("FINAL FETCH URL:", finalUrl);

    const res = await fetch(finalUrl, { signal });

    if (!res.ok) {
      throw new Error("There is no product data");
    }

    return res.json();
  };

  const { data, error, isPending } = useQuery({
    queryKey: [key1, searchParams],
    queryFn: productFun,
  });

  return { data, error, isPending };
};

export default UseFetch;
