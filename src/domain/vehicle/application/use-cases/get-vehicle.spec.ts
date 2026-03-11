import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { GetVehicleUseCase } from "./get-vehicle";
import { CreateVehicleUseCase } from "./create-vehicle";
import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";
import { VehicleType } from "../../enterprise/enums/vehicle-type";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let createVehicle: CreateVehicleUseCase;
let sut: GetVehicleUseCase;

describe("Get Vehicle", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository);
    sut = new GetVehicleUseCase(inMemoryVehicleRepository);
  });

  test("should be able to get a vehicle by id", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-123",
      customerId: "customer-123",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: VehicleType.CAR,
    });

    const { vehicle } = await sut.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    expect(vehicle.id).toEqual(createdVehicle.id);
    expect(vehicle.brand).toBe("Toyota");
    expect(vehicle.model).toBe("Corolla");
    expect(vehicle.year).toBe(2023);
    expect(vehicle.licensePlate.value).toBe("ABC1234");
    expect(vehicle.type).toBe(VehicleType.CAR);
  });

  test("should throw when vehicle does not exist", async () => {
    await expect(
      sut.execute({
        vehicleId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(VehicleNotFoundError);
  });
});
