import { Student } from "../../models";
import { Op } from "sequelize";
import { successResponse, errorResponse } from "../../helpers";

export const allStudents = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "name";
    const sortDesc = req.query.sortDesc || true;
    const limit = Number(req.query.limit) || 10;
    let where = {};
    if (query.trim() != "") {
      where = {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            ra: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            cpf: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      };
    }
    const students = await Student.findAndCountAll({
      order: [[sortBy, sortDesc ? "DESC" : "ASC"]],
      offset: (page - 1) * limit,
      limit,
      where,
    });
    return successResponse(req, res, { students });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
