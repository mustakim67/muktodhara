export const getRequiredResources = (status) => {
  switch (status) {
    case "RED":
      return {
        personnel: "2 Senior Engineers, 5 Drainage Cleaners, 1 Field Supervisor",
        equipment: "1 Heavy-duty Suction Truck, 2 Submersible Pumps, Safety Gear",
        urgency: "CRITICAL (Immediate Action Required)"
      };
    case "YELLOW":
      return {
        personnel: "1 Junior Engineer, 2 Maintenance Staff",
        equipment: "Manual De-clogging Tools, Portable Pump",
        urgency: "HIGH (Action within 4 hours)"
      };
    default:
      return { personnel: "None", equipment: "None", urgency: "Normal" };
  }
};