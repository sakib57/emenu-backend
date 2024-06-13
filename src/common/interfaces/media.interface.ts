export interface IMedia {
  readonly _id: string;
  uri: string;
  readonly mimetype: string;
  readonly provider: string;
  readonly type: string;
  readonly isDeleted: boolean;
}
