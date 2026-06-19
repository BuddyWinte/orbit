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
 * @module api/forms
 * @author BuddyWinte
 * @since 2.1.10-beta20
 */

import { withAuth } from "@/lib/withAuth";
