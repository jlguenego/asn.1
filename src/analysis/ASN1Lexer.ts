import {Lexer} from 'chevrotain';
import {allASN1Tokens} from './ASN1Token';

export const ASN1Lexer = new Lexer(allASN1Tokens);
