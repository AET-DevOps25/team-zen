"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { File, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"

type Snippet = {
    id: number
    title: string
    content: string
    timestamp: string
}

export default function SnippetGallery() {
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSnippets() {
            try {
                const response = await fetch("http://localhost:8085/api/snippets", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // for authentication
                })

                if (!response.ok) {
                    console.log(`Failed to fetch snippets: ${response.statusText}`)
                    setSnippets([])
                }

                const data: Snippet[] = await response.json()
                console.log("Fetched snippets:", data)
                setSnippets(data)
            } catch (err: any) {
                console.log(err.message || "Unknown error catched")
                setSnippets([])
            } finally {
                setLoading(false)
            }
        }

        fetchSnippets()
    }, [])

    if (loading) return <p>Loading snippets...</p>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets?.map((snippet, index) => (
                <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-emerald-500">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-gray-900">{snippet.title}</h3>
                                <File size={18} className="text-blue-500" />
                            </div>

                            <div className="text-gray-600 mb-4 text-sm line-clamp-3">{snippet.content}</div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    <Calendar size={12} />
                                    {new Date(snippet.timestamp).toLocaleDateString("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    <Clock size={12} />
                                    {new Date(snippet.timestamp).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Badge>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t bg-gray-50 py-3 px-6">
                            <div className="flex justify-between items-center w-full text-sm text-gray-500">
                                <button className="text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
