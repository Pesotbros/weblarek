import { ensureElement } from "../../utils/utils";
import { Form } from "./form";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: keyof IContactsFormData, value: string) => void,
  ) {
    super(container, onSubmit, onChange);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.form,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.form,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}

