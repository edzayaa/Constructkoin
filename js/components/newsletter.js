import { init, showMessageStatus, disableSubmitButton, enableSubmitButton, checkValidation } from "../utils/form-validation.js";

export class Newsletter {
  constructor() {
    this.init();
  }

  init() {
    const forms = document.querySelectorAll("[data-form-validate]");

    forms.forEach((form) => {
      init(form);

      const errorStatusContainer = form.querySelector("[data-form-status-message='error']");
      const successStatusContainer = form.querySelector("[data-form-status-message='success']");
      const submitButton = form.querySelector("[type='submit']");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        disableSubmitButton(form);

        let isValid = checkValidation();

        if (!isValid) {
          enableSubmitButton(form);
          return;
        }

        submitButton.setAttribute("data-loading", "true");

        const formData = new FormData();
        formData.append("post_id", "1763");
        formData.append("form_id", "d8a6bdd");
        formData.append("referer_title", "");
        formData.append("queried_id", "10");
        formData.append("form_fields[email]", form.querySelector('input[name="email"]').value);
        formData.append("action", "elementor_pro_forms_send_form");
        formData.append("referrer", window.location.href);

        try {
          const response = await fetch("https://admin.constructkoin.com/wp-admin/admin-ajax.php", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            submitButton.setAttribute("data-loading", "false");

            showMessageStatus(successStatusContainer, "Your subscription has been successfully registered!", form, "success");
            setTimeout(() => {
              document.querySelector(".modal-wrapper").removeAttribute("data-modal-open");
            }, 1000);
          } else {
            submitButton.setAttribute("data-loading", "false");

            showMessageStatus(errorStatusContainer, "Something went wrong. Please try again.", form, "error");
          }
        } catch (error) {
          console.error("Error:", error);
          submitButton.setAttribute("data-loading", "false");

          showMessageStatus(errorStatusContainer, "Something went wrong. Please try again.", form, "error");
        } finally {
          enableSubmitButton(form);
        }
      });
    });
  }
}
