
declare module 'htmlhint' {

    // version >= 0.11.0 es6
    export default HTMLHint;

    // version < 0.11.0
    export var HTMLHint: Verifier|undefined;

    export interface Verifier {
        verify(text: string): Error[];
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
