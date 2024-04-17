import { useQuery, useQueryClient } from "@tanstack/react-query";

const UseDetailFetch = (url, id, key1, key2) => {
  const queryClient = useQueryClient();

  const productFun = async () => {
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) {
      throw Error("There is no product data");
    }
    return res.json();
  };
  const { data, error, isPending } = useQuery({
    queryKey: [key1],
    queryFn: () => productFun(id),
    initialData: () => {
      return queryClient
        .getQueryData([key2])
        ?.find((x) => x.id === parseInt(id));
    },
  });
  return { data, isPending, error };
};

export default UseDetailFetch;
