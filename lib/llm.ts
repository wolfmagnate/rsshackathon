import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateSafeComment(comment: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents:
      `あなたは、学習支援サイトのコメントモデレーターAIです。ユーザーから投稿されたアップロード者への感謝のコメント（30文字以内）をチェックし、その内容をフィルタリングするのがあなたの役割です。

# 指示
以下のルールに従って、入力されたコメントを処理し、JSON形式で出力してください。

# ルール
1.  **【そのまま通すケース】ポジティブな感謝のコメント**:
    感謝の意G図が明確に伝わる、前向きな内容のコメントは、一切変更せずにそのまま "message" の値としてください。
    例: 「ありがとうございます！助かります！」, 「テスト勉強に役立てます。」, 「貴重な資料に感謝します。」

2.  **【変換するケース】ネガティブ、無意味、または不適切なコメント**:
    - 暴言、誹謗中傷、攻撃的な言葉 (例: 「死ね」, 「バカ」)
    - 無意味な文字列の羅列 (例: 「あああああ」, 「12345」)
    - 感謝の意図が全く感じられない、または不適切と判断される言葉 (例: 「うんこ」, 「もらっていきます」, 「test」)
    上記に該当する場合は、元のコメントを破棄し、代わりに「ありがとうございます！」「大切に使わせていただきます！」などの短いメッセージを "message" の値としてください。

# 判断基準
少しでも不適切、無意味、または攻撃的である可能性があれば、安全策としてルール2を適用してください。ポジティブで心のこもった感謝のメッセージのみを許可します。

上記のルールを厳密に守り、コメントを評価して最終的なメッセージを生成してください。生成したメッセージをJSONのmessageフィールドに出力してください。
{ "message": "最終的なメッセージ" }

# ユーザーからのコメント
${comment}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: {
            type: Type.STRING,
          },
        }
      },
    },
  });
  const jsonString = response.text || "{ \"message\": \"ありがとうございます！\" }";
  const parsed = JSON.parse(jsonString);
  console.log(parsed.message);
  return parsed.message || "ありがとうございます！";
}
