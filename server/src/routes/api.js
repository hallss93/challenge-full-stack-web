import express from "express";
import validate from "express-validation";

import * as studentController from "../controllers/student/student.controller";
import * as studentValidator from "../controllers/student/student.validator";

const router = express.Router();

router.get(
  "/",
  validate(studentValidator.getAllStudents),
  studentController.allStudents
);
router.get(
  "/:ra",
  validate(studentValidator.getStudent),
  studentController.getOneStudent
);

module.exports = router;
