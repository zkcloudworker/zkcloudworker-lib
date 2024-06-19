import fs from "fs/promises";
export async function saveFile(params) {
    const { data, filename } = params;
    const folder = "./data/";
    const name = folder + filename + ".json";
    try {
        await fs.access("./data");
    }
    catch (e) {
        // if not, create it
        await fs.mkdir("./data");
    }
    try {
        await fs.writeFile(name, JSON.stringify(data, null, 2));
        return name;
    }
    catch (e) {
        console.error(`Error writing file ${name}`);
        return undefined;
    }
}
export async function loadFile(filename) {
    const name = "./data/" + filename + ".json";
    try {
        const filedata = await fs.readFile(name, "utf8");
        const data = JSON.parse(filedata);
        return data;
    }
    catch (e) {
        console.error(`File ${name} does not exist or has wrong format`);
        return undefined;
    }
}
export async function saveBinaryFile(params) {
    const { data, filename } = params;
    const folder = "./data/";
    const name = folder + filename + ".bin";
    try {
        await fs.access("./data");
    }
    catch (e) {
        // if not, create it
        await fs.mkdir("./data");
    }
    try {
        await fs.writeFile(name, data);
        return name;
    }
    catch (e) {
        console.error(`Error writing file ${name}`);
        return undefined;
    }
}
export async function loadBinaryFile(filename) {
    const name = "./data/" + filename + ".bin";
    try {
        const data = await fs.readFile(name);
        return data;
    }
    catch (e) {
        console.error(`File ${name} does not exist or has wrong format`);
        return undefined;
    }
}
//# sourceMappingURL=files.js.map