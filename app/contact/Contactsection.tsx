"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { Label } from "@/components/ui/label.tsx";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    message: z.string().min(5, { message: "Message must be at least 5 characters." }),
});

export function ContactSection() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Attempting to send message with data:", data);
        const toastId = toast.loading("Sending your message...");

        try {
            const response = await fetch("https://formsubmit.co/ajax/eduhubcenter1@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _captcha: "false",
                    _template: "table",
                    _honey: ""
                })
            });

            console.log("Response from FormSubmit:", response);
            const result = await response.json();
            console.log("Result from FormSubmit:", result);

            if (result.success === "true") {
                toast.success("Message sent successfully! I'll get back to you soon.", {
                    id: toastId,
                    duration: 5000
                });
                reset();
                router.push('/');
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.", {
                id: toastId,
                duration: 5000
            });
        }
    };

    return (
        <section id="contact" className="py-10 relative px-5">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto">
                <div
                    className="max-w-xl mx-auto text-center mb-16"
                >
                    <Badge className="mb-4" variant="secondary">Get In Touch</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h2>
                    <p className="text-xl text-muted-foreground">
                        Have a question, feedback, or need support? We'd love to hear from you.
                    </p>
                </div>

                <div className=" max-w-5xl mx-auto">

                    <div
                        className="w-full"
                    >
                        <Card className="h-full">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LabelInputContainer>
                                            <Label htmlFor="name">Your name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your Name"
                                                type="text"
                                                {...register("name")}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                        </LabelInputContainer>

                                        <LabelInputContainer>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                {...register("email")}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                        </LabelInputContainer>
                                    </div>

                                    <LabelInputContainer>
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            placeholder="Ex. Contrat Freelance..."
                                            type="text"
                                            {...register("subject")}
                                        />
                                        {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                                    </LabelInputContainer>

                                    <LabelInputContainer>
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Your Message"
                                            className="min-h-[150px]"
                                            {...register("message")}
                                        />
                                        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
                                    </LabelInputContainer>
                                    <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </div>
                                        ) : (
                                            "Send Message →"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}



const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
