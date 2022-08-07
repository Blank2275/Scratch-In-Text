class Lexer {
    constructor(code) {
        this.code = code;

        this.start = 0;
        this.current = 0;
        this.line = 1;

        this.tokens = [];
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        return this.tokens;
    }

    addToken(token, value) {
        this.tokens.push({
            "type": token,
            "typeName": TOKENS_REVERSED[token],
            value: value
        });
    }

    scanToken() {
        let c = this.advance();
        switch (c) {
            case "(": this.addToken(TOKENS.LEFT_PAREN); break;
            case ")": this.addToken(TOKENS.RIGHT_PAREN); break;
            case "{": this.addToken(TOKENS.LEFT_BRACE); break;
            case "}": this.addToken(TOKENS.RIGHT_BRACE); break;
            case ",": this.addToken(TOKENS.COMMA); break;
            case ".": this.addToken(TOKENS.DOT); break;
            case "-": this.addToken(TOKENS.MINUS); break;
            case "+": this.addToken(TOKENS.PLUS); break;
            case ";": this.addToken(TOKENS.SEMICOLON); break;
            case "*": this.addToken(TOKENS.STAR); break;
            case "!":
                this.addToken(this.match("="), TOKENS.BANG_EQUAL, TOKENS.BANG);
                break;
            case "=":
                this.addToken(this.match("="), TOKENS.EQUAL_EQUAL, TOKENS.EQUAL);
                break;
            case "<":
                this.addToken(this.match("="), TOKENS.LESS_EQUAL, TOKENS.LESS);
                break;
            case ">":
                this.addToken(this.match("="), TOKENS.GREATER_EQUAL, TOKENS.GREATER);
                break;
            case "/":
                if (this.match("/")) {
                    //comment goes to the end of the line
                    while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
                } else {
                    this.addToken(TOKENS.DIVIDE);
                }
                break;

            case " ":
                break;
            case "\r":
                break;
            case "\t":
                break;
            case "\n":
                this.line += 1;
                break;

            case '"': this.string(); break;

            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    console.error(`line ${this.line}: unexpected character: ${this.character}`);
                }
        }
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();
        let value = this.code.substring(this.start + 1, this.current);
        //console.log(this.code);
        this.addToken(TOKENS.IDENTIFIER, value);
    }

    isAlpha(c) {
        return (c >= "a" && c <= "z") ||
            (c >= "A" && c <= "Z") ||
            (c == "_");
    }

    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    peekNext() {
        if (this.current + 1 >= this.code.length) return "\0";
        return this.code.substring(this.current + 1, this.current + 2);
    }

    number() {
        while (this.isDigit(this.peekNext())) this.advance();

        if (this.peek() == "." && this.isDigit(this.peekNext())) {
            advance();
            while (this.isDigit(this.peek())) this.advance();
        }

        let value = this.code.substring(this.start, this.current) + this.peek();

        if (value.substring(0, 1) == "(") value = value.substring(1, value.length);
        this.addToken(TOKENS.NUMBER, parseFloat(value));
    }

    isDigit(c) {
        return (c >= '0' && c <= '9');
    }

    string() {
        while (this.peekNext() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") this.line += 1;
            this.advance();
        }
        if (this.isAtEnd()) {
            console.error(`line: ${this.line} unterminated string starting at line ${this.start}`);
        }

        this.advance();

        let value = this.code.substring(this.start + 2, this.current)
        this.addToken(TOKENS.STRING, value);
    }

    peek() {
        if (this.isAtEnd()) return "\0";
        return this.code.substring(this.current, this.current + 1);
    }

    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.code.substring(this.current, this.current + 1) != expected) return false;

        this.current += 1;
        return true;
    }

    advance() {
        this.current += 1;
        return this.code.substring(this.current, this.current + 1);
    }

    isAtEnd() {
        return this.current >= this.code.length;
    }
}

const fs = require('fs');

const TOKENS = {
    "LEFT_PAREN": 0,
    "RIGHT_PAREN": 1,
    "LEFT_BRACE": 2,
    "RIGHT_BRACE": 3,
    "COMMA": 4,
    "PLUS": 5,
    "MINUS": 6,
    "MULTIPLY": 7,
    "DIVIDE": 8,
    "SEMICOLON": 9,

    "NOT": 10,
    "NOT_EQUAL": 11,
    "EQUAL": 12,
    "EQUAL_EQUAL": 13,
    "GREATER": 14,
    "GREATER_EQUAL": 15,
    "LESS_EQUAL": 16,
    "LESS": 17,

    "IDENTIFIER": 18,
    "STRING": 19,
    "NUMBER": 20,

    "EOF": 21
}
//reverse lookup table for tokens
const reverse = obj => Object.fromEntries(Object.entries(TOKENS).map(a => a.reverse()))
const TOKENS_REVERSED = reverse(TOKENS);

exports.Lexer = Lexer;
exports.TOKENS = TOKENS;
exports.TOKENS_REVERSED = TOKENS_REVERSED;