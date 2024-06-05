import tabs from './modules/tabs';
import modal, {openModal} from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import slider from './modules/slider';
import calculator from './modules/calculator';
import form from './modules/form';
window.addEventListener('DOMContentLoaded', ()=> {
    const modalTimerId = setTimeout(()=> openModal('modal',modalTimerId), 5000);
    tabs();
    modal('[data-modal]','.modal',modalTimerId);
    cards();
    calculator();
    slider();
    form('form',modalTimerId);
    timer();
});


