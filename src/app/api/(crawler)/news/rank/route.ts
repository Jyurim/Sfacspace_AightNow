import { NextResponse } from "next/server";
import puppeteer, { Page } from "puppeteer";
import { addNewsToFirestore, handleTranslate } from "../firebase/fireStore";

export const dynamic = "force-dynamic";

const fetchRankNews = async (page: Page) => {
  const url = `https://m.stock.naver.com/front-api/news/category?category=ranknews&pageSize=20&page=1`;
  const headers = {
    "Content-Type": "application/json",
  };

  const articles = [];
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    const list = data.result
      .filter((item: any) => !item.isVideo)
      .map((item: any) => {
        return {
          aid: item.articleId,
          tit: item.title,
          subcontent: item.body,
          oid: item.officeId,
          ohnm: item.officeName,
          dt: item.datetime,
          thumbUrl: item.imageOriginLink,
          hasImage: item.hasImage,
        };
      });

    // 뉴스 기사
    for (const news of list) {
      await page.goto(`https://n.news.naver.com/mnews/article/${news.oid}/${news.aid}`, {
        waitUntil: "networkidle2",
      });

      const article = await page.$eval("#newsct", element => {
        const selectElement = (selector: string) => element.querySelector(selector) as HTMLElement;
        const titleElement = selectElement(".media_end_head_title");
        const timeElement = selectElement(".media_end_head_info_datestamp_time._ARTICLE_DATE_TIME");
        const contentElement = selectElement("#dic_area");
        const imageElement = element.querySelector("#img1") as HTMLImageElement;

        if (contentElement) {
          const summaryElement = selectElement(".media_end_summary");
          const end_photo_org = contentElement.querySelector(".end_photo_org");
          const end_photo = contentElement.querySelector("#img_a2");
          const remove_article = element.querySelector("#dic_area > div:nth-child(38)");

          if (summaryElement) {
            summaryElement.remove();
          }
          if (end_photo_org) {
            end_photo_org.remove();
          }
          if (end_photo) {
            end_photo.remove();
          }
          if (remove_article) {
            remove_article.remove();
          }
        }

        if (!titleElement || !timeElement || !contentElement) {
          throw new Error("Required elements not found");
        }

        return {
          published: timeElement.innerText,
          content: contentElement.outerHTML,
          image: imageElement?.src,
          stockName: "rank",
          relatedItems: null,
        };
      });

      const content = {
        ...news,
        ...article,
        translations: { "en-US": "", ZH: "", JA: "", FR: "" },
      };

      // for (const lang of languages) {
      //   try {
      //     const translatedContent = await handleTranslate(content.content, lang);
      //     content.translations[lang] = translatedContent;
      //   } catch (error) {
      //     console.error(`Failed to translate content to ${lang}`, error);
      //   }
      // }

      articles.push(content);
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching rank news:`, error);
    throw new Error("Failed to fetch rank news data");
  }
};

export async function GET(request: Request) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    const rankNews = await fetchRankNews(page);
    await addNewsToFirestore("rank", rankNews); // Firestore에 뉴스 추가

    return NextResponse.json(rankNews);
  } catch (error) {
    console.error(`Error in GET request:`, error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  } finally {
    await browser.close();
  }
}
