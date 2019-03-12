import ow from "ow";

export interface ResponseEntity {
    strategy: string;
    metadata: object;
}
export type Response = ResponseEntity[];

export namespace Response {
    export function validate(o: Response) {
        ow(o, ow.array.minLength(1).ofType(ow.object.hasKeys("strategy", "metadata")));
    }
}
