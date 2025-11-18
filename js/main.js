document.addEventListener("DOMContentLoaded", () => {
  class SmoothScroller {
    constructor(selector) {
      // Шукаємо всі елементи, що мають атрибут data-scroll-to
      this.links = document.querySelectorAll(selector);
      if (this.links.length > 0) {
        this.initialize();
      }
    }

    initialize() {
      this.links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault(); // Вимикаємо стандартний перехід

          const targetId = link.dataset.scrollTo; // Отримуємо "#reviews"
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            // Відступ зверху (щоб не прилипало до краю екрана)
            // На мобільних це важливо через адресний рядок і хедер
            const headerOffset = 100;

            // Обчислюємо позицію елемента відносно верху сторінки
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          } else {
            console.warn(`Елемент з id ${targetId} не знайдено!`);
          }
        });
      });
    }
  }

  // Ініціалізуємо для навігації, кнопок у товарах та кнопки "Зв'язатися"
  // ВАЖЛИВО: Тепер ми передаємо селектор, який шукає елементи з атрибутом data-scroll-to
  new SmoothScroller("[data-scroll-to]");

  // --- ЕЛЕМЕНТИ ФОРМИ (глобальні для скрипту) ---
  const productSelect = document.getElementById("product-select");
  const colorSelect = document.getElementById("color-select");
  const allProductsData = [];

  // --- 2. ЛОГІКА ДЛЯ ПРОДУКТІВ (СЛАЙДЕР, КОЛІР, КНОПКА "ДО ФОРМИ") ---
  const productBlocks = document.querySelectorAll(".products__product");

  productBlocks.forEach((product, productIndex) => {
    // ... (Код для 2.1, 2.2, 2.3, 2.4 без змін) ...
    // 2.1 Слайдер в продукті
    const allImages = product.querySelectorAll(".products__product_images-big");
    const prevButton = product.querySelector(".prleft-arrow");
    const nextButton = product.querySelector(".prright-arrow");
    let currentIndex = 0;
    function showImage(index) {
      allImages.forEach((img, i) => {
        img.hidden = i !== index;
      });
    }
    if (allImages.length > 0 && prevButton && nextButton) {
      nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % allImages.length;
        showImage(currentIndex);
      });
      prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        showImage(currentIndex);
      });
      showImage(currentIndex);
    }
    // 2.2 Вибір кольору в продукті
    const colorOptions = product.querySelectorAll(
      ".products__product_info_colors-color"
    );
    const colorRegex = /-[a-f0-9]{6}-/i;
    const handleColorSelection = (event) => {
      const clickedColorDiv = event.currentTarget;
      colorOptions.forEach((div) => {
        div.classList.remove("selected");
      });
      clickedColorDiv.classList.add("selected");
      const selectedColorValue = clickedColorDiv.dataset.color;
      const newColorCode = `-${selectedColorValue.toLowerCase()}-`;
      if (allImages.length > 0) {
        allImages.forEach((img) => {
          img.src = img.src.replace(colorRegex, newColorCode);
        });
        currentIndex = 0;
        showImage(currentIndex);
      }
    };
    colorOptions.forEach((div) => {
      div.addEventListener("click", handleColorSelection);
    });
    // 2.3 Збір даних для форми
    const nameElement = product.querySelector(".products__product_info-name");
    if (nameElement && colorOptions.length > 0) {
      const productName = nameElement.textContent.trim();
      const productColors = [];
      colorOptions.forEach((colorEl) => {
        const colorValue = colorEl.dataset.color;
        const colorName = colorEl.dataset.colorName || colorValue;
        if (colorValue) {
          productColors.push({ value: colorValue, text: colorName });
        }
      });
      allProductsData[productIndex] = {
        name: productName,
        colors: productColors,
      };
      if (productSelect) {
        const option = document.createElement("option");
        option.value = productIndex;
        option.textContent = productName;
        productSelect.appendChild(option);
      }
    }
    // 2.4 Логіка кнопки "Перейти до заповнення форм"
    const fillFormButton = product.querySelector(
      ".products__product_info-button"
    );
    if (fillFormButton && productSelect && colorSelect) {
      fillFormButton.addEventListener("click", () => {
        const selectedColorDiv = product.querySelector(
          ".products__product_info_colors-color.selected"
        );
        const selectedColorValue = selectedColorDiv
          ? selectedColorDiv.dataset.color
          : null;
        productSelect.value = productIndex;
        productSelect.dispatchEvent(new Event("change"));
        if (selectedColorValue) {
          colorSelect.value = selectedColorValue;
          colorSelect.dispatchEvent(new Event("change"));
        }
      });
    }
  }); // Кінець .forEach(product)

  // --- 3. ЛОГІКА ДЛЯ КАРУСЕЛІ ВІДГУКІВ (REVIEWS) ---
  const reviewsContainer = document.querySelector(".reviews__images");
  if (reviewsContainer) {
    // ... (Ваш код каруселі відгуків без змін) ...
    const prevButton = reviewsContainer.querySelector(".left-arrow");
    const nextButton = reviewsContainer.querySelector(".right-arrow");
    if (prevButton && nextButton) {
      const states5 = ["review-far", "", "review-active", "", "review-far"];
      const states3 = ["", "review-active", ""];
      const mediaQuery = window.matchMedia("(max-width: 1278px)");
      function updateReviewClasses() {
        const currentItems = reviewsContainer.querySelectorAll(
          ".reviews__images-review"
        );
        const isMobileView = mediaQuery.matches;
        const states = isMobileView ? states3 : states5;
        const visibleItemCount = states.length;
        currentItems.forEach((item, index) => {
          item.classList.remove("review-active", "review-far", "is-hidden");
          if (index < visibleItemCount) {
            const state = states[index];
            if (state) item.classList.add(state);
          } else {
            item.classList.add("is-hidden");
          }
        });
      }
      function moveReviewNext() {
        const currentItems = reviewsContainer.querySelectorAll(
          ".reviews__images-review"
        );
        if (currentItems.length > 0) {
          reviewsContainer.appendChild(currentItems[0]);
          updateReviewClasses();
        }
      }
      function moveReviewPrev() {
        const currentItems = reviewsContainer.querySelectorAll(
          ".reviews__images-review"
        );
        if (currentItems.length > 0) {
          reviewsContainer.prepend(currentItems[currentItems.length - 1]);
          updateReviewClasses();
        }
      }
      nextButton.addEventListener("click", moveReviewNext);
      prevButton.addEventListener("click", moveReviewPrev);
      mediaQuery.addEventListener("change", updateReviewClasses);
      updateReviewClasses();
    }
  }

  // --- 4. ЛОГІКА ДЛЯ ФОРМИ У ФУТЕРІ ---
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyBBggnv-YqTVwjZTg9T0dIfQRXeOEHXBtyD0K1odqI6eAmCKEICw9fNK4Ofs2foyS0/exec"; // <--- ВАША URL

  const phoneInput = document.getElementById("phone-input");
  const nameInput = document.getElementById("name-input");
  const submitButton = document.getElementById("submit-button");
  const successPopup = document.getElementById("success-popup");
  const closePopupButton = document.getElementById("popup-close-button");

  // [!!! НОВЕ !!!] Знаходимо поле-пастку
  const honeypotInput = document.getElementById("honeypot-field");

  if (
    productSelect &&
    colorSelect &&
    phoneInput &&
    nameInput &&
    submitButton &&
    successPopup &&
    closePopupButton &&
    honeypotInput
  ) {
    const allFormFields = [productSelect, colorSelect, phoneInput, nameInput];

    // ... (всі ваші функції clearSelect, checkSelectValue, checkFormValidity, resetForm - без змін) ...
    function clearSelect(selectElement) {
      if (!selectElement) return;
      while (selectElement.options.length > 1) {
        selectElement.remove(1);
      }
      selectElement.value = "";
    }
    function checkSelectValue(selectElement) {
      if (!selectElement) return;
      if (selectElement.value !== "") {
        selectElement.classList.add("has-value");
      } else {
        selectElement.classList.remove("has-value");
      }
    }
    function checkFormValidity() {
      let isFormValid = true;
      allFormFields.forEach((field) => {
        if (!field.disabled && field.value.trim() === "") {
          isFormValid = false;
        }
      });
      submitButton.disabled = !isFormValid;
    }
    function resetForm() {
      productSelect.value = "";
      clearSelect(colorSelect);
      phoneInput.value = "";
      nameInput.value = "";
      colorSelect.disabled = true;
      submitButton.disabled = true;
      checkSelectValue(productSelect);
      checkSelectValue(colorSelect);
      honeypotInput.value = ""; // Очищуємо пастку
    }

    // ... (код слухачів productSelect та allFormFields - без змін) ...
    productSelect.addEventListener("change", () => {
      const selectedProductIndex = productSelect.value;
      const isProductSelected = selectedProductIndex !== "";
      checkSelectValue(productSelect);
      clearSelect(colorSelect);
      if (isProductSelected && allProductsData[selectedProductIndex]) {
        colorSelect.disabled = false;
        const productData = allProductsData[selectedProductIndex];
        productData.colors.forEach((color) => {
          const option = document.createElement("option");
          option.value = color.value;
          option.textContent = color.text;
          colorSelect.appendChild(option);
        });
      } else {
        colorSelect.disabled = true;
      }
      checkSelectValue(colorSelect);
      checkFormValidity();
    });

    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value;
      // Видаляємо все, КРІМ цифр
      let cleanedValue = value.replace(/[^0-9]/g, "");

      // Обмежуємо довжину (напр., 12 символів для +380...)
      if (cleanedValue.length > 12) {
        cleanedValue = cleanedValue.slice(0, 12);
      }

      // Встановлюємо очищене значення
      e.target.value = cleanedValue;
    });

    // 2. Валідація імені (без цифр)
    nameInput.addEventListener("input", (e) => {
      let value = e.target.value;
      // Видаляємо цифри та більшість спец. символів,
      // але залишаємо букви (вкл. українські), пробіл, дефіс та апостроф
      let cleanedValue = value.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]/g, "");

      e.target.value = cleanedValue;
    });

    allFormFields.forEach((field) => {
      const eventType = field.tagName === "INPUT" ? "input" : "change";
      field.addEventListener(eventType, () => {
        if (field.tagName === "SELECT") {
          checkSelectValue(field);
        }
        checkFormValidity();
      });
    });

    // Слухач кнопки "Відправити" (ОНОВЛЕНО)
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      // ПЕРЕВІРКА НА БОТА:
      // Якщо поле-пастка заповнене, нічого не робимо (але вдаємо, що відправили)
      if (honeypotInput.value !== "") {
        console.warn("Honeypot field filled. Likely spam.");
        successPopup.hidden = false; // Помилково показуємо "успіх" боту
        resetForm(); // Скидаємо форму
        return; // Зупиняємо виконання
      }

      submitButton.disabled = true;
      submitButton.textContent = "Відправка...";

      const formData = new FormData();
      formData.append(
        "product",
        productSelect.options[productSelect.selectedIndex].text
      );
      formData.append(
        "color",
        colorSelect.options[colorSelect.selectedIndex].text
      );
      formData.append("phone", phoneInput.value);
      formData.append("name", nameInput.value);
      // [!!! НОВЕ !!!] Додаємо поле-пастку (воно буде порожнім)
      formData.append("website", honeypotInput.value);

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result === "success") {
            successPopup.hidden = false;
            resetForm();
          } else {
            alert("Сталася помилка при відправці: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Помилка! ", error.message);
          alert("Не вдалося зв'язатися. Перевірте інтернет.");
        })
        .finally(() => {
          submitButton.textContent = "Відправити";
        });
    });

    // ... (код слухачів Popup - без змін) ...
    closePopupButton.addEventListener("click", () => {
      successPopup.hidden = true;
    });
    successPopup.addEventListener("click", (event) => {
      if (event.target === successPopup) {
        successPopup.hidden = true;
      }
    });
  }

  // --- 5. ЛОГІКА КОПІЮВАННЯ ПО КЛІКУ ---
  const copyElements = document.querySelectorAll(".copy-on-click");
  if (copyElements.length > 0) {
    // ... (Ваш код копіювання без змін) ...
    copyElements.forEach((element) => {
      element.addEventListener("click", () => {
        const textToCopy = element.textContent.trim();
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            const originalText = element.textContent;
            element.textContent = "Скопійовано!";
            setTimeout(() => {
              element.textContent = originalText;
            }, 2000);
          })
          .catch((err) => {
            console.error("Не вдалося скопіювати: ", err);
          });
      });
    });
  }
}); // <-- КІНЕЦЬ 'DOMContentLoaded'
