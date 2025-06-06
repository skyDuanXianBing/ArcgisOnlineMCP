import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import esriConfig from "@arcgis/core/config.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";


export function createServer(): McpServer {
  const server = new McpServer({
    name: 'ArcgisOnline Tools MCP Server',
    version: '0.1.0',
  })
  server.tool(
    'query',
    'query Arcgis Online FeatureLayer Element',
    {
      url: z.string().url().describe('Feature layer URL'),
      apikey: z.string().min(1).describe('API key'),
      where: z.string().default("1=1").describe('WHERE clause for filtering features'),
    },
    async ({ url, apikey, where }) => {
      try {
        // 验证输入参数
        if (!url || !apikey) {
          throw new Error('URL and API key are required');
        }

        esriConfig.apiKey = apikey;
        const featureLayer = new FeatureLayer({
          url: url,
        });

        // 等待图层加载以验证URL有效性
        await featureLayer.load();

        const featureQueryResult = await featureLayer.queryFeatures({
          where: where,
          outFields: ['*'],
          returnGeometry: true,
        });

        // 提取所有要素的完整属性
        const features = featureQueryResult.features || [];
        const allFeatureAttributes = features.map((feature: any) => {
          return {
            attributes: feature.attributes || {},
            geometry: feature.geometry || null
          };
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                totalFeatures: features.length,
                features: allFeatureAttributes
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                details: 'Failed to query features from the layer'
              }, null, 2)
            }
          ]
        };
      }
    }
  )

  // Update Feature Attributes Tool
  server.tool(
    'updateFeatureAttributes',
    'Update only the attributes of an existing feature in an ArcGIS Online FeatureLayer',
    {
      url: z.string().url().describe('Feature layer URL'),
      apikey: z.string().min(1).describe('API key'),
      objectId: z.number().positive().describe('Object ID of the feature to update'),
      attributes: z.record(z.any()).describe('Updated feature attributes')
    },
    async ({ url, apikey, objectId, attributes }) => {
      try {
        if (!url || !apikey || !objectId || !attributes) {
          throw new Error('URL, API key, object ID, and attributes are required');
        }

        esriConfig.apiKey = apikey;
        const featureLayer = new FeatureLayer({
          url: url,
        });

        // 等待图层加载以获取objectIdField
        await featureLayer.load();

        if (!featureLayer.objectIdField) {
          throw new Error('Unable to determine object ID field for this layer');
        }

        // Create a graphic with the provided objectId and attributes (no geometry)
        const graphic = new Graphic({
          attributes: {
            ...attributes,
            [featureLayer.objectIdField]: objectId // Ensure the objectId is included
          }
          // No geometry property - only updating attributes
        });

        // Apply the edits to update the feature
        const editsResult = await featureLayer.applyEdits({
          updateFeatures: [graphic]
        });

        // 检查每个结果的成功状态
        const allSuccessful = editsResult.updateFeatureResults.every(result => result.success);
        const hasResults = editsResult.updateFeatureResults.length > 0;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: hasResults && allSuccessful,
                totalUpdated: editsResult.updateFeatureResults.length,
                results: editsResult.updateFeatureResults
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                details: 'Failed to update feature attributes'
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  // Update Point Geometry Tool
  server.tool(
    'updatePointGeometry',
    'Update only the geometry of an existing point feature using latitude and longitude',
    {
      url: z.string().url().describe('Feature layer URL'),
      apikey: z.string().min(1).describe('API key'),
      objectId: z.number().positive().describe('Object ID of the feature to update'),
      latitude: z.number().min(-90).max(90).describe('Latitude (Y coordinate)'),
      longitude: z.number().min(-180).max(180).describe('Longitude (X coordinate)'),
      wkid: z.number().positive().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, objectId, latitude, longitude, wkid }) => {
      try {
        if (!url || !apikey || !objectId || latitude === undefined || longitude === undefined) {
          throw new Error('URL, API key, object ID, latitude, and longitude are required');
        }

        esriConfig.apiKey = apikey;
        const featureLayer = new FeatureLayer({
          url: url,
        });

        // 等待图层加载以获取objectIdField
        await featureLayer.load();

        if (!featureLayer.objectIdField) {
          throw new Error('Unable to determine object ID field for this layer');
        }

        // Create a point geometry from latitude and longitude
        const point = new Point({
          x: longitude,
          y: latitude,
          spatialReference: { wkid: wkid }
        });

        // Create a graphic with the provided objectId and point geometry (no attributes)
        const graphic = new Graphic({
          attributes: {
            [featureLayer.objectIdField]: objectId // Only include the objectId
          },
          geometry: point
        });

        // Apply the edits to update the feature
        const editsResult = await featureLayer.applyEdits({
          updateFeatures: [graphic]
        });

        // 检查每个结果的成功状态
        const allSuccessful = editsResult.updateFeatureResults.every(result => result.success);
        const hasResults = editsResult.updateFeatureResults.length > 0;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: hasResults && allSuccessful,
                totalUpdated: editsResult.updateFeatureResults.length,
                results: editsResult.updateFeatureResults
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                details: 'Failed to update point geometry'
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  // Update Line Geometry Tool
  server.tool(
    'updateLineGeometry',
    'Update only the geometry of an existing line feature using an array of coordinates',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      objectId: z.number().describe('Object ID of the feature to update'),
      coordinates: z.array(
        z.object({
          latitude: z.number().describe('Latitude (Y coordinate)'),
          longitude: z.number().describe('Longitude (X coordinate)')
        })
      ).min(2).describe('Array of coordinates for the line vertices'),
      wkid: z.number().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, objectId, coordinates, wkid }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Convert the coordinates array to the format expected by Polyline
      const path = coordinates.map(coord => [coord.longitude, coord.latitude]);

      // Create a polyline geometry from the coordinates
      const polyline = new Polyline({
        paths: [path],
        spatialReference: { wkid: wkid }
      });

      // Create a graphic with the provided objectId and polyline geometry (no attributes)
      const graphic = new Graphic({
        attributes: {
          [featureLayer.objectIdField]: objectId // Only include the objectId
        },
        geometry: polyline
      });

      // Apply the edits to update the feature
      const editsResult = await featureLayer.applyEdits({
        updateFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.updateFeatureResults.length > 0,
              results: editsResult.updateFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  // Update Polygon Geometry Tool
  server.tool(
    'updatePolygonGeometry',
    'Update only the geometry of an existing polygon feature using an array of coordinates',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      objectId: z.number().describe('Object ID of the feature to update'),
      coordinates: z.array(
        z.object({
          latitude: z.number().describe('Latitude (Y coordinate)'),
          longitude: z.number().describe('Longitude (X coordinate)')
        })
      ).min(3).describe('Array of coordinates for the polygon vertices'),
      wkid: z.number().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, objectId, coordinates, wkid }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Convert the coordinates array to the format expected by Polygon
      // For a polygon, we need to close the ring by adding the first point at the end
      const ring = coordinates.map(coord => [coord.longitude, coord.latitude]);

      // Check if the ring is closed (first point equals last point)
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];

      // If the ring is not closed, close it by adding the first point at the end
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        ring.push([firstPoint[0], firstPoint[1]]);
      }

      // Create a polygon geometry from the coordinates
      const polygon = new Polygon({
        rings: [ring],
        spatialReference: { wkid: wkid }
      });

      // Create a graphic with the provided objectId and polygon geometry (no attributes)
      const graphic = new Graphic({
        attributes: {
          [featureLayer.objectIdField]: objectId // Only include the objectId
        },
        geometry: polygon
      });

      // Apply the edits to update the feature
      const editsResult = await featureLayer.applyEdits({
        updateFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.updateFeatureResults.length > 0,
              results: editsResult.updateFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  // Delete Feature Tool
  server.tool(
    'deleteFeature',
    'Delete a feature from an ArcGIS Online FeatureLayer',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      objectId: z.number().describe('Object ID of the feature to delete')
    },
    async ({ url, apikey, objectId }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Create a graphic with just the objectId for deletion
      const graphic = new Graphic({
        attributes: {
          [featureLayer.objectIdField]: objectId
        }
      });

      // Apply the edits to delete the feature
      const editsResult = await featureLayer.applyEdits({
        deleteFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.deleteFeatureResults.length > 0,
              results: editsResult.deleteFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  // Add Point Feature Tool
  server.tool(
    'addPointFeature',
    'Add a new point feature to an ArcGIS Online FeatureLayer using latitude and longitude',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      attributes: z.record(z.any()).describe('Feature attributes'),
      latitude: z.number().describe('Latitude (Y coordinate)'),
      longitude: z.number().describe('Longitude (X coordinate)'),
      wkid: z.number().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, attributes, latitude, longitude, wkid }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Create a point geometry from latitude and longitude
      const point = new Point({
        x: longitude,
        y: latitude,
        spatialReference: { wkid: wkid }
      });

      // Create a new graphic with the provided attributes and point geometry
      const graphic = new Graphic({
        attributes: attributes,
        geometry: point
      });

      // Apply the edits to add the new feature
      const editsResult = await featureLayer.applyEdits({
        addFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.addFeatureResults.length > 0,
              results: editsResult.addFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  // Add Line Feature Tool
  server.tool(
    'addLineFeature',
    'Add a new line feature to an ArcGIS Online FeatureLayer using an array of coordinates',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      attributes: z.record(z.any()).describe('Feature attributes'),
      coordinates: z.array(
        z.object({
          latitude: z.number().describe('Latitude (Y coordinate)'),
          longitude: z.number().describe('Longitude (X coordinate)')
        })
      ).min(2).describe('Array of coordinates for the line vertices'),
      wkid: z.number().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, attributes, coordinates, wkid }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Convert the coordinates array to the format expected by Polyline
      const path = coordinates.map(coord => [coord.longitude, coord.latitude]);

      // Create a polyline geometry from the coordinates
      const polyline = new Polyline({
        paths: [path],
        spatialReference: { wkid: wkid }
      });

      // Create a new graphic with the provided attributes and polyline geometry
      const graphic = new Graphic({
        attributes: attributes,
        geometry: polyline
      });

      // Apply the edits to add the new feature
      const editsResult = await featureLayer.applyEdits({
        addFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.addFeatureResults.length > 0,
              results: editsResult.addFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  // Add Polygon Feature Tool
  server.tool(
    'addPolygonFeature',
    'Add a new polygon feature to an ArcGIS Online FeatureLayer using an array of coordinates',
    {
      url: z.string().describe('Feature layer URL'),
      apikey: z.string().describe('API key'),
      attributes: z.record(z.any()).describe('Feature attributes'),
      coordinates: z.array(
        z.object({
          latitude: z.number().describe('Latitude (Y coordinate)'),
          longitude: z.number().describe('Longitude (X coordinate)')
        })
      ).min(3).describe('Array of coordinates for the polygon vertices'),
      wkid: z.number().default(4326).describe('Spatial reference WKID (default: 4326 WGS84)')
    },
    async ({ url, apikey, attributes, coordinates, wkid }) => {
      esriConfig.apiKey = apikey;
      const featureLayer = new FeatureLayer({
        url: url,
      });

      // Convert the coordinates array to the format expected by Polygon
      // For a polygon, we need to close the ring by adding the first point at the end
      const ring = coordinates.map(coord => [coord.longitude, coord.latitude]);

      // Check if the ring is closed (first point equals last point)
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];

      // If the ring is not closed, close it by adding the first point at the end
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        ring.push([firstPoint[0], firstPoint[1]]);
      }

      // Create a polygon geometry from the coordinates
      const polygon = new Polygon({
        rings: [ring],
        spatialReference: { wkid: wkid }
      });

      // Create a new graphic with the provided attributes and polygon geometry
      const graphic = new Graphic({
        attributes: attributes,
        geometry: polygon
      });

      // Apply the edits to add the new feature
      const editsResult = await featureLayer.applyEdits({
        addFeatures: [graphic]
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: editsResult.addFeatureResults.length > 0,
              results: editsResult.addFeatureResults
            }, null, 2)
          }
        ]
      };
    }
  );

  return server
}
