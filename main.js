const systemInformation = require('systeminformation');
const fs = require('node:fs');
const execSync = require('node:child_process');

systemInformation.cpu()
    .then(info => {
        console.log('CPU Information:');
        console.log('- manufacturer: ' + info.manufacturer);
        console.log('- brand: ' + info.brand);
        console.log('- speed: ' + info.speed);
        console.log('- threads: ' + info.cores);
        console.log('- physical cores: ' + info.physicalCores);
        console.log('...');
    }).catch(err => console.error(err))

execSync('ls -la');