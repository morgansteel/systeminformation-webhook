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
let virtualHost;
let mainboardUUID;

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

// reserveWirelessData() methods use the following variables in global scope

let iface;
let ipv4;
let mac;
let virtualNAT;
let ifacetype;
let speed;

let ssid;
let channel;
let wirelessFrequency;
let signalStrangth; // in dBm
let quality;



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
		mainboardUUID = data.uuid;
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
	} catch (e) {
		console.log(e);
	} finally {
		
	}
}

async function reserveWirelessData() { // Includes interfaces, Wi-Fi networks, bluetooth, 
	try {
		const interfaces = systemInformation.networkInterfaces('default');
		const networks = systemInformation.wifiNetworks();
		const bluetooth = systemInformation.bluetoothDevices();
		const printers = systemInformation.printer();
		
		ssid = interfaces.ssid;
		channel = interfaces.channel;
		wirelessFrequency = interfaces.
		
		
	} catch (e) {
		
	} finally {
		
	}
}


async function writeReservedToJSON() {
    await reserveCPUData();
    await reserveMotherboardData();
	await reserveUEFIData();
	
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
	defaultjsondata.embeds[1].fields[4].value = virtualHost;
	defaultjsondata.embeds[1].fields[5].value = mainboardUUID;
	
	// Write changes for UEFI Firmware block
	
	defaultjsondata.embeds[2].fields[0].value = uefiVendor;
	defaultjsondata.embeds[2].fields[1].value = uefiVersion;
	defaultjsondata.embeds[2].fields[2].value = uefiReleaseDate;
	defaultjsondata.embeds[2].fields[3].value = uefiLanguage;
	defaultjsondata.embeds[2].fields[4].value = uefiSupportedFeatures;
	
	// Write changes for OS block
	
	defaultjsondata.embeds[3].fields[0].value = osName;
	defaultjsondata.embeds[3].fields[2].value = osDistro;
	defaultjsondata.embeds[3].fields[3].value = osRelease;
	defaultjsondata.embeds[3].fields[4].value = kernel;
	defaultjsondata.embeds[3].fields[5].value = uefiEnabled;
	defaultjsondata.embeds[3].fields[6].value = hostname;
	defaultjsondata.embeds[3].fields[7].value = hyperV;
	
	// Write changes for graphics block
	
	

    fs.writeFileSync('default.json', JSON.stringify(defaultjsondata, null, 2));

    execSync('./send-to-webhook.sh');
}

writeReservedToJSON();
