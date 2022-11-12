const net = require('net')
const dns = require('node:dns')
const {
  PacketDecoder,
  createHandshakePacket,
  createPingPacket
} = require('./minecraftPacket')

const ping = module.exports.ping = (hostname, port, callback) => {
    checkSrvRecord(hostname)
        .then(openConnection, _ => openConnection({ hostname, port }))
        .then(data => callback(null, data))
        .catch(callback);
}

function openConnection (address) {
    const { hostname, port } = address;

    return new Promise((resolve, reject) => {
        let connection = net.createConnection(port, hostname, () => {
            // Decode incoming packets
            let packetDecoder = new PacketDecoder();
            connection.pipe(packetDecoder);
            // Write handshake packet
            connection.write(createHandshakePacket(hostname, port));
            packetDecoder.once('error', error => {
                connection.destroy();
                clearTimeout(timeout);
                reject(error);
            });

            packetDecoder.once('packet', data => {
                // Write ping packet
                connection.write(createPingPacket(Date.now()));
                packetDecoder.once('packet', ping => {
                    connection.end();
                    clearTimeout(timeout);
                    data.ping = ping;
                    resolve(data);
                });
            });
        });

        // Destroy on error
        connection.once('error', error => {
            connection.destroy();
            clearTimeout(timeout);
            reject(error);
        })

        // Destroy on timeout
        connection.once('timeout', () => {
            connection.destroy();
            clearTimeout(timeout);
            reject(new Error('Timed out'));
        })

        // Packet timeout (5 seconds)
        let timeout = setTimeout(() => {
            connection.end();
            reject(new Error('Timed out (5 seconds passed)'));
        }, 5000);
    });
}

function checkSrvRecord (hostname) {
    return new Promise((resolve, reject) => {
        if (net.isIP(hostname) !== 0) {
            reject(new Error('Hostname is an IP address'));
        } else {
            dns.resolveSrv('_minecraft._tcp.' + hostname, (error, result) => {
                if (error) {
                    reject(error);
                } else if (result.length === 0) {
                    reject(new Error('Empty result'));
                } else {
                    resolve({
                        hostname: result[0].name,
                        port: result[0].port
                    });
                }
            });
        }
    });
}