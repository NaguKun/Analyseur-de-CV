import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Users, Search, Database, FileText, TrendingUp, Terminal } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground terminal-cursor">CV Analysis & Candidate Database</h1>
          </div>
          <p className="text-primary text-lg font-mono">{">"} Intelligent recruitment system powered by AI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-primary flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">CVs Processed</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,341</div>
              <p className="text-xs text-primary">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Active Searches</CardTitle>
              <Search className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">89</div>
              <p className="text-xs text-primary">+23% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Match Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">94.2%</div>
              <p className="text-xs text-primary">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Upload className="h-5 w-5 text-primary" />
                Upload CVs
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Process new CV files or import from Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  {">"} START_UPLOAD
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Search className="h-5 w-5 text-primary" />
                Search Candidates
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Find candidates using AI-powered semantic search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {">"} SEARCH_NOW
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-primary" />
                View Database
              </CardTitle>
              <CardDescription className="text-muted-foreground">Browse all candidates in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/candidates">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {">"} VIEW_ALL
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest CV processing and search activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "CV_PROCESSED", candidate: "John Smith", time: "2 minutes ago" },
                { action: "SEARCH_QUERY", query: "React Developer with 3+ years", time: "5 minutes ago" },
                { action: "CV_PROCESSED", candidate: "Sarah Johnson", time: "12 minutes ago" },
                { action: "CANDIDATE_VIEWED", candidate: "Mike Chen", time: "18 minutes ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0 hover:bg-muted px-2 rounded transition-colors"
                >
                  <div>
                    <p className="font-medium text-primary font-mono">
                      {">"} {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground ml-4">{activity.candidate || activity.query}</p>
                  </div>
                  <span className="text-sm text-primary font-mono">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
