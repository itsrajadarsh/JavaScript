'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Adarsh Raj',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Suraj Singh',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Utkarsh Shandilya',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Mausam Kumar Giri',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Adarsh Raj',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2024-02-08T14:11:59.604Z',
    '2024-03-27T17:01:17.194Z',
    '2024-04-21T23:36:17.929Z',
    '2024-04-23T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Suraj Singh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-04-22T18:49:59.371Z',
    '2024-04-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

const calcDate = function (theDay, locale) {
  const now = new Date();
  const days = Math.trunc(Math.abs(theDay - now) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <= 7) return `${days} days ago`;

  // const year = theDay.getFullYear();
  // const month = `${theDay.getMonth() + 1}`.padStart(2, 0);
  // const date = `${theDay.getDate()}`.padStart(2, 0);
  // return `${date}/${month}/${year}`;

  //Using International API
  return new Intl.DateTimeFormat(locale).format(theDay);
};

const calcDaysPassed = (date1, date2) => {
  return Math.trunc(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
};
// console.log(calcDaysPassed(new Date(2024, 3, 22), new Date(2024, 3, 28)));

//amount formatting
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  // console.log(movements);
  containerMovements.innerHTML = '';

  //for sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    var type = '';
    if (mov < 0) {
      type = 'withdrawal';
    } else {
      type = 'deposit';
    }
    const today = new Date(acc.movementsDates[i]);
    const displayDate = calcDate(today, acc.locale);
    // const displayDays = calcDaysPassed();

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCurr(
        mov,
        acc.locale,
        acc.currency
      )}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalence = function (acc) {
  acc.balence = acc.movements.reduce(function (acc, m) {
    return acc + m;
  }, 0);
  labelBalance.textContent = `${formatCurr(
    acc.balence,
    acc.locale,
    acc.currency
  )}`;
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
  labelSumIn.textContent = `${formatCurr(totalIn, acc.locale, acc.currency)}`;
  labelSumOut.textContent = `${formatCurr(
    Math.abs(totalOut),
    acc.locale,
    acc.currency
  )}`;

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
  labelSumInterest.textContent = `${formatCurr(
    totalIntrest,
    acc.locale,
    acc.currency
  )}`;
};

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);

  //display balence
  calcDisplayBalence(acc);

  //display summary
  calcDisplaySummary(acc);
};

// dynamic function call
let currentAccount, clock;

const startLogoutTimmer = function () {
  //time to be alocated for session out in seconds
  let time = 120;
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    // console.log(time);
    labelTimer.textContent = `${min}:${sec}`;
    if (time == 0) {
      containerApp.style.opacity = 0;
      alert('Session Timeout');
      labelWelcome.innerHTML = 'Log in to get started';
      clearInterval(clock);
    }
    time--;
  };
  tick();
  clock = setInterval(tick, 1000);
};

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

    //CHECK IF ANY ALREADY RUNNING CLOCK EXIST
    if (clock) clearInterval(clock);
    //SETTING SECONDS FOR SESSION TIMEOUT
    startLogoutTimmer();

    labelWelcome.innerHTML = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
    const today = new Date();
    // const year = today.getFullYear();
    // const month = `${today.getMonth() + 1}`.padStart(2, 0);
    // const date = `${today.getDate()}`.padStart(2, 0);
    // const hour = `${today.getHours()}`.padStart(2, 0);
    // const min = `${today.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year} ${hour}:${min}`;
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      navigator.language,
      options
    ).format(today);
    containerApp.style.opacity = 100;
  } else {
    alert('Invalid Username or Password');
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//fake login for demo check
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

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
    const now = new Date();
    currentAccount.movementsDates.push(now.toISOString());
    reciverAcc.movementsDates.push(now.toISOString());
    updateUI(currentAccount);
    clearInterval(clock);
    startLogoutTimmer();
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
    alert('Account closed Sucessfully!');
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
    setTimeout(function () {
      currentAccount.movements.push(Math.floor(amount));
      const now = new Date();
      currentAccount.movementsDates.push(now.toISOString());
      alert('Loan Granted!');
      updateUI(currentAccount);
      clearInterval(clock);
      startLogoutTimmer();
    }, 3000);
    alert('Please wait...');
  } else {
    alert('Loan amount Rejected!');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////////////////////////////////////////////
// Date and Time
// const today = new Date();
// const year = today.getFullYear();
// const month = `${today.getMonth() + 1}`.padStart(2, 0);
// const date = `${today.getDate()}`.padStart(2, 0);
// labelDate.textContent = `${date}/${month}/${year}`;
// console.log(`${date}/${month}/${year}`);

// const future = new Date();
// const calcDate = function (date) {
//   const now = new Date();
//   return Math.trunc(Math.abs(+now - +date));
// };
// const calcDaysPassed = (date1, date2) => {
//   return Math.trunc(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
// };
// console.log(calcDaysPassed(new Date(2024, 3, 22), new Date(2024, 3, 28)));
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////

// const randInt = (min, max) => {
//   Math.trunc(Math.random() * (max - min) + 1 + min);
// };
// console.log(randInt(3, 5));
