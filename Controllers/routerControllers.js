import Route from "../Models/route.js";

// getAll
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
// get
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create

export const createRoute = async (req, res) => {
  try {
    const { routeId, distanceKm, trafficLevel, baseTimeMinutes } = req.body;
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }
    const route = await Route.create({
      routeId,
      distanceKm,
      trafficLevel,
      baseTimeMinutes,
    });
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update

export const updateRoute = async (req, res) => {
  try {
    let updateData = req.body;
    if (typeof req.body === "string") {
      updateData = { name: req.body }; 
    }
    const route = await Route.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete

export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};
