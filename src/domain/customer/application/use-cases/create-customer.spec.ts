import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "./create-customer";

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CreateCustomerUseCase;

describe("Create Quetion", () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CreateCustomerUseCase(inMemoryCustomerRepository);
  });

  test("should be able create a customer", async () => {

    const { customer } = await sut.execute({
      customerId: "123",
      nome: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    });

    expect(customer.id).toBeTruthy();
    expect(inMemoryCustomerRepository.items[0]?.id).toEqual(customer.id);
  });
});
