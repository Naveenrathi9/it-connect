import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Create new asset return request
app.post('/api/asset-returns', async (req: Request, res: Response) => {
  try {
    const {
      department,
      emp_code,
      emp_name,
      email,
      make_of_old_asset,
      model_of_asset,
      asset_no_to_return,
      sap_item_code,
      cost_center,
      remarks,
      status_of_store = 'Pending'
    } = req.body;
    
    // Validate required fields
    const requiredFields = [
      'department', 'emp_code', 'emp_name', 'email',
      'make_of_old_asset', 'model_of_asset', 'asset_no_to_return',
      'sap_item_code', 'cost_center'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    const [result] = await db.query(
      `INSERT INTO it_asset_returns 
      (department, emp_code, emp_name, email, make_of_old_asset, 
       model_of_asset, asset_no_to_return, sap_item_code, cost_center, 
       remarks, status_of_store) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        department,
        emp_code,
        emp_name,
        email,
        make_of_old_asset,
        model_of_asset,
        asset_no_to_return,
        sap_item_code,
        cost_center,
        remarks || null,
        status_of_store
      ]
    );

    res.status(201).json({
      message: 'Asset return request created successfully',
      id: (result as any).insertId
    });
  } catch (error: any) {
    console.error('Error creating asset return request:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'Asset return with this asset number already exists'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create asset return request',
      details: error.message 
    });
  }
});

// Get all asset returns
app.get('/api/asset-returns', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, department, emp_code, emp_name, email, 
        make_of_old_asset, model_of_asset, asset_no_to_return,
        sap_item_code, cost_center, remarks, 
        status_of_store as status,
        store_comment, received_at, created_at, updated_at
      FROM it_asset_returns 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching asset returns:', error);
    res.status(500).json({ error: 'Failed to fetch asset returns' });
  }
});

// Get single asset return by ID
app.get('/api/asset-returns/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM it_asset_returns WHERE id = ?', [req.params.id]);
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'Asset return not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching asset return:', error);
    res.status(500).json({ error: 'Failed to fetch asset return' });
  }
});

// Update asset return
app.put('/api/asset-returns/:id', async (req: Request, res: Response) => {
  try {
    const {
      department,
      emp_code,
      emp_name,
      email,
      make_of_old_asset,
      model_of_asset,
      asset_no_to_return,
      sap_item_code,
      cost_center,
      remarks,
      status_of_store,
      store_comment,
      received_at
    } = req.body;
    
    // Check if the record exists
    const [existing] = await db.query(
      'SELECT * FROM it_asset_returns WHERE id = ?', 
      [req.params.id]
    );
    
    if (!Array.isArray(existing) || existing.length === 0) {
      return res.status(404).json({ error: 'Asset return not found' });
    }
    
    // Update the record
    // Format the date for MySQL if it exists
    const formattedReceivedAt = received_at 
      ? new Date(received_at).toISOString().slice(0, 19).replace('T', ' ')
      : null;
      
    // Determine the new status
    let newStatus = status_of_store || (existing as any)[0].status_of_store;
    if (store_comment) {
      newStatus = 'Accepted';
    }

    await db.query(
      `UPDATE it_asset_returns 
       SET 
         department = COALESCE(?, department),
         emp_code = COALESCE(?, emp_code),
         emp_name = COALESCE(?, emp_name),
         email = COALESCE(?, email),
         make_of_old_asset = COALESCE(?, make_of_old_asset),
         model_of_asset = COALESCE(?, model_of_asset),
         asset_no_to_return = COALESCE(?, asset_no_to_return),
         sap_item_code = COALESCE(?, sap_item_code),
         cost_center = COALESCE(?, cost_center),
         remarks = COALESCE(?, remarks),
         status_of_store = ?,
         store_comment = COALESCE(?, store_comment),
         received_at = COALESCE(?, received_at)
       WHERE id = ?`,
      [
        department,
        emp_code,
        emp_name,
        email,
        make_of_old_asset,
        model_of_asset,
        asset_no_to_return,
        sap_item_code,
        cost_center,
        remarks,
        newStatus,
        store_comment,
        formattedReceivedAt,
        req.params.id
      ]
    );
    
    // Get the updated record
    const [updated] = await db.query(
      'SELECT * FROM it_asset_returns WHERE id = ?', 
      [req.params.id]
    );
    
    res.json({
      message: 'Asset return updated successfully',
      data: updated[0]
    });
  } catch (error: any) {
    console.error('Error updating asset return:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        error: 'Asset return with this asset number already exists'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update asset return',
      details: error.message 
    });
  }
});

// Delete an asset return
app.delete('/api/asset-returns/:id', async (req: Request, res: Response) => {
  try {
    const [result] = await db.query(
      'DELETE FROM it_asset_returns WHERE id = ?',
      [req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Asset return not found' });
    }
    
    res.json({ message: 'Asset return deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset return:', error);
    res.status(500).json({ 
      error: 'Failed to delete asset return',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update asset return status (kept for backward compatibility)
app.patch('/api/asset-returns/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const [result] = await db.query(
      'UPDATE it_asset_returns SET status_of_store = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Asset return not found' });
    }
    
    res.json({ message: 'Asset return status updated successfully' });
  } catch (error) {
    console.error('Error updating asset return status:', error);
    res.status(500).json({ error: 'Failed to update asset return status' });
  }
});

export default app;
