import { fork as forkChild } from "child_process";
import { ChildProcess } from "child_process";
import Events from "events";

class Cluster {
	public workers: Array<ChildProcess | null> = [];
	public events: Events.EventEmitter;

	constructor(private workerScript: string) {
		this.events = new Events.EventEmitter();
	}

	public send(index: number, message: any) {
		if (index < 0 || index >= this.workers.length) {
			console.log(`No worker at index ${index}`);
			return;
		}

		this.workers[index]?.send(message);
	}

	public sendPid(pid: any, message: any) {
		const worker = this.workers.find((worker) => worker?.pid === pid);
		if (!worker) {
			console.log(`No worker with pid ${pid}`);
			return;
		}

		worker.send(message);
	}

	public sendAll(message: any) {
		this.workers.forEach((worker) => {
			if (!worker) return;
			worker.send(message);
		});
	}

	public remove(index: number) {
		if (index < 0 || index >= this.workers.length) {
			console.log(`No worker at index ${index}`);
			return;
		}

		this.workers[index]?.kill();
		this.workers.splice(index, 1);
	}

	public removePid(pid: any) {
		const worker = this.workers.find((worker) => worker?.pid === pid);
		if (!worker) {
			console.log(`No worker with pid ${pid}`);
			return;
		}

		worker.kill();
		this.workers.splice(this.workers.indexOf(worker), 1);
	}

	public removeLast() {
		const worker = this.workers.pop();
		if (worker) worker.kill();
	}

	public removeFirst() {
		const worker = this.workers.shift();
		if (worker) worker.kill();
	}

	public removeAll() {
		this.workers.forEach((worker) => worker?.kill());
		this.workers = [];
	}

	public fork(id: number | undefined = undefined) {
		const worker = forkChild(this.workerScript);
		if (!id) id = this.workers.length;

		worker.on("exit", (signal) => {
			this.events.emit("exit", signal, id, worker.pid);

			if (id) this.workers[id] = null;
		});

		worker.on("message", (message) => {
			this.events.emit("message", message, id, worker.pid);
		});

		worker.on("error", (error) => {
			this.events.emit("error", error, id, worker.pid);
		});

		this.workers[id] = worker as ChildProcess;

		this.events.emit("fork", id, worker.pid);

		return worker;
	}
}


export default Cluster;