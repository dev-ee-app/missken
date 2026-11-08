import { NextRequest, NextResponse } from "next/server";
import { LessonDAL } from "@/lib/dal/lessons";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_teacher_a_123";
    const list = await LessonDAL.listUserLessons(userId);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "usr_teacher_a_123";
    const lesson = await LessonDAL.createLesson(userId, body);
    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
