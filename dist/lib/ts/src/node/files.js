"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBinaryFile = exports.saveBinaryFile = exports.loadFile = exports.saveFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
async function saveFile(params) {
    const { data, filename } = params;
    const folder = "./data/";
    const name = folder + filename + ".json";
    try {
        await promises_1.default.access("./data");
    }
    catch (e) {
        // if not, create it
        await promises_1.default.mkdir("./data");
    }
    try {
        await promises_1.default.writeFile(name, JSON.stringify(data, null, 2));
        return name;
    }
    catch (e) {
        console.error(`Error writing file ${name}`);
        return undefined;
    }
}
exports.saveFile = saveFile;
async function loadFile(filename) {
    const name = "./data/" + filename + ".json";
    try {
        const filedata = await promises_1.default.readFile(name, "utf8");
        const data = JSON.parse(filedata);
        return data;
    }
    catch (e) {
        console.error(`File ${name} does not exist or has wrong format`);
        return undefined;
    }
}
exports.loadFile = loadFile;
async function saveBinaryFile(params) {
    const { data, filename } = params;
    const folder = "./data/";
    const name = folder + filename + ".bin";
    try {
        await promises_1.default.access("./data");
    }
    catch (e) {
        // if not, create it
        await promises_1.default.mkdir("./data");
    }
    try {
        await promises_1.default.writeFile(name, data);
        return name;
    }
    catch (e) {
        console.error(`Error writing file ${name}`);
        return undefined;
    }
}
exports.saveBinaryFile = saveBinaryFile;
async function loadBinaryFile(filename) {
    const name = "./data/" + filename + ".bin";
    try {
        const data = await promises_1.default.readFile(name);
        return data;
    }
    catch (e) {
        console.error(`File ${name} does not exist or has wrong format`);
        return undefined;
    }
}
exports.loadBinaryFile = loadBinaryFile;
