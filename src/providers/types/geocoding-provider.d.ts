export interface GeocodingProvider {
  getAddressFromCep: (cep: string) => Promise<{
    lat: number;
    lng: number;
    formatted_address: string;
  }>;
}
