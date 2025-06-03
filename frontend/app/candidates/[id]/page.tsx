"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Code,
  Download,
  MessageSquare,
  Building,
  Terminal,
} from "lucide-react"
import Link from "next/link"

interface CandidateProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  currentRole: string
  summary: string
  experience: {
    company: string
    position: string
    duration: string
    description: string
    achievements: string[]
  }[]
  education: {
    degree: string
    institution: string
    year: string
    gpa?: string
  }[]
  skills: {
    category: string
    items: string[]
  }[]
  certifications: string[]
  projects: {
    name: string
    description: string
    technologies: string[]
    url?: string
  }[]
  languages: string[]
  extractedData: any
}

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  // Mock candidate data
  const candidate: CandidateProfile = {
    id: params.id,
    name: "John_Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    currentRole: "Senior React Developer",
    summary:
      "Experienced full-stack developer with 5+ years of expertise in React, TypeScript, and Node.js. Passionate about building scalable web applications and leading development teams. Strong background in agile methodologies and modern development practices.",
    experience: [
      {
        company: "TechCorp_Inc",
        position: "Senior React Developer",
        duration: "2022 - Present",
        description: "Lead frontend development for enterprise applications serving 100k+ users",
        achievements: [
          "Improved application performance by 40% through code optimization",
          "Led a team of 4 developers in migrating legacy codebase to React",
          "Implemented automated testing reducing bugs by 60%",
        ],
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        duration: "2020 - 2022",
        description: "Developed and maintained web applications using React and Node.js",
        achievements: [
          "Built responsive web applications from scratch",
          "Integrated third-party APIs and payment systems",
          "Collaborated with design team to implement pixel-perfect UIs",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Stanford University",
        year: "2020",
        gpa: "3.8",
      },
    ],
    skills: [
      {
        category: "Frontend",
        items: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Express.js", "Python", "FastAPI", "GraphQL"],
      },
      {
        category: "Database",
        items: ["PostgreSQL", "MongoDB", "Redis"],
      },
      {
        category: "Tools & Technologies",
        items: ["Git", "Docker", "AWS", "Jest", "Webpack"],
      },
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "Google Cloud Professional Developer",
      "Certified Scrum Master",
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
        url: "https://github.com/johnsmith/ecommerce",
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        technologies: ["React", "Socket.io", "MongoDB", "Express.js"],
      },
    ],
    languages: ["English (Native)", "Spanish (Conversational)"],
    extractedData: {
      confidence: 0.95,
      processingTime: "2.3s",
      extractedFields: ["Personal Information", "Work Experience", "Education", "Skills", "Projects", "Certifications"],
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-primary pb-6">
          <Link href="/candidates" className="text-primary hover:text-primary/90 mb-4 inline-block font-mono">
            {"<"} BACK_TO_CANDIDATES
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground terminal-cursor">{candidate.name}</h1>
              </div>
              <p className="text-primary text-lg font-mono">
                {">"} {candidate.currentRole}
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-black font-bold font-mono">
                <MessageSquare className="h-4 w-4 mr-2" />
                CONTACT
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/90 hover:text-black font-mono"
              >
                <Download className="h-4 w-4 mr-2" />
                DOWNLOAD_CV
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <Card className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded bg-muted border border-primary">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-mono">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted border border-primary">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-mono">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted border border-primary">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-mono">{candidate.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="h-5 w-5 text-primary" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills
                    .flatMap((category) => category.items.slice(0, 3))
                    .map((skill) => (
                      <Badge key={skill} className="bg-primary text-black font-mono">
                        {skill}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Extraction Info */}
            <Card className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="text-foreground font-mono">AI_EXTRACTION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-mono">CONFIDENCE:</span>
                  <span className="font-medium text-foreground font-mono">
                    {(candidate.extractedData.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-mono">PROCESSING_TIME:</span>
                  <span className="font-medium text-foreground font-mono">
                    {candidate.extractedData.processingTime}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-primary font-mono">EXTRACTED_FIELDS:</span>
                  <div className="mt-1 space-y-1">
                    {candidate.extractedData.extractedFields.map((field: string) => (
                      <div key={field} className="text-xs text-primary font-mono">
                        {">"} {field.replace(/\s+/g, "_").toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card border border-primary">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  OVERVIEW
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  EXPERIENCE
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  SKILLS
                </TabsTrigger>
                <TabsTrigger
                  value="raw-data"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono"
                >
                  RAW_DATA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary */}
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="text-foreground font-mono">PROFESSIONAL_SUMMARY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary leading-relaxed font-mono">{candidate.summary}</p>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candidate.education.map((edu, index) => (
                      <div key={index} className="mb-4 last:mb-0 p-3 rounded bg-muted border-l-4 border-l-primary">
                        <h4 className="font-semibold text-foreground font-mono">{edu.degree}</h4>
                        <p className="text-primary font-mono">{edu.institution}</p>
                        <div className="flex gap-4 text-sm text-primary font-mono">
                          <span>{edu.year}</span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Award className="h-5 w-5 text-primary" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {candidate.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted border border-primary">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-primary font-mono">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {candidate.experience.map((exp, index) => (
                  <Card key={index} className="bg-card border-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <Building className="h-5 w-5 text-primary" />
                            {exp.position}
                          </CardTitle>
                          <CardDescription className="text-primary font-mono">{exp.company}</CardDescription>
                        </div>
                        <Badge className="bg-primary text-black font-mono">{exp.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-primary mb-4 font-mono">{exp.description}</p>
                      <div>
                        <h5 className="font-medium mb-2 text-foreground font-mono">KEY_ACHIEVEMENTS:</h5>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm p-2 rounded bg-muted border border-primary"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-primary font-mono">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                {candidate.skills.map((skillCategory, index) => (
                  <Card key={index} className="bg-card border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Code className="h-5 w-5 text-primary" />
                        {skillCategory.category.toUpperCase()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.items.map((skill) => (
                          <Badge key={skill} variant="outline" className="border-primary text-primary font-mono">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Projects */}
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="text-foreground font-mono">PROJECTS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidate.projects.map((project, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-l-primary pl-4 p-3 rounded bg-muted border border-primary"
                      >
                        <h4 className="font-semibold text-foreground font-mono">{project.name}</h4>
                        <p className="text-primary text-sm mb-2 font-mono">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} className="text-xs bg-primary text-black font-mono">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {project.url && (
                          <a
                            href={project.url}
                            className="text-primary text-sm hover:underline mt-1 inline-block font-mono"
                          >
                            VIEW_PROJECT →
                          </a>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw-data">
                <Card className="bg-card border-primary">
                  <CardHeader>
                    <CardTitle className="text-foreground font-mono">EXTRACTED_JSON_DATA</CardTitle>
                    <CardDescription className="text-primary font-mono">
                      {">"} Raw data extracted from the CV using AI processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border border-primary text-primary font-mono">
                      {JSON.stringify(candidate, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
