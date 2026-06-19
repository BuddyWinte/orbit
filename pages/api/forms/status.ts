/**
 * Orbit Forms
 * Licensed under GPL-3.0 (see LICENSE for details)
 *
 * Handles toggling the Forms feature via Feature Flags
 *
 * Routes:
 * GET  /api/forms/status
 * POST /api/forms/status
 * 
 *
 * @module api/forms
 * @author BuddyWinte
 * @since 2.1.10-beta20
 */

import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/utils/database";
import { withAuth } from "@/lib/withAuth";

type ApiResponse =
  | { success: true; data: { enabled: boolean } }
  | { success: false; error: string };


export default withAuth(handler)


async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>)  {
  const userId = (req as any).auth?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const workspaceGroupId = Number(req.query.workspaceGroupId);
    if (!workspaceGroupId) {
      return res.status(400).json({
        success: false,
        error: "Missing workspaceGroupId"
      });
    }
    
    if (!Number.isInteger(workspaceGroupId)) {
      return res.status(400).json({
        success: false,
        error: "workspaceGroupId must be interger"
      })
    }

    if (req.method == "GET") {
      const config = await prisma.config.findFirst({
        where: {
          key: "forms.enabled",
          workspaceGroupId,
        },
      });

      const value = config?.value as { enabled?: boolean } | null;

      return res.status(200).json({
        success: true,
        data: { enabled: value?.enabled ?? false }
      });
    }

    if (req.method == "POST") {
      const { enabled } = req.body;
      if (enabled == undefined || typeof enabled !== "boolean") {
        return res.status(400).json({
          success: false,
          error: "enabled must be boolean"
        })
      }

      const existing = await prisma.config.findFirst({
        where: {
          key: "forms.enabled",
          workspaceGroupId,
        },
      });

      const dValue = { enabled };

      const config = existing ? await prisma.config.update({
        where: { id: existing.id },
        data: { value: dValue },
      }) : await prisma.config.create({
        data: {
          key: "forms.enabled",
          workspaceGroupId,
          value: dValue,
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          enabled: (config.value as any).enabled,
        },
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  } catch(err) {
    console.error("Forms toggle error: ", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    })
  }
}