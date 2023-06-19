const { getCourses, getCoursesById, getCourseCategories } = require("../../controllers/courses.controllers");

const coursesRouter = require("express").Router();

coursesRouter.route("/").get(getCourses);
coursesRouter.route("/:_id").get(getCoursesById);
coursesRouter.route("/categories").get(getCourseCategories);

module.exports = coursesRouter;
