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
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
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
        name: "New Customer",
        email: "newcustomer@example.com",
        phone: "11999999999",
      }),
    ).rejects.toThrow(PhoneAlreadyInUseError);
  });
});
