const { Lexer, TOKENS, TOKENS_REVERSED } = require("./lex");
const fs = require("fs");

const path = "./testing.scit";
const code = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

const lexer = new Lexer(code);
const tokens = lexer.scanTokens();
console.log(tokens);