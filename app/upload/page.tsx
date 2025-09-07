"use client"

import { useState, useRef } from "react"
import { useAppContext, AnalysisResult } from "@/context/AppContext"
import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Upload, Image as ImageIcon, Camera, Loader2, XCircle, FileText, Book, RefreshCw } from "lucide-react"

export default function Page() {
  const { addAnalysisResult } = useAppContext()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAnalysisResult(null) // Reset previous results
      setError(null) // Reset previous errors
      const previewUrl = URL.createObjectURL(selectedFile)
      setImagePreview(previewUrl)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!file) {
      setError("アップロードするファイルが選択されていません。")
      return
    }

    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result: AnalysisResult | { error: string } = await response.json()

      if (response.ok) {
        const analysisData = result as AnalysisResult
        setAnalysisResult(analysisData)
        if (analysisData.is_exam) {
          addAnalysisResult(analysisData) // Save to global context
        }
      } else {
        setError((result as { error: string }).error || "不明なエラーが発生しました。")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("アップロード中にクライアント側でエラーが発生しました。")
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader>
        <div className="flex items-center justify-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">試験問題スキャナー</h1>
        </div>
      </AppHeader>
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
        <Card>
          <CardContent className="p-6">
            {imagePreview ? (
              <div className="mb-4 rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            ) : (
              <div className="h-48 w-full bg-muted rounded-md flex flex-col items-center justify-center text-muted-foreground mb-4">
                <ImageIcon className="h-12 w-12" />
                <p>画像を選択してください</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleFileSelect}
                disabled={isUploading}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                ギャラリー
              </Button>
              <Button
                variant="outline"
                onClick={handleCameraCapture}
                disabled={isUploading}
              >
                <Camera className="mr-2 h-4 w-4" />
                カメラ
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "解析中..." : "解析を実行"}
            </Button>
            {(file || analysisResult || error) && (
              <Button variant="ghost" className="w-full" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                クリア
              </Button>
            )}
          </CardFooter>
        </Card>

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                解析エラー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                解析結果
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.is_exam ? (
                <div>
                  <h3 className="font-bold text-lg mb-2">メタデータ</h3>
                  <p className="text-muted-foreground mb-4">
                    {analysisResult.metadata}
                  </p>
                  <h3 className="font-bold text-lg mb-2">問題内容</h3>
                  <pre className="bg-muted p-4 rounded-md whitespace-pre-wrap font-sans text-sm">
                    {analysisResult.content}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  この画像は試験問題ではないと判断されました。
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <AppFooter />
    </div>
  )
}