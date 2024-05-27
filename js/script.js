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
    // const getResource = async (url) =>{ //async показывает что функция будет асинхронной
    //     const res = await fetch(url);//await будет ждать пока операция выполнится прежде чем пойти дальше, не работает без async
    //
    //     if(!res.ok){
    //         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    //     }
    //
    //     return await res.json();
    // }


    // getResource('http://localhost:3000/menu')
    //     .then(data=>{
    //         console.log(data)
    //         data.forEach(({title,descr,price}) =>{
    //             const container = document.querySelector('#menu__cards');
    //             const card = container.appendChild(new Card(title,descr,price).createCard());
    //         });
    //     })

    axios.get('http://localhost:3000/menu')
        .then(data=> {
            data.data.forEach(({title, descr, price}) => {
                const container = document.querySelector('#menu__cards');
                const card = container.appendChild(new Card(title, descr, price).createCard());
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

    function showThanksModal() {
        document.querySelector('.modal__content > form').remove();
        const modalContent = document.querySelector('.modal__content');
        modalContent.innerHTML = `
        <div class="modal__title">Спасибо! Мы скоро свяжемся с вами</div>
        <div style="text-align: center;"><img src="../img/mark.svg" width="50px" alt=""></div>
        `;

        console.log(modal)
    }

    function getWeather(){
        const APIkey = '8d5e2ff30a08fcf1bfff04ea7a6c2a27',
            lat = 58.010422,
            lon = 56.229443,
            weather = document.querySelector('.weather');
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
            .then(response => response.json())
            .then(data=>{
                weather.innerHTML =
                `
                    <h1>Погода:</h1>
                    <p>Город: ${data.name}</p>
                    <p>Температура: ${((data.main.temp - 273.15)* 1.000000).toFixed(0)} градуса</p>
                `
                console.log(data);
            })
            .catch(error=>{
                console.error('Произошла ошибка:', error)
            })
    }
    getWeather();

    fetch('http://localhost:3000/menu')
        .then(data=>data.json())
        .then(res=>console.log(res))
});


