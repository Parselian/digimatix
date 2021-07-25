'use-strict';

document.addEventListener('DOMContentLoaded', () => {
    let inactiveSlides = [];
    const sliderFilterBtns = document.querySelectorAll('.about-slider__filter-button'),
        formInputs = document.querySelectorAll('.form__input'),
        sliderFilterSelect = document.querySelector('.about-slider__filter-select');

    const aboutSlider = new Swiper('.about-slider', {
        autoplay: true,
        speed: 300,
        loop: 'true',
        slidesPerView: 4,
        slidesPerScroll: 1,
        pagination: {
            el: '.about-slider__dots',
            bulletClass: 'about-slider__dot',
            bulletActiveClass: 'about-slider__dot_active'
        },
        // Navigation arrows
        navigation: {
            prevEl: '.about-slider__arrow_prev',
            nextEl: '.about-slider__arrow_next',
        },
        breakpoints: {
            1200: {
                spaceBetween: 64
            },
            992: {
                autoplay: false,
                spaceBetween: 32,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
                autoplay: {
                    delay: 5000
                },
            },
            420: {
                slidesPerView: 2,
                spaceBetween: 25
            },
            0: {
                autoplay: {
                    delay: 3000
                },
                slidesPerView: 1,
                spaceBetween: 15
            }
        }
    });

    const maskPhone = (selector, masked = '+ 7 ( _ _ _ ) _ _ _ - _ _ - _ _') => {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");

            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 31) {
                this.value = "";
            }

        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }

    }
    maskPhone('input[name="user_phone"]')

    const maskEmail = (selector) => {
        const email_regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        const inputs = document.querySelectorAll(selector);

        inputs.forEach(item => {
            item.addEventListener('change', () => {
                if (!email_regexp.test(item.value)) {
                    item.value = '';
                }
            });
        })
    }
    maskEmail('input[name="user_email"]')

    const toggleActiveFormInputs = () => {
        formInputs.forEach(item => {
            item.addEventListener('focusin', () => {
                item.parentNode.classList.add('form__input-wrap_active')
            })
            item.addEventListener('focusout', () => {
                item.parentNode.classList.remove('form__input-wrap_active')
            })
        })
    }
    toggleActiveFormInputs();

    const filterSlides = (wrapper, selector, group) => {
        const allSlides = document.querySelectorAll(selector);

        inactiveSlides.forEach(item => {
            document.querySelector(wrapper).insertAdjacentElement('beforeend', item);
        })
        inactiveSlides = [];

        allSlides.forEach(item => {
            if (item.dataset.group !== 'all' && item.dataset.group === group &&
                !item.classList.contains('swiper-slide-duplicate')) {
                inactiveSlides.push(item.parentNode.removeChild(item));
            }
        })

        aboutSlider.update();
    }

    sliderFilterSelect.addEventListener('change', (e) => {
        filterSlides('.about-slider__slides', '.about-slider__slide', e.target.value)
    })

    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.matches('.about-slider__filter-button')) {
            sliderFilterBtns.forEach(item => {
                item.classList.remove('about-slider__filter-button_active')
            });
            target.classList.add('about-slider__filter-button_active');

            filterSlides('.about-slider__slides', '.about-slider__slide', target.dataset.group)
        }
    })
})