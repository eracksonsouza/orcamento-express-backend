import { InMemoryVehicleRepository } from "@/src/test/repositories/in-memory-vehicle-repository";
import { GetVehicleUseCase } from "./get-vehicle";
import { UpdateVehicleUseCase } from "./update-vehicle";
import { CreateVehicleUseCase } from "./create-vehicle";
import { VehicleNotFoundError } from "../../enterprise/errors/vehicle-not-found-error";

let inMemoryVehicleRepository: InMemoryVehicleRepository;
let createVehicle: CreateVehicleUseCase;
let updateVehicle: UpdateVehicleUseCase;
let getVehicle: GetVehicleUseCase;

describe("Update Vehicle", () => {
  beforeEach(() => {
    inMemoryVehicleRepository = new InMemoryVehicleRepository();
    createVehicle = new CreateVehicleUseCase(inMemoryVehicleRepository);
    updateVehicle = new UpdateVehicleUseCase(inMemoryVehicleRepository);
    getVehicle = new GetVehicleUseCase(inMemoryVehicleRepository);
  });

  test("should be able to update a vehicle", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: "CAR",
    });

    await createVehicle.execute({
      vehicleId: "vehicle-2",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      licensePlate: "XYZ5678",
      type: "CAR",
    });

    const response = await updateVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
      brand: "Toyota",
      model: "Yaris",
      year: 2024,
      licensePlate: "BRA2E19",
      type: "MOTORCYCLE",
    });

    const { vehicle: updatedVehicle } = await getVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    expect(response.vehicleId).toBe(createdVehicle.id.toString());
    expect(updatedVehicle.brand).toBe("Toyota");
    expect(updatedVehicle.model).toBe("Yaris");
    expect(updatedVehicle.year).toBe(2024);
    expect(updatedVehicle.licensePlate.toString()).toBe("BRA2E19");
    expect(updatedVehicle.type).toBe("MOTORCYCLE");
  });

  test("should throw when vehicle does not exist", async () => {
    await expect(
      updateVehicle.execute({
        vehicleId: "non-existent-vehicle-id",
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        licensePlate: "ABC1234",
        type: "CAR",
      }),
    ).rejects.toBeInstanceOf(VehicleNotFoundError);
  });

  test("should be able to update only provided fields", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: "CAR",
    });

    await updateVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
      brand: "Honda",
    });

    const { vehicle: updatedVehicle } = await getVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    expect(updatedVehicle.brand).toBe("Honda");
    expect(updatedVehicle.model).toBe("Corolla");
    expect(updatedVehicle.year).toBe(2023);
    expect(updatedVehicle.licensePlate.toString()).toBe("ABC1234");
    expect(updatedVehicle.type).toBe("CAR");
  });

  test("should update type of vehicle", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: "CAR",
    });

    await updateVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
      type: "MOTORCYCLE",
    });

    const { vehicle: updatedVehicle } = await getVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    expect(updatedVehicle.type).toBe("MOTORCYCLE");
  });

  test("should update updatedAt when vehicle is updated", async () => {
    const { vehicle: createdVehicle } = await createVehicle.execute({
      vehicleId: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      licensePlate: "ABC1234",
      type: "CAR",
    });

    const { vehicle: vehicleBeforeUpdate } = await getVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    const beforeUpdatedAt = vehicleBeforeUpdate.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 5));

    await updateVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
      model: "Yaris",
    });

    const { vehicle: vehicleAfterUpdate } = await getVehicle.execute({
      vehicleId: createdVehicle.id.toString(),
    });

    const afterUpdatedAt = vehicleAfterUpdate.updatedAt.getTime();

    expect(afterUpdatedAt).toBeGreaterThan(beforeUpdatedAt);
  });
});
