# PhoneCheck-element

## Установка

- В HTML файле начало и конец элемента отмечены комментариями, достаточно перенести этот код в вашу страницу.
- CSS стили находятся в style.css, их можно либо подключить, либо скопировать в вашу таблицу
- JavaScript реализация представляет собой класс компонента PhoneCheck и объект с props, которые необходимо передать в конструктор
- Если будете менять имена классов CSS, то необходимо их заменить в props .js файла.
- В props также содержатся ссылки на внешние функции-обработчики проверки номера и передачи серверу верного номера. В данной реализации эти процессы просто симулируются. 

## Запуск
- Достаточно создать объект класса PhoneCheck передав в него props.

## Примечания
- Можно было сделать точкой фхода элемент формы или div, частично скрыв верстку от пользователя, но так мы теряем в гибкости, если нужно быстро перекомпоновать части элемента (Изменить выравнивание строки с ошибкой относительно номера или вообще перенести его, добавить текст и т.п.).
