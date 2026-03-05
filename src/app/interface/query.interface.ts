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
    fields?: string;
    includes?: string;
    [key: string]: string | undefined

}
export interface IQueryConfig {
    searchAbleFields?: string[];
    filterAbleFields?: string[]
}
export interface PrismaNumberFilter {
    equals?: number;
    in?: number[];
    notIn?: number[];
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: PrismaNumberFilter | number
}

export interface PrismaStringFilter {
    contains?: string
    startsWith?: string;
    endsWith?: string;
    node?: "insensitive" | "default";
    equals?: string;
    in?: string[];
    notIn?: string[];
    lt?: string;
    gt?: string;
    gte?: string;
    not?: PrismaStringFilter | string;

}
export interface PrismaWhereConditions {
    OR?: Record<string, unknown>[];
    AND?: Record<string, unknown>[];
    NOT?: Record<string, unknown>[];
    [key: string]: unknown
}
export interface IQueryResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    }
}