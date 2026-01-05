import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// GET all locations
export async function getLocations(req, res) {
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
}

// GET single location
export async function getLocation(req, res) {
  const { id } = req.query;
  
  try {
    const result = await sql(`
      SELECT id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
      FROM "Location"
      WHERE id = $1
    `, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: error.message });
  }
}

// POST create location
export async function createLocation(req, res) {
  const { routeId, name, latitude, longitude, description } = req.body;

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
}

// PUT update location
export async function updateLocation(req, res) {
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
}

// DELETE location
export async function deleteLocation(req, res) {
  const { id } = req.query;

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
}

// POST add image to location
export async function addImage(req, res) {
  const { id } = req.query;
  const { imageUrl } = req.body;

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
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({ error: error.message });
  }
}

// DELETE image from location
export async function deleteImage(req, res) {
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
