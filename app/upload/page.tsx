"use client"

import { useState, useRef } from "react"
import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Camera } from "lucide-react"

export default function Page() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
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
      // This should not happen if the button is disabled correctly
      alert("アップロードするファイルが選択されていません。")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("アップロード成功！")
        // Reset state after successful upload
        setFile(null)
        setImagePreview(null)
      } else {
        const errorData = await response.json()
        alert(`アップロード失敗: ${errorData.error || "不明なエラー"}`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("アップロード中にエラーが発生しました。")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader>
        <div className="flex items-center justify-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">アップロード</h1>
        </div>
      </AppHeader>
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
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
                <p>画像が選択されていません</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleFileSelect}>
                <ImageIcon className="mr-2 h-4 w-4" />
                ギャラリー
              </Button>
              <Button variant="outline" onClick={handleCameraCapture}>
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
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!file}
            >
              <Upload className="mr-2 h-4 w-4" />
              アップロード
            </Button>
          </CardFooter>
        </Card>
      </main>
      <AppFooter />
    </div>
  )
}
