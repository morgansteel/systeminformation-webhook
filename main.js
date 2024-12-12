const systemInformation = require('systeminformation');
const fs = require('fs');
const { execSync } = require('child_process');
const defaultjsondata = require('./default.json');
let cpuModel;
let cpuPhysicalCores;
let cpuThreads;
let cpuBrand;
let cpuSpeed;
let motherboardManufacturer;
let isVM;
let systemModel;
let serial;

async function reserveCPUData() {
    try {
        const data = await systemInformation.cpu();
        cpuModel = data.manufacturer;
        cpuPhysicalCores = data.physicalCores;
        cpuThreads = data.cores;
        cpuBrand = data.brand;
        cpuSpeed = data.speed;
    } catch (e) {
        console.log(e);
    }
}

async function reserveMotherboardData() {
    try {
        const data = await systemInformation.system();
        motherboardManufacturer = data.manufacturer;
        isVM = data.virtual;
        if (isVM) {
            isVM = "Yes";
        } else {
            isVM = "No";
        }
        systemModel = data.model;
        serial = data.serial;
        if (serial == "-") {
            serial = "HIDDEN";
        }
    } catch (e) {
        console.log(e);
    }
}

async function readFileAndSend() {
    await reserveCPUData();
    await reserveMotherboardData();

    defaultjsondata.embeds[0].fields[0].value = cpuModel;
    defaultjsondata.embeds[0].fields[1].value = cpuPhysicalCores;
    defaultjsondata.embeds[0].fields[2].value = cpuThreads;
    defaultjsondata.embeds[0].fields[3].value = cpuBrand;
    defaultjsondata.embeds[0].fields[4].value = (cpuSpeed*1000).toFixed(2);

    defaultjsondata.embeds[1].fields[0].value = motherboardManufacturer;
    defaultjsondata.embeds[1].fields[1].value = isVM;
    defaultjsondata.embeds[1].fields[2].value = systemModel;
    defaultjsondata.embeds[1].fields[3].value = serial;
    console.log(serial);
    console.log(systemModel);

    fs.writeFileSync('default.json', JSON.stringify(defaultjsondata, null, 2));

    execSync('./send-to-webhook.sh');
}

readFileAndSend();
