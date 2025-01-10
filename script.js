let breakDuration = 30; // Стандартное время перерыва
let timerInterval;

// Элементы DOM
const mainMenu = document.getElementById('main-menu');
const confirmBreak = document.getElementById('confirm-break');
const breakTimer = document.getElementById('break-timer');
const endBreak = document.getElementById('end-break');
const settings = document.getElementById('settings');

const takeBreakButton = document.getElementById('take-break-button');
const settingsButton = document.getElementById('settings-button');
const confirmButton = document.getElementById('confirm-button');
const cancelButton = document.getElementById('cancel-button');
const cancelBreakButton = document.getElementById('cancel-break-button');
const saveSettingsButton = document.getElementById('save-settings-button');
const backButton = document.getElementById('back-button');
const backToMenuButton = document.getElementById('back-to-menu');

const breakDurationInput = document.getElementById('break-duration');
const startTimeElement = document.getElementById('start-time');
const endTimeElement = document.getElementById('end-time');
const timeLeftElement = document.getElementById('time-left');

const endSound = document.getElementById('end-sound');

// Функции для работы с уведомлениями
function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        console.log("Permission granted for notifications.");
      }
    });
  }
}

function sendNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  }
}

// Функции для работы с таймером
function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function startBreakTimer() {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + breakDuration * 60000);

  startTimeElement.textContent = `Начало: ${startTime.toLocaleTimeString()}`;
  endTimeElement.textContent = `Конец: ${endTime.toLocaleTimeString()}`;

  updateTimer(endTime);

  timerInterval = setInterval(() => {
    updateTimer(endTime);
  }, 1000); // Обновление каждую секунду

  showElement(breakTimer);
  hideElement(mainMenu);
  hideElement(confirmBreak);
}

function updateTimer(endTime) {
  const now = new Date();
  const timeLeftMs = endTime - now; // Оставшееся время в миллисекундах

  if (timeLeftMs <= 0) {
    clearInterval(timerInterval);
    timeLeftElement.textContent = 'Перерыв окончен!';
    endSound.play();  // Воспроизведение звука
    sendNotification("Перерыв окончен!");
    
    // Переход в меню после окончания перерыва
    showElement(endBreak);
    hideElement(breakTimer);
  } else {
    const minutesLeft = Math.floor(timeLeftMs / 60000); // Минуты
    const secondsLeft = Math.floor((timeLeftMs % 60000) / 1000); // Секунды

    timeLeftElement.textContent = `До конца перерыва: ${minutesLeft} мин ${secondsLeft} сек`;

    if (minutesLeft === 0 && secondsLeft <= 5) {
      sendNotification("До конца перерыва осталось 5 секунд!");
    }

    // Уведомление за 5 минут до окончания перерыва
    if (minutesLeft === 5 && secondsLeft === 0) {
      sendNotification("До конца перерыва осталось 5 минут!");
    }
  }
}

function cancelBreak() {
  clearInterval(timerInterval);
  endSound.pause();  // Остановка звука
  endSound.currentTime = 0;  // Сброс времени звука на начало
  showElement(mainMenu);
  hideElement(breakTimer);
}

function saveSettings() {
  const newDuration = parseInt(breakDurationInput.value, 10);
  if (!isNaN(newDuration) && newDuration > 0) {
    breakDuration = newDuration;
    alert(`Длительность перерыва сохранена: ${breakDuration} минут(ы)`);
  } else {
    alert('Пожалуйста, введите корректное значение.');
  }
}

// Слушатели событий
takeBreakButton.addEventListener('click', () => {
  showElement(confirmBreak);
  hideElement(mainMenu);
});

confirmButton.addEventListener('click', startBreakTimer);

cancelButton.addEventListener('click', () => {
  showElement(mainMenu);
  hideElement(confirmBreak);
});

cancelBreakButton.addEventListener('click', cancelBreak);

settingsButton.addEventListener('click', () => {
  showElement(settings);
  hideElement(mainMenu);
});

saveSettingsButton.addEventListener('click', saveSettings);

backButton.addEventListener('click', () => {
  showElement(mainMenu);
  hideElement(settings);
});

backToMenuButton.addEventListener('click', () => {
  showElement(mainMenu);
  hideElement(endBreak);
  endSound.pause();  // Остановка звука при возврате в меню
  endSound.currentTime = 0;  // Сброс времени звука на начало
});

// Запрос разрешения на уведомления при загрузке страницы
requestNotificationPermission();