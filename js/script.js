"use strict"

document.addEventListener('DOMContentLoaded', ()=> {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                    console.log('yes1')
                }
            });
            console.log('yes')
        } else {
            console.log('no')
        }
    });

    //Timer
    const deadline = '2024-05-03';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), //Кол-во милисекунд до которых нужно будет дойти
            days = Math.floor(t / (1000 * 60 * 60 * 24)), // Math.floor Округляет до целого чилса
            hours = Math.floor((t / (1000 * 60 * 60)) % 24), //Общее кол-во часов
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock(); //Что бы таймер запускался сразу при загрузке страницы а не через секунду
        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //Модальное окно
    const modalButton = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalButtonClose = document.querySelector('[data-close]'),
        box = document.body;

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId)
    }

    modalButton.forEach((elem) => {
        elem.addEventListener('click', openModal);
    });

    modalButtonClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
            console.log('НАЖАТА')
        }
    });
    document.addEventListener('keydown', (e) => { //Тригер на клавишу Escape(ESC)
        if (e.code === "Escape") {
            closeModal();
        }
    });
    const modalTimerId = setTimeout(openModal, 5000)

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll) //Удаляет обработчик после перовго вызова
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    //Cards
    class Card {
        constructor(subtitle, description, price, ...classes) {
            this.subtitle = subtitle;
            this.description = description;
            this.price = price;
            this.classes = classes;// А если не будет ни одного класса? То тогда нужно создать дефолтный
        }

        createCard() {
            const div = document.createElement('div');

            if (this.classes.length === 0) {
                this.div = 'menu__item'
                div.classList.add(this.div); //Если нет ни одного класса в rest то будет по дефолту menu__item
            } else {
                this.classes.forEach(className => div.classList.add(className)); //Короткая запись можно было через {}
            }
            div.innerHTML = `
                <img src="img/tabs/elite.jpg" alt="elite">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</div>
                </div>
            `;
            return div;
        }
    }
    axios.get('http://localhost:3000/menu')
        .then(data=> {
            data.data.forEach(({title, descr, price}) => {
                const container = document.querySelector('#menu__cards');
                container.appendChild(new Card(title, descr, price).createCard());
            })
        });

    //Forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо, мы скоро свяжемся с вами',
        failure: 'Что-то пошло не так'
    }

    forms.forEach(item => {
        bindPostData(item);
        console.log('Загружено')
    });

    const postData = async (url,data) =>{ //async показывает что функция будет асинхронной
        const res = await fetch(url,{ //await будет ждать пока операция выполнится прежде чем пойти дальше, не работает без async. Тоесть без await код продолжит работать даже если в перменную еще ничего не пришло, тк запрос может идти долго
            method:"POST",
            header:{
                'Content-type':'application/json'
            },
            body: data
        });
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusMessage = document.createElement('div');
            statusMessage.style.textAlign = 'center';
            statusMessage.innerHTML = `<img src="../img/spinner.svg" width="50px" alt=""> <br> ${message.loading}`
            form.append(statusMessage);

            const formData = new FormData(form);

            const object = {};
                postData('http://localhost:3000/requests', JSON.stringify(object))
                .then(data=> {//В случае успеха
                    console.log(formData)
                    console.log(data);
                    statusMessage.textContent = message.success;

                    showThanksModal();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                }).catch(()=>{//В случае провала
                statusMessage.textContent = message.failure;
            }).finally(()=>{
                form.reset();
            })//Вне зависимости от исхода

        });
    }
    //ThanksModal
    function showThanksModal() {
        document.querySelector('.modal__content > form').remove();
        const modalContent = document.querySelector('.modal__content');
        modalContent.innerHTML = `
        <div class="modal__title">Спасибо! Мы скоро свяжемся с вами</div>
        <div style="text-align: center;"><img src="../img/mark.svg" width="50px" alt=""></div>
        `;
    }

    //Slider
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide=>{
       slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for(let i = 0; i < slides.length;i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to',i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if(i===0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click',()=>{
        console.log('next')
        if(offset == +width.slice(0,width.length - 2) * (slides.length - 1)){
            offset = 0;
        }else{
            offset += +width.slice(0,width.length - 2);
        }

       slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }

        dots.forEach(dot=> dot.style.opacity = '.5');
        dots[slideIndex-1].style.opacity = 1;
    });

    prev.addEventListener('click',()=>{
        if(offset == 0){
            offset = +width.slice(0,width.length - 2) * (slides.length - 1)
        }else{
            offset -= +width.slice(0,width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }

        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }
        dots.forEach(dot=> dot.style.opacity = '.5');
        dots[slideIndex-1].style.opacity = 1;
    });
    dots.forEach(dot => {
       dot.addEventListener('click',(e)=>{
           const slideTo = e.target.getAttribute('data-slide-to');

           slideIndex = slideTo;
           offset = +width.slice(0,width.length - 2) * (slideTo - 1);

           slidesField.style.transform = `translateX(-${offset}px)`;

           if(slides.length < 10){
               current.textContent = `0${slideIndex}`;
           }else{
               current.textContent = slideIndex;
           }

           dots.forEach(dot => dot.style.opacity = '.5');
           dots[slideIndex - 1].style.opacity = 1;
       })
    });


    // function getWeather(){
    //     const APIkey = '8d5e2ff30a08fcf1bfff04ea7a6c2a27',
    //         lat = 58.010422,
    //         lon = 56.229443,
    //         weather = document.querySelector('.weather');
    //     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    //         .then(response => response.json())
    //         .then(data=>{
    //             weather.innerHTML =
    //             `
    //                 <h1>Погода:</h1>
    //                 <p>Город: ${data.name}</p>
    //                 <p>Температура: ${((data.main.temp - 273.15)* 1.000000).toFixed(0)} градуса</p>
    //             `
    //             console.log(data);
    //         })
    //         .catch(error=>{
    //             console.error('Произошла ошибка:', error)
    //         })
    // }
    // getWeather();

    fetch('http://localhost:3000/menu')
        .then(data=>data.json())


    //Calculator
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;
    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    }else{
        sex = 'female';
        localStorage.setItem('sex','female');
    }

    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    }else{
        ratio = 1.375;
        localStorage.setItem('ratio',1.375);
    }

    function initLocalSettings(selector,activeClass){
        const elements = document.querySelectorAll(selector);
        // console.log(localStorage.getItem('sex'))
        elements.forEach(elem=>{
            console.log(elements)
            console.log('Айди:',elem.getAttribute('id'))
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
                console.log('нАЗНАЧЕН')
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
                console.log('нАЗНАЧЕН')
            }
        });
    }
    initLocalSettings('.calculating__choose-item','calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big','calculating__choose-item_active');
    function calcTotal(){
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = '____';
            return;
        }
        if(sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();
    function getStaticInformation(selector,activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem=>{
            elem.addEventListener('click',(e)=>{
                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio',+e.target.getAttribute('data-ratio'));
                }else{
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex',e.target.getAttribute('id'))
                }
                console.log(ratio,sex);
                elements.forEach(elem=>{
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        })
    }
    getStaticInformation('#gender div','calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div','calculating__choose-item_active');

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);
        input.addEventListener('input',()=>{
            if(input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }else{
                input.style.border = 'none';
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break
                case 'age':
                    age = +input.value;
                    break;

            }
            calcTotal();
        });

    }
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});


