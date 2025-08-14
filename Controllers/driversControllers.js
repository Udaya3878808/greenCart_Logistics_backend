import Driver from "../Models/drivers.js";

// getAll
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getdriver

export const getAllDriversById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create
export const createDriver = async (req, res) => {
  try {
    const { name, currentShiftHours, pastWeekHours } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is requried" });
    }
    const driver = await Driver.create({
      name,
      currentShiftHours,
      pastWeekHours,
    });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update

export const updateDriver = async (req, res) => {
  try {
    let updateData = req.body;
    if (typeof req.body === "string") {
      updateData = { assignedRoute: req.body }; // wrap string into object
    }
    const driver = await Driver.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!driver)
      return res
        .status(404)
        .json({ message: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver)
      return res
        .status(404)
        .json({ message: "Driver not found" });
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
