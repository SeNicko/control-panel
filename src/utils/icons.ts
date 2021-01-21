export const staticIcons = new Map<string, string>([
  ["Type-Car", "taxi"],
  ["Type-BaseStation", "domain"],
  ["Type-Portable", "devices"],
  ["WorkingMode-Voice", "account-voice"],
  ["WorkingMode-Data", "database-export-outline"],
  ["WorkingMode-Idle", "sleep"],
]);

export const getBatteryIcon = (percentage: number): string => {
  percentage = Math.round(percentage / 10) * 10;
  if (percentage >= 100) return "battery";
  else if (percentage <= 0) return "battery-outline";
  else return `battery-${Math.round(percentage / 10) * 10}`;
};

export const getSignalIcon = (strength: number): string => {
  strength = Math.round(strength / 2.5);
  if (strength <= 0) return `network-strength-outline`;
  if (strength >= 10) return "network-strength-10";
  else return `network-strength-${strength}`;
};
