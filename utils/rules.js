export function calculateFuelCost(distanceKm, trafficLevel) {
    let baseCost = 5 * distanceKm;
    if (trafficLevel === "High") {
        baseCost += 2 * distanceKm;
    }
    return baseCost;
}

export function applyLateDeliveryPenalty(actualMinutes, scheduledMinutes) {
    return actualMinutes > scheduledMinutes + 10 ? 50 : 0;
}

export function applyDriverFatigue(hoursWorked) {
    return hoursWorked > 8 ? 0.7 : 1; // 30% speed decrease
}

export function applyHighValueBonus(orderValue, deliveredOnTime) {
    return (orderValue >= 1000 && deliveredOnTime) ? (orderValue * 0.1) : 0;
}

export function calculateEfficiency(onTime, total) {
    return total > 0 ? (onTime / total) * 100 : 0;
}
