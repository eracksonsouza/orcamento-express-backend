import type { PrismaClient } from "@prisma/client";

export interface OverviewResult {
  quotes: {
    byStatus: Record<string, number>;
    total: number;
  };
  revenue: {
    total: string;
    subtotal: string;
    discount: string;
    taxes: string;
    quotesReady: number;
  };
  customers: {
    total: number;
  };
  recentQuotes: Array<{
    id: string;
    status: string;
    total: string;
    version: number;
    createdAt: Date;
    customer: { id: string; name: string };
    vehicle: { id: string; brand: string; model: string; licensePlate: string } | null;
  }>;
}

export class GetOverviewUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(): Promise<OverviewResult> {
    const [statusCounts, revenueTotals, recentQuotes, customerCount] =
      await Promise.all([
        this.prisma.quote.groupBy({
          by: ["status"],
          _count: { id: true },
        }),

        this.prisma.quote.aggregate({
          where: { status: "READY" },
          _sum: { total: true, subtotal: true, discount: true, taxes: true },
          _count: { id: true },
        }),

        this.prisma.quote.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            customer: { select: { id: true, name: true } },
            vehicle: {
              select: {
                id: true,
                brand: true,
                model: true,
                licensePlate: true,
              },
            },
          },
        }),

        this.prisma.customer.count(),
      ]);

    const byStatus = Object.fromEntries(
      statusCounts.map((s) => [s.status, s._count.id]),
    );

    return {
      quotes: {
        byStatus,
        total: statusCounts.reduce((acc, s) => acc + s._count.id, 0),
      },
      revenue: {
        total: (revenueTotals._sum.total ?? 0).toString(),
        subtotal: (revenueTotals._sum.subtotal ?? 0).toString(),
        discount: (revenueTotals._sum.discount ?? 0).toString(),
        taxes: (revenueTotals._sum.taxes ?? 0).toString(),
        quotesReady: revenueTotals._count.id,
      },
      customers: {
        total: customerCount,
      },
      recentQuotes: recentQuotes.map((q) => ({
        id: q.id,
        status: q.status,
        total: q.total.toString(),
        version: q.version,
        createdAt: q.createdAt,
        customer: q.customer,
        vehicle: q.vehicle,
      })),
    };
  }
}
