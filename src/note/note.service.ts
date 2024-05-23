import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertNoteDto } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  /**
   * getNotes
   * @param userId
   */
  getNotes(userId: number) {
    return this.prismaService.note.findMany({
      where: { userId },
    });
  }

  /**
   * getNoteById
   *
   * @param noteId
   */
  async getNoteById(noteId: number) {
    return this.prismaService.note.findUnique({
      where: { id: noteId },
    });
  }

  /**
   * insertNote
   *
   * @param userId
   * @param insertNoteDto
   */
  insertNote(userId: number, insertNoteDto: InsertNoteDto) {
    return this.prismaService.note.create({
      data: {
        title: insertNoteDto.title,
        description: insertNoteDto.description,
        url: insertNoteDto.url,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        createdAt: true,
      },
    });
  }

  /**
   * updateNoteById
   *
   * @param noteId
   * @param updateNoteDto
   */
  async updateNoteById(noteId: number, updateNoteDto: InsertNoteDto) {
    const noteData = await this.prismaService.note.findUnique({
      where: { id: noteId },
    });
    if (!noteData) {
      throw new ForbiddenException('Note not found');
    }
    return this.prismaService.note.update({
      where: { id: noteId },
      data: {
        title: updateNoteDto.title,
        description: updateNoteDto.description,
        url: updateNoteDto.url,
      },
    });
  }

  /**
   * deleteNoteById
   *
   * @param noteId
   */
  async deleteNoteById(noteId: number) {
    const noteData = await this.prismaService.note.findUnique({
      where: { id: noteId },
    });
    if (!noteData) {
      throw new ForbiddenException('Note not found');
    }
    await this.prismaService.note.delete({ where: { id: noteId } });
    return this.prismaService.note.findMany();
  }
}
