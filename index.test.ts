import { expect, test } from "bun:test";
import Cluster from './index';

test("Cluster", () => {
  const cluster = new Cluster("./example/worker.ts");

  expect(cluster.workers.length).toBe(0);

  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();

  expect(cluster.workers.length).toBe(4);

  cluster.sendAll("Hello!");

  cluster.send(0, "Hello!");

  cluster.sendPid(cluster.workers[0]?.pid, "Hello!");

  cluster.removeAll();

  expect(cluster.workers.length).toBe(0);

  cluster.fork();

  expect(cluster.workers.length).toBe(1);

  cluster.removeLast();

  expect(cluster.workers.length).toBe(0);

  cluster.fork();

  expect(cluster.workers.length).toBe(1);

  cluster.removeFirst();

  expect(cluster.workers.length).toBe(0);

  cluster.fork();

  expect(cluster.workers.length).toBe(1);

  cluster.remove(0);

  expect(cluster.workers.length).toBe(0);

  cluster.fork();

  expect(cluster.workers.length).toBe(1);

  cluster.removePid(cluster.workers[0]?.pid);

  expect(cluster.workers.length).toBe(0);
});