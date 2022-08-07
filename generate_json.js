const { Lexer, TOKENS, TOKENS_REVERSED } = require("./lex");
const fs = require("fs");

const path = "./testing.scit";
const code = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

const lexer = new Lexer(code);
const tokens = lexer.scanTokens();

function generateJson(tokens) {
    for (var token of tokens) {
        switch (token.type) {
            case 18://identifier
                let json = handleIdentifier(token);
                break;
        }
    }
}

function handleIdentifier(token) {
    const value = token.value;
    token.id = generateRandomID();

    let res = {};
    switch (value) {
        case "OnFlagClicked":
            res[`${token.id}`] = {
                "opcode": "event_whenflagclicked",
                "next": "",
                "parent": null,
                "inputs": {},
                "fields": {},
                "shadow": false,
                "topLevel": true,
                "x": 325,
                "y": 210
            }
            return res;
        case "goTo":
            res[`${token.id}`] = {
                "opcode": "motion_gotoxy",
                "next": "",
                "parent": "",
                "inputs": { "X": [1, [4, "0"]], "Y": [1, [4, "0"]] },
                "fields": {},
                "shadow": false,
                "topLevel": false
            }
            return res;
        case "repeat":
            res[`${token.id}`] = {
                "opcode": "control_repeat",
                "next": "",
                "parent": "",
                "inputs": {
                    "TIMES": [1, [6, "0"]],
                    "SUBSTACK": [2, ""]
                },
                "fields": {},
                "shadow": false,
                "topLevel": false
            }
            return res;
    }
}

function generateRandomID() {
    const length = 20;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]-|`/=!@#$%^&*()~{}".split();

    let res = "";
    for (let i = 0; i < length; i++) {
        res += chars[Math.floor(Math.random() * chars.length)]
    }
    return res;
}