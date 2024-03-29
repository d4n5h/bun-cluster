# bun-cluster
Simple cluster library for Bun

## Install

```bash
bun install bun-cluster
```

## Example

### Master

```typescript
import Cluster from "bun-cluster";

const cluster = new Cluster("./worker.ts");

cluster.events.on("fork", (id, pid) => {
	console.log(`Forked worker ${id} (${pid})`);
});

cluster.events.on("message", (message, id, pid) => {
	console.log(`Received message from worker ${id} (${pid}): `, message);
});

cluster.events.on("error", (error, id, pid) => {
	console.log(`Error from worker ${id} (${pid}): `, error);
});

cluster.events.on("exit", (signal, id, pid) => {
	console.log(`Worker ${id} (${pid}) exited with code ${signal}`);

	cluster.fork(id);
});

cluster.fork();
cluster.fork();
cluster.fork();
cluster.fork();

cluster.sendAll("Hello!");
cluster.send(0, "Hello!");
cluster.sendPid(cluster.workers[0]?.pid, "Hello!");
```

### Worker

```typescript
process.on("message", (message) => {
  console.log(`Received message from master: `, message);
});

setTimeout(() => {
  (process.send as Function)("Hello from worker!");
}, 1000);

setTimeout(() => {
  process.exit(0);
}, 2000);
```
