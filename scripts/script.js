import Swiper from '../lib/swiper-bundle.esm.browser.min.js'

new Swiper('.goods__block', {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 24
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: 24
        },
    },
    navigation: {
        prevEl: '.goods__arrow-prev',
        nextEl: '.goods__arrow-next'
    },
    // Отключаем случайный скролл на любую неактивную кнопку
    preventClicks: true,
    a11y: false
});

// Модальное окно
const productMore = document.querySelectorAll('.product__more');
const modalOverlay = document.querySelector('.goods__modal-overlay');
const modal = document.querySelector('.goods__modal-wrap');
const bodyHidden = document.querySelector('body');

productMore.forEach((btn) => {
    btn.addEventListener('click', () => {
        modalOverlay.classList.add('modal-overlay--visible');
        modal.classList.add('modal--visible');
        bodyHidden.classList.add('body-hidden');
    })
});

modalOverlay.addEventListener('click', ({ target }) => {
    if (target === modalOverlay) {
        modalOverlay.classList.remove('modal-overlay--visible');
        modal.classList.remove('modal--visible');
        bodyHidden.classList.remove('body-hidden');
    }
});

// Работа с валютой
const dataCurrency = {};

const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('EU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
    }).format(value)
}

const showPrice = (currency = 'USD') => {
    const priceElems = document.querySelectorAll('[data-price]');

    priceElems.forEach(elem => {
        elem.textContent = formatCurrency(elem.dataset.price * dataCurrency[currency], currency);
    });

};

const myHeaders = new Headers();
myHeaders.append("apikey", "IkTEID7ozWBF1du9MBJhKHsmjf1bXsOM");

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

fetch("https://api.apilayer.com/fixer/latest?base=USD", requestOptions)
    .then(response => response.json())
    .then(result => {
        Object.assign(dataCurrency, result.rates)
        showPrice();
    })
    .catch(error => console.log('error', error));

// Дропдоун
const countryBtn = document.querySelector('.country__btn');
const countryWrapper = document.querySelector('.country__wrapper');

countryBtn.addEventListener('click', () => {
    countryWrapper.classList.toggle('country__wrapper-open');
    countryBtn.classList.toggle('is-open');
});

countryWrapper.addEventListener('click', ({ target }) => {
    if (target.classList.contains('country__choise')) {
        countryWrapper.classList.remove('country__wrapper-open');
        countryBtn.classList.remove('is-open');
        showPrice(target.dataset.currency);
    }
});

new SimpleBar(document.querySelector('.country__list'), {
    classNames: {
        scrollbar: 'country__scrollbar',
        track: 'country__track'
    }
});


// Таймер
const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const timer = (deadLine) => {
    const unitDay = document.querySelector('.timer__unit_day');
    const unitHour = document.querySelector('.timer__unit_hour');
    const unitMin = document.querySelector('.timer__unit_min');
    const descriptionDay = document.querySelector('.timer__unit-description_day');
    const descriptionHour = document.querySelector('.timer__unit-description_hour');
    const descriptionMin = document.querySelector('.timer__unit-description_min');



    const getTimeRemaing = () => {
        const dateStop = new Date(deadLine).getTime();
        const dateNow = Date.now();
        const timeRemaing = dateStop - dateNow;

        const minutes = Math.floor(timeRemaing / 1000 / 60 & 60);
        const hours = Math.floor(timeRemaing / 1000 / 60 / 60 & 24);
        const days = Math.floor(timeRemaing / 1000 / 60 / 60 / 24 % 365);

        return { timeRemaing, minutes, hours, days };
    };

    const start = () => {
        const timer = getTimeRemaing();

        unitDay.textContent = timer.days;
        unitHour.textContent = timer.hours;
        unitMin.textContent = timer.minutes;

        descriptionDay.textContent = declOfNum(timer.days, ['день', 'дня', 'дней']);
        descriptionHour.textContent = declOfNum(timer.hours, ['час', 'часа', 'часов']);
        descriptionMin.textContent = declOfNum(timer.minutes, ['минута', 'минуты', 'минут']);

        const timerId = setTimeout(start, 60000);

        if (timer.timeRemaing < 0) {
            clearTimeout(timerId);
            unitDay.textContent = '0';
            unitHour.textContent = '0';
            unitMin.textContent = '0';
        };
    };

    start();
};

timer('2023/09/07 20:00');