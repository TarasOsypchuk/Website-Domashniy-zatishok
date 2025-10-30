class SmoothScroller {
  constructor(selector) {
    this.links = document.querySelectorAll(selector);
    if (this.links.length > 0) {
      this.initialize();
    }
  }

  initialize() {
    this.links.forEach((link) => {
      const target = parseInt(link.dataset.scrollTo);
      if (!isNaN(target)) {
        link.addEventListener("click", () => this.scrollToPosition(target));
      }
    });
  }

  scrollToPosition(topPosition) {
    window.scroll({
      top: topPosition,
      behavior: "smooth",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SmoothScroller("#scroller-down");
});

document.addEventListener("DOMContentLoaded", () => {
  const colorOptions = document.querySelectorAll(
    ".products__product_info_colors-color"
  );

  const handleColorSelection = (event) => {
    const clickedColorDiv = event.currentTarget;

    colorOptions.forEach((div) => {
      div.classList.remove("selected");
    });

    clickedColorDiv.classList.add("selected");

    const selectedColorValue = clickedColorDiv.dataset.color;

    console.log("Вибраний колір:", selectedColorValue);
  };
  colorOptions.forEach((div) => {
    div.addEventListener("click", handleColorSelection);
  });
});

function handleSizeDropdown(clickedElement) {
  // 1. Знаходимо батьківський контейнер `.size-selector`
  const sizeWidget = clickedElement.closest(".size-selector");

  // Виходимо, якщо клік не був пов'язаний з селектором
  if (!sizeWidget) return;

  const displayButton = sizeWidget.querySelector(
    ".products__product_info_size-display"
  );
  const optionsList = sizeWidget.querySelector(
    ".products__product_info_size-options-list"
  );

  // 2. Логіка для відкриття/закриття списку
  if (
    clickedElement === displayButton ||
    displayButton.contains(clickedElement)
  ) {
    const isHidden = optionsList.hidden;
    optionsList.hidden = !isHidden;
    displayButton.setAttribute("aria-expanded", isHidden);
    return;
  }

  // 3. Логіка для вибору опції (li)
  if (clickedElement.tagName === "LI" && optionsList.contains(clickedElement)) {
    const selectedValueSpan = sizeWidget.querySelector(".selected-size-text");
    const options = sizeWidget.querySelectorAll(
      ".products__product_info_size-options-list li"
    );
    const newValue = clickedElement.dataset.value;

    // Оновлюємо відображуваний текст
    selectedValueSpan.textContent = newValue;
    selectedValueSpan.dataset.value = newValue;

    // Оновлюємо клас 'selected'
    options.forEach((li) => li.classList.remove("selected"));
    clickedElement.classList.add("selected");

    // Закриваємо список
    optionsList.hidden = true;
    displayButton.setAttribute("aria-expanded", false);

    console.log("Вибраний розмір:", newValue);
  }
}

// --- ІНІЦІАЛІЗАЦІЯ СЛУХАЧА ---

document.addEventListener("DOMContentLoaded", () => {
  // Встановлюємо ОДИН слухач на тіло документа для обробки всіх кліків
  document.body.addEventListener("click", (event) => {
    // Перевірка, чи клік був пов'язаний з випадаючим списком розмірів
    const sizeSelector = event.target.closest(".size-selector");
    if (sizeSelector) {
      handleSizeDropdown(event.target);
    }

    const isInside = event.target.closest(".size-selector");
    if (!isInside) {
      document
        .querySelectorAll(
          ".size-selector .products__product_info_size-options-list"
        )
        .forEach((ul) => {
          ul.hidden = true;
        });
    }
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const reviewsContainer = document.querySelector(".reviews__images");

//   // Знаходимо всі елементи, які можуть бути null
//   if (!reviewsContainer) {
//     console.error("Контейнер .reviews__images не знайдено!");
//     return;
//   }

//   const prevButton = reviewsContainer.querySelector(".left-arrow");
//   const nextButton = reviewsContainer.querySelector(".right-arrow");

//   if (!prevButton || !nextButton) {
//     console.error("Стрілки .left-arrow або .right-arrow не знайдено!");
//     return;
//   }

//   // Це 5 станів, які ми будемо застосовувати
//   // (Далеко, Близько, Активний, Близько, Далеко)
//   const states = ["review-far", "", "review-active", "", "review-far"];

//   /**
//    * Функція, що оновлює класи для всіх відгуків.
//    */
//   function updateClasses() {
//     // Отримуємо поточний порядок елементів у контейнері
//     const currentItems = reviewsContainer.querySelectorAll(
//       ".reviews__images-review"
//     );

//     currentItems.forEach((item, index) => {
//       // 1. Спочатку очищаємо всі старі класи
//       item.classList.remove("review-active", "review-far", "is-hidden");

//       if (index < 5) {
//         // 2. Якщо елемент входить у видиму "п'ятірку"
//         // Застосовуємо клас зі списку 'states'
//         const state = states[index];
//         if (state) {
//           // (не додаємо клас, якщо state = '')
//           item.classList.add(state);
//         }
//       } else {
//         // 3. Якщо це 6-й, 7-й або дальший елемент - ховаємо його
//         item.classList.add("is-hidden");
//       }
//     });
//   }

//   /**
//    * Рухаємо карусель вперед (вправо)
//    */
//   function moveNext() {
//     const currentItems = reviewsContainer.querySelectorAll(
//       ".reviews__images-review"
//     );
//     if (currentItems.length === 0) return;

//     // 1. Беремо перший елемент
//     const firstItem = currentItems[0];

//     // 2. Переміщуємо його в кінець контейнера
//     reviewsContainer.appendChild(firstItem);

//     // 3. Оновлюємо класи для нового порядку
//     updateClasses();
//   }

//   /**
//    * Рухаємо карусель назад (вліво)
//    */
//   function movePrev() {
//     const currentItems = reviewsContainer.querySelectorAll(
//       ".reviews__images-review"
//     );
//     if (currentItems.length === 0) return;

//     // 1. Беремо останній елемент
//     const lastItem = currentItems[currentItems.length - 1];

//     // 2. Переміщуємо його на початок контейнера
//     reviewsContainer.prepend(lastItem);

//     // 3. Оновлюємо класи для нового порядку
//     updateClasses();
//   }

//   // 4. Прив'язуємо функції до кнопок
//   nextButton.addEventListener("click", moveNext);
//   prevButton.addEventListener("click", movePrev);

//   // 5. Встановлюємо початковий стан при завантаженні
//   updateClasses();
// });

document.addEventListener("DOMContentLoaded", () => {
    const reviewsContainer = document.querySelector(".reviews__images");

    if (!reviewsContainer) {
        console.error("Контейнер .reviews__images не знайдено!");
        return;
    }

    const prevButton = reviewsContainer.querySelector(".left-arrow");
    const nextButton = reviewsContainer.querySelector(".right-arrow");

    if (!prevButton || !nextButton) {
        console.error("Стрілки .left-arrow або .right-arrow не знайдено!");
        return;
    }

    // --- НОВЕ: Визначаємо стани для 5 та 3 елементів ---
    
    // Стан для 5 елементів (Далеко, Близько, Активний, Близько, Далеко)
    const states5 = ["review-far", "", "review-active", "", "review-far"];
    
    // Стан для 3 елементів (Близько, Активний, Близько)
    const states3 = ["", "review-active", ""];
    
    // Створюємо медіа-запит, який ми будемо перевіряти
    const mediaQuery = window.matchMedia("(max-width: 1278px)");

    /**
     * Функція, що оновлює класи для всіх відгуків.
     */
    function updateClasses() {
        // Отримуємо поточний порядок елементів
        const currentItems = reviewsContainer.querySelectorAll(
            ".reviews__images-review"
        );

        // --- ОНОВЛЕНО: Вибираємо правильний набір станів ---
        const isMobileView = mediaQuery.matches; // true, якщо екран <= 1278px
        const states = isMobileView ? states3 : states5;
        const visibleItemCount = states.length; // 3 або 5
        // --------------------------------------------------

        currentItems.forEach((item, index) => {
            // 1. Очищаємо всі старі класи
            item.classList.remove("review-active", "review-far", "is-hidden");

            if (index < visibleItemCount) { // Використовуємо 3 або 5
                // 2. Якщо елемент входить у видиму зону
                const state = states[index];
                if (state) {
                    item.classList.add(state);
                }
            } else {
                // 3. Якщо це 4-й/5-й (на мобільному) або 6-й/7-й (на десктопі) - ховаємо
                item.classList.add("is-hidden");
            }
        });
    }

    /**
     * Рухаємо карусель вперед (вправо)
     */
    function moveNext() {
        const currentItems = reviewsContainer.querySelectorAll(
            ".reviews__images-review"
        );
        if (currentItems.length === 0) return;
        const firstItem = currentItems[0];
        reviewsContainer.appendChild(firstItem); // Переміщуємо в кінець
        updateClasses();
    }

    /**
     * Рухаємо карусель назад (вліво)
     */
    function movePrev() {
        const currentItems = reviewsContainer.querySelectorAll(
            ".reviews__images-review"
        );
        if (currentItems.length === 0) return;
        const lastItem = currentItems[currentItems.length - 1];
        reviewsContainer.prepend(lastItem); // Переміщуємо на початок
        updateClasses();
    }

    // 4. Прив'язуємо функції до кнопок
    nextButton.addEventListener("click", moveNext);
    prevButton.addEventListener("click", movePrev);

    // --- НОВЕ: Слухаємо зміни розміру вікна ---
    // Це потрібно, щоб карусель перебудувалася, 
    // якщо користувач змінить розмір вікна
    mediaQuery.addEventListener("change", updateClasses);

    // 5. Встановлюємо початковий стан при завантаженні
    updateClasses();
});





document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const colorSelect = document.getElementById("color-select");
  const sizeSelect = document.getElementById("size-select");

  productSelect.addEventListener("change", () => {
    // Перевіряємо, чи обрано щось (значення не є порожнім)
    const isProductSelected = productSelect.value !== "";

    // Вмикаємо або вимикаємо поля
    colorSelect.disabled = !isProductSelected;
    sizeSelect.disabled = !isProductSelected;

    // Опціонально: скидаємо вибір кольору/розміру,
    // якщо користувач змінив товар
    if (!isProductSelected) {
      colorSelect.value = "";
      sizeSelect.value = "";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Отримуємо всі елементи форми ---
  const productSelect = document.getElementById("product-select");
  const colorSelect = document.getElementById("color-select");
  const sizeSelect = document.getElementById("size-select");
  const phoneInput = document.getElementById("phone-input");
  const nameInput = document.getElementById("name-input");
  const submitButton = document.getElementById("submit-button");

  // Список усіх полів, які мають бути заповнені
  const allFormFields = [
    productSelect,
    colorSelect,
    sizeSelect,
    phoneInput,
    nameInput,
  ];

  // --- 2. Отримуємо елементи Popup ---
  const successPopup = document.getElementById("success-popup");
  const closePopupButton = document.getElementById("popup-close-button");

  /**
   * Функція 1: Перевірка, чи всі поля заповнені
   */
  function checkFormValidity() {
    let isFormValid = true;

    // Перевіряємо, чи всі поля (які не вимкнені) мають значення
    allFormFields.forEach((field) => {
      if (!field.disabled && field.value.trim() === "") {
        isFormValid = false;
      }
    });

    // Вмикаємо або вимикаємо кнопку
    submitButton.disabled = !isFormValid;
  }

  /**
   * Функція 2: Скидання форми до початкового стану
   */
  function resetForm() {
    // Скидаємо значення
    productSelect.value = "";
    colorSelect.value = "";
    sizeSelect.value = "";
    phoneInput.value = "";
    nameInput.value = "";

    // Повертаємо залежні поля у вимкнений стан
    colorSelect.disabled = true;
    sizeSelect.disabled = true;

    // Вимикаємо кнопку відправки
    submitButton.disabled = true;
  }

  // --- 3. Встановлення Слухачів ---

  // Ваш існуючий слухач, що керує залежністю полів
  productSelect.addEventListener("change", () => {
    const isProductSelected = productSelect.value !== "";
    colorSelect.disabled = !isProductSelected;
    sizeSelect.disabled = !isProductSelected;

    if (!isProductSelected) {
      colorSelect.value = "";
      sizeSelect.value = "";
    }

    // Перевіряємо валідність форми після кожної зміни
    checkFormValidity();
  });

  // Додаємо слухачі на ВСІ поля для перевірки валідності
  allFormFields.forEach((field) => {
    const eventType = field.tagName === "INPUT" ? "input" : "change";
    field.addEventListener(eventType, checkFormValidity);
  });

  // Слухач для кнопки "Відправити"
  submitButton.addEventListener("click", (event) => {
    event.preventDefault(); // Зупиняємо стандартну відправку форми

    // Показуємо popup
    successPopup.hidden = false;

    // Очищуємо форму
    resetForm();
  });

  // Слухач для закриття Popup
  closePopupButton.addEventListener("click", () => {
    successPopup.hidden = true;
  });

  // (Опціонально) Закриття по кліку на темний фон
  successPopup.addEventListener("click", (event) => {
    if (event.target === successPopup) {
      // Клік був на самому фоні
      successPopup.hidden = true;
    }
  });
});
