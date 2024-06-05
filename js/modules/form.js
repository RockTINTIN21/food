import {closeModal,openModal} from "./modal";
import {postData} from "../services/services";

function form(formSelector,modalTimerId){
    //Forms
    const forms = document.querySelectorAll(formSelector);
    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо, мы скоро свяжемся с вами',
        failure: 'Что-то пошло не так'
    }

    forms.forEach(item => {
        console.log(item)
        bindPostData(item);
    });



    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Формы:',form[0].value)
            const statusMessage = document.createElement('div');
            statusMessage.style.textAlign = 'center';
            statusMessage.innerHTML = `<img src="../img/spinner.svg" width="50px" alt=""> <br> ${message.loading}`
            form.append(statusMessage);

            const formData = new FormData(form);
            postData('http://localhost:3000/requests', JSON.stringify(formData))
                .then(data=> {//В случае успеха
                    statusMessage.textContent = message.success;

                    showThanksModal();
                    console.log(JSON.stringify(formData))
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
}
export default form;