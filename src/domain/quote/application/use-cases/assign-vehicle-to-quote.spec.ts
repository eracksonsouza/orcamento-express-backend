import { InMemoryQuoteRepository } from "@/src/test/repositories/in-memory-quote-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { makeCustomer } from "@/src/test/factories/make-customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { CreateQuoteUseCase } from "./create-quote";
import { GetQuoteUseCase } from "./get-quote";
import { CreateVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/create-vehicle";
import { VehicleType } from "@/src/domain/vehicle/enterprise/enums/vehicle-type";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import { VehicleNotFoundError } from "@/src/domain/vehicle/enterprise/errors/vehicle-not-found-error";
import { AssignVehicleToQuoteUseCase } from "./assign-vehicle-to-quote";

let inMemoryQuoteRepository: InMemoryQuoteRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let inMemoryVehicleRepository: InMemoryVehicleRepository;
let createQuote: CreateQuoteUseCase;
let getQuote: GetQuoteUseCase;
let createVehicle: CreateVehicleUseCase;
let sut: AssignVehicleToQuoteUseCase;

describe("Assign Vehicle To Quote", () => {
  beforeEach(async () => {
    inMemoryQuoteRepository = new InMemoryQuoteRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    inMemoryVehicleRepository = new InMemoryVehicleRepository();

    createQuote = new CreateQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryCustomerRepository,
    );
    getQuote = new GetQuoteUseCase(inMemoryQuoteRepository);
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository, inMemoryCustomerRepository);
    sut = new AssignVehicleToQuoteUseCase(
      inMemoryQuoteRepository,
      inMemoryVehicleRepository,
    );

    await inMemoryCustomerRepository.save(
      makeCustomer({ name: "John Doe", email: "john@example.com", phone: "11111111111" }, new UniqueEntityId("customer-123")),
    );
    await inMemoryCustomerRepository.save(
      makeCustomer({ name: "Jane Doe", email: "jane@example.com", phone: "22222222222" }, new UniqueEntityId("customer-456")),
    );
  });

  test("should be able to assign a vehicle to quote when vehicle belongs to quote customer", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    const { vehicle } = await createVehicle.execute({
      vehicleId: "vehicle-123",
      customerId: "customer-123",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: VehicleType.CAR,
    });

    const response = await sut.execute({
      quoteId: quote.id.toString(),
      vehicleId: vehicle.id.toString(),
    });

    const { quote: updatedQuote } = await getQuote.execute({
      quoteId: quote.id.toString(),
    });

    expect(response.quoteId).toBe(quote.id.toString());
    expect(response.vehicleId).toBe(vehicle.id.toString());
    expect(updatedQuote.vehicleId).toBe(vehicle.id.toString());
  });

  test("should throw when quote does not exist", async () => {
    await expect(
      sut.execute({
        quoteId: "non-existent-quote",
        vehicleId: "vehicle-123",
      }),
    ).rejects.toBeInstanceOf(QuoteNotFoundError);
  });

  test("should throw when vehicle does not exist", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    await expect(
      sut.execute({
        quoteId: quote.id.toString(),
        vehicleId: "non-existent-vehicle",
      }),
    ).rejects.toBeInstanceOf(VehicleNotFoundError);
  });

  test("should throw when vehicle does not belong to quote customer", async () => {
    const { quote } = await createQuote.execute({
      customerId: "customer-123",
    });

    const { vehicle } = await createVehicle.execute({
      vehicleId: "vehicle-999",
      customerId: "customer-456",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      licensePlate: "XYZ9876",
      type: VehicleType.CAR,
    });

    await expect(
      sut.execute({
        quoteId: quote.id.toString(),
        vehicleId: vehicle.id.toString(),
      }),
    ).rejects.toThrow("Vehicle does not belong to quote customer");
  });
});
