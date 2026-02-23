import type { QuoteRepository } from "../repositories/quote-repository";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { VehicleRepository } from "@/src/domain/vehicle/application/repositories/vehicle-repository";
import { VehicleNotFoundError } from "@/src/domain/vehicle/enterprise/errors/vehicle-not-found-error";

interface AssignVehicleToQuoteRequest {
  quoteId: string;
  vehicleId: string;
}

interface AssignVehicleToQuoteResponse {
  quoteId: string;
  vehicleId: string;
}

export class AssignVehicleToQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private vehicleRepository: VehicleRepository,
  ) {}

  async execute({
    quoteId,
    vehicleId,
  }: AssignVehicleToQuoteRequest): Promise<AssignVehicleToQuoteResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    const customerVehicles = await this.vehicleRepository.findByCustomerId(
      quote.customerId,
    );

    const belongsToQuoteCustomer = customerVehicles.some(
      (item) => item.id.toString() === vehicle.id.toString(),
    );

    if (!belongsToQuoteCustomer) {
      throw new Error("Vehicle does not belong to quote customer");
    }

    quote.assignVehicle(vehicle.id.toString(), quote.customerId);
    await this.quoteRepository.save(quote);

    return {
      quoteId: quote.id.toString(),
      vehicleId: vehicle.id.toString(),
    };
  }
}
