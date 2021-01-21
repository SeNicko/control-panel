const degToRad = (deg: number) => deg * (Math.PI / 180);

export const getDistance = (
  fCords: [number, number],
  sCords: [number, number]
) => {
  const radius = 6371;
  const dLat = degToRad(sCords[0] - fCords[0]);
  const dLon = degToRad(sCords[1] - fCords[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(fCords[0])) *
      Math.cos(degToRad(sCords[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * c;

  return Math.round(distance * 10) / 10;
};
