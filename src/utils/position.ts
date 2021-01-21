// Convert api string position to useful array of floating point numbers
export const convertToLatLon = (pos: {
  Lat: string;
  Lon: string;
}): [number, number] => {
  const lat = parseFloat(pos.Lat);
  const lng = parseFloat(pos.Lon);
  return [lat, lng];
};
