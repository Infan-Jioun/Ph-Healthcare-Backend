/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PrismaFindManyAegs {
    where?: Record<string, unknown>;
    innclude?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>;
    orderBy?: Record<string, unknown> | Record<string, unknown>;
    skip?: number,
    take?: number,
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;

}
export interface PrismaCountAegs {
    where?: Record<string, unknown>;
    include?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>;
    orderBy?: Record<string, unknown> | Record<string, unknown>;
    skip?: number,
    take?: number,
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;

}
export interface PrismaModelDelegets {
    findMany(args?: any): Promise<any[]>;
    count(args?: any): Promise<number>
}
export interface IQueryParams {
    searchItem?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    fiedls?: string;
    includes?: string;
    [key: string]: string | undefined

}
export interface IQueryConfig {
    searchAbleFields?: string[];
    filterAbleFields?: string[]
}