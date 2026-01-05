import { neon } from '@neondatabase/serverless';

// Initialize Neon connection
let sql;
try {
  sql = neon(process.env.DATABASE_URL || process.env.VITE_DATABASE_URL);
} catch (error) {
  console.error('Failed to initialize Neon connection:', error);
}

// Utility to check if sql is ready
function checkSqlConnection(res) {
  if (!sql) {
    return res.status(500).json({ 
      error: 'Database not connected',
      hint: 'Check DATABASE_URL environment variable'
    });
  }
  return null;
}

// Route handlers
const handlers = {
  // GET all locations or single location
  async GET(req, res) {
    const err = checkSqlConnection(res);
    if (err) return err;

    const { id, imageUrl } = req.query;

    // DELETE image from location
    if (imageUrl && req.method === 'GET' && id) {
      return handlers.DELETE_IMAGE(req, res);
    }

    // GET single location
    if (id) {
      try {
        const result = await sql(`
          SELECT id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
          FROM "Location"
          WHERE id = $1
        `, [id]);
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Location not found' });
        }
        
        return res.status(200).json(result[0]);
      } catch (error) {
        console.error('Error fetching location:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    // GET all locations
    try {
      const result = await sql(`
        SELECT id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt" 
        FROM "Location"
        ORDER BY "createdAt" DESC
      `);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST create location or add image
  async POST(req, res) {
    const err = checkSqlConnection(res);
    if (err) return err;

    const { id } = req.query;
    const { routeId, name, latitude, longitude, description, imageUrl } = req.body;

    // POST add image to location
    if (id && imageUrl) {
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }

      try {
        const result = await sql(`
          UPDATE "Location"
          SET images = array_append(images, $1),
              "updatedAt" = NOW()
          WHERE id = $2
          RETURNING id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
        `, [imageUrl, id]);
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Location not found' });
        }
        
        return res.status(200).json(result[0]);
      } catch (error) {
        console.error('Error adding image:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    // POST create location
    if (!routeId || !name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        error: 'routeId, name, latitude, and longitude are required' 
      });
    }

    try {
      const result = await sql(`
        INSERT INTO "Location" (
          "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
      `, [routeId, name, latitude, longitude, description || null, []]);
      
      res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // PUT update location
  async PUT(req, res) {
    const err = checkSqlConnection(res);
    if (err) return err;

    const { id } = req.query;
    const { name, latitude, longitude, description } = req.body;

    try {
      const result = await sql(`
        UPDATE "Location"
        SET name = COALESCE($1, name),
            latitude = COALESCE($2, latitude),
            longitude = COALESCE($3, longitude),
            description = COALESCE($4, description),
            "updatedAt" = NOW()
        WHERE id = $5
        RETURNING id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
      `, [name || null, latitude || null, longitude || null, description || null, id]);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE location or image
  async DELETE(req, res) {
    const err = checkSqlConnection(res);
    if (err) return err;

    const { id, imageUrl } = req.query;

    // DELETE image from location
    if (imageUrl) {
      return handlers.DELETE_IMAGE(req, res);
    }

    // DELETE location
    try {
      const result = await sql('DELETE FROM "Location" WHERE id = $1 RETURNING id', [id]);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE image helper
  async DELETE_IMAGE(req, res) {
    const { id, imageUrl } = req.query;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    try {
      const result = await sql(`
        UPDATE "Location"
        SET images = array_remove(images, $1),
            "updatedAt" = NOW()
        WHERE id = $2
        RETURNING id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
      `, [imageUrl, id]);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

// Default export for Vercel
export default async function handler(req, res) {
  const method = req.method;
  
  if (!handlers[method]) {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  return handlers[method](req, res);
}
