import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGeneratedVideoSchema, insertQuizAttemptSchema } from "@shared/schema";
import { z } from "zod";

function generateDummyNotes(prompt: string): string {
  const topic = prompt.replace(/^visualize\s+/i, "").replace(/^the\s+/i, "");
  return `# Understanding ${topic}

## Key Concepts

This visualization demonstrates the fundamental principles of ${topic}. The animation breaks down complex concepts into easily digestible visual elements.

### Main Points:
1. The core mechanism involves the interaction between multiple variables
2. Observable effects can be measured and quantified
3. Real-world applications include various scientific and engineering fields

### Mathematical Foundation:
The underlying equations describe the relationship between cause and effect, showing how changes in one variable influence others in the system.

### Practical Applications:
- Scientific research and experimentation
- Engineering design and optimization
- Educational demonstrations and learning

## Summary
This topic represents a fundamental concept in science that has wide-ranging implications across multiple disciplines.`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, userId } = req.body;
      
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Using local video for preview
      const video = await storage.createGeneratedVideo({
        prompt,
        videoUrl: "/assets/vid.mp4", // Using local video
        userId: userId || null,
      });

      const notesText = generateDummyNotes(prompt);
      const notesRecord = await storage.createNotes({
        videoId: video.id,
        notesText,
        downloaded: false,
      });

      res.json({
        video: {
          ...video,
          videoUrl: "/assets/vid.mp4" // Ensure the URL is correctly set
        },
        notes: notesRecord,
      });

      /* Original API implementation - keeping it for future use
      const video = await storage.createGeneratedVideo({
        prompt,
        videoUrl: "/placeholder.mp4",
        userId: userId || null,
      });

      const notesText = generateDummyNotes(prompt);
      const notesRecord = await storage.createNotes({
        videoId: video.id,
        notesText,
        downloaded: false,
      });

      res.json({
        video,
        notes: notesRecord,
      });
      */
    } catch (error) {
      console.error("Generate error:", error);
      res.status(500).json({ error: "Failed to generate video" });
    }
  });

  app.get("/api/videos", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const videos = await storage.getGeneratedVideos(userId);
      res.json(videos);
    } catch (error) {
      console.error("Get videos error:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getGeneratedVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      const notes = await storage.getNotesByVideoId(video.id);
      res.json({ video, notes });
    } catch (error) {
      console.error("Get video error:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  app.post("/api/notes/:id/download", async (req, res) => {
    try {
      const updated = await storage.markNotesDownloaded(req.params.id);
      if (!updated) {
        return res.status(404).json({ error: "Notes not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Mark download error:", error);
      res.status(500).json({ error: "Failed to mark notes as downloaded" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const schema = z.object({
        prompt: z.string().min(1),
        score: z.number().min(0),
        totalQuestions: z.number().min(1),
        userId: z.string().optional().nullable(),
      });

      const data = schema.parse(req.body);
      
      const attempt = await storage.createQuizAttempt({
        prompt: data.prompt,
        score: data.score,
        totalQuestions: data.totalQuestions,
        userId: data.userId || null,
      });

      const passed = data.score >= Math.ceil(data.totalQuestions * 0.6);

      res.json({
        attempt,
        passed,
        message: passed ? "Congratulations, you passed!" : "Keep learning and try again!",
      });
    } catch (error) {
      console.error("Quiz submit error:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  app.get("/api/quiz/history", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const attempts = await storage.getQuizAttempts(userId);
      res.json(attempts);
    } catch (error) {
      console.error("Get quiz history error:", error);
      res.status(500).json({ error: "Failed to fetch quiz history" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      
      const videos = await storage.getGeneratedVideos(userId);
      const quizAttempts = await storage.getQuizAttempts(userId);
      const notesDownloaded = await storage.getNotesDownloadCount(userId);
      
      const passedQuizzes = quizAttempts.filter(
        (q) => q.score >= Math.ceil(q.totalQuestions * 0.6)
      ).length;
      
      const passRate = quizAttempts.length > 0
        ? Math.round((passedQuizzes / quizAttempts.length) * 100)
        : 0;

      let streak = 7;
      if (userId) {
        const user = await storage.getUser(userId);
        streak = user?.streak || 0;
      }

      res.json({
        videosGenerated: videos.length,
        notesDownloaded,
        quizAttempts: quizAttempts.length,
        passedQuizzes,
        passRate,
        streak,
        recentVideos: videos.slice(0, 5),
        recentQuizzes: quizAttempts.slice(0, 5),
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  return httpServer;
}
