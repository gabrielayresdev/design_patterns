import { GeocodingProvider } from "../types/geocoding-provider";

export class InMemoryGeocodingProvider implements GeocodingProvider {
  async getAddressFromCep(cep: string) {
    return {
      lat: -22.8624546,
      lng: -43.2240407,
      formatted_address:
        "Cidade Universitária, Rio de Janeiro - State of Rio de Janeiro, 21941-901, Brazil",
    };
  }
}
