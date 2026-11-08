import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { LessonDAL } from "@/lib/dal/lessons";

export async function POST(req: NextRequest) {
  let browser;
  try {
    const body = await req.json();
    const lessonId = body.id;
    const bgType = body.bgType || "none";
    const ecoMode = body.ecoMode ? "true" : "false";

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lesson id" }, { status: 400 });
    }

    // Detect available Chromium executable or launch default
    const fs = await import("fs");
    const edgeWindows = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
    const chromeLinux = "/usr/bin/google-chrome";

    let launchOptions: any = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    };

    if (fs.existsSync(edgeWindows)) {
      launchOptions.executablePath = edgeWindows;
    } else if (fs.existsSync(chromeLinux)) {
      launchOptions.executablePath = chromeLinux;
    }

    try {
      browser = await chromium.launch(launchOptions);
    } catch (launchErr) {
      console.warn("Serverless browser binary not found, fallback to client print:", launchErr);
      return NextResponse.json(
        { error: "Serverless browser binary unavailable. Use client print.", fallback: true },
        { status: 503 }
      );
    }

    const page = await browser.newPage({
      viewport: { width: 1280, height: 1600 },
    });

    // Navigate to dedicated clean printable page
    const host = req.headers.get("host") || "localhost:3005";
    const protocol = host.includes("localhost") ? "http" : "https";
    const printUrl = `${protocol}://${host}/print?id=${lessonId}&bg=${bgType}&eco=${ecoMode}`;

    await page.goto(printUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForSelector("#page-1", { timeout: 10000 });

    // Generate exact A4 vector PDF with background graphics enabled
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(body.title || "lesson-plan")}.pdf"`,
      },
    });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
