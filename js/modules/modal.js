function closeModal(modalSelector) {
    modal = document.querySelector(modalSelector)
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function openModal(modalSelector,modalTimerId) {
    modal = document.querySelector(modalSelector)
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    console.log(modalTimerId)
    console.log(modal)
    if(modalTimerId){
        clearInterval(modalTimerId)
    }
}
function modal(triggerSelector,modalSelector,modalTimerId){
    //Модальное окно
    const modalButton = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector),
        modalButtonClose = document.querySelector('[data-close]');
    modalButton.forEach((elem) => {
        elem.addEventListener('click', () => openModal(modalSelector,modalTimerId));
    });

    modalButtonClose.addEventListener('click',()=> closeModal(modalSelector));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modalSelector);
        }
    });
    document.addEventListener('keydown', (e) => { //Тригер на клавишу Escape(ESC)
        if (e.code === "Escape") {
            closeModal(modalSelector);
        }
    });


    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector,modalTimerId);
            window.removeEventListener('scroll', showModalByScroll) //Удаляет обработчик после перовго вызова
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}
export default modal;
export {closeModal, openModal};