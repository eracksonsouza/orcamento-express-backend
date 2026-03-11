import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { DeleteVehicleUseCase } from "./delete-vehicle";
import { CreateVehicleUseCase } from "./create-vehicle";
import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let deleteVehicle: DeleteVehicleUseCase;
let createVehicle: CreateVehicleUseCase;

describe("Delete Vehicle", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository);
    deleteVehicle = new DeleteVehicleUseCase(inMemoryVehicleRepository);
  });

  test("should be able to delete a vehicle", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-123",
      customerId: "customer-123",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: "CAR",
    });

    const response = await deleteVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    const deletedVehicle = await inMemoryVehicleRepository.findById(
      createdVehicle.id.toString(),
    );

    expect(response.vehicleId).toBe(createdVehicle.id.toString());
    expect(deletedVehicle).toBeNull();
  });

  test("should throw when vehicle does not exist", async () => {
    await expect(
      deleteVehicle.execute({
        vehicleId: "non-existing-vehicle-id",
      }),
    ).rejects.toBeInstanceOf(VehicleNotFoundError);
  });
});
