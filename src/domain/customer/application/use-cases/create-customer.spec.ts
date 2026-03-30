import { InMemoryCustomerRepository } from "@/src/test/repositories/in-memory-customer-repository";
import { CreateCustomerUseCase } from "./create-customer";
import { EmailAlreadyInUseError } from "../../enterprise/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "../../enterprise/errors/phone-already-in-use-error";
import { makeCustomer } from "@/src/test/factories/make-customer";

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CreateCustomerUseCase;

describe("Create Customer", () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CreateCustomerUseCase(inMemoryCustomerRepository);
  });

  test("should be able create a customer", async () => {
    const { customer } = await sut.execute({
      customerId: "123",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    });

    expect(customer.id).toBeTruthy();
    expect(inMemoryCustomerRepository.items[0]?.id).toEqual(customer.id);
  });

  test("should not create customer with duplicate email", async () => {
    const existingCustomer = makeCustomer({
      email: "duplicate@example.com",
    });
    await inMemoryCustomerRepository.save(existingCustomer);

    await expect(
      sut.execute({
        customerId: "new-customer-id",
        name: "New Customer",
        email: "duplicate@example.com",
        phone: "11999999999",
      }),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });

  test("should not create customer with duplicate phone", async () => {
    const existingCustomer = makeCustomer({
      phone: "11999999999",
    });
    await inMemoryCustomerRepository.save(existingCustomer);

    await expect(
      sut.execute({
        customerId: "new-customer-id",
        name: "New Customer",
        email: "newcustomer@example.com",
        phone: "11999999999",
      }),
    ).rejects.toThrow(PhoneAlreadyInUseError);
  });

  test("should allow same customer to update without triggering duplicate validation", async () => {
    const existingCustomer = makeCustomer({
      email: "customer@example.com",
      phone: "11999999999",
    });
    await inMemoryCustomerRepository.save(existingCustomer);

    // Same customer ID updating their own data should work
    const { customer } = await sut.execute({
      customerId: existingCustomer.id.toString(),
      name: "Updated Name",
      email: "customer@example.com",
      phone: "11999999999",
    });

    expect(customer.name).toBe("Updated Name");
  });
});
