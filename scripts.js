const Modal = {
  open(){
    document.querySelector('.modal-overlay').classList.add('active');
  },
  
  close(){
    document.querySelector('.modal-overlay').classList.remove('active');
  },
}

const Storage = {
  getItems(){
    return JSON.parse(localStorage.getItem('@devfinances:transacitions')) || [];
  },
  setItems(transactions) {
    localStorage.setItem('@devfinances:transacitions', JSON.stringify(transactions));
  }

}

const dataTransactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -23131,
    date: '01/06/2021'
  },
  {
    id: 2,
    description: 'Salário',
    amount: 1000000,
    date: '01/06/2021'
  },
  {
    id: 3,
    description: 'Site',
    amount: 500000,
    date: '10/06/2021'
  },
  {
    id: 4,
    description: 'Aluguel',
    amount: -150000,
    date: '10/06/2021'
  },

];

const Transactions = {
  data: Storage.getItems(),

  income(){
    let income = 0;
    this.data.forEach(function(transaction){
      if (transaction.amount > 0 ){
        income += transaction.amount;
      }
    });
    
    return income;
  },

  expense(){
    let expense = 0;
    this.data.forEach(function(transaction){
      if (transaction.amount < 0 ){
        expense += transaction.amount;
      }
    });
    
    return expense;
  },

  total(){
    return this.income() + this.expense();
  },

  //create
  create(transaction){
    const id = this.data.length + 1;
    transaction.id = id;
    this.data.push(transaction);

    Storage.setItems(this.data);

    this.read();
  },
  
  //read
  read(){
    DOM.load(this.data);
  },
  
  //update
  update(){},

  //delete
  delete(id){
    let filtered = this.data.filter(t => t.id !== id);
    console.log(filtered)
    this.data = filtered;
    
    Storage.setItems(this.data);

    this.read();
  }
}

const Form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues(){
    const newTransacitons = {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
    };

    return newTransacitons;
  },

  validateValues(){
    const transaction = this.getValues();
    if (transaction.description === '' || transaction.amount === '' || transaction.date === '') {
      throw new Error('Por favor, preecha todos os campos');
    }
  },

  formatValues() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    
    return {
      description, 
      amount, 
      date
    }
  },

  clear(){    
    this.description.value = '';
    this.amount.value = '';
    this.date.value = '';
  },

  submit(event){
    event.preventDefault();
    
    try {
      //Validar valores
      //this.validateValues();
      
      // Formatar valores
      const formatedTransaction = this.formatValues();
      
      // Adicionar valores
      Transactions.create(formatedTransaction);
      
      // limpar formulario
      this.clear();
      
      // fechar modal
      Modal.close();
  
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }
}

const Utils = {
  formatAmount(value){
    value = Number(value.replace(/\,\./g, "")) * 100
    
    return value
},
  
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

   return signal + value
  },

  formatDate(value){
    return value.split('-').reverse().join('/');
  }
}

const DOM = {
  dataTableTbody: document.querySelector('#data-table table tbody'),
  
  load(transactions){
    this.update();
    
    this.clear();

    transactions.forEach(transaction => {
      let tableRow = document.createElement('tr');
      tableRow.innerHTML = DOM.htmlTr(transaction);
      DOM.dataTableTbody.appendChild(tableRow);
    });
  },

  clear(){
    this.dataTableTbody.innerHTML = '';
  },

  htmlTr(transaction){
    let CSSclass = '';

    if(!isNaN(transaction.amount) === false){
      let stringToNumber = parseFloat(transaction.amount.replace('R$', ''));
      CSSclass = stringToNumber > 0 ? 'income' : 'expense';
    }else {
      CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    }
    
    let amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img class ="btn-remove" onclick="Transactions.delete(${transaction.id})" src="./assets/minus.svg" alt="Remover transação">
        </td>
      </tr>`;       
      
      return html;   
  },
  
  update(){
    let income = Utils.formatCurrency(Transactions.income());
    let expense = Utils.formatCurrency(Transactions.expense());
    let total = Utils.formatCurrency(Transactions.total());

    document.querySelector('#income p').innerHTML = income; 
    document.querySelector('#expense p').innerHTML = expense; 
    document.querySelector('#total p').innerHTML = total;     
  },
}

const App = {
  init() {
    Transactions.read();
  }
}


App.init();