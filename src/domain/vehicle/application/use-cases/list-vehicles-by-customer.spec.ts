import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { VehicleType } from "../../enterprise/enums/vehicle-type";
import { CreateVehicleUseCase } from "./create-vehicle";
import { ListVehiclesByCustomerUseCase } from "./list-vehicles-by-customer";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let createVehicle: CreateVehicleUseCase;
let sut: ListVehiclesByCustomerUseCase;

describe("List Vehicles By Customer", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository);
    sut = new ListVehiclesByCustomerUseCase(inMemoryVehicleRepository);
  });

  test("should be able to list vehicles by customer id", async () => {
    const customerId = "customer-123";

    const { vehicle: vehicleOne } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: VehicleType.CAR,
    });

    const { vehicle: vehicleTwo } = await createVehicle.execute({
      vehicleId: "vehicle-2",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      licensePlate: "DEF5678",
      type: VehicleType.CAR,
    });

    const { vehicle: otherCustomerVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-3",
      brand: "Yamaha",
      model: "Fazer",
      year: 2021,
      licensePlate: "GHI9012",
      type: VehicleType.MOTORCYCLE,
    });

    inMemoryVehicleRepository.attachVehicleToCustomer(
      customerId,
      vehicleOne.id.toString(),
    );
    inMemoryVehicleRepository.attachVehicleToCustomer(
      customerId,
      vehicleTwo.id.toString(),
    );
    inMemoryVehicleRepository.attachVehicleToCustomer(
      "customer-999",
      otherCustomerVehicle.id.toString(),
    );

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
    const result = await sut.execute({ customerId: "customer-without-vehicles" });

    expect(result.vehicles).toHaveLength(0);
  });
});
