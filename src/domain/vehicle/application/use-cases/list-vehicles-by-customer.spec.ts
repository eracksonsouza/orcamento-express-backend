import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { makeCustomer } from "@/src/test/factories/make-customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { VehicleType } from "../../enterprise/enums/vehicle-type";
import { CreateVehicleUseCase } from "./create-vehicle";
import { ListVehiclesByCustomerUseCase } from "./list-vehicles-by-customer";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createVehicle: CreateVehicleUseCase;
let sut: ListVehiclesByCustomerUseCase;

describe("List Vehicles By Customer", () => {
  beforeEach(async () => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository, inMemoryCustomerRepository);
    sut = new ListVehiclesByCustomerUseCase(inMemoryVehicleRepository);
    await inMemoryCustomerRepository.save(makeCustomer({}, new UniqueEntityId("customer-123")));
    await inMemoryCustomerRepository.save(makeCustomer({}, new UniqueEntityId("customer-999")));
  });

  test("should be able to list vehicles by customer id", async () => {
    const customerId = "customer-123";

    const { vehicle: vehicleOne } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      customerId,
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: VehicleType.CAR,
    });

    const { vehicle: vehicleTwo } = await createVehicle.execute({
      vehicleId: "vehicle-2",
      customerId,
      brand: "Honda",
      model: "Civic",
      year: 2022,
      licensePlate: "DEF5678",
      type: VehicleType.CAR,
    });

    const { vehicle: otherCustomerVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-3",
      customerId: "customer-999",
      brand: "Yamaha",
      model: "Fazer",
      year: 2021,
      licensePlate: "GHI9012",
      type: VehicleType.MOTORCYCLE,
    });

    const result = await sut.execute({ customerId });

    expect(result.vehicles).toHaveLength(2);
    expect(
      result.vehicles.some((vehicle) => vehicle.id.equals(vehicleOne.id)),
    ).toBe(true);
    expect(
      result.vehicles.some((vehicle) => vehicle.id.equals(vehicleTwo.id)),
    ).toBe(true);
  });

  test("should return empty list when customer has no vehicles", async () => {
    const result = await sut.execute({
      customerId: "customer-without-vehicles",
    });

    expect(result.vehicles).toHaveLength(0);
  });
});
