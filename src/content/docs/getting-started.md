---
title: Getting Started
description: Provision an OSELIA Hearth DI16-G from the box to live in Home Assistant — no programming required.
section: Getting Started
order: 1
---

This guide takes a fresh **OSELIA Hearth (DI16-G)** from the box to live in Home
Assistant. No programming needed: you plug in a USB cable, run one command, and
answer a few prompts. The wizard does the rest.

> ⚠️ **Never connect USB-C while the board's 24 V supply is ON.** The board can't be
> powered from USB and 24 V at the same time. **Switch the 24 V supply OFF before
> plugging in USB**, and only switch it back on after you've unplugged USB. USB alone
> powers the gateway fine for provisioning.

## Before you start

You need:

- The **Hearth**, wired (24 V inputs + **Ethernet plugged in**), with the **24 V
  supply switched OFF** for now. MicroPython does *not* need to be pre-flashed — the
  wizard checks the interpreter and offers to flash the pinned build if it's missing.
- A **USB cable** from the gateway to your laptop. USB powers the gateway during
  provisioning; Ethernet stays connected so it can reach the broker.
- **Home Assistant** already running on the LAN, with its MQTT broker, on the **same
  network** the gateway's Ethernet is plugged into.
- Your **broker username / password**, if your broker requires a login.

## One-time laptop setup

Install Python 3, then the tool the wizard uses to talk to the board:

```bash
pip install mpremote
# optional: better serial diagnostics, and required for --monitor-passive on Windows
pip install pyserial
```

`zeroconf` (used to auto-find your broker) isn't required up front — the wizard offers
to install it on first run.

## Provision the gateway

1. **Confirm the 24 V supply is OFF**, then plug the gateway into your laptop with USB.
   Leave **Ethernet** connected; the 24 V supply stays off for the whole step.

2. From the firmware repo's `provisioning/` folder, run:

   ```bash
   python3 provision.py
   ```

3. Answer the prompts. The wizard **finds MQTT brokers on the network automatically**
   (mDNS, then a quick port-1883 scan):

   | Prompt | What to do |
   |--------|------------|
   | `Which MQTT broker number` | Only if several were found — type the number to use. |
   | `Broker IP or hostname` | Only if none were found — type the broker's address. |
   | `Broker username` | Type it, or leave **blank** for anonymous brokers. |
   | `Broker password` | Type it (hidden), or leave blank. |

   The number of input boards is **auto-detected** — the gateway scans its I²C bus at
   boot, so you're never asked for a count.

4. The wizard checks the broker is reachable **before writing anything**, writes the
   config, copies the firmware, restarts the board, and waits for it to report
   **online via the broker**.

5. On **`PASS: device … is online`**, **unplug USB, then switch the 24 V supply ON.**
   The gateway reboots on field power, reconnects, and the inputs come alive.

That's it — the gateway is now a device in Home Assistant. Next, install the
[Home Assistant integration](/docs/ha-integration) so it appears under OSELIA with
OTA updates, then [name your switches and build automations](/docs/automations).

## Adding an Ember expander

[OSELIA Ember (DI-16X)](/products/ember-di16x) modules need **no provisioning of their
own** — the gateway discovers them on its I²C bus:

1. Set the module's address straps (A0–A2) to the next free address (`0x21`, `0x22`, …).
2. Wire it onto the shared field bus next to the Hearth.
3. **Power-cycle the gateway.** It rescans the bus at boot and the new inputs appear as
   `board<N>_input<M>` in Home Assistant.

## Moving a gateway to a new network

Everything site-specific (broker IP, MQTT login, DHCP/static) lives in a small
`site.json` on the board, and the gateway does **not** reconfigure itself. To relocate:
re-run `python3 provision.py` at the new site — it auto-discovers the new broker and
writes the new config. **No re-flash needed** — a move is purely a re-provision.

## Re-provisioning later

Run `python3 provision.py` again on the same unit any time. It reads the existing
settings, offers them as defaults, and lets you change just the broker, swap
credentials, or add a board. Re-running is safe.
