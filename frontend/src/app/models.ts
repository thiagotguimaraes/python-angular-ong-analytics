export interface ProductionPoint {
	timestamp: string
	oil_rate: number
	pressure: number
	temperature: number
}

export interface Well {
	name: string
	collection: string
	latitude: number
	longitude: number
	id: number
}
