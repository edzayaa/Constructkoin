const currentLanguage = document.documentElement.getAttribute("data-current-language")?.toUpperCase() || "EN";

const LANGUAGES = {
  ES: {
    ERROR_MESSAGES: {
      required: "Este campo es obligatorio",
      email: "Por favor ingresa un email válido",
      confirmEmail: "Los emails no coinciden",
      minLength: (min) => `Mínimo ${min} caracteres requeridos`,
      maxLength: (max) => `Máximo ${max} caracteres permitidos`,
      select: "Por favor selecciona una opción válida",
      phone: "Por favor ingresa un número de teléfono válido",
      postalCode: "Por favor ingresa un código postal válido",
      confirmPassword: "Los passwords no coinciden",
      atLeastOneOption_es: "Por favor selecciona al menos una opción",
    },
  },
  EN: {
    ERROR_MESSAGES: {
      required: "This field is required",
      email: "Please enter a valid email address",
      confirmEmail: "Emails do not match",
      minLength: (min) => `Minimum ${min} characters required`,
      maxLength: (max) => `Maximum ${max} characters allowed`,
      select: "Please select a valid option",
      phone: "Please enter a valid phone number",
      postalCode: "Please enter a valid postal code",
      confirmPassword: "Passwords do not match",
      atLeastOneOption: "Please select at least one option",
    },
  },
};

const { ERROR_MESSAGES } = LANGUAGES[currentLanguage] || LANGUAGES.EN;

let form = null;
let validateFields = [];
let niceSelects = [];

function validateFieldGroup(fieldGroup) {
  const input = fieldGroup.querySelector("input, textarea, select");
  if (!input) return { isValid: false, message: "" };

  let valid = true;
  let message = "";
  const isRequired = input.hasAttribute("required");

  // Radio validation
  if (input.type === "radio") {
    const name = input.name;

    const checked = fieldGroup.querySelector(`input[type="radio"][name="${name}"]:checked`);
    if (!checked) {
      return { isValid: false, message: ERROR_MESSAGES.required };
    }
    return { isValid: true, message: "" };
  }

  // Single Checkbox validation
  if (input.type === "checkbox" && !input.name.includes("[]")) {
    if (input.required && !input.checked) {
      const customMessage = input.getAttribute("data-custom-message") || ERROR_MESSAGES.required;

      return {
        isValid: false,
        message: customMessage,
      };
    }
    return { isValid: true, message: "" };
  }

  // Checkbox group validation
  if (input.type === "checkbox" && input.name.includes("[]")) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${input.name}"]`);
    const isChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);

    if (!isChecked) {
      return {
        isValid: false,
        message: ERROR_MESSAGES.atLeastOneOption || "Please select at least one option",
      };
    }
    return { isValid: true, message: "" };
  }

  // Required validation
  const value = input.value.trim();
  const length = value.length;

  if (isRequired && !value) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.required,
    };
  }

  if (!isRequired && !value) {
    return { isValid: true, message: "" };
  }

  // Custom pattern validation
  const customPattern = input.getAttribute("data-pattern");
  if (customPattern) {
    const regex = new RegExp(customPattern);
    if (!regex.test(value)) {
      valid = false;

      const placeholder = input.getAttribute("placeholder") || "";
      message = (ERROR_MESSAGES.pattern || "Invalid format.") + (placeholder ? ` (e.g. ${placeholder})` : "");
      return { isValid: valid, message };
    }
  }

  // Select validation
  if (input.tagName.toLowerCase() === "select") {
    if (value === "" || value === "disabled" || value === "null" || value === "false") {
      valid = false;
      message = ERROR_MESSAGES.select;
    }
  }

  // Email validation
  if (input.type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      valid = false;
      message = ERROR_MESSAGES.email;
    }

    if (input.id === "confirm-email") {
      const originalEmailInput = document.getElementById("email");
      if (originalEmailInput && value !== originalEmailInput.value.trim()) {
        valid = false;
        message = ERROR_MESSAGES.confirmEmail;
      }
    }
  }

  // Password validation
  if (input.type === "password") {
    if (input.id === "confirm-password") {
      const originalPasswordInput = document.getElementById("password");

      if (originalPasswordInput && value !== originalPasswordInput.value.trim()) {
        valid = false;
        message = ERROR_MESSAGES.confirmPassword;
      }
    }
  }

  // Phone number validation & Card number validation
  if (input.type === "tel") {
    // CARD VALIDATION
    if (input.name === "cardNumber" || input.id === "cardNumber") {
      const cardPattern = /^\d{13,16}$/; // Visa, MasterCard, etc. entre 13 y 19 dígitos
      if (!cardPattern.test(value.replace(/\s+/g, ""))) {
        valid = false;
        message = "Invalid card number format.";
      }
    }

    // CVC VALIDATION
    if (input.id === "securityCode" || input.name === "securityCode") {
      const numericPattern = /^\d+$/;
      if (!numericPattern.test(value)) {
        valid = false;
        message = "Security code must contain only digits.";
      }
    }

    // PHONE VALIDATION
    if (input.id === "phone" || input.name === "phone") {
      const phonePattern = /^\+?[\d\s\-]{7,15}$/;
      if (!phonePattern.test(value)) {
        valid = false;
        message = ERROR_MESSAGES.phone;
      }
    }
  }

  // Postal code validation
  if (input.name === "postalCode") {
    const postalCodePattern = /^[A-Za-z0-9\s\-]{3,10}$/;

    if (!postalCodePattern.test(value)) {
      valid = false;
      message = ERROR_MESSAGES.postalCode;
    }
  }

  const min = parseInt(input.getAttribute("min")) || 0;
  const max = parseInt(input.getAttribute("max")) || Infinity;

  if (input.hasAttribute("min") && length < min) {
    valid = false;
    message = ERROR_MESSAGES.minLength(min);
  }

  if (input.hasAttribute("max") && length > max) {
    valid = false;
    message = ERROR_MESSAGES.maxLength(max);
  }

  return { isValid: valid, message };
}

