"use client";
import LanguageButton from "@/components/btnUi/LanguageButton";
import { updateLanguage } from "../../utills/updateLanguage";
import { useAuthStore } from "@/Store/store";
import { useState } from "react";

export default function MainLanguage() {
  const focusBtn = useAuthStore.getState().user?.language;
  const [focus, setFocus] = useState(focusBtn || "KO");

  const handleLanguageChange = async (language: string) => {
    try {
      await updateLanguage(language);
      setFocus(language);
    } catch (error) {
      console.error("언어 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <main className="w-full h-auto rounded-2xl p-[32px] min-h-[500px] bg-white ">
      <div className="w-full h-auto flex justify-between items-center mb-[24px]">
        <div className="w-auto h-auto">
          <h2 className=" text-body2  text-mainNavy-900 font-bold mb-3">언어 설정</h2>
          <span className="text-body4 font-light">
            이 설정에서 번역할 언어 선택하시면 뉴스에서 번역된 기사를 확인하실 수 있습니다.
          </span>
        </div>
      </div>
      <div className="w-full h-auto flex gap-[20px] flex-wrap">
        <LanguageButton
          style={"KO"}
          onClick={() => handleLanguageChange("KO")}
          focusBtn={focus === "KO"}
        />
        <LanguageButton
          style={"en-US"}
          onClick={() => handleLanguageChange("en-US")}
          focusBtn={focus === "en-US"}
        />
        <LanguageButton
          style={"ZH"}
          onClick={() => handleLanguageChange("ZH")}
          focusBtn={focus === "ZH"}
        />
        <LanguageButton
          style={"JA"}
          onClick={() => handleLanguageChange("JA")}
          focusBtn={focus === "JA"}
        />
        <LanguageButton
          style={"FR"}
          onClick={() => handleLanguageChange("FR")}
          focusBtn={focus === "FR"}
        />
      </div>
    </main>
  );
}
