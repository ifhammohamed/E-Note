const NoteRepository = require("../repositories/noteRepository");
const Note = require("../sequelize/models").Note;
const { Op } = require("sequelize");

class NotesController {
  constructor() {
    try {
      this.NoteRepository = new NoteRepository();

      if (!this.NoteRepository) {
        throw new Error("Missing dependencies in NoteRepository Controller");
      }
    } catch (error) {
      console.error("Error initializing UserController:", error);
      throw error;
    }
  }

  async getNoteById(req, res) {
    try {
      const id = req.params.id;
      const note = await Note.findByPk(id);
      // const note = await Note.findByPk(id);
      if (note) {
        res.json({
          status: "success",
          message: "Note fetched successfully",
          data: note,
        });
      } else {
        res.status(404).json({ status: "error", message: "Note not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error fetching note", error });
    }
  }

  async getAllNotes(req, res) {
    try {
      const { page, limit, title, archived, categories, order } = req.query;
      const where = {};
      const orderBy =
        order && order.toLowerCase() === "desc"
          ? [["updatedAt", "DESC"]]
          : [["updatedAt", "ASC"]];

      if (title) {
        where.title = { [Op.like]: `%${title}%` };
      }

      if (archived !== undefined) {
        where.archived = archived === "true";
      }

      if (categories) {
        where.categories = { [Op.contains]: categories.split(",") };
      }

      if (categories && categories.toLowerCase() === "all") {
        delete where.categories;
      }

      let notes;
      if (page && limit) {
        const offset = (page - 1) * limit;
        notes = await Note.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: orderBy,
        });
      } else {
        notes = await Note.findAll({
          where,
          order: orderBy,
        });
      }

      res.json({
        status: "success",
        message: "Notes fetched successfully",
        data: notes.rows || notes,
        pagination:
          page && limit
            ? {
                total: notes.count,
                page: parseInt(page),
                limit: parseInt(limit),
              }
            : undefined,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error fetching notes", error });
    }
  }

  async getActiveNotes(req, res) {
    try {
      const notes = await Note.findAll({ where: { archived: false } });
      res.json({
        status: "success",
        message: "Active notes fetched successfully",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error fetching active notes",
        error,
      });
    }
  }

  async getArchivedNotes(req, res) {
    try {
      const notes = await Note.findAll({ where: { archived: true } });
      res.json({
        status: "success",
        message: "Archived notes fetched successfully",
        data: notes,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error fetching archived notes",
        error,
      });
    }
  }

  async createNote(req, res) {
    try {
      const noteData = req.body;
      const note = await Note.create(noteData);
      res.status(201).json({
        status: "success",
        message: "Note created successfully",
        data: note,
      });
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error creating note", error });
    }
  }

  async updateNote(req, res) {
    try {
      const id = req.params.id;
      const noteData = req.body;
      const [updated] = await Note.update(noteData, { where: { id } });

      if (updated) {
        const updatedNote = await Note.findByPk(id);
        res.json({
          status: "success",
          message: "Note updated successfully",
          data: updatedNote,
        });
      } else {
        res.status(404).json({ status: "error", message: "Note not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error updating note", error });
    }
  }

  async deleteNote(req, res) {
    try {
      const id = req.params.id;
      const deleted = await Note.destroy({ where: { id } });
      if (deleted) {
        res
          .status(204)
          .json({ status: "success", message: "Note deleted successfully" });
      } else {
        res.status(404).json({ status: "error", message: "Note not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error deleting note", error });
    }
  }

  async archiveNote(req, res) {
    try {
      const id = req.params.id;
      const [updated] = await Note.update(
        { archived: true },
        { where: { id } }
      );
      if (updated) {
        const updatedNote = await Note.findByPk(id);
        res.json({
          status: "success",
          message: "Note archived successfully",
          data: updatedNote,
        });
      } else {
        res.status(404).json({ status: "error", message: "Note not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error archiving note", error });
    }
  }

  async unarchiveNote(req, res) {
    try {
      const id = req.params.id;
      const [updated] = await Note.update(
        { archived: false },
        { where: { id } }
      );
      if (updated) {
        const updatedNote = await Note.findByPk(id);
        res.json({
          status: "success",
          message: "Note unarchived successfully",
          data: updatedNote,
        });
      } else {
        res.status(404).json({ status: "error", message: "Note not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error unarchiving note", error });
    }
  }
}

module.exports = NotesController;
