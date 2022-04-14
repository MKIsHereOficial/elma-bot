const si = require('systeminformation');

class Ram {
  constructor(used, total, free) {
    this._used = used;
    this._total = total;
    this._free = free;

    Object.defineProperty(this, "gigabyte", { value: false, writable: false });
  }
  
  get free() {
    return Math.round((parseInt(this._free) / 1024 / 1024) / 100);
  }

  get used() {
    if (!this.gigabyte) return Math.round((parseInt(this._used) / 1024 / 1024) / 100);
    return Math.round(this._used / (1e+9));
  }

  get total() {
    return Math.round((parseInt(this._total) / 1024 / 1024) / 100);
  }

  get formattedTotal() {
    return `${this.total}MB`;
  }

  get formattedUsed() {
    return `${this.used}MB`;
  }

  get formattedFree() {
    return `${this.free}MB`;
  }

  get comparision() {
    return `${this.formattedUsed}/${this.formattedTotal}`;
  }
}

module.exports.ram = async () => {
  const mem = await si.mem();
  return new Ram(mem.used, mem.total, mem.free);
}

async function cpuUsage() {
  var data = await si.currentLoad();

  data = {
    current: data.currentLoad,
    currentUser: data.currentLoadUser,
    currentSystem: data.currentLoadSystem,
    idle: data.currentLoadIdle,
    average: data.avgLoad,
    cpus: data.cpus.map(cpu => {
      return {
        load: cpu.load,
        loadUser: cpu.loadUser,
        loadSystem: cpu.loadSystem,
        idle: cpu.loadIdle,
      }
    }),
  }

  return data;
}
module.exports.cpuUsage = cpuUsage;

async function cpuSpeed() {
  var data = await si.cpuCurrentSpeed();

  return data;
}
module.exports.cpuSpeed = cpuSpeed;

module.exports.cpu = async () => {
  const p = await si.cpu();
  const usage = await cpuUsage();
  const speed = await cpuSpeed();

  return {toString: () => {return `${p.manufacturer} ${p.brand} ${p.model}`}, cpu: p, usage, speed};
}

async function os() {
  const data = await si.osInfo() || [];

  data.toString = () => {
    return `${data.distro} ${data.arch}`;
  }
 
  return data;
}

module.exports.os = os;

module.exports.version = "0.2";