---
title: Назви вимикачів та автоматизації
description: Підпишіть входи в Home Assistant і реагуйте на одинарне / подвійне / довге натискання.
section: Початок роботи
order: 3
---

## Як назвати вимикачі

Вимикачі не іменуються в майстрі. Кожен вхід з’являється в Home Assistant як
`board<N>_input<M>`. Щоб підписати їх:

1. Пройдіться домом і натисніть кожен фізичний вимикач.
2. У Home Assistant спостерігайте, як спрацьовують тригери пристрою під час
   натискання, і перейменуйте кожен на кімнату/функцію, якою він керує.

Це лише перейменування в інтерфейсі Home Assistant — без перепрошивки.

## Реакція на натискання

Кожен вхід повідомляє, **як** його натиснули, тож один фізичний вимикач може робити
кілька речей — наприклад, **одинарний** тап вмикає світло, **довге** утримання
вимикає.

> **«З коробки» ви отримуєте `single` і `long`.** `double` випромінюється лише якщо
> `DOUBLE_GAP_MS > 0` у конфігурації прошивки (за замовчуванням вимкнено, тож
> одинарний тап спрацьовує миттєво). Лишайте вимкненим, якщо реально не
> використовуєте подвійний тап.

### Варіант A — інтерфейс Home Assistant (без YAML)

Шлюз оголошує кожен вхід/жест як **тригер пристрою** Home Assistant:

1. **Settings → Automations & scenes → Create automation → empty automation**.
2. **Add trigger → Device**, оберіть **«Hearth»**, потім вхід і тип натискання:
   - **«… button short press»** = **одинарний** тап
   - **«… button long press»** = **довге** утримання
   - **«… button double press»** з’являється лише якщо ви ввімкнули `double`.
3. **Add action** — наприклад, *Light → Toggle*, оберіть світло. Збережіть.

Зробіть одну автоматизацію для одинарного й другу для довгого натискання, якщо
хочете різну поведінку.

### Варіант B — YAML (для REST-викликів / складних дій)

Кожен жест також публікується в MQTT:

```
hearth/<device_id>/board<B>/input<P>/action      payload: single | double | long
```

Знайдіть `<device_id>` через `mosquitto_sub -h <BROKER_IP> -t 'hearth/+/status' -v`
або зчитайте його зі сторінки пристрою в Home Assistant. Потім тригерте напряму на
топік:

```yaml
- alias: "Світло в коридорі ON — board1 input1 single"
  triggers:
    - trigger: mqtt
      topic: hearth/<device_id>/board1/input1/action
      payload: single
  actions:
    - action: light.turn_on
      target: { entity_id: light.hall }

- alias: "Світло в коридорі OFF — board1 input1 long"
  triggers:
    - trigger: mqtt
      topic: hearth/<device_id>/board1/input1/action
      payload: long
  actions:
    - action: light.turn_off
      target: { entity_id: light.hall }
```

> Замініть `<device_id>`, номери плати/входу та entity id на свої. Після
> редагування YAML перезавантажте в **Developer Tools → YAML → Reload automations**.
> Порада: дивіться натискання наживо через `mosquitto_sub -h <BROKER_IP> -t 'hearth/#' -v`,
> поки тапаєте.

## Сутності подій на вхід

Окрім тригерів пристрою, кожен вхід також є сутністю `event`
(`event.hearth_board<B>_input<N>`) з типами подій `single` / `double` / `long` —
сучасний, зручний для панелей і журналу спосіб реагувати на натискання.
