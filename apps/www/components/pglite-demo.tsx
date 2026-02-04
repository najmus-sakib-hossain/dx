"use client";

import { useState, useEffect } from "react";
import { getPGlite } from "@/lib/db/pglite";

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
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">PGlite Browser Database Demo</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded h-24"
          />
          <button
            onClick={addNote}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className="text-gray-600 mt-2">{note.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
