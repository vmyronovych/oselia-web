---
title: Naming Switches & Automations
description: Label your inputs in Home Assistant and react to single / double / long presses.
section: Getting Started
order: 3
---

## Naming your switches

You don't name switches in the wizard. Every input shows up in Home Assistant as
`board<N>_input<M>`. To label them:

1. Walk the house and press each physical switch.
2. In Home Assistant, watch the device's triggers light up as you press, and rename
   each one to the room/function it controls.

This is just renaming in the Home Assistant UI — no re-flashing.

## Reacting to a press

Each input reports **how** it was pressed, so one physical switch can do more than one
thing — e.g. a **single** tap turns a light on, a **long** hold turns it off.

> **Out of the box you get `single` and `long`.** `double` is only emitted if
> `DOUBLE_GAP_MS > 0` in the firmware config (off by default, so a single tap fires
> instantly). Leave it off unless you actually use double-tap.

### Option A — the Home Assistant UI (no YAML)

The gateway advertises every input/gesture as a Home Assistant **device trigger**:

1. **Settings → Automations & scenes → Create automation → empty automation**.
2. **Add trigger → Device**, pick **"Hearth"**, then choose the input and press type:
   - **"… button short press"** = a **single** tap
   - **"… button long press"** = a **long** hold
   - **"… button double press"** appears only if you enabled `double`.
3. **Add action** — e.g. *Light → Toggle*, pick your light. Save.

Make one automation for the single press and a second for the long press if you want
each to do something different.

### Option B — YAML (for REST calls / advanced actions)

Each gesture is also published to MQTT:

```
hearth/<device_id>/board<B>/input<P>/action      payload: single | double | long
```

Find `<device_id>` with `mosquitto_sub -h <BROKER_IP> -t 'hearth/+/status' -v`, or read
it off the device page in Home Assistant. Then trigger directly on the topic:

```yaml
- alias: "Hall light ON — board1 input1 single"
  triggers:
    - trigger: mqtt
      topic: hearth/<device_id>/board1/input1/action
      payload: single
  actions:
    - action: light.turn_on
      target: { entity_id: light.hall }

- alias: "Hall light OFF — board1 input1 long"
  triggers:
    - trigger: mqtt
      topic: hearth/<device_id>/board1/input1/action
      payload: long
  actions:
    - action: light.turn_off
      target: { entity_id: light.hall }
```

> Replace `<device_id>`, the board/input numbers, and the entity ids with yours. After
> editing YAML, reload in **Developer Tools → YAML → Reload automations**. Tip: watch
> presses arrive live with `mosquitto_sub -h <BROKER_IP> -t 'hearth/#' -v` while you tap.

## Per-input event entities

Beyond device triggers, each input is also an `event` entity
(`event.hearth_board<B>_input<N>`) with `single` / `double` / `long` event types — the
modern, dashboard- and logbook-friendly way to react to presses.
