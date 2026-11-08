import { NextRequest, NextResponse } from "next/server";
import { LessonDAL } from "@/lib/dal/lessons";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_teacher_a_123";
    const lesson = await LessonDAL.getLessonById(userId, params.id);
    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const userId = body.userId || "usr_teacher_a_123";
    const updated = await LessonDAL.updateLesson(userId, params.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_teacher_a_123";
    await LessonDAL.deleteLesson(userId, params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
