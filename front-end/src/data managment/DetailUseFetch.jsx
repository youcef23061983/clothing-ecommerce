import { useQuery, useQueryClient } from "@tanstack/react-query";

const DetailUseFetch = (url, key, productID) => {
  const queryClient = useQueryClient();

  const productFun = async () => {
    const res = await fetch(`${url}/${productID}`);
    if (!res.ok) {
      throw Error("There is no detail product data");
    }
    return res.json();
  };
  const { data, error, isPending } = useQuery({
    queryKey: [key, productID],
    queryFn: productFun,
    initialData: () => {
      return queryClient
        .getQueryData([key])
        ?.find((x) => x.id === parseInt(productID));
    },
  });
  return { data, error, isPending };
};

export default DetailUseFetch;
