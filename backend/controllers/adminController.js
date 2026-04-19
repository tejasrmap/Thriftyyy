const User = require("../models/User");

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a new employee
// @route   POST /api/admin/employees
// @access  Private/Admin
const addEmployee = async (req, res) => {
  try {
    const { fullName, email, password, permissions } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const employee = await User.create({
      fullName,
      email,
      password,
      role: "employee",
      permissions: permissions || {
        canManageInventory: true,
        canSeeRevenue: false,
        canManageBookings: true
      }
    });

    if (employee) {
      res.status(201).json({
        _id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
        permissions: employee.permissions
      });
    } else {
      res.status(400).json({ message: "Invalid employee data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update employee permissions
// @route   PUT /api/admin/employees/:id/permissions
// @access  Private/Admin
const updateEmployeePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const employee = await User.findById(req.params.id);

    if (employee && employee.role === "employee") {
      employee.permissions = { ...employee.permissions, ...permissions };
      const updatedEmployee = await employee.save();
      res.json({
        _id: updatedEmployee.id,
        fullName: updatedEmployee.fullName,
        permissions: updatedEmployee.permissions
      });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && (user.role === "employee" || user.role === "user")) {
      await user.deleteOne();
      res.json({ message: "Staff member removed" });
    } else {
      res.status(404).json({ message: "Staff member not found or protected" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployeePermissions,
  deleteEmployee,
};
