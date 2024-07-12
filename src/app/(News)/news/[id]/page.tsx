"use client";

import { useNewsStore } from "@/Store/newsStore";
import CardSmallNews from "@/components/Card/CardSmallNews";
import Header from "@/components/Header";
import ListStockUp from "@/components/List/ListStockUp";
import TextButton from "@/components/btnUi/TextButton";
import React, { useEffect, useState } from "react";
import ArticleIcon from "@/features/news/components/ArticleIcon.svg";

type TPageProps = {
  params: { id: string };
};

function formatDateTime(dateTimeStr: string) {
  if (!dateTimeStr || dateTimeStr.length !== 14) {
    console.error("Invalid dateTimeStr format");
    return null;
  }

  const year = dateTimeStr.substring(0, 4);
  const month = dateTimeStr.substring(4, 6);
  const day = dateTimeStr.substring(6, 8);
  const hour = parseInt(dateTimeStr.substring(8, 10), 10);
  const minute = dateTimeStr.substring(10, 12);

  const period = hour >= 12 ? "오후" : "오전";
  const formattedHour = hour % 12 || 12;

  return `${year}년 ${month}월 ${day}일 ${period} ${formattedHour}:${minute}`;
}

export default function NewsDetail({ params }: TPageProps) {
  const { id } = params;
  const [loading, setLoading] = useState(false);

  const fetchNewsArticle = useNewsStore(state => state.fetchNewsArticle);
  const article = useNewsStore(state => state.newsArticle);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetchNewsArticle({ id });
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="h-full">
        <div className="w-[1200px] flex justify-between  mt-[121px]">
          <div className="w-[792px] flex flex-col bg-white p-8 font-pretendard rounded-2xl">
            <h1
              className="text-3xl font-bold"
              dangerouslySetInnerHTML={{ __html: article.tit }}
            ></h1>
            <div className="w-[728px] h-9 flex  items-start ">
              <div className="w-[728px] flex  mt-4 gap-2  text-zinc-600 text-sm font-medium  leading-tight">
                <div className="">{article.ohnm}</div>
                <div className="text-right">∙</div>
                <div className="">
                  {isNaN(Number(article.published))
                    ? article.published
                    : formatDateTime(article.published)}
                </div>
                <div className="text-right">∙</div>
                <div className="text-right">조회수 {article.view}회</div>
              </div>
              <div className="mt-3">
                <TextButton size="custom" width="176px" height="36px" icon="Translate">
                  번역하기
                </TextButton>
              </div>
            </div>
            <div className="w-[138px] h-6 flex justify-between my-8">
              <div className="w-6 h-6 pt-[5.2px] pb-[6.34px] pl-[4.82px] pr-[4.4px] bg-mainNavy-900 rounded-md flex items-center justify-center">
                <div className="relative">
                  <ArticleIcon />
                </div>
              </div>
              <div>아이낫우 AI 요약</div>
            </div>

            <div className=" flex flex-col">
              <div className="p-4 rounded-lg mb-4">
                바이오 연구의 첨단,인공 유전자로 인간 피부 재생 가능성 바이오 연구의 첨단,인공
                유전자로 인간 피부 재생 가능성바이오 연구의 첨단,인공 유전자로 인간 피부 재생
                가능성바이오 연구의 첨단,인공 유전자로 인간 피부 재생 가능성바이오 연구의 첨단,인공
                유전자로 인간 피부 재생 가능성바이오 연구의 첨단,인공 유전자로 인간 피부 재생
                가능성바이오 연구의 첨단,인공 유전자로 인간 피부 재생 가능성바이오 연구의 첨단,인공
                유전자로 인간 피부 재생 가능성바이오 연구의 첨단,인공 유전자로 인간 피부 재생 가능성
              </div>
              {article.image && (
                <img src={article.image} alt="image" width={728} height={370} className="my-8" />
              )}
              <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="w-[384px] h-[310px] bg-white rounded-2xl font-pretendard p-8">
              <h2 className="text-xl  ">현재 뉴스와 관련된 주식</h2>
              <div className=" flex flex-col ">
                <ListStockUp />
                <ListStockUp />
                <ListStockUp />
              </div>
            </div>
            <div className="w-[388px] h-[488px] p-8 bg-white rounded-2xl font-pretendard">
              <h2 className="font-bold text-xl">관련기사</h2>
              <div className=" flex flex-col gap-y-5 mt-[10px]">
                <CardSmallNews />
                <CardSmallNews />
                <CardSmallNews />
                <CardSmallNews />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
