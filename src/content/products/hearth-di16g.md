---
title: OSELIA Hearth
sku: DI16-G
tagline: The wired smart-home gateway on a DIN rail.
summary: >-
  A 24 V wall-switch input gateway built on the RP2040-ETH. It reads up to 128
  isolated inputs, classifies every press as single / double / long, and publishes
  to Home Assistant over MQTT — no cloud, no DNS, deterministic timing.
role: gateway
order: 1
specs:
  - label: MCU
    value: RP2040 (dual Cortex-M0+, 264 KB SRAM, 4 MB flash)
  - label: Network
    value: CH9120 UART-to-Ethernet, onboard TCP/IP stack
  - label: Inputs (onboard)
    value: 16 × isolated 24 V (MCP23017 + PC817 optocouplers)
  - label: Max inputs
    value: 128 (1 Hearth + up to 7 Ember expanders over I²C)
  - label: Press detection
    value: single / double / long, tunable from Home Assistant
  - label: Integration
    value: First-party OSELIA Home Assistant integration (HACS)
  - label: Updates
    value: OTA from the Home Assistant UI, auto-revert on bad image
  - label: Mounting
    value: DIN rail, 24 V field supply
features:
  - title: Local-first, no cloud
    body: >-
      Presses go straight to your MQTT broker on the LAN. No accounts, no
      DNS dependency, deterministic timing — it keeps working when the internet
      doesn't.
  - title: Its own Home Assistant integration
    body: >-
      The device appears under the OSELIA integration (not the generic MQTT
      one), with event entities, device triggers, rich diagnostics, and live
      controls.
  - title: Verified OTA updates
    body: >-
      A native firmware update card in Home Assistant. Download → verify →
      apply → boot-confirm, with automatic revert if an image is bad.
  - title: Tune without re-flashing
    body: >-
      Long-press time, double-tap window, debounce and log level are live
      numbers in Home Assistant — change them and they take effect immediately
      and survive a reboot.
---

## What it is

The **OSELIA Hearth (DI16-G)** is the brain of an OSELIA installation. Wire your
ordinary 24 V wall switches back to the module, plug in Ethernet, and every press
becomes a clean, classified event in Home Assistant.

It reads 16 isolated 24 V inputs on board, and scales to **128 inputs** by chaining
[Ember DI-16X](/products/ember-di16x) expanders on the shared I²C field bus. One
gateway, one MQTT connection, one device in Home Assistant.

## How it fits together

```
Wall switch ─ 24 V ─▶ Hearth DI16-G ─ Ethernet ─▶ MQTT broker ─▶ Home Assistant
                          │
                          └─ I²C field bus ─▶ Ember DI-16X ─▶ Ember DI-16X ... (×7)
```

The firmware classifies each press and publishes it; the OSELIA Home Assistant
integration turns those into entities, device triggers and a curated dashboard.

## Get one online

The [Getting Started](/docs/getting-started) guide walks you through provisioning a
fresh unit over USB — one command, a few prompts, done — and installing the Home
Assistant integration.
