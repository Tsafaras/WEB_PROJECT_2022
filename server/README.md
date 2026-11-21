# server

## Project Setup

```sh
bun install
```

Requires a `MongoDB` server running at localhost:27017.\
Works with version `4.6.0`, as seen in [package.json](package.json), but
it's very possible it can work with more recent versions, as not many
features are utilized to have enough surface area for breaking changes.

### Run it

```sh
bun run debug # Debug mode
bun run start
```
