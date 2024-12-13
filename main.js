const systemInformation = require('systeminformation');
const fs = require('fs');
const { execSync } = require('child_process');
const defaultjsondata = require('./default.json');

// basic variables for respective items written to default.json

let cpuModel;
let cpuPhysicalCores;
let cpuThreads;
let cpuBrand;
let cpuSpeed;

let motherboardManufacturer;
let isVM;
let systemModel;
let serial;

let uefiVendor;
let uefiVersion;
let uefiReleaseDate;
let uefiLanguage;
let uefiSupportedFeatures;

let osName;
let osDistro;
let osRelease;
let kernel;
let uefiEnabled;
let hostname;
let hyperV;

let gpuvendor;
let gpusubvendor;
let gpumodel;
let gpupcibus;
let gpuvram;

let totalMem;
let freeMem;
let aggregateUsedMem;
let buffcachepool;
let swaptotal;


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
    } finally {
		console.log("CPU information successfully pulled.");
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
		virtualHost = data.virtualHost;
    } catch (e) {
        console.log(e);
    } finally {
		console.log("Motherboard/Mainboard data successfully pulled.");
	}
}

async function reserveUEFIData() {
	try {
		const data = await systemInformation.bios();
			uefiVendor = data.vendor;
			uefiVersion = data.version;
			uefiReleaseDate = data.releaseDate;
			uefiLanguage = data.language;
			uefiSupportedFeatures = data.features;
			if (uefiLanguage == undefined) {
				uefiLanguage = "HIDDEN";
			}
			if (uefiSupportedFeatures == undefined) {
				uefiSupportedFeatures = "HIDDEN";
			}
	} catch (e) {
		console.log(e);
	} finally {
		console.log("UEFI information successfully pulled.");
	}
}

async function reserveOSData() {
	try {
		const data = await systemInformation.osInfo();
			osName = data.platform;
			osDistro = data.distro;
			osRelease = data.release;
			kernel = data.kernel;
			uefiEnabled = data.uefi;
			hostname = data.hostname;
			hyperV = data.hypervizor;
			if (hyperV == undefined) {
				hyperV = "N/A";
			}
	} catch (e) {
		console.log(e);
	} finally {
		
	}
}


async function reserveGraphicsData() {
	try {
		const data = await systemInformation.graphics();
		gpuvendor = data.controllers[0].vendor;
		gpusubvendor = data.controllers[0].subVendor;
		gpumodel = data.controllers[0].model;
		gpupcibus = data.controllers[0].bus;
		gpuvram = data.controllers[0].vram;
		if (gpusubvendor == null || gpusubvendor == undefined || gpusubvendor == "") {
			gpusubvendor = "Unknown Origin";
		}
		
	} catch (e) {
		console.log(e);
	} finally {
		console.log(".");
	}
}

async function reserveMemoryData() {
	try {
		const data = await systemInformation.mem();
		const memArray = systemInformation.memLayout();
		totalMem = data.total;
		freeMem = data.free;
		aggregateUsedMem = data.used;
		buffcachepool = data.buffcache;
		swaptotal = data.swaptotal;

		
	} catch (e) {
		console.log(e);
	} finally {

	}
}

let memClock;
let ecc;
let voltagemin;
let voltagemax;
let memtype;


async function writeReservedToJSON() {
    await reserveCPUData();
    await reserveMotherboardData();
    await reserveUEFIData();
    await reserveOSData();
    await reserveGraphicsData();

	// Write changes for CPU block
	
    defaultjsondata.embeds[0].fields[0].value = cpuModel;
    defaultjsondata.embeds[0].fields[1].value = cpuPhysicalCores;
    defaultjsondata.embeds[0].fields[2].value = cpuThreads;
    defaultjsondata.embeds[0].fields[3].value = cpuBrand;
    defaultjsondata.embeds[0].fields[4].value = (cpuSpeed*1000).toFixed(2);
	
	// Write changes for mainboard block

    defaultjsondata.embeds[1].fields[0].value = motherboardManufacturer;
    defaultjsondata.embeds[1].fields[1].value = isVM;
    defaultjsondata.embeds[1].fields[2].value = systemModel;
    defaultjsondata.embeds[1].fields[3].value = serial;

	
	// Write changes for UEFI Firmware block

	console.log(uefiVendor);
	console.log(uefiLanguage);
	console.log(uefiSupportedFeatures);
	defaultjsondata.embeds[2].fields[0].value = uefiVendor;
	defaultjsondata.embeds[2].fields[1].value = uefiVersion;
	defaultjsondata.embeds[2].fields[2].value = uefiReleaseDate;
	defaultjsondata.embeds[2].fields[3].value = uefiLanguage;
	defaultjsondata.embeds[2].fields[4].value = uefiSupportedFeatures;
	
	// Write changes for OS block

	defaultjsondata.embeds[3].fields[0].value = osName;
	defaultjsondata.embeds[3].fields[1].value = osDistro;
	defaultjsondata.embeds[3].fields[2].value = osRelease;
	defaultjsondata.embeds[3].fields[3].value = kernel;
	defaultjsondata.embeds[3].fields[4].value = uefiEnabled;
	defaultjsondata.embeds[3].fields[5].value = hostname;
	defaultjsondata.embeds[3].fields[6].value = hyperV;
	
	// Write changes for graphics block

	defaultjsondata.embeds[4].fields[0].value = gpuvendor;
	defaultjsondata.embeds[4].fields[1].value = gpusubvendor;
	defaultjsondata.embeds[4].fields[2].value = gpumodel;
	defaultjsondata.embeds[4].fields[3].value = gpupcibus;
	defaultjsondata.embeds[4].fields[4].value = gpuvram;

	// Write changes for memory block


    fs.writeFileSync('default.json', JSON.stringify(defaultjsondata, null, 2));

    execSync('./send-to-webhook.sh');
}

writeReservedToJSON();
    
