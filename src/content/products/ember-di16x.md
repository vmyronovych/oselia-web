---
title: OSELIA Ember
sku: DI-16X
tagline: Sixteen more inputs, snapped onto the rail.
summary: >-
  An input-expander module for the Hearth gateway. Each Ember adds 16 isolated
  24 V inputs over the shared I²C field bus — chain up to seven to reach 128
  inputs on a single gateway.
role: expander
order: 2
specs:
  - label: Inputs
    value: 16 × isolated 24 V (MCP23017 + PC817 optocouplers)
  - label: Field bus
    value: Shared I²C with wired-OR interrupt
  - label: Addressing
    value: 0x21–0x27 via A0–A2 straps (board number = bus position)
  - label: Per gateway
    value: Up to 7 Ember modules (128 inputs total)
  - label: Detection
    value: Auto-detected — wire it, power-cycle, it appears
  - label: Mounting
    value: DIN rail, alongside the Hearth gateway
features:
  - title: Plug-and-scale
    body: >-
      The gateway scans its I²C bus at boot and uses whatever Ember modules are
      connected. Add one later: wire it, power-cycle, done — no re-flashing, no
      config change.
  - title: Galvanically isolated
    body: >-
      Every input is opto-isolated (PC817) and RC-debounced in hardware, just
      like the gateway's onboard inputs. The field side stays at 24 V, the logic
      side at 3.3 V.
  - title: One device in Home Assistant
    body: >-
      Ember inputs show up as part of the same Hearth device — board 2 input 5,
      board 3 input 12, and so on — not a pile of separate devices.
---

## What it is

The **OSELIA Ember (DI-16X)** is the expansion module for an OSELIA installation.
It carries 16 more isolated 24 V inputs and shares the [Hearth gateway's](/products/hearth-di16g)
I²C field bus, so adding inputs is a matter of snapping another module onto the rail.

## Scaling up

A single [Hearth DI16-G](/products/hearth-di16g) handles its own 16 inputs plus up
to **seven Ember modules** — `0x21` through `0x27` on the bus — for **128 inputs**
total. Board numbering follows bus position, so inputs stay predictable:

```
Hearth (board 1, 0x20) ─┐
Ember  (board 2, 0x21) ─┤
Ember  (board 3, 0x22) ─┤  shared SDA/SCL + wired-OR INT
   ...                  ─┤
Ember  (board 8, 0x27) ─┘
```

## Adding one

There's nothing to provision on an Ember itself — it's discovered by the gateway.
See [Getting Started](/docs/getting-started#adding-an-ember-expander) for the
strap-and-power-cycle steps.
