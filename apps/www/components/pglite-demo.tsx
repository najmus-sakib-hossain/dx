"use client";

import { AlertCircle, Database, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VALIDATION_LIMITS } from "@/lib/constants";
import { getPGlite } from "@/lib/db/pglite";
import { logger } from "@/lib/logger";
import { createNoteSchema, noteIdSchema } from "@/lib/validations/note";

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export function PGliteDemo() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setDbError(false);
      const db = await getPGlite();
      const result = await db.query<Note>("SELECT * FROM notes ORDER BY created_at DESC");
      setNotes(result.rows);
    } catch (err) {
      logger.error("Failed to load notes", err);
      setDbError(true);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function addNote() {
    setError(null);

    try {
      // Validate input
      const validated = createNoteSchema.parse({ title, content });

      setLoading(true);
      const db = await getPGlite();
      await db.query("INSERT INTO notes (title, content) VALUES ($1, $2)", [
        validated.title,
        validated.content || "",
      ]);
      setTitle("");
      setContent("");
      await loadNotes();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        logger.error("Failed to add note", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id: number) {
    try {
      // Validate ID
      noteIdSchema.parse(id);

      const db = await getPGlite();
      await db.query("DELETE FROM notes WHERE id = $1", [id]);
      await loadNotes();
    } catch (err) {
      logger.error("Failed to delete note", err, { noteId: id });
      setError("Failed to delete note");
    }
  }

  if (dbError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Database Error</CardTitle>
          </div>
          <CardDescription>
            Failed to initialize PGlite. Your browser may not support WebAssembly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadNotes} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <CardTitle>PGlite Browser Database</CardTitle>
          </div>
          <CardDescription>
            PostgreSQL running entirely in your browser with WebAssembly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={VALIDATION_LIMITS.NOTE_TITLE_MAX}
          />
          <Textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-24"
            maxLength={VALIDATION_LIMITS.NOTE_CONTENT_MAX}
          />
          <Button onClick={addNote} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Note"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No notes yet. Create your first note above!
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{note.title}</CardTitle>
                    <CardDescription>{new Date(note.created_at).toLocaleString()}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {note.content && (
                <CardContent>
                  <p className="text-muted-foreground">{note.content}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
