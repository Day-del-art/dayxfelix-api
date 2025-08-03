// File: api/create.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const PTLA_KEY = "ptla_HLvWas8bebIA1bq8lzVtCLnm6ytYIqEKbFVqC2UZgDD";
const PTLC_KEY = "ptlc_lLIEJylSRYbMCFLu0VBQ5mbX70W0IfWES1e9U10sATM";
const PANEL_URL = "https://dayxfelix.vhon-offcial.biz.id";
const EGG_ID = 15;
const LOC_ID = 1;

router.post('/', async (req, res) => {
  const { username, email, ram, cpu, disk } = req.body;

  const password = Math.random().toString(36).slice(-8);

  try {
    const userRes = await axios.post(`${PANEL_URL}/api/application/users`, {
      username,
      email,
      first_name: username,
      last_name: "server",
      password,
    }, {
      headers: {
        'Authorization': `Bearer ${PTLA_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      }
    });

    const userId = userRes.data.attributes.id;

    const serverRes = await axios.post(`${PANEL_URL}/api/application/servers`, {
      name: username,
      user: userId,
      egg: EGG_ID,
      docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
      startup: "npm run start",
      environment: {
        USER_UPLOAD: "true"
      },
      limits: {
        memory: parseInt(ram),
        swap: 0,
        disk: parseInt(disk),
        io: 500,
        cpu: parseInt(cpu)
      },
      feature_limits: {
        databases: 1,
        backups: 1,
        allocations: 1
      },
      allocation: {
        default: 1
      },
      deploy: {
        locations: [LOC_ID],
        dedicated_ip: false,
        port_range: []
      }
    }, {
      headers: {
        'Authorization': `Bearer ${PTLA_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      }
    });

    return res.json({
      status: 'Sukses dibuat!',
      username,
      password,
      panel: `${PANEL_URL}`
    });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({
      status: 'Gagal buat panel',
      error: err?.response?.data || err.message
    });
  }
});

module.exports = router;
