document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.querySelector('.advantage-cards');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    leftArrow.addEventListener('click', function () {
        cardContainer.scrollLeft -= 350; // Измените значение, чтобы подстроить под ваш дизайн
    });

    rightArrow.addEventListener('click', function () {
        cardContainer.scrollLeft += 350; // Измените значение, чтобы подстроить под ваш дизайн
    });
    const theme = localStorage.getItem('theme');
    if (theme === 'night') {
      document.body.classList.add('night-mode');
      document.getElementById('checkbox').checked = true;
    }
});
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('night-mode');
    const theme = body.classList.contains('night-mode') ? 'night' : 'day';
    localStorage.setItem('theme', theme);
  }

  function openResetPasswordModal() {
  document.getElementById('resetPasswordModal').style.display = 'block';
}

function closeResetPasswordModal() {
  document.getElementById('resetPasswordModal').style.display = 'none';
}

function sendResetPasswordEmail() {
  const email = document.getElementById('resetPasswordEmail').value;
  if (!email) {
    alert('Пожалуйста, введите ваш email');
    return;
  }

  fetch('/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Письмо с инструкциями по восстановлению пароля отправлено');
        closeResetPasswordModal();
      } else {
        console.error('Ошибка при отправке письма:', data.error);
        alert('Произошла ошибка при отправке письма');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}
