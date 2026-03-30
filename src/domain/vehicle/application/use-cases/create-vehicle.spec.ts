import { CreateVehicleUseCase } from "./create-vehicle";
import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { makeCustomer } from "@/src/test/factories/make-customer";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { VehicleType } from "../../enterprise/enums/vehicle-type";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CreateVehicleUseCase;

describe("Create Vehicle", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CreateVehicleUseCase(inMemoryVehicleRepository, inMemoryCustomerRepository);
  });

  test("should be able create a vehicle", async () => {
    const customer = makeCustomer({}, new UniqueEntityId("customer-123"));
    await inMemoryCustomerRepository.save(customer);

    const { vehicle } = await sut.execute({
      vehicleId: "vehicle-123",
      customerId: "customer-123",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: VehicleType.CAR,
    });

    expect(vehicle.id).toBeTruthy();
    expect(inMemoryVehicleRepository.items[0]?.id).toEqual(vehicle.id);
    expect(vehicle.brand).toBe("Toyota");
    expect(vehicle.model).toBe("Corolla");
    expect(vehicle.year).toBe(2023);
    expect(vehicle.licensePlate.value).toBe("ABC1234");
    expect(vehicle.type).toBe(VehicleType.CAR);
  });

  test("should not be able to create a vehicle for a non-existent customer", async () => {
    await expect(
      sut.execute({
        vehicleId: "vehicle-123",
        customerId: "non-existent-customer",
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        licensePlate: "ABC1234",
        type: VehicleType.CAR,
      }),
    ).rejects.toThrow(CustomerNotFoundError);
  });
});
