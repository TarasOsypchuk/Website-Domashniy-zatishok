
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ЛОГІКА ДЛЯ SMOOTHSCROLLER ---
    // (Код Scroller без змін)
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
            window.scroll({ top: topPosition, behavior: "smooth" });
        }
    }
    new SmoothScroller(".products__product_info-button"); // Використовуємо клас

    
    // --- ЕЛЕМЕНТИ ФОРМИ (глобальні для скрипту) ---
    const productSelect = document.getElementById("product-select");
    const colorSelect = document.getElementById("color-select");
    const allProductsData = []; 

    
    // --- 2. ЛОГІКА ДЛЯ ПРОДУКТІВ (СЛАЙДЕР, КОЛІР, КНОПКА "ДО ФОРМИ") ---
    const productBlocks = document.querySelectorAll(".products__product");

    productBlocks.forEach((product, productIndex) => {
        // 2.1 Слайдер в продукті
        const allImages = product.querySelectorAll(".products__product_images-big");
        const prevButton = product.querySelector(".prleft-arrow");
        const nextButton = product.querySelector(".prright-arrow");
        let currentIndex = 0;

        function showImage(index) {
            allImages.forEach((img, i) => { img.hidden = i !== index; });
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
        const colorOptions = product.querySelectorAll(".products__product_info_colors-color");
        const colorRegex = /-[a-f0-9]{6}-/i;

        const handleColorSelection = (event) => {
            const clickedColorDiv = event.currentTarget;
            colorOptions.forEach((div) => { div.classList.remove("selected"); });
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
            
            colorOptions.forEach(colorEl => {
                const colorValue = colorEl.dataset.color;
                const colorName = colorEl.dataset.colorName || colorValue;
                if (colorValue) {
                    productColors.push({ value: colorValue, text: colorName });
                }
            });

            allProductsData[productIndex] = { name: productName, colors: productColors };

            if (productSelect) {
                const option = document.createElement('option');
                option.value = productIndex;
                option.textContent = productName;
                productSelect.appendChild(option);
            }
        }
        
        // 2.4 Логіка кнопки "Перейти до заповнення форм"
        const fillFormButton = product.querySelector(".products__product_info-button");
        
        if (fillFormButton && productSelect && colorSelect) {
            fillFormButton.addEventListener('click', () => {
                const selectedColorDiv = product.querySelector(".products__product_info_colors-color.selected");
                const selectedColorValue = selectedColorDiv ? selectedColorDiv.dataset.color : null;

                productSelect.value = productIndex;
                productSelect.dispatchEvent(new Event('change'));
                
                if (selectedColorValue) {
                    colorSelect.value = selectedColorValue;
                    colorSelect.dispatchEvent(new Event('change'));
                }
            });
        }

    }); // Кінець .forEach(product)

    
    // --- 3. ЛОГІКА ДЛЯ КАРУСЕЛІ ВІДГУКІВ (REVIEWS) ---
    // (Тут ваш код для каруселі відгуків, без змін)
    const reviewsContainer = document.querySelector(".reviews__images");
    if (reviewsContainer) {
        const prevButton = reviewsContainer.querySelector(".left-arrow");
        const nextButton = reviewsContainer.querySelector(".right-arrow");

        if (prevButton && nextButton) {
            const states5 = ["review-far", "", "review-active", "", "review-far"];
            const states3 = ["", "review-active", ""];
            const mediaQuery = window.matchMedia("(max-width: 1278px)");

            function updateReviewClasses() {
                const currentItems = reviewsContainer.querySelectorAll(".reviews__images-review");
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
                const currentItems = reviewsContainer.querySelectorAll(".reviews__images-review");
                if (currentItems.length > 0) {
                    reviewsContainer.appendChild(currentItems[0]);
                    updateReviewClasses();
                }
            }

            function moveReviewPrev() {
                const currentItems = reviewsContainer.querySelectorAll(".reviews__images-review");
                if (currentItems.length > 0) {
                    reviewsContainer.prepend(currentItems[currentItems.length - 1]);
                    updateReviewClasses();
                }
            }

            nextButton.addEventListener("click", moveReviewNext);
            prevButton.addEventListener("click", moveReviewPrev);
            mediaQuery.addEventListener("change", updateReviewClasses);
            updateReviewClasses();
        } else {
            console.error("Стрілки у Відгуках (.left-arrow або .right-arrow) не знайдено!");
        }
    }

    
    // --- 4. ЛОГІКА ДЛЯ ФОРМИ У ФУТЕРІ ---
    const phoneInput = document.getElementById("phone-input");
    const nameInput = document.getElementById("name-input");
    const submitButton = document.getElementById("submit-button");
    const successPopup = document.getElementById("success-popup");
    const closePopupButton = document.getElementById("popup-close-button");

    // (Прибираємо sizeSelect звідси)
    if (productSelect && colorSelect && phoneInput && nameInput && submitButton && successPopup && closePopupButton) {
        
        const allFormFields = [productSelect, colorSelect, phoneInput, nameInput];

        function clearSelect(selectElement) {
            if (!selectElement) return;
            while (selectElement.options.length > 1) {
                selectElement.remove(1);
            }
            selectElement.value = "";
        }

        // [!!! НОВЕ !!!] Функція для зміни кольору тексту <select>
        function checkSelectValue(selectElement) {
            if (!selectElement) return;
            if (selectElement.value !== "") {
                selectElement.classList.add('has-value');
            } else {
                selectElement.classList.remove('has-value');
            }
        }

        function checkFormValidity() {
            let isFormValid = true;
            allFormFields.forEach(field => {
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
            // [!!! НОВЕ !!!] Скидаємо колір тексту
            checkSelectValue(productSelect);
            checkSelectValue(colorSelect);
        }

        // 4.3 Слухачі подій форми
        productSelect.addEventListener("change", () => {
            const selectedProductIndex = productSelect.value;
            const isProductSelected = selectedProductIndex !== "";

            checkSelectValue(productSelect); // [!!! НОВЕ !!!] Перевіряємо колір
            clearSelect(colorSelect);
        
            if (isProductSelected && allProductsData[selectedProductIndex]) {
                colorSelect.disabled = false;
                const productData = allProductsData[selectedProductIndex];
                productData.colors.forEach(color => {
                    const option = document.createElement('option');
                    option.value = color.value;
                    option.textContent = color.text;
                    colorSelect.appendChild(option);
                });
            } else {
                colorSelect.disabled = true;
            }
            
            checkSelectValue(colorSelect); // [!!! НОВЕ !!!] Перевіряємо колір (після очищення)
            checkFormValidity();
        });

        // [!!! ОНОВЛЕНО !!!] Додаємо перевірку кольору до слухача
        allFormFields.forEach(field => {
            const eventType = (field.tagName === 'INPUT') ? 'input' : 'change';
            field.addEventListener(eventType, () => {
                if (field.tagName === 'SELECT') {
                    checkSelectValue(field); // Перевіряємо колір тексту
                }
                checkFormValidity(); // Перевіряємо валідність
            });
        });

        // Слухачі для Popup (без змін)
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            successPopup.hidden = false;
            resetForm();
        });
        closePopupButton.addEventListener("click", () => {
            successPopup.hidden = true;
        });
        successPopup.addEventListener('click', (event) => {
            if (event.target === successPopup) {
                successPopup.hidden = true;
            }
        });
    }

}); // <-- КІНЕЦЬ 'DOMContentLoaded'




