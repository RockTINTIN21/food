function cards(){
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
}
export default cards;