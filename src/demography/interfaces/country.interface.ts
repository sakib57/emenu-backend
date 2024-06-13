import { State } from '../schemas/state.schema';

export interface ICountry {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly code: string;
  readonly languages: string[];
  readonly dialingCode: string;
  readonly states: State[];
  readonly continent: string;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
