
### `Intro`
A object to interface with the banano network with nodejs event system.

### `State`
still a Poc for the moment

### `Udp support`
| Name             | Done |
| :--------------- | :--- |
| Keep alive       | ✓    |
| Publish          | ✓    |
| Confirm Req      | ✓    |
| Confirm ACK      | ✓    |

### `TCP support`
| Name                  | Done |
| :-------------------- | :--- |
| Bulk Pull             | ✗    |
| Bulk Push             | ✗    |
| Frontier Req          | ✓    |
| Bulk Pull Blocks      | ✗    |

### `TODO`
- change the config system to be injected
- finish support for all tcp requests
- create a object that simplifies the network client into simple action and events
