
### `Intro`
A object to interface with the banano network with NodeJS event system.

### `State`
Usable in its current state see example for ways to use it.

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
| Bulk Pull             | ✓    |
| Bulk Push             | ✗    |
| Frontier Req          | ✓    |
| Bulk Pull Blocks      | ✓    |

## `weird stuff`

#### `Frontier Req`
Has a count value that has no effect on how many entries that are streamed back.
The age is in seconds and is how long ago that frontier was modified on that node.

#### `Bulk Pull Blocks`
This will always respond with an invalid block ending the stream. This is not currently working or implemented?
in the version of the nodes I've tested.

#### `Bulk pull`
This will be added later after for the moment I've not dug into the project to understand how it's used.
