const express = require("express");
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  updateEmployeePermissions,
  deleteEmployee,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes are protected and restricted to Admin
router.use(protect);
router.use(admin);

router.route("/employees")
  .get(getEmployees)
  .post(addEmployee);

router.route("/employees/:id")
  .delete(deleteEmployee);

router.route("/employees/:id/permissions")
  .put(updateEmployeePermissions);

module.exports = router;
