import { useQuery, useQueryClient } from "@tanstack/react-query";

const UseFetch = (url, id, key1, key2) => {
  const queryClient = useQueryClient();

  const productFun = async () => {
    const detailUrl = id ? `${url}/${id}` : url;
    const res = await fetch(detailUrl);
    if (!res.ok) {
      throw Error("There is no product data");
    }
    return res.json();
  };
  const { data, error, isPending } = useQuery({
    queryKey: id ? [key1, id] : [key1],
    queryFn: () => productFun(id),
    initialData: () => {
      return queryClient
        .getQueryData([key2])
        ?.find((x) => x.id === parseInt(id));
    },
  });
  return { data, error, isPending };
};

export default UseFetch;