function setErrorMessage(fieldGroup, message) {
  const errorWrapper = fieldGroup.querySelector("[data-error-message]");

  const existingError = errorWrapper.querySelector(".error-message");
  if (existingError) existingError.remove();

  if (message) {
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorWrapper.appendChild(errorElement);
  }
}

function initLiveValidation() {
  validateFields.forEach((fieldGroup) => {
    const input = fieldGroup.querySelector("input, textarea, select");
    if (!input) return;

    if (input.type === "checkbox" && input.name.endsWith("[]")) {
      const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${input.name}"]`);

      const validateCheckboxGroup = () => {
        const { isValid, message } = validateFieldGroup(fieldGroup);

        if (!isValid) {
          setErrorMessage(fieldGroup, message);
        } else {
          setErrorMessage(fieldGroup, "");
        }
      };

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          checkbox.dataset.touched = "true";
          validateCheckboxGroup();
        });
      });

      return; // Salir temprano para evitar otros eventos
    }

    const validate = () => {
      const { isValid, message } = validateFieldGroup(fieldGroup);

      if (!isValid) {
        setErrorMessage(fieldGroup, message);
      } else {
        setErrorMessage(fieldGroup, "");
      }
    };

    input.addEventListener("focus", () => {
      input.dataset.touched = "true";
    });

    if (input.tagName.toLowerCase() === "select") {
      input.addEventListener("change", () => {
        input.dataset.touched = "true";
        validate();
      });
    } else {
      input.addEventListener("input", () => {
        if (input.dataset.touched) {
          validate();
        }
      });
    }

    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      validate();
    });

    const cardInput = fieldGroup.querySelector("#cardNumber");

    cardInput?.addEventListener("input", (e) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      value = value.replace(/(.{4})/g, "$1 ").trim();

      e.target.value = value;
    });
  });
}

export function checkValidation() {
  let allValid = true;

  validateFields.forEach((fieldGroup) => {
    const { isValid, message } = validateFieldGroup(fieldGroup);
    setErrorMessage(fieldGroup, message);

    if (!isValid) {
      allValid = false;
    }
  });

  return allValid;
}

export function resetForm() {
  form.reset();

  const selectElement = form.querySelectorAll("select");

  selectElement.forEach(function (select) {
    select.selectedIndex = 0;
  });

  resetNiceSelects()
}

