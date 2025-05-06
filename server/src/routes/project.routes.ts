import { NextFunction, Request, Response, Router } from 'express';
import { z } from 'zod';
import { client } from '../database/client';

const router = Router();

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required at least 1 character' }),
  description: z.string().min(1, { message: 'Description is required at least 1 character' }),
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = (req.query.s as string) || '';

    let countQuery = 'SELECT COUNT(*) FROM projects';
    let dataQuery = 'SELECT * FROM projects';
    const params: any[] = [];
    let whereClause = '';

    if (search) {
      whereClause = ' WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }

    const countResult = await client.query(
      countQuery + whereClause,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    let dataParams = [...params];
    let paramIndex = params.length;
    dataQuery += whereClause + ' LIMIT $' + (paramIndex + 1) + ' OFFSET $' + (paramIndex + 2);
    dataParams.push(limit, offset);

    const result = await client.query(
      dataQuery,
      dataParams
    );

    res.json({
      data: result.rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    next(new Error('Error fetching projects'));
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM projects WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    next(new Error('Error fetching project'));
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success, data, error } = projectSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error });
    }
    const result = await client.query('INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(new Error('Error creating project'));
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { success, data, error } = projectSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error });
    }
    const result = await client.query('UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *', [data.name, data.description, id]);
    return res.json(result.rows[0]);
  } catch (error) {
    next(new Error('Error updating project'));
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await client.query('DELETE FROM projects WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    next(new Error('Error deleting project'));
  }
});

export const projectRoutes = router; 