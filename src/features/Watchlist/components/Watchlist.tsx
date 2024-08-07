"use client";

import { useCallback, useEffect, useState } from "react";
import TextButton from "@/components/btnUi/TextButton";
import WatchListCard, { TStockInfo } from "./WatchListCard";
import { useAuthStore, useClose, useShow } from "@/Store/store";
import Header from "@/components/Header";
import WatchListAdd from "./WatchListAdd";
import { stockAction2 } from "@/lib/stockAction";
import { updateDoc, arrayRemove, collection, query, where, getDocs } from "firebase/firestore";
import fireStore from "@/firebase/firestore";
import { SkeletonCard } from "./SkeletonCard";

const STOCK_NAME_KO_TO_EN: { [key: string]: string } = {
  애플: "apple",
  테슬라: "tesla",
  아마존: "amazon",
  구글: "google",
  마이크로소프트: "microsoft",
  유니티: "unity",
};

export default function WatchList() {
  const { isShow, setIsShow } = useShow();
  const { isClose, setIsClose } = useClose();
  const [stockPriceInfoMap, setStockPriceInfoMap] = useState<Map<string, TStockInfo>>(new Map());
  const [watchList, setWatchList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const userId = user?.userId || user?.id;

  const fetchWatchList = async () => {
    if (!userId) return;

    try {
      const userRef = collection(fireStore, "users");
      const q = query(userRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocs = querySnapshot.docs[0];
        const userData = userDocs.data();

        setWatchList(userData.stock || []); // 'stock' 필드에서 데이터를 가져옵니다
      } else {
        console.log("사용자를 찾을 수 없습니다");
        setWatchList([]);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const handleAdd = () => {
    setIsShow(!isShow);
    setIsClose(!isClose);
  };
  //id로 사용
  const handleAddStock = useCallback(
    (stock: string) => {
      setWatchList(prevList => [...prevList, stock]);
    },
    [setWatchList],
  );

  const handleDelete = async (stockToDelete: string) => {
    if (!userId) return;

    try {
      const useRef = collection(fireStore, "users");
      const q = query(useRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          stock: arrayRemove(stockToDelete),
        });
      }

      setWatchList(prevList => prevList.filter(stock => stock !== stockToDelete));
      setStockPriceInfoMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(stockToDelete);
        return newMap;
      });
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchWatchList();
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    async function fetchStockPrices() {
      setIsLoading(true);
      for (const stockName of watchList) {
        if (!stockPriceInfoMap.has(stockName)) {
          try {
            const stockEn = STOCK_NAME_KO_TO_EN[stockName];
            const stockPriceInfo = await stockAction2(stockEn);
            setStockPriceInfoMap(prev => new Map(prev).set(stockName, stockPriceInfo));
          } catch (error) {
            console.log(error);
          }
        }
      }
      setIsLoading(false);
    }

    fetchStockPrices();
  }, [watchList]);

  return (
    <>
      <div className={`w-full relative`}>
        <Header />
        <div className="mt-20 flex justify-center items-center">
          <div className={`w-[1214px] h-[1188px] mt-96 flex flex-col`}>
            <div className="w-[1214px] mt-14 h-9 flex flex-row justify-between font-pretendard ">
              <h2 className="text-2xl text-mainNavy-900 font-bold ">{user?.name}님의 관심종목</h2>
              <TextButton size="custom" width={"189px"} height={"36px"} onClick={handleAdd}>
                관심종목 추가
              </TextButton>
            </div>
            <div className={"my-6 grid grid-cols-3 gap-5"}>
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => <SkeletonCard key={index} />)
              ) : watchList.length > 0 ? (
                watchList.map(stockName => (
                  <WatchListCard
                    key={stockName}
                    name={stockName}
                    onDelete={() => handleDelete(stockName)}
                    stockPriceInfo={stockPriceInfoMap.get(stockName) || null}
                  />
                ))
              ) : (
                <div>관심 종목이 없습니다. 종목을 추가해 주세요.</div>
              )}
            </div>
          </div>
        </div>
        {isClose ? "" : <WatchListAdd onAddStock={handleAddStock} />}
      </div>
    </>
  );
}
