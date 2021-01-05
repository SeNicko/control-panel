import { LatLngExpression } from "leaflet";

// Convert api string position to useful array of floating point numbers
export const convertToLatLon = (pos: { Lat: string; Lon: string }): LatLngExpression => {
	const lat = parseFloat(pos.Lat);
	const lng = parseFloat(pos.Lon);
	return [lat, lng];
};
