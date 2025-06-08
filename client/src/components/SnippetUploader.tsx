"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"

export default function SnippetUploader() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (
        e: React.FormEvent,
        title: string,
        content: string,
        setIsSubmitting: (val: boolean) => void,
        setSuccess: (val: boolean) => void,
        resetForm: () => void
    ) => {
        e.preventDefault()
        setIsSubmitting(true)

        const payload = { title, content }

        try {
            const response = await fetch("http://localhost:8085/api/snippets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error("Failed to create snippet")
            }

            setSuccess(true)
            resetForm()
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error("Error creating snippet:", error)
            alert("There was an error submitting the snippet.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setTitle("")
        setContent("")
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form
                onSubmit={(e) => handleSubmit(e, title, content, setIsSubmitting, setSuccess, resetForm)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Enter snippet title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Paste or write your snippet content here..."
                    ></textarea>
                </div>

                <div className="flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                Submitting...
                            </>
                        ) : (
                            "Submit Snippet"
                        )}
                    </Button>

                    {success && (
                        <div className="flex items-center space-x-2 text-emerald-600">
                            <Check size={20} />
                            <span>Submitted!</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
