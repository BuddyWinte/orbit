/**
 * Orbit Forms
 * Licensed under GPL-3.0 (see LICENSE for details)
 *
 * Form collection endpoint.
 * Used for listing existing forms and creating new forms.
 *
 * Routes:
 * GET  /api/workspace/:workspaceId/forms
 * POST /api/workspace/:workspaceId/forms
 * GET  /api/workspace/:workspaceId/forms/:formId
 * PATCH /api/workspace/:workspaceId/forms/:formId
 * DELETE /api/workspace/:workspaceId/forms/:formId
 *
 * Permissions:
 * - Forms.View
 * - Forms.Create
 *
 * @module api/workspace/[id]/forms
 * @author BuddyWinte
 * @since 2.1.10-beta20
 */

import { AuthenticatedRequest } from "@/lib/withAuth";
import type { NextApiResponse } from "next";
import prisma from "@/utils/database";

type FormOut = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse =
  | { success: true; body: { forms: FormOut[] } }
  | { success: true; body: { form: FormOut } }
  | { success: false; error: string };

function toFormOut(form: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): FormOut {
  return {
    id: form.id,
    title: form.name,
    description: form.description,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
  };
}

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const workspaceId = Number(req.query.id);
  if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid workspaceGroupId",
    });
  }

  try {
    switch (req.method) {
      case "GET": {
        const forms = await prisma.form.findMany({
          where: { workspaceGroupId: workspaceId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return res.status(200).json({
          success: true,
          body: {
            forms: forms.map(toFormOut),
          },
        });
      }

      case "POST": {
        const { title, description } = req.body ?? {};

        if (typeof title !== "string" || title.trim().length === 0) {
          return res.status(400).json({
            success: false,
            error: "title is required",
          });
        }

        const form = await prisma.form.create({
          data: {
            name: title.trim(),
            description: typeof description === "string" ? description : null,
            workspaceGroupId: workspaceId,
            createdById: BigInt(userId),
            isEnabled: true,
            settings: {},
          },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return res.status(201).json({
          success: true,
          body: {
            form: toFormOut(form),
          },
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          success: false,
          error: "Method Not Allowed",
        });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}