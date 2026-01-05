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

// GET all routes
export async function getRoutes(req, res) {
  const err = checkSqlConnection(res);
  if (err) return err;

  try {
    const result = await sql(`
      SELECT id, name, description, "createdAt", "updatedAt" 
      FROM "Route" 
      ORDER BY "createdAt" DESC
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: error.message });
  }
}

// GET single route with locations
export async function getRoute(req, res) {
  const err = checkSqlConnection(res);
  if (err) return err;

  const { id } = req.query;
  try {
    const route = await sql(`
      SELECT id, name, description, "createdAt", "updatedAt" 
      FROM "Route" 
      WHERE id = $1
    `, [id]);
    
    const locations = await sql(`
      SELECT id, "routeId", name, latitude, longitude, description, images, "createdAt", "updatedAt"
      FROM "Location"
      WHERE "routeId" = $1
      ORDER BY "createdAt" DESC
    `, [id]);
    
    res.status(200).json({ route: route[0], locations });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: error.message });
  }
}

// POST create route
export async function createRoute(req, res) {
  const err = checkSqlConnection(res);
  if (err) return err;

  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await sql(`
      INSERT INTO "Route" (name, description, "createdAt", "updatedAt")
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, name, description, "createdAt", "updatedAt"
    `, [name, description || null]);
    
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: error.message });
  }
}

// PUT update route
export async function updateRoute(req, res) {
  const err = checkSqlConnection(res);
  if (err) return err;

  const { id } = req.query;
  const { name, description } = req.body;

  try {
    const result = await sql(`
      UPDATE "Route"
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          "updatedAt" = NOW()
      WHERE id = $3
      RETURNING id, name, description, "createdAt", "updatedAt"
    `, [name || null, description || null, id]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: error.message });
  }
}

// DELETE route
export async function deleteRoute(req, res) {
  const err = checkSqlConnection(res);
  if (err) return err;

  const { id } = req.query;

  try {
    // Delete locations first (foreign key constraint)
    await sql('DELETE FROM "Location" WHERE "routeId" = $1', [id]);
    
    // Delete route
    const result = await sql('DELETE FROM "Route" WHERE id = $1 RETURNING id', [id]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: error.message });
  }
}
