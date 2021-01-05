export interface Radio {
	Id: number;
	Name: string;
	Type: string;
	SerialNumber: string;
	Strength: number;
	BatteryLevel: number;
	WorkingMode: string;
	Position: {
		Lat: string;
		Lon: string;
	};
}
