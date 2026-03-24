import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

async function hasColumn(
  tableName: string,
  columnName: string
): Promise<boolean> {
  const rows = (await prisma.$queryRawUnsafe(
    `
      SELECT 1
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    tableName,
    columnName
  )) as any[];
  return Array.isArray(rows) && rows.length > 0;
}

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS youtube_testimonials (
      id BIGINT NOT NULL AUTO_INCREMENT,
      title VARCHAR(191) NOT NULL,
      description TEXT NULL,
      youtube_link VARCHAR(500) NOT NULL,
      profile_image VARCHAR(500) NULL,
      name VARCHAR(191) NULL,
      designation VARCHAR(191) NULL,
      review TEXT NULL,
      status TINYINT(1) NOT NULL DEFAULT 1,
      position INT NOT NULL DEFAULT 0,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX idx_youtube_testimonials_status (status),
      INDEX idx_youtube_testimonials_position (position)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  if (!(await hasColumn("youtube_testimonials", "profile_image"))) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE youtube_testimonials ADD COLUMN profile_image VARCHAR(500) NULL AFTER youtube_link"
    );
  }
  if (!(await hasColumn("youtube_testimonials", "name"))) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE youtube_testimonials ADD COLUMN name VARCHAR(191) NULL AFTER profile_image"
    );
  }
  if (!(await hasColumn("youtube_testimonials", "designation"))) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE youtube_testimonials ADD COLUMN designation VARCHAR(191) NULL AFTER name"
    );
  }
  if (!(await hasColumn("youtube_testimonials", "review"))) {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE youtube_testimonials ADD COLUMN review TEXT NULL AFTER designation"
    );
  }
}

function isYouTubeUrl(url: string) {
  const value = String(url || "").trim();
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value);
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "1";

    let sql = `
      SELECT
        id,
        title,
        description,
        youtube_link as youtubeLink,
        profile_image as profileImage,
        name,
        designation,
        review,
        status,
        position,
        created_at as createdAt,
        updated_at as updatedAt
      FROM youtube_testimonials
      WHERE 1=1
    `;
    const args: any[] = [];
    if (activeOnly) {
      sql += " AND status = 1";
    }
    sql += " ORDER BY position ASC, id DESC";

    const rows = (await prisma.$queryRawUnsafe(sql, ...args)) as any[];
    return NextResponse.json({
      success: true,
      data: serializeBigInt(rows || []),
    });
  } catch (error) {
    console.error("YOUTUBE_TESTIMONIALS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch youtube testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();
    const body = await req.json();

    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    const youtubeLink = String(body?.youtubeLink || "").trim();
    const profileImage = String(body?.profileImage || "").trim();
    const name = String(body?.name || "").trim();
    const designation = String(body?.designation || "").trim();
    const review = String(body?.review || "").trim();
    const status = body?.isActive ? 1 : 0;
    const position = Number(body?.position || 0);

    if (!title || !youtubeLink) {
      return NextResponse.json(
        { success: false, message: "Title and YouTube link are required" },
        { status: 400 }
      );
    }
    if (!isYouTubeUrl(youtubeLink)) {
      return NextResponse.json(
        { success: false, message: "Invalid YouTube link" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO youtube_testimonials
        (title, description, youtube_link, profile_image, name, designation, review, status, position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      title,
      description || null,
      youtubeLink,
      profileImage || null,
      name || null,
      designation || null,
      review || null,
      status,
      Number.isFinite(position) ? position : 0
    );

    return NextResponse.json({
      success: true,
      message: "YouTube testimonial created",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
    console.error("YOUTUBE_TESTIMONIALS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create youtube testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();
    const body = await req.json();

    const id = Number(body?.id);
    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    const youtubeLink = String(body?.youtubeLink || "").trim();
    const profileImage = String(body?.profileImage || "").trim();
    const name = String(body?.name || "").trim();
    const designation = String(body?.designation || "").trim();
    const review = String(body?.review || "").trim();
    const status = body?.isActive ? 1 : 0;
    const position = Number(body?.position || 0);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }
    if (!title || !youtubeLink) {
      return NextResponse.json(
        { success: false, message: "Title and YouTube link are required" },
        { status: 400 }
      );
    }
    if (!isYouTubeUrl(youtubeLink)) {
      return NextResponse.json(
        { success: false, message: "Invalid YouTube link" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
        UPDATE youtube_testimonials
        SET title = ?,
            description = ?,
            youtube_link = ?,
            profile_image = ?,
            name = ?,
            designation = ?,
            review = ?,
            status = ?,
            position = ?,
            updated_at = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `,
      title,
      description || null,
      youtubeLink,
      profileImage || null,
      name || null,
      designation || null,
      review || null,
      status,
      Number.isFinite(position) ? position : 0,
      id
    );

    return NextResponse.json({
      success: true,
      message: "YouTube testimonial updated",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
    console.error("YOUTUBE_TESTIMONIALS_PUT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update youtube testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdminRole();
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      "DELETE FROM youtube_testimonials WHERE id = ?",
      id
    );

    return NextResponse.json({
      success: true,
      message: "YouTube testimonial deleted",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
    console.error("YOUTUBE_TESTIMONIALS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete youtube testimonial" },
      { status: 500 }
    );
  }
}
