"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Mail, MapPin, Calendar, Code, Award, Terminal } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: string
  name: string
  email: string
  location: string
  experience: number
  currentRole: string
  skills: string[]
  education: string
  matchScore: number
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [experienceRange, setExperienceRange] = useState([0])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<Candidate[]>([])

  // Mock candidate data
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      name: "John_Smith",
      email: "john.smith@email.com",
      location: "San Francisco, CA",
      experience: 5,
      currentRole: "Senior React Developer",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      education: "BS Computer Science - Stanford University",
      matchScore: 95,
    },
    {
      id: "2",
      name: "Sarah_Johnson",
      email: "sarah.j@email.com",
      location: "New York, NY",
      experience: 3,
      currentRole: "Full Stack Developer",
      skills: ["React", "Python", "Django", "PostgreSQL", "Docker"],
      education: "MS Software Engineering - MIT",
      matchScore: 88,
    },
    {
      id: "3",
      name: "Mike_Chen",
      email: "mike.chen@email.com",
      location: "Seattle, WA",
      experience: 7,
      currentRole: "Lead Frontend Engineer",
      skills: ["React", "Vue.js", "JavaScript", "CSS", "Webpack"],
      education: "BS Computer Science - University of Washington",
      matchScore: 82,
    },
  ]

  const availableSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Python",
    "Node.js",
    "GraphQL",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Vue.js",
    "Angular",
    "Django",
    "FastAPI",
  ]

  const handleSearch = async () => {
    setSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const filteredResults = mockCandidates.filter((candidate) => {
      const matchesQuery =
        !searchQuery ||
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesExperience = candidate.experience >= experienceRange[0]
      const matchesSkills =
        selectedSkills.length === 0 || selectedSkills.some((skill) => candidate.skills.includes(skill))
      const matchesLocation = !location || candidate.location.toLowerCase().includes(location.toLowerCase())

      return matchesQuery && matchesExperience && matchesSkills && matchesLocation
    })

    setResults(filteredResults)
    setSearching(false)
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

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
            <h1 className="text-4xl font-bold text-foreground terminal-cursor">Search Candidates</h1>
          </div>
          <p className="text-primary text-lg font-mono">
            {">"} Find the perfect candidates using AI-powered semantic search
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Filter className="h-5 w-5 text-primary" />
                  Search Filters
                </CardTitle>
                <CardDescription className="text-muted-foreground font-mono">
                  {">"} Refine your candidate search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Query */}
                <div>
                  <Label htmlFor="search" className="text-primary font-mono">
                    JOB_DESCRIPTION / KEYWORDS:
                  </Label>
                  <Input
                    id="search"
                    placeholder="e.g., React developer with 3+ years experience"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border bg-muted text-foreground focus:border-primary/60 font-mono"
                  />
                </div>

                {/* Experience Range */}
                <div>
                  <Label className="text-primary font-mono">MINIMUM_EXPERIENCE (years):</Label>
                  <div className="mt-2">
                    <Slider
                      value={experienceRange}
                      onValueChange={setExperienceRange}
                      max={15}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-primary mt-1 font-mono">
                      <span>0</span>
                      <span>{experienceRange[0]}+ years</span>
                      <span>15+</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-primary font-mono">REQUIRED_SKILLS:</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer font-mono ${
                          selectedSkills.includes(skill)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border-primary text-primary hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-primary font-mono">
                    LOCATION:
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-border bg-muted text-foreground focus:border-primary/60 font-mono"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searching ? "SEARCHING..." : "SEARCH_CANDIDATES"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground font-mono">SEARCH_RESULTS</CardTitle>
                <CardDescription className="text-muted-foreground font-mono">
                  {results.length > 0
                    ? `Found ${results.length} matching candidates`
                    : "Enter search criteria and click search"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-primary">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-mono">NO_SEARCH_RESULTS_YET. Use the filters to find candidates.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((candidate) => (
                      <Card
                        key={candidate.id}
                        className="bg-muted border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground font-mono">{candidate.name}</h3>
                              <p className="text-primary font-mono">{candidate.currentRole}</p>
                            </div>
                            <Badge className="bg-primary text-primary-foreground font-mono">
                              {candidate.matchScore}% MATCH
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-primary font-mono">
                              <Mail className="h-4 w-4" />
                              {candidate.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-primary font-mono">
                              <MapPin className="h-4 w-4" />
                              {candidate.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-primary font-mono">
                              <Calendar className="h-4 w-4" />
                              {candidate.experience} years experience
                            </div>
                            <div className="flex items-center gap-2 text-sm text-primary font-mono">
                              <Award className="h-4 w-4" />
                              {candidate.education}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Code className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-primary font-mono">SKILLS:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs border-primary text-primary font-mono"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/candidates/${candidate.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-mono"
                              >
                                VIEW_PROFILE
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono"
                            >
                              CONTACT_CANDIDATE
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
