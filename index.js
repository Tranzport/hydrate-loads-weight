const { Pool } = require("pg");
const fs = require('fs');

const printLog = new console.Console(fs.createWriteStream('./log.txt'));
const credentials = {
    user: "postgres",
    host: "localhost",
    database: "grid",
    password: "123456",
    port: 5432,
};

const pool = new Pool(credentials);

const getLoadsIds = async () => {
    const query = 'SELECT id FROM ONLY public.load ORDER BY created_at DESC;';
    return await pool.query(query);
}

const updateLoadsWeight = async (id) => {
    const query = `SELECT * FROM tz_load.isp_update_loads_weight(${id});`;
    return await pool.query(query);
}

(async () => {
    printLog.log('starting Time :- ', new Date().toLocaleString());

    const mResult = await getLoadsIds();
    const loadIds = mResult.rows;

    for (const load of loadIds) {
        try {
                await updateLoadsWeight(load.id);
                printLog.log('Success -> ', 'load weight updated for load id -', load.id);
            } catch (error) {
                printLog.log('Failed -> ', load.id, error.message, error.code);
            }
    };

    await pool.end();

    printLog.log('Finishing Time :- ', new Date().toLocaleString());
})();