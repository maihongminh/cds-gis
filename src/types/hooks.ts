export type FilterOperator =
  | '='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | 'like'
  | 'not like'
  | 'in'
  | 'not in'
  | 'is'
  | 'between';

/** [field, operator, value] */
export type Filter = [string, FilterOperator, unknown];

export interface GetListArgs<T = Record<string, unknown>> {
  /** Only return these fields. Default: all fields */
  fields?: (keyof T | string)[];
  /** AND filter conditions */
  filters?: Filter[];
  /** OR filter conditions */
  orFilters?: Filter[];
  /** Skip the first n records (used for pagination) */
  limit_start?: number;
  /** Number of records per page. Default: 20 */
  limit?: number;
  /** Sort order */
  orderBy?: { field: string; order: 'asc' | 'desc' };
  /** Return a key-value dict instead of an array */
  asDict?: boolean;
}

export interface TokenParams {
  useToken: boolean;
  /** Token string or a function that returns the token */
  token: string | (() => string);
  /** Prefix in the Authorization header */
  type: 'Bearer' | 'token';
}

export interface UploadArgs {
  /** Whether the file is private. Default: false */
  isPrivate?: boolean;
  /** Target folder */
  folder?: string;
  /** File URL if already available */
  file_url?: string;
  /** Associated Doctype */
  doctype?: string;
  /** ID of the associated document */
  docname?: string;
  /** Field in the document that will store the file */
  fieldname?: string;
}
