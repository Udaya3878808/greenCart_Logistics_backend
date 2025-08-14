import Driver from "../Models/drivers.js";
import Route from "../Models/route.js";
import Order from "../Models/orders.js";

// Convert HH:MM string to minutes since midnight
function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Convert ISO timestamp to minutes since midnight
function timestampToMinutes(timestamp) {
  const date = new Date(timestamp);
  return date.getHours() * 60 + date.getMinutes();
}

// Calculate fuel cost based on traffic rules
function calcFuelCost(distanceKm, trafficLevel) {
  let costPerKm = 5;
  if (trafficLevel.toLowerCase() === "high") {
    costPerKm += 2;
  }
  return distanceKm * costPerKm;
}

// Main Simulation
export const runSimulation = async (req, res) => {
  
  try {
    const { availableDrivers, startTime, maxHoursPerDriver } = req.body;

    if (
      availableDrivers == null ||
      startTime == null ||
      maxHoursPerDriver == null
    ) {
      return res.status(400).json({
        message:
          "availableDrivers, startTime, and maxHoursPerDriver are required.",
      });
    }

    if (availableDrivers <= 0) {
      return res.status(400).json({
        message: "availableDrivers must be a positive number.",
      });
    }

    if (maxHoursPerDriver <= 0) {
      return res.status(400).json({
        message: "maxHoursPerDriver must be a positive number.",
      });
    }

    const drivers = await Driver.find().limit(availableDrivers);
    const routes = await Route.find();
    const orders = await Order.find().populate("assignedRoute");

    if (drivers.length < availableDrivers) {
      return res.status(400).json({
        error: "ValidationError",
        message: `Only ${drivers.length} drivers are available in the database.`,
      });
    }

    let totalProfit = 0;
    let totalFuelCost = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;

    const startMinutes = timeToMinutes(startTime);

    let driverIndex = 0;

    for (const order of orders) {
      const driver = drivers[driverIndex];
      const route = routes.find((r) => r._id.equals(order.assignedRoute._id));
      if (!route) continue;

      // Calculate speed factor based on hours worked
      let speedFactor = 1;
      if (driver.currentShiftHours > maxHoursPerDriver) {
        speedFactor = 0.7; // 30% slower if driver over max hours
      }

      // Calculate delivery duration adjusted for fatigue (in minutes)
      const deliveryTime = route.baseTimeMinutes / speedFactor;

      // Calculate actual delivery time (minutes since midnight)
      const actualDeliveryTime = startMinutes + deliveryTime;

      // Scheduled delivery time from order.deliveryTimestamp (minutes since midnight)
      const scheduledDeliveryTime = timestampToMinutes(order.deliveryTimestamp);

      // Late delivery penalty if actual delivery is more than 10 min late
      let penalty = 0;
      if (actualDeliveryTime > scheduledDeliveryTime + 10) {
        penalty = 50;
        lateDeliveries++;
      } else {
        onTimeDeliveries++;
      }

      // Bonus for high value order if no penalty
      let bonus = 0;
      if (order.valueRs > 1000 && penalty === 0) {
        bonus = order.valueRs * 0.1;
      }

      // Fuel cost calculation
      const fuelCost = calcFuelCost(route.distanceKm, route.trafficLevel);

      // Calculate profit
      const profit = order.valueRs + bonus - penalty - fuelCost;

      totalProfit += profit;
      totalFuelCost += fuelCost;

      // Update driver's worked hours
      driver.currentShiftHours =
        (driver.currentShiftHours || 0) + deliveryTime / 60;

      // Next driver (round robin)
      driverIndex = (driverIndex + 1) % drivers.length;
    }

    // Efficiency score
    const efficiency = orders.length
      ? (onTimeDeliveries / orders.length) * 100
      : 0;

    return res.json({
      totalProfit: totalProfit.toFixed(2),
      efficiency: efficiency.toFixed(2),
      onTimeDeliveries,
      lateDeliveries,
      totalFuelCost: totalFuelCost.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
