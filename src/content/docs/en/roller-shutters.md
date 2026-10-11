---
title: Add roller shutters
description: Animated guide to pairing Waveshare relays, setting travel times and rooms, and binding Hearth wall buttons in OSELIA Config.
section: Getting Started
order: 4
interactive: roller-shutters
---

<h2 id="steps">Step-by-step instructions</h2>

Follow the interactive example above or use the written steps below.
**Waveshare** drives the motor through two relays; **Hearth** reports wall-button gestures;
**Home Assistant** connects them into shutter control.

## Before you start

- Install [OSELIA Hearth](/docs/ha-integration) and [Waveshare Modbus RTU Relay](https://github.com/vmyronovych/oselia-waveshare-relay-ha/blob/main/docs/install.md), then restart Home Assistant.
- [Add your relay board](https://github.com/vmyronovych/oselia-waveshare-relay-ha/blob/main/docs/setup.md) using Serial or Network (TCP). Each board on a shared bus needs a unique Modbus address.
- For wall-button control, connect Hearth to MQTT and verify its input `event` entities are available. You can create and test the shutter without a wall button.
- Sign in as an administrator to access **OSELIA Config**.
- Motor installation should already be complete. Identify two different unused relay channels **on the same board**, one for opening and one for closing.

## 1. Pair the relays

1. Open **Settings → Devices & Services**.
2. On **Waveshare Modbus RTU Relay**, choose **Configure → Add a roller shutter**.
3. Fill in the form:

| Field | Value |
| --- | --- |
| Name | A useful name, such as Living room shutter |
| Relay board | The board connected to this motor |
| Up relay (opens) | Your opening relay number |
| Down relay (closes) | Your closing relay number |
| Up travel time (seconds) | Leave at 0 initially |
| Down travel time (seconds) | Leave at 0 initially |

4. Choose **Submit**. A new `cover` entity appears on the board's device.

Numbers match the **Relay 1, Relay 2, …** labels. Channels 1 and 2 in the demonstration are
examples: use your actual wiring. Both directions need different channels, and a channel
cannot belong to another shutter.

## 2. Test movement

Open the new shutter on the board's device page. Check **Open → Stop → Close → Stop**
through the cover entity, which coordinates the two directions.

If the directions are reversed, stop movement and use **Configure → Edit a roller shutter**
to correct the Up / Down relay numbers. Editing preserves the entity, history and bindings.

## 3. Enable position control (optional)

Open / Close / Stop already work with zero travel times.

1. Measure a **complete opening run**, starting fully closed.
2. Separately measure a **complete closing run**, starting fully open.
3. Enter both times in seconds under **Configure → Edit a roller shutter**, then save.
4. Complete a full run to an end position to synchronize the estimate.

The position slider is available when **both travel times are greater than 0**.
**0% means closed; 100% means open.** Position is estimated from motor running time,
not measured by a position sensor. The demonstration's 24 and 26 seconds are examples only.

## 4. Put the shutter in its room

1. Open **Settings → Devices & Services → Entities**, select the cover, then **⚙**.
2. Turn off **Use device area**.
3. Select the actual **Area**, such as Living room, and choose **Update**.

Keep the board device in the utility room; the cover gets its own room. Create missing
rooms under **Settings → Areas, labels & zones**. The automation's area and the button
input's area do not determine where the shutter tile appears.

## 5. Bind the wall button

1. Open **OSELIA Config** in the sidebar.
2. Enable **Listen for presses**, then hold the physical wall button.
3. Choose **Use in form ↓** in the detected-input banner.
4. Check **Input (wall-switch)** and **Gesture → Long press**.
5. Set **Target (light / cover)** to your shutter `cover` and **Action** to `open`.
6. Set a **Name**, such as “Living room — open shutter”, then **Save binding**.
7. Repeat for the second button with action `close`. You can also create a separate `stop` binding.

Each binding creates an ordinary Home Assistant automation. Repeating the **same configured
gesture** while the shutter is moving stops it by default. Single press can remain bound
to a light. Double press requires enabling it in the firmware; this example only needs long press.

## 6. Check the resident dashboard

Reload your existing resident dashboard. To create one:

1. **Settings → Dashboards → Add dashboard → New dashboard from scratch** → name it **OSELIA** → **Create**.
2. Open it → **⋮ → Edit dashboard → ⋮ → Raw configuration editor**.
3. Replace the contents with:

```yaml
strategy:
  type: custom:oselia-resident
```

4. Choose **Save**. The shutter appears under its entity's room.

**Only entities bound to wall buttons appear on the resident dashboard.** Check control
from both the tile and the physical button.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No board to select | Add one via Configure → Add a relay board first. |
| Relay channels rejected | Use distinct channels within the board's channel count, not assigned to another shutter. |
| No position slider | Enter both full travel times, greater than 0. |
| Button not detected | Check Hearth availability, MQTT and Listen for presses. |
| No shutter tile | Save a binding targeting that cover in OSELIA Config, check Automation health and reload the dashboard. |
| Tile in the utility room | Disable Use device area on the cover entity and assign its Area. |

More detail: [Waveshare shutters](https://github.com/vmyronovych/oselia-waveshare-relay-ha/blob/main/docs/entities.md#roller-shutters-covers),
[OSELIA Config](https://github.com/vmyronovych/oselia-hearth-di16g-ha/blob/main/docs/config-panel.md),
[rooms](https://github.com/vmyronovych/oselia-hearth-di16g-ha/blob/main/docs/rooms.md),
[dashboards](https://github.com/vmyronovych/oselia-hearth-di16g-ha/blob/main/docs/dashboards.md).
