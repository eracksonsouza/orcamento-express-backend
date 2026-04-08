import type { VehicleRepository, VehicleWithCustomer } from "@/src/domain/vehicle/application/repositories/vehicle-repository";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";
import type { PrismaClient } from "@prisma/client";
import prismaClient from "@/src/infra/database/prisma/client";
import { Vehicle } from "@/src/domain/vehicle/enterprise/entities/vehicle";
import { PrismaVehicleMapper } from "./mappers/vehicle-mapper";

export class PrismaVehicleRepository implements VehicleRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? prismaClient;
  }

  async save(vehicle: Vehicle): Promise<void> {
    const exists = await this.exists(vehicle.id.toString());

    if (exists) {
      await this.update(vehicle);
      return;
    }

    await this.create(vehicle);
  }

  async exists(id: string): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      select: { id: true },
    });
    return vehicle !== null;
  }

  async existsByLicensePlate(licensePlate: string): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { licensePlate },
      select: { id: true },
    });
    return vehicle !== null;
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    return vehicle ? PrismaVehicleMapper.toDomain(vehicle) : null;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { licensePlate },
    });
    return vehicle ? PrismaVehicleMapper.toDomain(vehicle) : null;
  }

  async findByCustomerId(customerId: string): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
    return PrismaVehicleMapper.toDomainList(vehicles);
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Vehicle>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.vehicle.count(),
    ]);

    return {
      data: PrismaVehicleMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async findAllWithCustomer(
    params?: PaginationParams,
  ): Promise<PaginatedResult<VehicleWithCustomer>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        include: { customer: { select: { name: true } } },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.vehicle.count(),
    ]);

    return {
      data: data.map((item) => ({
        vehicle: PrismaVehicleMapper.toDomain(item),
        customerName: item.customer.name,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async searchWithCustomer(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<VehicleWithCustomer>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const normalizedQuery = query.trim();
    const where = {
      OR: [
        { brand: { contains: normalizedQuery, mode: "insensitive" as const } },
        { model: { contains: normalizedQuery, mode: "insensitive" as const } },
        {
          licensePlate: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
        },
        {
          customer: {
            name: { contains: normalizedQuery, mode: "insensitive" as const },
          },
        },
      ],
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        where,
        include: { customer: { select: { name: true } } },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      data: data.map((item) => ({
        vehicle: PrismaVehicleMapper.toDomain(item),
        customerName: item.customer.name,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Vehicle>> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const normalizedQuery = query.trim();
    const where = {
      OR: [
        { brand: { contains: normalizedQuery, mode: "insensitive" as const } },
        { model: { contains: normalizedQuery, mode: "insensitive" as const } },
        {
          licensePlate: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      data: PrismaVehicleMapper.toDomainList(data),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({ where: { id } });
  }

  private async create(vehicle: Vehicle): Promise<void> {
    await this.prisma.vehicle.create({
      data: PrismaVehicleMapper.toPersistence(vehicle),
    });
  }

  private async update(vehicle: Vehicle): Promise<void> {
    await this.prisma.vehicle.update({
      where: { id: vehicle.id.toString() },
      data: PrismaVehicleMapper.toUpdatePersistence(vehicle),
    });
  }
}
