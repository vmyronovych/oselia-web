---
title: Troubleshooting
description: Common provisioning messages and how to fix them, plus watching live logs over USB.
section: Reference
order: 1
---

## Common messages

| Message | Likely cause / fix |
|---------|--------------------|
| `No RP2040-ETH detected over USB` | Cable not plugged in, or wrong port — try `--port`. If it vanished *after* provisioning, recover via **BOOTSEL** (hold BOOT while plugging in), then re-run. |
| `No MicroPython detected` / version mismatch | Accept the wizard's offer to flash the pinned build (needs internet, or pass `--mpy-uf2 PATH`). |
| `BOOTSEL drive (RPI-RP2) didn't appear` | The board didn't enter BOOTSEL; do the BOOT+RESET dance by hand and retry. |
| `could not enter raw repl` | A running unit's watchdog fights `mpremote`. Unplug/replug (or tap RESET) and re-run. |
| `cannot reach <ip>:<port>` | Wrong broker IP/port, broker down, or laptop on a different network. |
| `broker refused: bad username or password` | Fix the credentials and re-run. |
| `FAIL (ethernet)` | Ethernet cable / broker IP unreachable **from the gateway's** network. |
| `FAIL (mqtt)` | Broker reachable but login/session failed — recheck IP/port and credentials. |
| `FAIL (mcp)` | An input board isn't responding — check I²C wiring and that the board count matches the chips installed. |
| `zeroconf package missing` | Accept the wizard's offer to install it, or decline and type the broker IP manually. |

## Watching live logs over USB

When a unit won't come online, watch its full boot over USB on a board that's already
running:

```bash
python3 provision.py --monitor
```

This **does not flash or re-provision** anything. It streams the firmware log — Ethernet
link, the input boards it discovers, leased IP, MQTT connect, HA discovery — with errors
in red and warnings in yellow. Press Ctrl-C to stop.

To listen to a stable field unit **without restarting it**, add `--monitor-passive`:

```bash
python3 provision.py --monitor --monitor-passive
```

## Decommissioning a unit

```bash
# Full decommission: remove from Home Assistant AND erase the board.
python3 provision.py --uninstall-all

# ...or individual steps:
python3 provision.py --uninstall-firmware   # erase app files (keeps MicroPython)
python3 provision.py --erase-flash          # erase EVERYTHING incl. MicroPython
python3 provision.py --uninstall-ha         # remove from Home Assistant
```

`--erase-flash` wipes the whole flash, leaving a bare-metal RP2040 in BOOTSEL. It
confirms first (irreversible). To reuse the board, re-run `provision.py`.
