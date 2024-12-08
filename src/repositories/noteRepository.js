const Note = require("../sequelize/models").Note;

class NoteRepository {
  constructor() {
    try {
      if (!Note) {
        throw new Error("Missing dependencies in NoteRepository");
      }
    } catch (error) {
      console.error("Error initializing NoteRepository:", error);
      throw error;
    }
  }

  async findByPk(id) {
    try {
      return await Note.findByPk(id);
    } catch (error) {
      throw new Error("Error fetching note");
    }
  }
  async getAllNotes({ page = 1, pageSize = 10, title = "" } = {}) {
    try {
      const offset = (page - 1) * pageSize;
      const where = title ? { title: { [Op.like]: `%${title}%` } } : {};
      return await Note.findAndCountAll({
        where,
        limit: pageSize,
        offset,
      });
    } catch (error) {
      throw new Error("Error fetching notes");
    }
  }

  async getActiveNotes() {
    try {
      return await Note.findAll({ where: { archived: false } });
    } catch (error) {
      throw new Error("Error fetching active notes");
    }
  }

  async getArchivedNotes() {
    try {
      return await Note.findAll({ where: { archived: true } });
    } catch (error) {
      throw new Error("Error fetching archived notes");
    }
  }

  async createNote(noteData) {
    console.log("🚀 ~ NoteRepository ~ createNote ~ noteData:", noteData);
    try {
      return await Note.create(noteData);
    } catch (error) {
      throw new Error("Error creating note");
    }
  }

  async updateNote(id, noteData) {
    try {
      const [updated] = await Note.update(noteData, { where: { id } });
      if (updated) {
        return await Note.findByPk(id);
      }
      throw new Error("Note not found");
    } catch (error) {
      throw new Error("Error updating note");
    }
  }

  async deleteNote(id) {
    try {
      const deleted = await Note.destroy({ where: { id } });
      if (deleted) {
        return true;
      }
      throw new Error("Note not found");
    } catch (error) {
      throw new Error("Error deleting note");
    }
  }

  async archiveNote(id) {
    try {
      const [updated] = await Note.update(
        { archived: true },
        { where: { id } }
      );
      if (updated) {
        return await Note.findByPk(id);
      }
      throw new Error("Note not found");
    } catch (error) {
      throw new Error("Error archiving note");
    }
  }

  async unarchiveNote(id) {
    try {
      const [updated] = await Note.update(
        { archived: false },
        { where: { id } }
      );
      if (updated) {
        return await Note.findByPk(id);
      }
      throw new Error("Note not found");
    } catch (error) {
      throw new Error("Error unarchiving note");
    }
  }
}

module.exports = NoteRepository;
