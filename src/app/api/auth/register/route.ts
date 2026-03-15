import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

// Server-side validation helper
function validateInput(name: string, email: string, password: string) {
  const errors: string[] = [];
  if (!name || name.trim().length < 2)
    errors.push("Name must be at least 2 characters.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.push("A valid email is required.");
  if (!password || password.length < 8)
    errors.push("Password must be at least 8 characters.");
  return errors;
}

// Sanitize inputs to prevent XSS
function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    const sanitizedName = sanitize(String(name ?? "").trim());
    const sanitizedEmail = sanitize(String(email ?? "").trim().toLowerCase());
    const sanitizedRole = ["student", "teacher", "admin"].includes(role) ? role : "student";

    const errors = validateInput(sanitizedName, sanitizedEmail, String(password ?? ""));
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(sanitizedEmail);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = db
      .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
      .run(sanitizedName, sanitizedEmail, hash, sanitizedRole);

    return NextResponse.json(
      { message: "Account created successfully.", userId: result.lastInsertRowid },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
