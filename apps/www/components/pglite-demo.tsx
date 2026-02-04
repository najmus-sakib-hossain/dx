"use client";

import { useState, useEffect } from "react";
import { getPGlite } from "@/lib/db/pglite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Database } from "lucide-react";

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

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const db = await getPGlite();
      const result = await db.query<Note>("SELECT * FROM notes ORDER BY created_at DESC");
      setNotes(result.rows);
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  }

  async function addNote() {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const db = await getPGlite();
      await db.query(
        "INSERT INTO notes (title, content) VALUES ($1, $2)",
        [title, content]
      );
      setTitle("");
      setContent("");
      await loadNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id: number) {
    try {
      const db = await getPGlite();
      await db.query("DELETE FROM notes WHERE id = $1", [id]);
      await loadNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
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
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-24"
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
                    <CardDescription>
                      {new Date(note.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                  >
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
