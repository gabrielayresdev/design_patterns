import { env } from "@/env/config";
import { GeocodingProvider } from "./types/geocoding-provider";
import z from "zod";

const address_schema = z.object({
  results: z.array(
    z.object({
      formatted_address: z.string(),
      geometry: z.object({
        location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      }),
    }),
  ),
  status: z.literal("OK"),
});

export class GoogleMapsGeocodingProvider implements GeocodingProvider {
  async getAddressFromCep(cep: string) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${cep},Brasil&key=${env.GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();

    const parsed_data = address_schema.safeParse(data);

    if (!parsed_data.success || parsed_data.data.results.length === 0) {
      throw new Error("Invalid address data.");
    }

    return {
      lat: parsed_data.data.results[0].geometry.location.lat,
      lng: parsed_data.data.results[0].geometry.location.lng,
      formatted_address: parsed_data.data.results[0].formatted_address,
    };
  }
}
