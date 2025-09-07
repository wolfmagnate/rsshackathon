import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

async function fileToGenerativePart(file: File) {
  const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString("base64");
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file is not an image" }, { status: 400 });
    }

    const imagePart = await fileToGenerativePart(file);

    const prompt = `あなたは、画像解析と情報抽出を専門とするAIアシスタントです。特に、大学などの教育機関で用いられる試験問題の構造を深く理解しています。
# 目的
アップロードされた画像を分析し、以下の2つのタスクを順番に実行してください。

- 試験問題の判定: 画像が試験問題の写真であるかを判定します。
- 情報抽出: 試験問題である場合、その「メタデータ」と「試験問題本体」を抽出し、指定された形式で出力します。

# 実行ステップ

ステップ1: 試験問題の判定

まず、画像の内容が大学の試験問題であるかをtrueかfalseで判断してください。

例え学術的な内容でも、講義ノートや教科書のページ、一般的な文書であると判断した場合は、試験問題ではないと判定してください。


ステップ2: 情報の抽出（試験問題と判定した場合のみ）

試験問題であると判定した場合、以下の要領で情報を抽出してください。

- メタデータの抽出
問題文以外の、試験自体を特定するための情報をすべて抜き出してください。
抽出対象例:
実施年度（例: 2024年度）
学期（例: 前期, 秋学期）
科目名・講義名（例: 量子力学I）
担当教員名（例: 〇〇 太郎）
試験の種別（例: 期末試験, 中間レポート）
抽出した情報を組み合わせ、「2023年度 後期 〇〇大学「△△学」期末試験（□□教授担当）」のような、人間が読んで自然な一つの文章にまとめてください。
情報が見つからない場合は、その部分を省略して構いません。


- 試験問題本体の抽出:

問題番号、問題文、設問、選択肢、図表への言及など、解答に関わるすべてのテキストを抽出してください。
元の問題の階層構造（大問、小問など）を、Markdownの箇条書き（ネストを含む）を用いて正確に再現してください。
数式や化学式は、すべてTeX形式で記述してください。（例: $f(x) = \int_a^b x^2 dx$, $\alpha$, $H_2O$）
注意: 学生の氏名、学籍番号、得点、解答など、個人的な情報は絶対に含めないでください。
テスト問題には学生による書き込みがあるかもしれませんが、絶対に試験問題として必要な部分だけを抽出し、書き込みは無視して下さい。


# 出力形式

以下の形式を厳密に守って出力してください。なお、試験問題の出力内容についてはあくまで例であり、要求されるのはMarkdownの箇条書き表現です。（番号による1,2,3の箇条書き、順序のない箇条書き、およびインデントによる表現を許す。数式はTeX形式）

- 試験問題ではない場合:

is_exam: false
metadata: (空文字列)
content: (空文字列)

- 試験問題である場合:

is_exam: true
metadata: <ステップ2-1で生成した自然言語のメタデータをここに記述>
content:
- 1. <大問1の問題文>
  - (1) <小問1の問題文。数式は $ax^2+bx+c=0$ のように記述>
  - (2) <小問2の問題文>
    - i. <さらに細かい設問>
- 2. <大問2の問題文>
  - a. <選択肢a>
  - b. <選択肢b>


# 追加指示
画像が不鮮明で読み取れない文字や数式は、[読み取り不可]と記述してください。`;

    const contents = [imagePart, { text: prompt }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_exam: {
              type: Type.BOOLEAN,
            },
            metadata: {
              type: Type.STRING,
            },
            content: {
              type: Type.STRING,
            },
          },
        },
      },
    });

    const jsonResponse = JSON.parse(response.text || '{"is_exam": false, "metadata": "", "content": ""}');

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("API Error in /api/upload:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
