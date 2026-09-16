import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { pool } from './db';

@Controller('items')
export class ItemsController {
  @Get()
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id');
    return rows;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (!rows[0]) throw new NotFoundException('item not found');
    return rows[0];
  }

  @Post()
  async create(@Body('name') name: string) {
    const { rows } = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name],
    );
    return rows[0];
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('name') name: string) {
    const { rows } = await pool.query(
      'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
      [name, id],
    );
    if (!rows[0]) throw new NotFoundException('item not found');
    return rows[0];
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { rows } = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (!rows[0]) throw new NotFoundException('item not found');
    return { deleted: true };
  }
}
