"use client";
import Stock from "@/components/Stock/Stock";
import Badge, { BadgeBlack } from "../../components/Badge/Badge";
import News from "./components/News";
import Report from "./components/Report";
import IconButton from "@/components/btnUi/IconButton";
import { useEffect, useState } from "react";
import Warning from "../../../public/icons/Warning.svg";
import ChatBot from "../chatbot/ChatBot";
import { useAuthStore, useLoginStore } from "@/Store/store";
import { stockAction2 } from "@/lib/stockAction";
import { TStockInfo } from "../Watchlist/components/WatchListCard";
import { useStockStore } from "@/Store/newsStore";
import Link from "next/link";
import { useFindStore } from "../search/components/findStore";

const datas = [
  { name: "애플", code: "AAPL", price: 0.0, change: 0.0, percent: 0.0, reutersCode: "apple" },
  { name: "애플", code: "AAPL", price: 0.0, change: 0.0, percent: 0.0, reutersCode: "microsoft" },
  { name: "애플", code: "AAPL", price: 0.0, change: 0.0, percent: 0.0, reutersCode: "amazon" },
];

export default function UserHome() {
  const [isShow, setIsShow] = useState(false);
  const { user, profile } = useAuthStore();
  const fetchStockList = useStockStore(state => state.fetchStockData);
  const stockData = useStockStore(state => state.stockData);
  const getSearchStockHistory = useFindStore(state => state.getSearchStockHistory);
  const stockHistory = useFindStore(state => state.stockHistory);

  useEffect(() => {
    async function fetchData() {
      try {
        getSearchStockHistory(user?.userId ?? user?.id ?? "");
        fetchStockList(); // 주식 데이터 가져오기
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const data = stockData.filter(stock => stockHistory.some(history => history.slug === stock.logo));

  return (
    <>
      <div className="flex justify-center items-start w-full mt-[139px]">
        <div className="flex flex-col gap-12 w-full max-w-7xl">
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center">
              <div className="text-mainNavy-900 text-3xl font-bold leading-9">
                {user?.nickname}님의 AI 리포트
              </div>
              <div className="ml-2">
                <Badge background="bg-mainNavy-900" color="white" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              {datas.slice(0, 3).map((data, index) => (
                <div key={index} className="">
                  <Report data={data} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col justify-start">
                <div className="text-mainNavy-900 text-3xl font-bold leading-9">최근 조회</div>
                <div className="px-8 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 bg-white rounded-2xl flex flex-col justify-start items-start mt-4">
                  <div className="w-full min-h-[300px] flex flex-col justify-center items-center gap-4">
                    {data.length === 0 ? (
                      <div className="w-full h-full flex flex-col justify-center items-center text-center flex-grow">
                        <Warning />
                        <div className="text-mainNavy-900 text-body2 font-semibold mt-4">
                          최근 조회한 종목이 없습니다.
                        </div>
                      </div>
                    ) : (
                      data.map((data, index) => (
                        <div key={index} className="flex justify-between items-center rounded-lg">
                          <Link href={`/report/${data.logo}`}>
                            <Stock
                              data={data}
                              logo={data.logo}
                              gap={`${
                                data.stockName.length < 3 && data.symbolCode.length < 5
                                  ? "gap-[291px]"
                                  : data.stockName.length < 4
                                  ? "gap-[274px]"
                                  : "gap-[210px]"
                              }`}
                            />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start">
                <div className="text-mainNavy-900 text-3xl font-bold leading-9">관심 종목</div>
                <div className="px-8 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 bg-white rounded-2xl flex flex-col justify-start items-start mt-4">
                  <div className="w-full min-h-[300px] flex flex-col justify-center items-center gap-4">
                    {stockData
                      .filter(item => user?.stock.includes(item.stockName))
                      .map((data, index) => (
                        <div key={index} className="flex justify-between items-center rounded-lg">
                          <Link href={`/report/${data.logo}`}>
                            <Stock
                              data={data}
                              logo={data.logo}
                              gap={`${
                                data.stockName.length < 3 && data.symbolCode.length < 5
                                  ? "gap-[291px]"
                                  : data.stockName.length < 4
                                  ? "gap-[274px]"
                                  : "gap-[210px]"
                              }`}
                            />
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="text-mainNavy-900 text-3xl font-bold leading-9">
                {user?.nickname}님을 위한 주식뉴스
              </div>
              <div className="mt-4 w-full">
                <News />
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 py-2 px-4">
          {/* {isShow ? (
            <ChatBot onClick={() => setIsShow(false)} />
          ) : (
            <IconButton size="chatBot" icon="ChatBot" onClick={() => setIsShow(true)} />
          )} */}
        </div>
      </div>
    </>
  );
}