export function init(customForm) {
  form = customForm;
  validateFields = form.querySelectorAll("[data-validate]");

  initLiveValidation();
}

export async function handleFormSubmit(url, form, config = {}) {
  const { method = "POST", headers = {}, onSuccess, onError, onValidationFail } = config;

  const isValid = checkValidation();

  if (!isValid) {
    onValidationFail?.();
    return;
  }

  const formData = new FormData(form);
  const data = {};

  for (let [key, value] of formData.entries()) {
    const cleanKey = key.endsWith("[]") ? key.slice(0, -2) : key;

    if (key.endsWith("[]")) {
      if (data[cleanKey]) {
        data[cleanKey].push(value);
      } else {
        data[cleanKey] = [value];
      }
    } else {
      if (data[cleanKey]) {
        if (Array.isArray(data[cleanKey])) {
          data[cleanKey].push(value);
        } else {
          data[cleanKey] = [data[cleanKey], value];
        }
      } else {
        data[cleanKey] = value;
      }
    }
  }

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, fetchOptions);
    const dataResponse = await response.json();

    if (!response.ok) {
      throw new Error(dataResponse.message);
    }

    onSuccess?.(dataResponse);
    return dataResponse;
  } catch (error) {
    console.error("Submit error:", error);
    onError?.(error);
    throw error;
  }
}

export function showMessageStatus(container, message, form, type) {
  if (!container) return;

  container.textContent = message;
  form.setAttribute("data-form-status", type);
}

export function disableSubmitButton(form) {
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add("--is-disabled");
  }
}

export function enableSubmitButton(form) {
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.classList.remove("--is-disabled");
  }
}

function resetNiceSelects() {
  niceSelects.forEach((select) => {
    select.destroy();
  });

  niceSelects = [];

  setLocations();
}

function populateSelect({ selectId, options, placeholder }) {
  const select = document.getElementById(selectId);

  if (!select) return;

  select.addEventListener("change", function () {
    const placeholder = select.getAttribute("data-placeholder") || "";
    
    const niceSelectWrapper = select.nextElementSibling || select.previousElementSibling;
    const current = niceSelectWrapper?.querySelector(".current");

    const selectedOption = [...select.options].find((opt) => opt.value === select.value);

    if (select.value !== placeholder) {
      current.classList.add("has-selection");
    }else {
       current.classList.remove("has-selection");
    }

    if (selectedOption && current) {
      current.textContent = selectedOption.textContent;
    }
  });

  options.sort().forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  const niceSelect = NiceSelect.bind(select, {
    searchable: false,
    placeholder: placeholder || select.getAttribute("data-placeholder"),
  });

  niceSelects.push(niceSelect);
}

function setLocations() {
  const uaeLocations = [
    // Abu Dhabi
    "Abu Dhabi City",
    "Al Ain",
    "Al Dhafra",
    "Mussafah",
    "Khalifa City",
    "Mohammed Bin Zayed City",
    "Yas Island",
    "Saadiyat Island",
    "Al Raha",
    "Al Reef",
    "Ruwais",
    "Tarif",
    "Ghayathi",

    // Dubai
    "Downtown Dubai",
    "Dubai Marina",
    "Jumeirah",
    "Al Barsha",
    "Deira",
    "Bur Dubai",
    "Business Bay",
    "Palm Jumeirah",
    "Dubai Hills Estate",
    "Mirdif",
    "Dubai South",
    "Jebel Ali",
    "Al Quoz",
    "Dubai Silicon Oasis",

    // Sharjah
    "Sharjah City",
    "Khor Fakkan",
    "Kalba",
    "Al Dhaid",
    "University City",
    "Al Qasimia",

    // Ajman
    "Ajman City",
    "Al Hamriyah",

    // Ras Al Khaimah
    "Ras Al Khaimah City",
    "Al Marjan Island",
    "Al Hamra Village",

    // Fujairah
    "Fujairah City",
    "Dibba Al-Fujairah",
    "Masafi",

    // Umm Al Quwain
    "Umm Al Quwain City",
    "Al Sinniyah Island",
  ];
  populateSelect({ selectId: "city", options: uaeLocations });
}

setLocations();
