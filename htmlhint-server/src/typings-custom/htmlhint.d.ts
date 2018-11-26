
declare module 'htmlhint' {

    export var HTMLHint: Verifier;

    export interface Verifier {
        verify(text: string): Error[];
        loadCustomRules(rulesdir: string): any;
    }

    export interface Error {
        type: string,
        message: string,
        raw: string,
        evidence: string,
        line: number,
        col: number,
        rule: Rule
    }

    export interface Rule {
        id: string,
        description: string,
        link: string
    }

}