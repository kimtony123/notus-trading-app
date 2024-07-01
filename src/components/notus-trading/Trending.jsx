import useAxios from "../hooks/useAxios"
import CoinTrending from "./CoinTrending";
import Skeleton from "./Skeleton";

const Trending = () => {
  const { response, loading } = useAxios('search/trending');

  if(loading) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl mb-2">Notus Crypto  Binary Options Trading</h1>
    </div>
  )
}

export default Trending