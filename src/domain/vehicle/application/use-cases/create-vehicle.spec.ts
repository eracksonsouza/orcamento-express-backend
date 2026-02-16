import { CreateVehicleUseCase } from "./create-vehicle";
import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { VehicleType } from "../../enterprise/enums/vehicle-type";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let sut: CreateVehicleUseCase;

describe("Create Vehicle", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    sut = new CreateVehicleUseCase(inMemoryVehicleRepository);
  });

  test("should be able create a vehicle", async () => {
    const { vehicle } = await sut.execute({
      vehicleId: "vehicle-123",
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
});
