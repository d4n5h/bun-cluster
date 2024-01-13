process.on("message", (message) => {
  console.log(`Received message from master: `, message);
});

setTimeout(() => {
  (process.send as Function)("Hello from worker!");
}, 1000);

setTimeout(() => {
  process.exit(0);
}, 2000);