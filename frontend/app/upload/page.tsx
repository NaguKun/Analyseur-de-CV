"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, LinkIcon, FileText, CheckCircle, AlertCircle, Terminal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [driveUrl, setDriveUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(selectedFiles)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    setFiles(droppedFiles)
  }

  const processFiles = async () => {
    setUploading(true)
    setProgress(0)

    for (let i = 0; i < files.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(((i + 1) / files.length) * 100)

      setResults((prev) => [
        ...prev,
        {
          filename: files[i].name,
          status: Math.random() > 0.1 ? "success" : "error",
          candidate: {
            name: `Candidate_${i + 1}`,
            email: `candidate${i + 1}@email.com`,
            skills: ["JavaScript", "React", "Node.js"],
            experience: `${Math.floor(Math.random() * 10) + 1} years`,
          },
        },
      ])
    }

    setUploading(false)
  }

  const processDriveUrl = async () => {
    setUploading(true)
    setProgress(0)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProgress(100)

    setResults([
      {
        filename: "Google_Drive_Import",
        status: "success",
        candidate: {
          name: "Drive_Candidate",
          email: "drive@email.com",
          skills: ["Python", "Machine Learning", "FastAPI"],
          experience: "5 years",
        },
      },
    ])

    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-primary pb-6">
          <Link href="/" className="text-primary hover:text-primary/90 mb-4 inline-block font-mono">
            {"<"} BACK_TO_DASHBOARD
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground terminal-cursor">Upload CVs</h1>
          </div>
          <p className="text-primary text-lg font-mono">
            {">"} Process CV files and extract candidate information using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Interface */}
          <div>
            <Tabs defaultValue="files" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card border border-primary">
                <TabsTrigger
                  value="files"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  FILE_UPLOAD
                </TabsTrigger>
                <TabsTrigger
                  value="drive"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  GOOGLE_DRIVE
                </TabsTrigger>
              </TabsList>

              <TabsContent value="files">
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Upload className="h-5 w-5 text-primary" />
                      Upload PDF Files
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono">
                      {">"} Select or drag and drop CV files to process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border-2 border-dashed border-primary rounded-lg p-8 text-center hover:border-primary/90 transition-colors bg-muted"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2 text-foreground font-mono">
                        DROP_FILES_HERE || CLICK_TO_BROWSE
                      </p>
                      <p className="text-primary mb-4 font-mono">Supports PDF files up to 10MB each</p>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button
                          variant="outline"
                          className="cursor-pointer border-primary text-primary hover:bg-primary/90 hover:text-black font-mono"
                        >
                          BROWSE_FILES
                        </Button>
                      </Label>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 text-primary font-mono">{">"} SELECTED_FILES:</h4>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-muted rounded border border-primary"
                            >
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm text-foreground font-mono">{file.name}</span>
                              <span className="text-xs text-primary ml-auto font-mono">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={processFiles}
                          disabled={uploading}
                          className="w-full mt-4 bg-primary hover:bg-primary/90 text-black font-bold font-mono"
                        >
                          {uploading ? "PROCESSING..." : "PROCESS_CVS"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drive">
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      Google Drive Import
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono">
                      {">"} Import CVs from a public Google Drive folder
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="drive-url" className="text-primary font-mono">
                          GOOGLE_DRIVE_FOLDER_URL:
                        </Label>
                        <Input
                          id="drive-url"
                          placeholder="https://drive.google.com/drive/folders/..."
                          value={driveUrl}
                          onChange={(e) => setDriveUrl(e.target.value)}
                          className="border-primary bg-muted text-foreground focus:border-primary/90 font-mono"
                        />
                      </div>
                      <Alert className="border-yellow-400 bg-muted">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-400 font-mono">
                          WARNING: Make sure the Google Drive folder is publicly accessible
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={processDriveUrl}
                        disabled={!driveUrl || uploading}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold font-mono"
                      >
                        {uploading ? "PROCESSING..." : "IMPORT_FROM_DRIVE"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Progress */}
            {uploading && (
              <Card className="mt-6 bg-card border-primary">
                <CardHeader>
                  <CardTitle className="text-foreground font-mono">PROCESSING_PROGRESS</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-primary mt-2 font-mono">{progress.toFixed(0)}% COMPLETE</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          <div>
            <Card className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="text-foreground font-mono">PROCESSING_RESULTS</CardTitle>
                <CardDescription className="text-muted-foreground font-mono">
                  {">"} Extracted candidate information from processed CVs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-primary">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-mono">NO_RESULTS_YET. Upload CVs to see extracted information.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="border border-primary rounded-lg p-4 bg-muted">
                        <div className="flex items-center gap-2 mb-2">
                          {result.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="font-medium text-foreground font-mono">{result.filename}</span>
                        </div>

                        {result.status === "success" && result.candidate && (
                          <div className="ml-6 space-y-1 text-sm font-mono">
                            <p className="text-primary">
                              <strong>NAME:</strong> {result.candidate.name}
                            </p>
                            <p className="text-primary">
                              <strong>EMAIL:</strong> {result.candidate.email}
                            </p>
                            <p className="text-primary">
                              <strong>EXPERIENCE:</strong> {result.candidate.experience}
                            </p>
                            <p className="text-primary">
                              <strong>SKILLS:</strong> {result.candidate.skills.join(", ")}
                            </p>
                          </div>
                        )}

                        {result.status === "error" && (
                          <p className="ml-6 text-sm text-red-400 font-mono">
                            ERROR: Failed to extract information from this CV
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
