import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { ApiRequest } from "./components/models/ApiRequest";
import { Catalog } from "./components/models/catalog";
import { Bag } from "./components/models/bag";
import { Buyer } from "./components/models/buyer";

import { Header } from "./components/views/headers";
import { Gallery } from "./components/views/gallery";
import { CardCatalog } from "./components/views/cardcatalog";
import { CardPreview } from "./components/views/cardpreview";
import { Basket } from "./components/views/basket";
import { CardBasket } from "./components/views/cardbasket";
import { Modal } from "./components/views/modal";
import { OrderForm } from "./components/views/orderform";
import { ContactsForm } from "./components/views/contactform";
import { Success } from "./components/views/success";

import { ensureElement, cloneTemplate } from "./utils/utils";
import { API_URL, categoryMap } from "./utils/constants";
import { TPayment } from "./types";

const events = new EventEmitter();

const api = new Api(API_URL);
const apirequest = new ApiRequest(api);

const catalog = new Catalog(events);
const bag = new Bag(events);
const buyer = new Buyer(events);

function errorsToString(errors: Record<string, string>) {
  return Object.values(errors).filter(Boolean).join("; ");
}

function isValid(errors: Record<string, string>) {
  return Object.keys(errors).length === 0;
}

function pickErrors<T extends string>(
  errors: Record<string, string>,
  keys: readonly T[],
): Record<T, string> {
  const res = {} as Record<T, string>;
  keys.forEach((k) => {
    if (errors[k]) res[k] = errors[k] as any;
  });
  return res;
}

const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>(".modal");

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer);

const basketView = new Basket(cloneTemplate("#basket"), () => {
  events.emit("basket:order");
});

const orderFormView = new OrderForm(
  cloneTemplate("#order") as HTMLFormElement,
  () => events.emit("order:submit"),
  (field, value) => events.emit("order:change", { field, value }),
);

const contactsFormView = new ContactsForm(
  cloneTemplate("#contacts") as HTMLFormElement,
  () => events.emit("contacts:submit"),
  (field, value) => events.emit("contacts:change", { field, value }),
);

const previewView = new CardPreview(cloneTemplate("#card-preview"), () => {
  events.emit("product:action");
});

const success = new Success(cloneTemplate("#success"), () => {
  events.emit("success:close");
});

function renderCatalog() {
  const products = catalog.getProducts();

  const cards = products.map((p) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), () => {
      events.emit("catalog:item-select", { id: p.id });
    });

    return card.render({
      title: p.title,
      price: p.price,
      image: p.image,
      category: p.category as keyof typeof categoryMap,
    });
  });

  gallery.render({ catalog: cards });
}

function renderBasket() {
  const items = bag.listProduct().map((item, index) => {
    const row = new CardBasket(cloneTemplate("#card-basket"), () => {
      events.emit("basket:item-remove", { id: item.id });
    });

    return row.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.items = items;
  basketView.total = bag.sumProducts();
}

function openBasket() {
  modal.content = basketView.render({
    items: [],
    total: bag.sumProducts(),
  });

  renderBasket();
  modal.open();
}

function openPreview() {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  const inCart = bag.checkProduct(product.id);
  const isUnavailable = product.price === null;

  modal.content = previewView.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category as keyof typeof categoryMap,
    description: product.description,
    buttonText: isUnavailable
      ? "Недоступно"
      : inCart
        ? "Удалить из корзины"
        : "Купить",
    buttonDisabled: isUnavailable,
  });

  modal.open();
}

function openOrder() {
  const data = buyer.getBuyer();
  const allErrors = buyer.validate();
  const stepErrors = pickErrors(allErrors, ["payment", "address"] as const);

  orderFormView.payment = data.payment;
  orderFormView.address = data.address;

  modal.content = orderFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openContacts() {
  const data = buyer.getBuyer();
  const allErrors = buyer.validate();
  const stepErrors = pickErrors(allErrors, ["email", "phone"] as const);

  contactsFormView.email = data.email;
  contactsFormView.phone = data.phone;

  modal.content = contactsFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openSuccess(total: number) {
  modal.content = success.render({ total });
  modal.open();
}

function updateOrderView() {
  const data = buyer.getBuyer();
  const allErrors = buyer.validate();
  const stepErrors = pickErrors(allErrors, ["payment", "address"] as const);

  orderFormView.payment = data.payment;
  orderFormView.address = data.address;

  orderFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });
}

function updateContactsView() {
  const data = buyer.getBuyer();
  const allErrors = buyer.validate();
  const stepErrors = pickErrors(allErrors, ["email", "phone"] as const);

  contactsFormView.email = data.email;
  contactsFormView.phone = data.phone;

  contactsFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });
}

events.on("catalog:changed", () => {
  renderCatalog();
});

events.on("cart:changed", () => {
  header.render({ counter: bag.countProducts() });
  renderBasket();
});

events.on("basket:open", () => {
  openBasket();
});

events.on<{ id: string }>("catalog:item-select", ({ id }) => {
  catalog.setSelectedProduct(id);
});

events.on("catalog:select", () => {
  openPreview();
});

events.on("product:action", () => {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  if (bag.checkProduct(product.id)) {
    bag.removeProduct(product);
  } else {
    if (product.price !== null) bag.addProduct(product);
  }

  modal.close();
});

events.on<{ id: string }>("basket:item-remove", ({ id }) => {
  const product = catalog.getProductById(id);
  if (!product) return;
  bag.removeProduct(product);
});

events.on("basket:order", () => {
  openOrder();
});

events.on<{ field: "payment" | "address"; value: string }>(
  "order:change",
  ({ field, value }) => {
    if (field === "payment") buyer.updateBuyer("payment", value as TPayment);
    else buyer.updateBuyer("address", value);
  },
);

events.on("order:submit", () => {
  openContacts();
});

events.on<{ field: "email" | "phone"; value: string }>(
  "contacts:change",
  ({ field, value }) => {
    buyer.updateBuyer(field, value);
  },
);

events.on("buyer:change", () => {
  updateOrderView();
  updateContactsView();
});

events.on("contacts:submit", async () => {
  const data = buyer.getBuyer();
  const total = bag.sumProducts();

  const order = {
    ...data,
    total,
    items: bag.listProduct().map((i) => i.id),
  };

  try {
    await apirequest.sendApiProducts(order as any);
    bag.clearBag();
    buyer.clearBuyer();
    openSuccess(total);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    contactsFormView.render({
      valid: false,
      errors: msg,
    });
  }
});

events.on("success:close", () => {
  modal.close();
});

header.render({ counter: bag.countProducts() });
catalog.setProducts(await apirequest.getApiProducts());
