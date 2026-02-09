import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";
import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "./create-customer";
import { GetCustomerUseCase } from "./get-customer";

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let createCustomer: CreateCustomerUseCase;
let sut: GetCustomerUseCase;

describe("Get Customer", () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    createCustomer = new CreateCustomerUseCase(inMemoryCustomerRepository);
    sut = new GetCustomerUseCase(inMemoryCustomerRepository);
  });

  test("should be able to get a customer by id", async () => {
    const { customer: createdCustomer } = await createCustomer.execute({
      customerId: "123",
      nome: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    });

    const { customer } = await sut.execute({
      customerId: createdCustomer.id.toString(),
    });

    expect(customer.id).toEqual(createdCustomer.id);
  });

  test("should throw when customer does not exist", async () => {
    await expect(
      sut.execute({
        customerId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(CustomerNotFoundError);
  });
});
