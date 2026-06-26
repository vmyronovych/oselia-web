---
title: Home Assistant Integration
description: Install the first-party OSELIA Hearth integration via HACS for native entities, diagnostics and OTA updates.
section: Getting Started
order: 2
---

The **OSELIA Hearth** Home Assistant integration makes a gateway appear under **its
own OSELIA integration** (not the generic MQTT integration), with a native firmware
**update** entity for OTA. Install it once per Home Assistant instance.

## Install via HACS (recommended)

1. In Home Assistant, open **HACS → ⋮ (top right) → Custom repositories**.
2. Repository: `https://github.com/vmyronovych/oselia-hearth-di16g-ha`,
   category **Integration**.
3. Install **OSELIA Hearth**, then **restart Home Assistant**.
4. **Settings → Devices & Services → Add integration → OSELIA Hearth**, and point it at
   your MQTT broker.

Updates then arrive in HACS automatically on each new release.

> The provisioning wizard can configure the integration for you (`--ha-setup`), but the
> integration *component* itself must be installed via HACS first, as above.

## Install manually

Copy `custom_components/oselia/` into your Home Assistant `config/custom_components/`,
restart Home Assistant, and add the integration as in step 4 above.

## How it works

- The integration opens **its own MQTT connection** to the same broker the gateways
  use — it does **not** depend on Home Assistant's MQTT integration. One config entry
  per broker.
- Gateways are discovered from their retained topics (`hearth/<id>/status`,
  `…/diag/state`). Each becomes one Home Assistant device under OSELIA.

## What you get per gateway

- **Events** — one `event` entity per input, with `single` / `double` / `long` types.
- **Device triggers** — per input `button_short_press` / `button_double_press` /
  `button_long_press`, so they appear in the automation **Device → Trigger** picker.
- **Diagnostics** — uptime, free memory, RP2040 temperature, reconnects, dropped
  events, boards online + their addresses, last input, IP, Ethernet link.
- **Controls** — Restart / Identify buttons; live gesture-timing numbers; log-level
  select. Changes take effect immediately and survive a reboot.
- **Firmware update** — a native OTA card; `latest_version` from a GitHub release feed.
  OTA is hardware-verified end to end (download → verify → apply → boot-confirm, with
  auto-revert on a bad image).

## Resilience

The integration is **startup-safe** (a broker that's down at HA startup never fails
setup), **auto-reconnects** with re-subscribe, follows broker availability, exposes an
always-available **"Broker connection"** sensor, and is **reload-safe**.
