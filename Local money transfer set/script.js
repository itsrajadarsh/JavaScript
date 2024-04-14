'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Adarsh Raj',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Suraj Singh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Utkarsh Shandilya',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Mausam Kumar Giri',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const display = function (movements, sort = false) {
  // console.log(movements);
  containerMovements.innerHTML = '';

  //for sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    var type = '';
    if (mov < 0) {
      type = 'withdrawal';
    } else {
      type = 'deposit';
    }
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__value">${mov}₹</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalence = function (acc) {
  acc.balence = acc.movements.reduce(function (acc, m) {
    return acc + m;
  }, 0);
  labelBalance.textContent = `${acc.balence}₹`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(nam => nam[0])
      .join('');
  });
};
createUserName(accounts);
// console.log(account3.username);

const calcDisplaySummary = function (acc) {
  const totalIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const totalOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${totalIn}₹`;
  labelSumOut.textContent = `${Math.abs(totalOut)}₹`;

  const totalIntrest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => {
      // console.log(mov);
      return (mov * acc.interestRate) / 100;
    })
    .filter(mov => mov >= 1)
    .reduce((acc, int) => {
      // console.log(int);
      return acc + int;
    });
  labelSumInterest.textContent = `${totalIntrest}₹`;
};

const updateUI = function (acc) {
  display(acc.movements);
  calcDisplayBalence(acc);
  calcDisplaySummary(acc);
};

// dynamic function call
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // for preventing from reloading
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (
    inputLoginUsername.value === currentAccount?.username &&
    Number(inputLoginPin.value) === currentAccount?.pin
  ) {
    // containerApp.classList.add("appShow");
    // console.log(currentAccount);
    // to clear form box

    labelWelcome.innerHTML = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
    containerApp.style.opacity = 100;
  } else {
    alert('Invalid Username or Password');
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (!reciverAcc) {
    alert('Invalid Reciever Details');
  }
  if (amount > currentAccount.balence) {
    alert('Insufficient Balance');
  }
  if (reciverAcc === currentAccount) {
    alert('You are not allowed to send money to self');
  }
  // console.log(reciverAcc);

  if (
    amount > 0 &&
    reciverAcc &&
    reciverAcc !== currentAccount &&
    amount <= currentAccount.balence
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
    alert('Transaction Sucessful!');
    // console.log(reciverAcc);
  } else {
    alert('Transaction Failed!');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const index = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );
  // console.log(index, inputClosePin.value);

  if (
    index > -1 &&
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    alert('Account close Sucessful!');
    labelWelcome.innerHTML = `Good Bye ${currentAccount.owner.split(' ')[0]}`;
  } else {
    alert('Invalid Details');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    alert('Loan Granted!');
    updateUI(currentAccount);
  } else {
    alert('Loan amount Rejected!');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  display(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
