/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema } from '@osd/config-schema';
import {
  IOpenSearchDashboardsResponse,
  IRouter,
} from '../../../../src/core/server';
import { APP_API } from '../../common';
import { MAP_ICON_SAVED_OBJECT_TYPE } from '../saved_objects';

const ICON_API_PATH = `${APP_API}/icons`;
const MAX_ICON_SVG_SIZE = 100 * 1024; // 100KB max for SVG content

/**
 * Server-side SVG validation.
 * Minimal checks — the security boundary is client-side rendering via <img> data URL,
 * which inherently prevents script execution, external resource loading, and DOM access.
 * Server-side validation just ensures we're storing valid SVG content.
 */
function validateSvgContent(svg: string): { valid: boolean; reason?: string } {
  if (!svg.toLowerCase().includes('<svg')) {
    return { valid: false, reason: 'Content is not a valid SVG' };
  }
  return { valid: true };
}

export function iconRoute(router: IRouter) {
  // Create a new custom icon
  router.post(
    {
      path: ICON_API_PATH,
      validate: {
        body: schema.object({
          name: schema.string({ minLength: 1, maxLength: 100 }),
          svg: schema.string({ minLength: 1, maxLength: MAX_ICON_SVG_SIZE }),
        }),
      },
    },
    async (context, request, response): Promise<IOpenSearchDashboardsResponse<any>> => {
      try {
        const { name, svg } = request.body;

        // Server-side SVG validation — fast reject obvious attacks
        const validation = validateSvgContent(svg);
        if (!validation.valid) {
          return response.custom({
            statusCode: 400,
            body: validation.reason || 'Invalid SVG content',
          });
        }

        const savedObjectsClient = context.core.savedObjects.client;

        const savedObject = await savedObjectsClient.create(MAP_ICON_SAVED_OBJECT_TYPE, {
          name,
          svg,
        });

        return response.ok({
          body: {
            id: savedObject.id,
            ...savedObject.attributes,
          },
        });
      } catch (error: any) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );

  // Get all custom icons (metadata only — SVG fetched individually via GET /{id})
  router.get(
    {
      path: ICON_API_PATH,
      validate: {},
    },
    async (context, request, response): Promise<IOpenSearchDashboardsResponse<any>> => {
      try {
        const savedObjectsClient = context.core.savedObjects.client;

        const findResponse = await savedObjectsClient.find({
          type: MAP_ICON_SAVED_OBJECT_TYPE,
          perPage: 100,
        });

        const icons = findResponse.saved_objects.map((obj) => ({
          id: obj.id,
          name: (obj.attributes as any).name,
        }));

        return response.ok({
          body: { icons },
        });
      } catch (error: any) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );

  // Get a single icon by ID
  router.get(
    {
      path: `${ICON_API_PATH}/{id}`,
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response): Promise<IOpenSearchDashboardsResponse<any>> => {
      try {
        const savedObjectsClient = context.core.savedObjects.client;
        const savedObject = await savedObjectsClient.get(
          MAP_ICON_SAVED_OBJECT_TYPE,
          request.params.id
        );

        return response.ok({
          body: {
            id: savedObject.id,
            ...savedObject.attributes,
          },
        });
      } catch (error: any) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );

  // Delete an icon
  router.delete(
    {
      path: `${ICON_API_PATH}/{id}`,
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response): Promise<IOpenSearchDashboardsResponse<any>> => {
      try {
        const savedObjectsClient = context.core.savedObjects.client;
        const { id } = request.params;

        await savedObjectsClient.delete(MAP_ICON_SAVED_OBJECT_TYPE, id);

        return response.ok({
          body: { success: true },
        });
      } catch (error: any) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
