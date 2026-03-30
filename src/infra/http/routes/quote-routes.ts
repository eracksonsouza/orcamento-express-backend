import type { FastifyInstance } from "fastify";
import { CreateQuoteController } from "../controllers/quote/create-quote-controller";
import { GetQuoteController } from "../controllers/quote/get-quote-controller";
import { ListQuotesController } from "../controllers/quote/list-quotes-controller";
import { AddQuoteItemController } from "../controllers/quote/add-quote-item-controller";
import { RemoveQuoteItemController } from "../controllers/quote/remove-quote-item-controller";
import { UpdateQuoteItemController } from "../controllers/quote/update-quote-item-controller";
import { UpdateQuoteCommercialTermsController } from "../controllers/quote/update-quote-commercial-terms-controller";
import { SubmitQuoteController } from "../controllers/quote/submit-quote-controller";
import { CreateNewQuoteVersionController } from "../controllers/quote/create-new-quote-version-controller";
import { makeCreateQuoteUseCase } from "../factories/make-create-quote-use-case";
import { makeGetQuoteUseCase } from "../factories/make-get-quote-use-case";
import { makeListQuotesUseCase } from "../factories/make-list-quotes-use-case";
import { makeAddQuoteItemUseCase } from "../factories/make-add-quote-item-use-case";
import { makeRemoveQuoteItemUseCase } from "../factories/make-remove-quote-item-use-case";
import { makeUpdateQuoteItemUseCase } from "../factories/make-update-quote-item-use-case";
import { makeUpdateQuoteCommercialTermsUseCase } from "../factories/make-update-quote-commercial-terms-use-case";
import { makeSubmitQuoteUseCase } from "../factories/make-submit-quote-use-case";
import { makeCreateNewQuoteVersionUseCase } from "../factories/make-create-new-quote-version-use-case";

export async function quoteRoutes(app: FastifyInstance) {
  const createQuoteController = new CreateQuoteController(
    makeCreateQuoteUseCase(),
  );
  const getQuoteController = new GetQuoteController(makeGetQuoteUseCase());
  const listQuotesController = new ListQuotesController(
    makeListQuotesUseCase(),
  );
  const addQuoteItemController = new AddQuoteItemController(
    makeAddQuoteItemUseCase(),
  );
  const removeQuoteItemController = new RemoveQuoteItemController(
    makeRemoveQuoteItemUseCase(),
  );
  const updateQuoteItemController = new UpdateQuoteItemController(
    makeUpdateQuoteItemUseCase(),
  );
  const updateQuoteCommercialTermsController =
    new UpdateQuoteCommercialTermsController(
      makeUpdateQuoteCommercialTermsUseCase(),
    );
  const submitQuoteController = new SubmitQuoteController(
    makeSubmitQuoteUseCase(),
  );
  const createNewQuoteVersionController = new CreateNewQuoteVersionController(
    makeCreateNewQuoteVersionUseCase(),
  );

  app.post("/quotes", createQuoteController.handle);
  app.get("/quotes", listQuotesController.handle);
  app.get("/quotes/:id", getQuoteController.handle);
  app.post("/quotes/:id/items", addQuoteItemController.handle);
  app.delete("/quotes/:id/items/:itemId", removeQuoteItemController.handle);
  app.patch("/quotes/:id/items/:itemId", updateQuoteItemController.handle);
  app.patch(
    "/quotes/:id/commercial-terms",
    updateQuoteCommercialTermsController.handle,
  );
  app.post("/quotes/:id/submit", submitQuoteController.handle);
  app.post("/quotes/:id/versions", createNewQuoteVersionController.handle);
}
