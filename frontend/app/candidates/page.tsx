"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Mail, Download, MoreHorizontal, Terminal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Candidate {
  id: string
  name: string
  email: string
  location: string
  experience: number
  currentRole: string
  skills: string[]
  status: "active" | "contacted" | "interviewed" | "hired"
  addedDate: string
}

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Mock candidate data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "John_Smith",
      email: "john.smith@email.com",
      location: "San Francisco, CA",
      experience: 5,
      currentRole: "Senior React Developer",
      skills: ["React", "TypeScript", "Node.js"],
      status: "active",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah_Johnson",
      email: "sarah.j@email.com",
      location: "New York, NY",
      experience: 3,
      currentRole: "Full Stack Developer",
      skills: ["React", "Python", "Django"],
      status: "contacted",
      addedDate: "2024-01-14",
    },
    {
      id: "3",
      name: "Mike_Chen",
      email: "mike.chen@email.com",
      location: "Seattle, WA",
      experience: 7,
      currentRole: "Lead Frontend Engineer",
      skills: ["React", "Vue.js", "JavaScript"],
      status: "interviewed",
      addedDate: "2024-01-13",
    },
    {
      id: "4",
      name: "Emily_Davis",
      email: "emily.davis@email.com",
      location: "Austin, TX",
      experience: 4,
      currentRole: "Backend Developer",
      skills: ["Python", "FastAPI", "PostgreSQL"],
      status: "active",
      addedDate: "2024-01-12",
    },
    {
      id: "5",
      name: "Alex_Rodriguez",
      email: "alex.r@email.com",
      location: "Los Angeles, CA",
      experience: 6,
      currentRole: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes"],
      status: "hired",
      addedDate: "2024-01-11",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground"
      case "contacted":
        return "bg-blue-500 text-white"
      case "interviewed":
        return "bg-yellow-500 text-black"
      case "hired":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-400 text-black"
    }
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.currentRole.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6">
          <Link href="/" className="text-primary hover:text-primary/80 mb-4 inline-block font-mono">
            {"<"} BACK_TO_DASHBOARD
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground terminal-cursor">Candidate Database</h1>
          </div>
          <p className="text-primary text-lg font-mono">{">"} Browse and manage all candidates in your database</p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-mono">FILTERS & ACTIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border bg-muted text-foreground focus:border-primary/60 font-mono"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 border-border bg-muted text-foreground">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-primary hover:bg-muted font-mono">
                    ALL_STATUSES
                  </SelectItem>
                  <SelectItem value="active" className="text-primary hover:bg-muted font-mono">
                    ACTIVE
                  </SelectItem>
                  <SelectItem value="contacted" className="text-primary hover:bg-muted font-mono">
                    CONTACTED
                  </SelectItem>
                  <SelectItem value="interviewed" className="text-primary hover:bg-muted font-mono">
                    INTERVIEWED
                  </SelectItem>
                  <SelectItem value="hired" className="text-primary hover:bg-muted font-mono">
                    HIRED
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 border-border bg-muted text-foreground">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="name" className="text-primary hover:bg-muted font-mono">
                    NAME
                  </SelectItem>
                  <SelectItem value="experience" className="text-primary hover:bg-muted font-mono">
                    EXPERIENCE
                  </SelectItem>
                  <SelectItem value="addedDate" className="text-primary hover:bg-muted font-mono">
                    DATE_ADDED
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-mono"
              >
                <Download className="h-4 w-4 mr-2" />
                EXPORT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-mono">CANDIDATES ({filteredCandidates.length})</CardTitle>
            <CardDescription className="text-muted-foreground font-mono">
              {">"} All candidates in your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-primary font-mono">NAME</TableHead>
                    <TableHead className="text-primary font-mono">ROLE</TableHead>
                    <TableHead className="text-primary font-mono">EXPERIENCE</TableHead>
                    <TableHead className="text-primary font-mono">LOCATION</TableHead>
                    <TableHead className="text-primary font-mono">SKILLS</TableHead>
                    <TableHead className="text-primary font-mono">STATUS</TableHead>
                    <TableHead className="text-primary font-mono">ADDED</TableHead>
                    <TableHead className="text-right text-primary font-mono">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground font-mono">{candidate.name}</div>
                          <div className="text-sm text-primary font-mono">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">{candidate.currentRole}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary text-primary font-mono">
                          {candidate.experience}Y
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">{candidate.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs border-primary text-primary font-mono"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs border-primary text-primary font-mono">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(candidate.status)} font-mono`}>
                          {candidate.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">{candidate.addedDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-primary" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/candidates/${candidate.id}`}
                                className="flex items-center text-primary hover:bg-muted font-mono"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                VIEW_PROFILE
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-primary hover:bg-muted font-mono">
                              <Mail className="h-4 w-4 mr-2" />
                              SEND_EMAIL
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-primary hover:bg-muted font-mono">
                              <Download className="h-4 w-4 mr-2" />
                              DOWNLOAD_CV
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
