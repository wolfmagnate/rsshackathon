"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, GraduationCap, Calculator, Folder, ChevronRight, ChevronDown, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import Link from "next/link"

// Mock data for courses and search results
const courses = [
  { id: 1, name: "微分積分学I", category: "全学共通科目", instructor: "田中教授", examCount: 5 },
  { id: 2, name: "データ構造とアルゴリズム", category: "情報学科", instructor: "佐藤教授", examCount: 3 },
  { id: 3, name: "線形代数学", category: "全学共通科目", instructor: "山田教授", examCount: 0 },
  { id: 4, name: "プログラミング基礎", category: "情報学科", instructor: "鈴木教授", examCount: 7 },
  { id: 5, name: "統計学入門", category: "全学共通科目", instructor: "高橋教授", examCount: 2 },
  { id: 6, name: "データベース設計", category: "情報学科", instructor: "伊藤教授", examCount: 4 },
  { id: 7, name: "物理学基礎", category: "理学部", instructor: "渡辺教授", examCount: 6 },
  { id: 8, name: "化学実験", category: "理学部", instructor: "中村教授", examCount: 1 },
  { id: 9, name: "生物学概論", category: "理学部", instructor: "小林教授", examCount: 3 },
  { id: 10, name: "数値解析", category: "情報学科", instructor: "中村教授", examCount: 2 },
]

const categories = [
  {
    id: "general",
    name: "全学共通科目",
    icon: BookOpen,
    courses: ["微分積分学I", "線形代数学", "統計学入門"],
  },
  {
    id: "cs",
    name: "情報学科",
    icon: Calculator,
    courses: ["データ構造とアルゴリズム", "プログラミング基礎", "データベース設計", "数値解析"],
  },
  {
    id: "science",
    name: "理学部",
    icon: GraduationCap,
    courses: ["物理学基礎", "化学実験", "生物学概論"],
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<typeof courses>([])
  const [searchResults, setSearchResults] = useState<typeof courses>([])
  const [isSearching, setIsSearching] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Handle search input changes and show suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const results = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setSuggestions([])
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader className="bg-white border-gray-200">
        <h1 className="text-lg font-bold text-center text-balance text-gray-900">過去問解答解説検索</h1>
      </AppHeader>

      <div className="px-4 py-6 max-w-md mx-auto pb-24">
        {/* Search Section */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="検索する授業名を入力してください"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-3 text-base border-2 border-border focus:border-green-500 rounded-lg"
            />
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-40 shadow-lg">
              <CardContent className="p-0">
                {suggestions.map((course) => (
                  <Link
                    key={course.id}
                    href={`/classes/${course.id}`}
                    className="block w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-muted"
                  >
                    <div className="font-medium text-foreground">{course.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.category} • {course.instructor}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">検索結果 ({searchResults.length}件)</h2>
            <div className="space-y-2">
              {searchResults.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <Link
                      href={`/classes/${course.id}`}
                      className="block w-full text-left focus:outline-none"
                    >
                      <h3 className="font-medium text-foreground mb-1">{course.name}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {course.category} • {course.instructor}
                        </span>
                        <span className={`font-medium ${course.examCount > 0 ? "text-green-600" : "text-gray-400"}`}>
                          {course.examCount > 0 ? `過去問${course.examCount}件あり` : "過去問なし"}
                        </span>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Browse by Category Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">授業から探す</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="bg-card rounded-lg border overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-3 flex items-center justify-between hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="border-t border-border bg-muted/30">
                    {category.courses.map((courseName) => {
                      const course = courses.find(c => c.name === courseName);
                      return (
                        <Link
                          key={courseName}
                          href={course ? `/classes/${course.id}` : '#'}
                          className="block w-full p-3 pl-8 text-left flex items-center gap-2 hover:bg-accent/10 transition-colors"
                        >
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{courseName}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}
