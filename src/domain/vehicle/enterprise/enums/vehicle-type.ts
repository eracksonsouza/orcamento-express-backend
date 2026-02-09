export const VehicleType = {
  CAR: "CAR",
  MOTORCYCLE: "MOTORCYCLE",
  TRUCK: "TRUCK",
  VAN: "VAN",
  SUV: "SUV",
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export function isValidVehicleType(value: string): value is VehicleType {
  return Object.values(VehicleType).includes(value as VehicleType);
}

export function getVehicleTypeLabel(type: VehicleType): string {
  const labels: Record<VehicleType, string> = {
    [VehicleType.CAR]: "Carro",
    [VehicleType.MOTORCYCLE]: "Moto",
    [VehicleType.TRUCK]: "Caminhão",
    [VehicleType.VAN]: "Van",
    [VehicleType.SUV]: "SUV",
  };

  return labels[type];
}
